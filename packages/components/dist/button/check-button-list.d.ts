export type CheckButtonValue = {
    value: any;
    title: string;
};
type CheckButtonListProps = {
    values: any[];
    onChange: (values: any[]) => void;
    items: CheckButtonValue[];
    gridCount?: number;
};
export declare const CheckButtonList: ({ values, onChange, items, gridCount, }: CheckButtonListProps) => import("react/jsx-runtime").JSX.Element;
export {};
