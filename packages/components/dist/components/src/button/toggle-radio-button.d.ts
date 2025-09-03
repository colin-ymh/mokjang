export type RadioButtonValue = {
    value: any;
    title: string;
};
type ToggleRadioButtonProps = {
    items: RadioButtonValue[];
    selectedValue: any;
    onChange: (value: any) => void;
    rowPadding?: number;
    columnPadding?: number;
    backgroundColor?: string;
    toggleBackgroundColor?: string;
    color?: string;
    fontSize?: number;
    fontWeight?: number;
};
export declare const ToggleRadioButton: ({ items, selectedValue, onChange, rowPadding, columnPadding, backgroundColor, toggleBackgroundColor, color, fontSize, fontWeight, }: ToggleRadioButtonProps) => import("react/jsx-runtime").JSX.Element;
export {};
