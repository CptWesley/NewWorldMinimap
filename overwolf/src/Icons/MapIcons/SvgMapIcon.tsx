import React from 'react';

export interface ISvgMapIconProps {
    stroke?: string;
    strokeWidth?: string | number;
    fill?: string;
    width?: number;
    height?: number;
    scale?: number;
}

export const svgMapIconDefaultProps: ISvgMapIconProps = {
    stroke: '#000',
    strokeWidth: 1,
    fill: '#fff',
    width: 16,
    height: 16,
    scale: 1,
};

export function getSvgMapIconProps<T extends ISvgMapIconProps>(props: T) {
    return { ...svgMapIconDefaultProps, ...props };
}

const xmlNamespace = 'http://www.w3.org/2000/svg';

type SvgMapIconPropsType = React.PropsWithChildren<ISvgMapIconProps>;
export default function SvgMapIcon(props: SvgMapIconPropsType) {
    const {
        children,
        stroke = '#000',
        strokeWidth = 1,
        fill = '#fff',
        width = 16,
        height = 16,
        scale = 1,
    } = getSvgMapIconProps(props);

    return (
        <svg
            xmlns={xmlNamespace}
            width={width * scale}
            height={height * scale}
            viewBox={`0 0 ${width} ${height}`}
            style={{
                fill,
                stroke,
                strokeWidth,
            }}
        >
            {children}
        </svg>
    );
}
