import React from 'react';
export declare const Profile: import("styled-components/dist/types").IStyledComponentBase<"web", import("styled-components/dist/types").Substitute<Omit<Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "ref" | "height" | "width" | "alt" | "src" | "loading" | "srcSet"> & {
    src: string | import("next/dist/shared/lib/get-img-props").StaticImport;
    alt: string;
    width?: number | `${number}` | undefined;
    height?: number | `${number}` | undefined;
    fill?: boolean | undefined;
    loader?: import("next/image").ImageLoader | undefined;
    quality?: number | `${number}` | undefined;
    priority?: boolean | undefined;
    loading?: "eager" | "lazy" | undefined;
    placeholder?: import("next/dist/shared/lib/get-img-props").PlaceholderValue | undefined;
    blurDataURL?: string | undefined;
    unoptimized?: boolean | undefined;
    overrideSrc?: string | undefined;
    onLoadingComplete?: import("next/dist/shared/lib/get-img-props").OnLoadingComplete | undefined;
    layout?: string | undefined;
    objectFit?: string | undefined;
    objectPosition?: string | undefined;
    lazyBoundary?: string | undefined;
    lazyRoot?: string | undefined;
} & React.RefAttributes<HTMLImageElement | null>, "ref"> & {
    ref?: ((instance: HTMLImageElement | null) => void | React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES[keyof React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES]) | React.RefObject<HTMLImageElement | null> | null | undefined;
}, {
    $isButton: boolean;
}>> & string & Omit<React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "ref" | "height" | "width" | "alt" | "src" | "loading" | "srcSet"> & {
    src: string | import("next/dist/shared/lib/get-img-props").StaticImport;
    alt: string;
    width?: number | `${number}` | undefined;
    height?: number | `${number}` | undefined;
    fill?: boolean | undefined;
    loader?: import("next/image").ImageLoader | undefined;
    quality?: number | `${number}` | undefined;
    priority?: boolean | undefined;
    loading?: "eager" | "lazy" | undefined;
    placeholder?: import("next/dist/shared/lib/get-img-props").PlaceholderValue | undefined;
    blurDataURL?: string | undefined;
    unoptimized?: boolean | undefined;
    overrideSrc?: string | undefined;
    onLoadingComplete?: import("next/dist/shared/lib/get-img-props").OnLoadingComplete | undefined;
    layout?: string | undefined;
    objectFit?: string | undefined;
    objectPosition?: string | undefined;
    lazyBoundary?: string | undefined;
    lazyRoot?: string | undefined;
} & React.RefAttributes<HTMLImageElement | null>>, keyof React.Component<any, {}, any>>;
type ProfileImageProps = {
    value?: string;
    width?: number;
    height?: number;
    onClick?: () => void;
    quality?: number;
};
export declare const ProfileImage: ({ value, width, height, quality, onClick, }: ProfileImageProps) => import("react/jsx-runtime").JSX.Element;
export {};
