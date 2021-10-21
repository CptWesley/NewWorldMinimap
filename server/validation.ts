import type { PlayerDataDeprecated, PlayerRequest, PlayerRequestDataPlain, PlayerRequestDataPsk, Vector2 } from './types';

export function validateVector2(vector2: Vector2): vector2 is Vector2 {
    return typeof vector2 === 'object'
        && typeof vector2.x === 'number'
        && typeof vector2.y === 'number';
}

function validatePlayerDataPlain(req: PlayerRequestDataPlain): req is PlayerRequestDataPlain {
    return typeof req === 'object'
        && req.type === 'plain'
        && typeof req.data === 'object'
        && typeof req.data.name === 'string'
        && validateVector2(req.data.location);
}

function validatePlayerDataPsk(req: PlayerRequestDataPsk): req is PlayerRequestDataPsk {
    return typeof req === 'object'
        && req.type === 'psk'
        && typeof req.data === 'string'
        && req.data.length < 128;
}

function validatePlayerDataDeprecated(req: PlayerDataDeprecated): req is PlayerDataDeprecated {
    return typeof req === 'object'
        && typeof req.type === 'undefined'
        && typeof req.data === 'object'
        && typeof req.data.name === 'string'
        && typeof req.data.location === 'object'
        && typeof req.data.location.x === 'number'
        && typeof req.data.location.y === 'number';
}

export function validatePlayerRequest(req: PlayerRequest): req is PlayerRequest {
    return typeof req === 'object'
        && typeof req.id === 'string'
        && Array.isArray(req.friends)
        && req.friends.every(f => typeof f === 'string')
        && (
            validatePlayerDataPlain(req as PlayerRequestDataPlain)
            || validatePlayerDataPsk(req as PlayerRequestDataPsk)
            || validatePlayerDataDeprecated(req as PlayerDataDeprecated)
        );
}
