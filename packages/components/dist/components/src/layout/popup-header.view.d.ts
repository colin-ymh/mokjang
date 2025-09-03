import React from 'react';
type PopupHeaderViewProps = {
    headerTitle?: string;
    headerDescription?: string;
    headerRight?: React.ReactNode;
    onClickCancel: () => void;
    onClickDone?: () => void;
    cancelText: string;
    doneText: string;
    isHeaderBorderShown?: boolean;
    height?: number;
};
export declare const PopupHeaderView: ({ headerTitle, headerDescription, headerRight, onClickCancel, onClickDone, cancelText, doneText, isHeaderBorderShown, height, }: PopupHeaderViewProps) => import("react/jsx-runtime").JSX.Element;
export {};
