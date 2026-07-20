import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parseSupabaseUrl } from '@/utils/delete';
import { isAuthenticated } from '@/lib/require-auth';

export const runtime = 'nodejs';

// 허용 버킷 화이트리스트 (signed-upload와 동일하게 유지).
const ALLOWED_BUCKETS = new Set(['profile', 'private']);

const MAX_URLS_PER_REQUEST = 50;

export async function POST(req: NextRequest) {
  try {
    // 인증: 백엔드 세션 쿠키 검증
    if (!(await isAuthenticated(req))) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!projectUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Missing Supabase env' },
        { status: 500 }
      );
    }

    const { urls } = (await req.json()) as { urls: string[] };
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'urls is required' }, { status: 400 });
    }
    if (urls.length > MAX_URLS_PER_REQUEST) {
      return NextResponse.json({ error: 'too many urls' }, { status: 400 });
    }

    const supabase = createClient(projectUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // URL들을 버킷별로 그룹화 후 삭제
    const bucketMap = new Map<string, string[]>();
    for (const url of urls) {
      const { bucket, path } = parseSupabaseUrl(url);
      // 허용 버킷 + 경로 조작 차단
      if (!ALLOWED_BUCKETS.has(bucket)) {
        return NextResponse.json(
          { error: 'bucket not allowed' },
          { status: 400 }
        );
      }
      if (path.includes('..')) {
        return NextResponse.json({ error: 'invalid path' }, { status: 400 });
      }
      if (!bucketMap.has(bucket)) bucketMap.set(bucket, []);
      bucketMap.get(bucket)!.push(path);
    }

    for (const [bucket, paths] of bucketMap) {
      const { error } = await supabase.storage.from(bucket).remove(paths);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('[storage/delete] error:', e);
    return NextResponse.json(
      { error: e?.message ?? 'failed to delete files' },
      { status: 500 }
    );
  }
}
