import DOMPurify from 'dompurify';

// Quill 에디터가 생성하는 리치 텍스트 HTML을 안전하게 렌더하기 위한 살균 함수.
// dangerouslySetInnerHTML에 넣기 전 반드시 이 함수를 거친다.
//
// 브라우저 전용 dompurify 사용 (서버 살균은 jsdom을 끌어와 Vercel Node 런타임에서
// ERR_REQUIRE_ESM으로 SSR이 죽는다). 리치 텍스트는 클라이언트에서 fetch되는 데이터라
// SSR 시점엔 어차피 비어 있고, 클라이언트에서 살균 후 렌더된다.
const ALLOWED_TAGS = [
  'p',
  'br',
  'b',
  'strong',
  'i',
  'em',
  'u',
  's',
  'a',
  'ul',
  'ol',
  'li',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'span',
  'pre',
  'code',
];

const ALLOWED_ATTR = ['href', 'target', 'rel', 'class', 'style'];

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';
  // dompurify는 브라우저 DOM이 필요하다. SSR(window 없음)에서는 빈 문자열 반환.
  if (typeof window === 'undefined') return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // javascript: 등 위험 스킴 차단
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
}
