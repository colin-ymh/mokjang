// src/app/api/storage/signed-upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 서버 전용 키
);

export async function POST(req: NextRequest) {
  try {
    const { files, bucket = 'private', prefix = '' } = await req.json();
    const now = Date.now();

    const items = await Promise.all(
      files.map(async (f: { fileName: string }) => {
        const safe = f.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = [prefix, `${now}-${crypto.randomUUID()}-${safe}`]
          .filter(Boolean)
          .join('/');

        const { data, error } = await supabase.storage
          .from(bucket)
          .createSignedUploadUrl(path);

        if (error) throw error;
        return { path, token: data.token };
      })
    );

    return NextResponse.json({ bucket, items });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'failed to issue upload urls' },
      { status: 500 }
    );
  }
}
