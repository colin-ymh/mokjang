import { InputHTMLAttributes } from 'react';
export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    height?: number;
    width?: number;
    color?: string;
    backgroundColor?: string;
    onClick?: (event: any) => void;
    borderBottomColor?: string;
    onFocus?: (event: any) => void;
    onBlur?: (event: any) => void;
    paddingLeft?: number;
};
export declare const MainInput: import("react").ForwardRefExoticComponent<InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    height?: number;
    width?: number;
    color?: string;
    backgroundColor?: string;
    onClick?: (event: any) => void;
    borderBottomColor?: string;
    onFocus?: (event: any) => void;
    onBlur?: (event: any) => void;
    paddingLeft?: number;
} & import("react").RefAttributes<HTMLInputElement>>;
