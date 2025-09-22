// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { IS_PRODUCTION } from '@mokjang/utils';

// 클라이언트에서 사용할 Supabase 인스턴스
export const supabase = IS_PRODUCTION
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  : createClient(
      process.env.NEXT_PUBLIC_TEST_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_TEST_SUPABASE_ANON_KEY!
    );
