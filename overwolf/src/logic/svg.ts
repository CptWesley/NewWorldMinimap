import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ISvgMapIconProps } from '../Icons/MapIcons/SvgMapIcon';

export async function svgMapIconToImageBitmap(component: React.ComponentType<ISvgMapIconProps>, props?: ISvgMapIconProps) {
    const element = React.createElement(component, props);
    const svgString = ReactDOMServer.renderToStaticMarkup(element);
    const svgUrl = `data:image/svg+xml;utf-8,${encodeURIComponent(svgString)}`;

    const img = new Image();
    const loadPromise = new Promise((resolve, reject) => {
        img.addEventListener('load', resolve);
        img.addEventListener('error', reject);
    });
    img.src = svgUrl;

    await loadPromise;

    const imageBitmap = createImageBitmap(img);
    return imageBitmap;
}
