type BorderTextareaProps = {
    borderColor?: string;
    /** 초기 최소 높이(px). 이전 height prop을 대체 */
    height?: number;
    width?: number;
    backgroundColor?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    placeholder?: string;
    readOnly?: boolean;
    onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    maxLength?: number;
    /** 내용 변경 시 즉시 리사이즈 (기본 true) */
    autoResize?: boolean;
    /** 내용 최대 높이 제한(px). 넘치면 스크롤 대신 늘리지 않음 */
    maxAutoHeight?: number;
};
export declare const BorderTextarea: import("react").ForwardRefExoticComponent<BorderTextareaProps & import("react").RefAttributes<HTMLTextAreaElement>>;
export {};
