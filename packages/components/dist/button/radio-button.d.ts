export type RadioButtonItemProps = {
    title?: string;
    isSelected: boolean;
    onClick?: (event: any) => void;
    isBorder?: boolean;
};
export declare const RadioButton: ({ title, isSelected, onClick, isBorder, }: RadioButtonItemProps) => import("react/jsx-runtime").JSX.Element;
