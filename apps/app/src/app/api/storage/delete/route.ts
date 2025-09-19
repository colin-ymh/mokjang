import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parseSupabaseUrl } from '@/utils/delete';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!projectUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Missing Supabase env' },
        { status: 500 }
      );
    }

    const { urls } = (await req.json()) as { urls: string[] };
    if (!urls || urls.length === 0) {
      return NextResponse.json({ error: 'urls is required' }, { status: 400 });
    }

    const supabase = createClient(projectUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // URL들을 버킷별로 그룹화 후 삭제
    const bucketMap = new Map<string, string[]>();
    for (const url of urls) {
      const { bucket, path } = parseSupabaseUrl(url);
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
