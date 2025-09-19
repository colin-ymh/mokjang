// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// 클라이언트에서 사용할 Supabase 인스턴스
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
