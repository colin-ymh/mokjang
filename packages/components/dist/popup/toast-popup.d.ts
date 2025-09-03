import { TOAST_DIRECTION } from './toast-popup.view';
import { MainTextProps } from '@mokjang/components';
type ToastPopupProps = MainTextProps & {
    timeout?: number;
    isDeletable?: boolean;
    direction?: TOAST_DIRECTION;
    onClose: () => void;
};
export declare const ToastPopup: ({ timeout, isDeletable, direction, onClose, }: ToastPopupProps) => import("react/jsx-runtime").JSX.Element;
export {};
