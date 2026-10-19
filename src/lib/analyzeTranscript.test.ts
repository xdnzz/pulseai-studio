import { describe, expect, it, vi } from 'vitest';
import { analyzeTranscript, fallbackAnalysis, type AnalyzeFetcher } from '@/lib/analyzeTranscript';

describe('analyzeTranscript', () => {
  it('returns a deterministic analysis when no API key is configured', async () => {
    const fetcher = vi.fn<AnalyzeFetcher>(async () => {
      throw new Error('network should not be called');
    });
    const analysis = await analyzeTranscript(
      'We should ship the player. Redis spike is a blocker.',
      undefined,
      fetcher
    );

    expect(fetcher).not.toHaveBeenCalled();
    expect(analysis.actionItems.map((item) => item.title)).toEqual(['We should ship the player']);
    expect(analysis.blockers).toEqual(['Redis spike is a blocker']);
    expect(analysis.summary).toContain('ship the player');
  });

  it('uses the model JSON when the key is present', async () => {
    const fetcher: AnalyzeFetcher = async () =>
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  actionItems: [{ title: 'Deploy the canvas', assignee: 'Danilo Diniz', priority: 'Urgent' }],
                  summary: 'Canvas is ready.',
                  blockers: []
                })
              }
            }
          ]
        })
      );

    const analysis = await analyzeTranscript('deploy the canvas', 'test-key', fetcher);
    expect(analysis.summary).toBe('Canvas is ready.');
    expect(analysis.actionItems[0]?.priority).toBe('Urgent');
  });

  it('falls back when the model reply is not the expected shape', async () => {
    const fetcher: AnalyzeFetcher = async () =>
      new Response(JSON.stringify({ choices: [{ message: { content: '{"nope":true}' } }] }));
    const analysis = await analyzeTranscript('please create the route', 'test-key', fetcher);
    expect(analysis).toEqual(fallbackAnalysis('please create the route'));
  });
});
