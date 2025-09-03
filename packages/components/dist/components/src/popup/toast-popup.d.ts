import { TOAST_DIRECTION } from './toast-popup.view';
import { MainTextProps } from 'index';
type ToastPopupProps = MainTextProps & {
    timeout?: number;
    isDeletable?: boolean;
    direction?: TOAST_DIRECTION;
};
export declare const ToastPopup: ({ timeout, isDeletable, direction, }: ToastPopupProps) => import("react/jsx-runtime").JSX.Element;
export {};
