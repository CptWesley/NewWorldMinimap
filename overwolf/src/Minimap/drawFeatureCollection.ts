import { MapIconRendererParameters, MapRendererParameters } from './useMinimapRenderer';
import {Feature, LineString} from 'geojson';
import {worldCoordinateToCanvas} from '@/logic/tiles';
import {rotateAround} from '@/logic/util';

const drawLineString = (params: MapRendererParameters, iconParams: MapIconRendererParameters, lineString: LineString, properties: featureProperties) => {
    const { context, mapCenterPosition, zoomLevel, renderAsCompass, center, mapAngle} = params;

    context.beginPath();
    let pointIndex = 0;
    for (const coor of lineString.coordinates) {
        const pointPos: Vector2 = {x: coor[0], y: coor[1]};
        const position = worldCoordinateToCanvas(
            pointPos,
            mapCenterPosition,
            zoomLevel,
            context.canvas.width,
            context.canvas.height,
        );

        const canvasPosition = renderAsCompass
            ? rotateAround(center, position, -mapAngle)
            : position;
        if (pointIndex === 0) {
            context.moveTo(canvasPosition.x, canvasPosition.y);
        } else {
            context.lineTo(canvasPosition.x, canvasPosition.y);
        }
        pointIndex++;
    }
    // Reset to default style
    context.strokeStyle = '#000000';
    context.lineWidth = 1;

    if (properties?.strokeStyle !== undefined) {
        context.strokeStyle = properties?.strokeStyle;
    }
    if (properties?.lineWidth !== undefined) {
        context.lineWidth = properties?.lineWidth;
    }
    context.stroke();

};

export default function drawFeatureCollection(params: MapRendererParameters, iconParams: MapIconRendererParameters, features: Feature[]) {

    for (const feature of features) {
        if (feature.geometry.type !== 'LineString') {
            console.warn('Only `LineString` feature is supported at the moment');
        } else {
            drawLineString(
                params,
                iconParams,
                feature.geometry,
                feature.properties as featureProperties,
            );
        }
    }
}

