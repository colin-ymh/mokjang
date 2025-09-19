import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    html,
    body {
        margin: 0;
        height: 100%;
        background-color: white;
        min-width: 320px;
        font-family: 'Pretendard', sans-serif;
        touch-action: none;
        overscroll-behavior: none;

        -webkit-tap-highlight-color: transparent;

        /* 텍스트 선택 막기 */
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;

        /* 이미지 등 드래그 막기 */
        -webkit-user-drag: none !important;
    }

    body > div:first-child,
    div#__next,
    div#__next > div {
        height: 100%;
    }

    /* 스크롤바 숨기기 */
    ::-webkit-scrollbar {
        display: none; /* Webkit 브라우저에서 스크롤바 숨기기 */
    }

    /* Firefox에서 스크롤바 숨기기 */
    body {
        scrollbar-width: none; /* Firefox에서 스크롤바 너비 제거 */
    }
`;

export default GlobalStyle;
