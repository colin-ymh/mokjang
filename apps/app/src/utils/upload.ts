// src/utils/upload.ts
import { supabase } from '@/lib/supabaseClient';

type IssueUploadItemsReq = {
  bucket: string;
  prefix?: string;
  files: { fileName: string; fileType?: string }[];
};
type IssueUploadItemsRes = {
  bucket: string;
  items: { path: string; token: string }[];
};

/**
 * Supabase의 public 버킷에 파일을 업로드하고
 * 즉시 접근 가능한 영구 URL(publicUrl)을 반환합니다.
 */
export const uploadFilesToSupabase = async (
  files: File[],
  opts: {
    bucket: string; // ✅ Supabase 대시보드에서 만든 public 버킷 이름
    prefix?: string; // ✅ 버킷 내 하위 폴더 경로(선택)
  }
): Promise<string[]> => {
  // 1) 업로드 토큰 발급 (서버 API 호출)
  const payload: IssueUploadItemsReq = {
    bucket: opts.bucket,
    prefix: opts.prefix ?? '',
    files: files.map((f) => ({ fileName: f.name, fileType: f.type })),
  };

  const issueRes = await fetch('/api/storage/signed-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(payload),
  });

  const issueJson = await issueRes.json().catch(() => ({}));
  if (!issueRes.ok) {
    const msg =
      (issueJson as any)?.error ??
      `failed to issue upload urls (${issueRes.status})`;
    throw new Error(msg);
  }

  const { bucket, items } = issueJson as IssueUploadItemsRes;
  if (!Array.isArray(items) || items.length !== files.length) {
    throw new Error(
      `mismatched items length (files=${files.length}, items=${items?.length ?? 0})`
    );
  }

  // 2) Supabase Storage에 실제 업로드
  const publicUrls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const { path, token } = items[i];

    const { error } = await supabase.storage
      .from(bucket)
      .uploadToSignedUrl(path, token, file);

    if (error) {
      throw new Error(
        `upload failed at index ${i} (${file.name}): ${error.message}`
      );
    }

    // 3) 업로드한 파일의 영구 공개 URL 반환
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    publicUrls.push(data.publicUrl);
  }

  return publicUrls;
};
