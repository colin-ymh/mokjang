export type HeaderBarItem = {
    id: string;
    title: string;
    icon?: any;
};
type PopupHeaderBarViewProps = {
    value: string;
    items: HeaderBarItem[];
    onClick: (id: string) => void;
};
export declare const PopupHeaderBarView: ({ value, items, onClick, }: PopupHeaderBarViewProps) => import("react/jsx-runtime").JSX.Element;
export {};
