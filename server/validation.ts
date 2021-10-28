import type { DeprecatedPlayerRequest, PlayerChannelRequestData, PlayerDataPsk, PlayerRequest } from './types';
import { validate as validateUuid } from 'uuid';

const maxChannels = 10;
const maxPskDataLength = 128;

function validatePlayerDataPsk(data: PlayerDataPsk): data is PlayerDataPsk {
    return !!data
        && typeof data === 'object'
        && data.type === 'psk'
        && typeof data.c === 'string'
        && data.c.length <= maxPskDataLength;
}

function validatePlayerChannelData(channel: PlayerChannelRequestData): channel is PlayerChannelRequestData {
    return !!channel
    && typeof channel === 'object'
    && typeof channel.channel === 'string'
    && validateUuid(channel.channel)
    && validatePlayerDataPsk(channel.data);
}

export function validatePlayerRequest(req: PlayerRequest): req is PlayerRequest {
    return !!req
        && typeof req === 'object'
        && typeof req.id === 'string'
        && validateUuid(req.id)
        && Array.isArray(req.channels)
        && req.channels.length <= maxChannels
        && req.channels.every(c => validatePlayerChannelData(c));
}

export function validateDeprecatedPlayerRequest(req: DeprecatedPlayerRequest): req is DeprecatedPlayerRequest {
    return !!req
        && typeof req === 'object'
        && typeof req.id === 'string'
        && Array.isArray(req.friends)
        && req.friends.every(f => typeof f === 'string')
        && !!req.data
        && typeof req.data === 'object'
        && typeof req.data.name === 'string'
        && typeof req.data.location === 'object'
        && typeof req.data.location.x === 'number'
        && typeof req.data.location.y === 'number';
}
