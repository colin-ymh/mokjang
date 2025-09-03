import { HeaderBarItem } from './popup-header-bar.view';
type PopupHeaderBarProps = {
    value: string;
    items: HeaderBarItem[];
    onClick: (id: any) => void;
};
export declare const PopupHeaderBar: ({ value, items, onClick, }: PopupHeaderBarProps) => import("react/jsx-runtime").JSX.Element;
export {};
