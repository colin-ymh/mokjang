export declare const CheckButtonContainer: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {
    width: number;
    height: number;
    $isChecked: boolean;
    $disabled: boolean;
    $borderColor?: string;
    $backgroundColor?: string;
}>> & string;
type CheckButtonProps = {
    value: boolean;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
    width?: number;
    height?: number;
    isStopPropagation?: boolean;
    borderColor?: string;
    backgroundColor?: string;
};
export declare const CheckButton: ({ value, onChange, disabled, width, height, isStopPropagation, borderColor, backgroundColor, }: CheckButtonProps) => import("react/jsx-runtime").JSX.Element;
export {};
