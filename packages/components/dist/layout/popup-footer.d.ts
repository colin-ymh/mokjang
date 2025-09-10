type PopupFooterProps = {
    onClickCancel?: () => void;
    onClickDone?: () => void;
    cancelText: string;
    doneText: string;
    cancelBackgroundColor?: string;
    doneBackgroundColor?: string;
    doneDisabled?: boolean;
};
export declare const PopupFooter: ({ onClickCancel, onClickDone, cancelText, doneText, cancelBackgroundColor, doneBackgroundColor, doneDisabled, }: PopupFooterProps) => import("react/jsx-runtime").JSX.Element;
export {};
