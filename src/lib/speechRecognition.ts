export interface BrowserSpeechAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface BrowserSpeechResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): BrowserSpeechAlternative;
  [index: number]: BrowserSpeechAlternative;
}

export interface BrowserSpeechResultList {
  readonly length: number;
  item(index: number): BrowserSpeechResult;
  [index: number]: BrowserSpeechResult;
}

export interface BrowserSpeechEvent extends Event {
  readonly resultIndex: number;
  readonly results: BrowserSpeechResultList;
}

export interface BrowserSpeechErrorEvent extends Event {
  readonly error: string;
}

export interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: BrowserSpeechEvent) => void) | null;
  onerror: ((event: BrowserSpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export interface BrowserSpeechRecognitionConstructor {
  new (): BrowserSpeechRecognition;
}

type SpeechHost = Window & {
  SpeechRecognition?: BrowserSpeechRecognitionConstructor;
  webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
};

export function getSpeechRecognitionConstructor(): BrowserSpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const host = window as SpeechHost;
  return host.SpeechRecognition ?? host.webkitSpeechRecognition ?? null;
}
