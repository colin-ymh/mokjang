/**
 * Supabase public/signed URL을 bucket과 path로 변환
 * ex) https://...supabase.co/storage/v1/object/public/profile/users/1/file.jpg
 */
export function parseSupabaseUrl(fileUrl: string): {
  bucket: string;
  path: string;
} {
  const u = new URL(fileUrl);
  const segments = u.pathname.split('/').filter(Boolean);
  // ['storage','v1','object','public','<bucket>',...path]
  // ['storage','v1','object','sign','<bucket>',...path]
  if (segments.length < 5) {
    throw new Error('Invalid Supabase storage URL');
  }

  const kind = segments[3]; // public or sign
  if (kind !== 'public' && kind !== 'sign') {
    throw new Error('Unknown Supabase storage URL kind');
  }

  const bucket = segments[4];
  const path = decodeURIComponent(segments.slice(5).join('/'));

  return { bucket, path };
}

/**
 * Supabase public URL만으로 이미지 삭제
 * @param urls Supabase public or signed URLs
 */
export async function deleteFilesFromSupabase(urls: string[]) {
  const res = await fetch('/api/storage/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`Failed to delete: ${res.status} ${msg}`);
  }
}
