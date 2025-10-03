import { SupabaseConfig } from './supabase.config';

describe('SupabaseConfig', () => {
  it('should be defined', () => {
    expect(new SupabaseConfig()).toBeDefined();
  });
});
