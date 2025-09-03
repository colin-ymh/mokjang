import { SIZE } from '@mokjang/constants';
export type MainTextProps = {
    size?: SIZE;
    color?: string;
    fontSize?: number;
    fontWeight?: number;
    whiteSpace?: string;
    maxWidth?: number | string;
    overflow?: string;
    textOverflow?: string;
    textDecoration?: string;
    cursor?: string;
    lineHeight?: number | string;
    baselineOffsetPx?: number;
};
export declare const MainText: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, MainTextProps>> & string;
