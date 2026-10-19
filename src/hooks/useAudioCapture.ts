'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { sampleFrequencyBars } from '@/lib/frequencyBars';
import {
  BrowserSpeechRecognition,
  getSpeechRecognitionConstructor
} from '@/lib/speechRecognition';
import { useMeetingStore } from '@/store/useMeetingStore';
import { useToastStore } from '@/store/useToastStore';

const SPEECH_FALLBACK =
  'Speech recognition is unavailable in this browser. Type a phrase to simulate live input.';

export function useAudioCapture() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const elementSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const rafRef = useRef(0);
  const mountedRef = useRef(true);
  const [bars, setBars] = useState<number[] | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const isRecordingMic = useMeetingStore((state) => state.isRecordingMic);
  const playbackSpeed = useMeetingStore((state) => state.playbackSpeed);

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setBars(null);
  }, []);

  const startLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const tick = () => {
      const analyser = analyserRef.current;
      if (!analyser || !mountedRef.current) return;
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      setBars(sampleFrequencyBars(data));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const ensureAnalyser = useCallback(() => {
    if (contextRef.current && analyserRef.current) {
      return { context: contextRef.current, analyser: analyserRef.current };
    }
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 128;
    contextRef.current = context;
    analyserRef.current = analyser;
    return { context, analyser };
  }, []);

  const releaseHardware = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    micSourceRef.current?.disconnect();
    micSourceRef.current = null;
  }, []);

  const connectFileElement = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || elementSourceRef.current) return;
    const { context, analyser } = ensureAnalyser();
    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    source.connect(context.destination);
    elementSourceRef.current = source;
  }, [ensureAnalyser]);

  const stopRecording = useCallback(() => {
    releaseHardware();
    useMeetingStore.getState().setRecordingMic(false);
    const audio = audioRef.current;
    if (!audio || audio.paused) stopLoop();
  }, [releaseHardware, stopLoop]);

  const startRecording = useCallback(async () => {
    if (useMeetingStore.getState().isRecordingMic) {
      stopRecording();
      return;
    }

    audioRef.current?.pause();

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      useToastStore.getState().show('Microphone permission was denied. Upload an audio file instead.');
      return;
    }

    const { context, analyser } = ensureAnalyser();
    const source = context.createMediaStreamSource(stream);
    source.connect(analyser);
    micSourceRef.current = source;
    streamRef.current = stream;
    if (context.state === 'suspended') await context.resume();

    useMeetingStore.getState().setPlaying(false);
    useMeetingStore.getState().setUploadedFileName(null);
    useMeetingStore.getState().setMode('live_mic');
    useMeetingStore.getState().setRecordingMic(true);
    startLoop();

    const Recognition = getSpeechRecognitionConstructor();
    if (!Recognition) {
      setSpeechSupported(false);
      useToastStore.getState().show(SPEECH_FALLBACK);
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (!result?.isFinal) continue;
        const detected = useMeetingStore.getState().appendLiveSegment(result[0]?.transcript ?? '');
        if (detected) useToastStore.getState().show('Action item detected from live speech');
      }
    };
    recognition.onerror = (event) => {
      if (event.error === 'aborted' || event.error === 'no-speech') return;
      setSpeechSupported(false);
      useToastStore.getState().show(SPEECH_FALLBACK);
    };
    recognition.onend = () => {
      if (!useMeetingStore.getState().isRecordingMic || recognitionRef.current !== recognition) return;
      try {
        recognition.start();
      } catch {
        setSpeechSupported(false);
      }
    };
    recognitionRef.current = recognition;
    setSpeechSupported(true);
    try {
      recognition.start();
    } catch {
      setSpeechSupported(false);
      useToastStore.getState().show(SPEECH_FALLBACK);
    }
  }, [ensureAnalyser, startLoop, stopRecording]);

  const loadFile = useCallback(
    async (file: File) => {
      releaseHardware();
      useMeetingStore.getState().setRecordingMic(false);
      stopLoop();
      const audio = audioRef.current;
      if (!audio) {
        useToastStore.getState().show('Audio player is not ready yet.');
        return;
      }

      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      connectFileElement();
      audio.src = url;
      audio.currentTime = 0;
      const { context } = ensureAnalyser();
      if (context.state === 'suspended') await context.resume();

      useMeetingStore.getState().setPlaying(false);
      useMeetingStore.getState().setCurrentTime(0);
      useMeetingStore.getState().setUploadedFileName(file.name);
      useMeetingStore.getState().setMode('uploaded_audio');
      useToastStore.getState().show(`Loaded ${file.name}`);
    },
    [connectFileElement, ensureAnalyser, releaseHardware, stopLoop]
  );

  const toggleUploadedPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        useToastStore.getState().show('Unable to play this audio file.');
      }
      return;
    }
    audio.pause();
  }, []);

  const resetDemo = useCallback(() => {
    releaseHardware();
    stopLoop();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setSpeechSupported(true);
    useMeetingStore.getState().resetToDemo();
    useToastStore.getState().show('Demo meeting restored');
  }, [releaseHardware, stopLoop]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      if (useMeetingStore.getState().mode !== 'uploaded_audio') return;
      useMeetingStore.getState().setCurrentTime(audio.currentTime);
    };
    const onDuration = () => {
      if (useMeetingStore.getState().mode !== 'uploaded_audio') return;
      if (Number.isFinite(audio.duration)) useMeetingStore.getState().setDuration(audio.duration);
    };
    const onPlay = () => {
      useMeetingStore.getState().setPlaying(true);
      startLoop();
    };
    const onPause = () => {
      useMeetingStore.getState().setPlaying(false);
      if (!useMeetingStore.getState().isRecordingMic) stopLoop();
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDuration);
    audio.addEventListener('durationchange', onDuration);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onPause);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDuration);
      audio.removeEventListener('durationchange', onDuration);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onPause);
    };
  }, [startLoop, stopLoop]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    if (!isRecordingMic) return;
    const id = window.setInterval(() => {
      const state = useMeetingStore.getState();
      const next = state.currentTimeSec + 1;
      state.setCurrentTime(next);
      if (next > state.durationSec) state.setDuration(next);
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRecordingMic]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      releaseHardware();
      cancelAnimationFrame(rafRef.current);
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      contextRef.current?.close().catch(() => undefined);
    };
  }, [releaseHardware]);

  return {
    audioRef,
    bars,
    speechSupported,
    startRecording,
    loadFile,
    toggleUploadedPlayback,
    resetDemo
  };
}
