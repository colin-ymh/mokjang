// src/app/api/storage/signed-upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAuthenticated } from '@/lib/require-auth';

export const runtime = 'nodejs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 서버 전용 키
);

// 허용 버킷 화이트리스트. 새 버킷이 필요하면 여기에 추가한다.
const ALLOWED_BUCKETS = new Set(['profile', 'private']);

// prefix는 'church/<id>/member' 형태만 허용. 경로 조작(..) 차단.
const PREFIX_PATTERN = /^[a-zA-Z0-9/_-]*$/;

// 업로드 허용 content-type (이미지 위주). 필요 시 확장.
const ALLOWED_FILE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const MAX_FILES_PER_REQUEST = 20;

type UploadFile = { fileName: string; fileType?: string };

function isValidPrefix(prefix: string): boolean {
  if (!PREFIX_PATTERN.test(prefix)) return false;
  if (prefix.includes('..')) return false;
  if (prefix.startsWith('/')) return false;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // 인증: 백엔드 세션 쿠키 검증
    if (!(await isAuthenticated(req))) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const {
      files,
      bucket = 'private',
      prefix = '',
    } = (await req.json()) as {
      files: UploadFile[];
      bucket?: string;
      prefix?: string;
    };

    // ── 입력 검증 ──────────────────────────────────────────────
    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'files is required' }, { status: 400 });
    }
    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json({ error: 'too many files' }, { status: 400 });
    }
    if (!ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json(
        { error: 'bucket not allowed' },
        { status: 400 }
      );
    }
    if (!isValidPrefix(prefix)) {
      return NextResponse.json({ error: 'invalid prefix' }, { status: 400 });
    }
    for (const f of files) {
      if (!f?.fileName) {
        return NextResponse.json(
          { error: 'fileName is required' },
          { status: 400 }
        );
      }
      if (f.fileType && !ALLOWED_FILE_TYPES.has(f.fileType)) {
        return NextResponse.json(
          { error: `file type not allowed: ${f.fileType}` },
          { status: 400 }
        );
      }
    }
    // ───────────────────────────────────────────────────────────

    const now = Date.now();

    const items = await Promise.all(
      files.map(async (f) => {
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
