import React from 'react';

export interface ISvgMapIconConsumerProps {
    stroke?: string;
    strokeWidth?: string | number;
    fill?: string;
    scale?: number;
    viewBox?: string;
}

interface ISvgMapIconProps extends ISvgMapIconConsumerProps {
    width?: number;
    height?: number;
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
        viewBox = `0 0 ${width} ${height}`,
    } = getSvgMapIconProps(props);

    return (
        <svg
            xmlns={xmlNamespace}
            width={width * scale}
            height={height * scale}
            viewBox={viewBox}
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
