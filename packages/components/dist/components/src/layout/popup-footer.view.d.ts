type PopupFooterViewProps = {
    onClickCancel: () => void;
    onClickDone?: () => void;
    cancelText: string;
    doneText: string;
    cancelBackgroundColor?: string;
    doneBackgroundColor?: string;
    doneDisabled?: boolean;
};
export declare const PopupFooterView: ({ onClickCancel, onClickDone, cancelText, doneText, cancelBackgroundColor, doneBackgroundColor, doneDisabled, }: PopupFooterViewProps) => import("react/jsx-runtime").JSX.Element;
export {};
