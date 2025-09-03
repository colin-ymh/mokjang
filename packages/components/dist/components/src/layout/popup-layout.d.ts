import React from 'react';
export type PopupLayoutProps = {
    onClickCancel: () => void;
    onClickDone?: () => void;
    headerTitle?: string;
    headerDescription?: string;
    headerRight?: React.ReactNode;
    cancelText?: string;
    doneText?: string;
    cancelBackgroundColor?: string;
    doneBackgroundColor?: string;
    isFooterShown?: boolean;
    isHeaderShown?: boolean;
    doneDisabled?: boolean;
    isHeaderBorderShown?: boolean;
    headerHeight?: number;
    children: React.ReactNode;
};
export declare const PopupLayout: ({ headerTitle, headerDescription, headerRight, onClickCancel, onClickDone, cancelText, doneText, cancelBackgroundColor, doneBackgroundColor, isHeaderShown, isFooterShown, doneDisabled, isHeaderBorderShown, headerHeight, children, }: PopupLayoutProps) => JSX.Element;
