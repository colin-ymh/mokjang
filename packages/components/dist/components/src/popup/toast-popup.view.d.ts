import { MainTextProps } from '../text';
export declare enum TOAST_DIRECTION {
    TOP = "top",
    BOTTOM = "bottom"
}
export declare const ToastPopupView: import("react").ForwardRefExoticComponent<MainTextProps & {
    isDeletable: boolean;
    direction: TOAST_DIRECTION;
    onClickDeleteButton: () => void;
} & import("react").RefAttributes<HTMLDivElement>>;
