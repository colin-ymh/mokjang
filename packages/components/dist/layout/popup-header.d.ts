import React from 'react';
type PopupHeaderProps = {
    headerTitle?: string;
    headerDescription?: string;
    headerRight?: React.ReactNode;
    headerLeft?: React.ReactNode;
    onClickClose: () => void;
    isHeaderBorderShown?: boolean;
    height?: number;
};
export declare const PopupHeader: (props: PopupHeaderProps) => import("react/jsx-runtime").JSX.Element;
export {};
