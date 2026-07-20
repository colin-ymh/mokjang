import DOMPurify from 'isomorphic-dompurify';

// Quill 에디터가 생성하는 리치 텍스트 HTML을 안전하게 렌더하기 위한 살균 함수.
// dangerouslySetInnerHTML에 넣기 전 반드시 이 함수를 거친다.
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
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // javascript: 등 위험 스킴 차단
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
}
