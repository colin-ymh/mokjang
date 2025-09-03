type PopupHeaderViewProps = {
    headerTitle?: string;
    headerDescription?: string;
    headerLeft?: React.ReactNode;
    headerRight?: React.ReactNode;
    onClickCancel: () => void;
    onClickDone?: () => void;
    cancelText: string;
    doneText: string;
    isHeaderBorderShown?: boolean;
    height?: number;
};
export declare const PopupHeaderView: ({ headerTitle, headerDescription, headerLeft, headerRight, onClickCancel, onClickDone, cancelText, doneText, isHeaderBorderShown, height, }: PopupHeaderViewProps) => import("react/jsx-runtime").JSX.Element;
export {};
