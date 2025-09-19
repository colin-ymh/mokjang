type PopupHeaderViewProps = {
    headerTitle?: string;
    headerDescription?: string;
    headerLeft?: React.ReactNode;
    headerRight?: React.ReactNode;
    onClickClose: () => void;
    isHeaderBorderShown?: boolean;
    height?: number;
};
export declare const PopupHeaderView: ({ headerTitle, headerDescription, headerLeft, headerRight, onClickClose, isHeaderBorderShown, height, }: PopupHeaderViewProps) => import("react/jsx-runtime").JSX.Element;
export {};
