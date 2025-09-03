type LabelTextareaProps = {
    label: string;
    zIndex?: number;
    borderColor?: string;
    height?: number;
    width?: number;
    backgroundColor?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    placeholder?: string;
    readOnly?: boolean;
    maxLength?: number;
};
export declare const LabelTextarea: import("react").ForwardRefExoticComponent<LabelTextareaProps & import("react").RefAttributes<HTMLTextAreaElement>>;
export {};
