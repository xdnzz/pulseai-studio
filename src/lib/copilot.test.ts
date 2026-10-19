import { describe, expect, it } from 'vitest';
import { replyForQuestion } from '@/lib/copilot';

describe('replyForQuestion', () => {
  it('ignores a blank question', () => {
    expect(replyForQuestion('   ')).toBeNull();
  });

  it('answers blockers before the generic summary', () => {
    expect(replyForQuestion('Any blocker on the backend?')).toContain('PUL-105');
    expect(replyForQuestion('redis spikes')).toContain('Marcus Vance');
  });

  it('answers CRM questions with the HubSpot task', () => {
    expect(replyForQuestion('What did Sarah ask about HubSpot?')).toContain('PUL-106');
  });

  it('checks blocker words before CRM words', () => {
    expect(replyForQuestion('sarah found a backend blocker')).toContain('PUL-105');
  });

  it('falls back to the owners summary', () => {
    expect(replyForQuestion('who owns the canvas?')).toContain('PUL-104');
    expect(replyForQuestion('who owns the canvas?')).toContain('PUL-107');
  });
});
