require('dotenv').config();
import express = require('express');
import rateLimit = require('express-rate-limit');
import process = require('process');
import crypto = require('crypto');
import { validatePlayerRequest } from './validation';
import type { FriendsList, MapType, MapTypeDeprecated, PlayerData, PlayerDataPlain, PlayerId, PlayerRequestData } from './types';

const app = express();
const port = Number(process.env.PORT);
const debug = process.env.DEBUG === 'true';
const expireSeconds: number = Number(process.env.EXPIRE) || 30;
const expireNanoseconds = BigInt(expireSeconds) * BigInt(1_000_000_000);

if (!port) {
    throw new Error(`Invalid port: ${port}`);
}

// Set CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Set rate limiter
const limiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 4 // 4 request max
});
app.use(limiter);

// Set json body parser
app.use(express.json());
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (err instanceof SyntaxError && (err as any).status === 400 && "body" in err) {
        res.status(400).send("400 Bad request");
    } else next();
});

const onlinePlayers = new Map<string, MapType>();
const onlinePlayersDeprecated = new Map<string, MapTypeDeprecated>();

function getSanitizedData<T extends PlayerRequestData>(data: T): PlayerData {
    switch (data.type) {
        case 'plain':
        case undefined:
            return {
                name: data.data.name,
                location: {
                    x: data.data.location.x,
                    y: data.data.location.y,
                },
            };
        case 'psk':
            return data.data;
    }
}

/**
 * Adds a player to the online players map.
 * The player ID is digested, and the digest is used as the key.
 * All players are added to the non-deprecated map.
 * If the request type is deprecated, its data will also be added to the
 * deprecated map, without being digested.
 * @param request The request data.
 */
function updatePlayerData(request: PlayerId & PlayerRequestData) {
    const idDigest = crypto.createHash('sha256').update(request.id).digest('hex');
    onlinePlayers.set(idDigest, {
        data: getSanitizedData(request),
        timestamp: process.hrtime.bigint(),
    });
    if (request.type === undefined) {
        onlinePlayersDeprecated.set(request.id, {
            data: getSanitizedData(request) as MapTypeDeprecated['data'],
            timestamp: process.hrtime.bigint(),
        });
    }
}

/**
 * Gets the list of player data for the friends of this request.
 * If the request is deprecated, only other players using the deprecated
 * client will be returned.
 * @param request The request data.
 * @returns A list of player data for the friends of this request.
 */
function getPlayersData(request: FriendsList & PlayerRequestData) {
    if (request.type !== undefined) {
        const data: PlayerData[] = [];
        for (const friendDigest of request.friends) {
            const playerData = onlinePlayers.get(friendDigest);
            if (playerData) {
                data.push(playerData.data);
            }
        }
        return data;
    } else {
        const data: PlayerDataPlain[] = [];
        for (const friend of request.friends) {
            const playerData = onlinePlayersDeprecated.get(friend);
            if (playerData) {
                data.push(playerData.data);
            }
        }
        return data;
    }
}

function evictPlayersData() {
    const now = process.hrtime.bigint();
    for (const [key, value] of onlinePlayers) {
        if (now - value.timestamp > expireNanoseconds) {
            onlinePlayers.delete(key);
        }
    }
    for (const [key, value] of onlinePlayersDeprecated) {
        if (now - value.timestamp > expireNanoseconds) {
            onlinePlayersDeprecated.delete(key);
        }
    }
}

app.post('/data/update', function (req, res) {
    const json = req.body;

    if (debug) {
        console.log(json);
    }

    if (validatePlayerRequest(json)) {
        updatePlayerData(json);

        const friends = getPlayersData(json);
        return res.json({
            friends: friends,
        });
    }
    return res.status(400).send("400 Bad request");
});

app.listen(port, () => {
    console.log(`Newworld minimap server started at the port: ${port}`);

    setInterval(function () {
        evictPlayersData();
        console.log(`Currently are stored ${onlinePlayers.size} (${onlinePlayersDeprecated.size}) players`);
    }, 5000);
});
