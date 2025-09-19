import React from 'react';
import { CURSOR } from '@mokjang/constants';
type IconProps = {
    svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    size?: number;
    color?: string;
    width?: number;
    onClick?: (event?: any) => void;
    cursor?: CURSOR;
    bottom?: number;
};
export declare const SvgIcon: ({ svg: SvgComponent, size, color, width, onClick, cursor, bottom, }: IconProps) => import("react/jsx-runtime").JSX.Element;
export {};
