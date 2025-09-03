export type TransparentBackgroundProps = {
    isOpened: boolean;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    blur?: boolean;
    zIndex?: number;
};
export declare const TransparentBackground: ({ isOpened, onClick, blur, zIndex, }: TransparentBackgroundProps) => import("react/jsx-runtime").JSX.Element | null;
