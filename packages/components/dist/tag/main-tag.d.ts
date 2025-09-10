import React from 'react';
type MainTagProps = {
    title: string;
    backgroundColor?: string;
    color?: string;
    svg?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    rowPadding?: number;
    columnPadding?: number;
    gap?: number;
    fontSize?: number;
    fontWeight?: number;
};
export declare const MainTag: ({ title, backgroundColor, color, svg, rowPadding, columnPadding, gap, fontSize, fontWeight, }: MainTagProps) => import("react/jsx-runtime").JSX.Element;
export {};
