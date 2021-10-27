require('dotenv').config();
import express = require('express');
import rateLimit = require('express-rate-limit');
import process = require('process');
import { validateDeprecatedPlayerRequest, validatePlayerRequest } from './validation';
import type { DeprecatedPlayerData, MapType, DeprecatedMapType, DeprecatedPlayerRequest, PlayerRequest, PlayerData, PlayerResponse, PlayerChannelResponseData } from './types';

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
    if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
        res.status(400).send('400 Bad request');
    } else next();
});

const channels = new Map<string, Map<string, MapType>>();

function updatePlayerData(request: PlayerRequest) {
    const timestamp = process.hrtime.bigint();
    for (const channelData of request.channels) {
        const stored: MapType = {
            data: channelData.data,
            timestamp,
        };
        let channel = channels.get(channelData.channel);
        if (!channel) {
            channel = new Map();
            channels.set(channelData.channel, channel);
        }
        channel.set(request.id, stored);
    }
}

function getPlayersResponseData(request: PlayerRequest) {
    const data: PlayerChannelResponseData[] = [];
    for (const channelData of request.channels) {
        const channel = channels.get(channelData.channel);
        if (!channel) { continue; }

        const players: PlayerData[] = [];
        for (const [playerId, mapItem] of channel) {
            if (playerId !== request.id) {
                players.push(mapItem.data);
            }
        }

        data.push({
            channel: channelData.channel,
            data: players,
        });
    }
    return data;
}

app.post('/data/channel', function (req, res) {
    const json = req.body;

    if (debug) {
        console.log(json);
    }

    if (validatePlayerRequest(json)) {
        updatePlayerData(json);

        const channels = getPlayersResponseData(json);
        const result: PlayerResponse = {
            channels,
        };
        return res.json(result);
    }
    return res.status(400).send('400 Bad request');
});

function evictPlayersData() {
    const now = process.hrtime.bigint();
    for (const [channelId, channel] of channels) {
        for (const [playerId, playerMapData] of channel) {
            if (now - playerMapData.timestamp > expireNanoseconds) {
                channel.delete(playerId);
            }
        }
        if (channel.size === 0) {
            channels.delete(channelId);
        }
    }
}

const deprecatedOnlinePlayers = new Map<string, DeprecatedMapType>();

function deprecatedGetSanitizedData(data: DeprecatedPlayerData): DeprecatedPlayerData {
    return {
        name: data.name,
        location: {
            x: data.location.x,
            y: data.location.y,
        },
    };
}

function deprecatedUpdatePlayerData(request: DeprecatedPlayerRequest) {
    deprecatedOnlinePlayers.set(request.id, {
        data: deprecatedGetSanitizedData(request.data),
        timestamp: process.hrtime.bigint(),
    });
}

function deprecatedGetPlayersData(request: DeprecatedPlayerRequest) {
    const data: DeprecatedPlayerData[] = [];
    for (const friend of request.friends) {
        const playerData = deprecatedOnlinePlayers.get(friend);
        if (playerData) {
            data.push(playerData.data);
        }
    }
    return data;
}

function deprecatedEvictPlayersData() {
    const now = process.hrtime.bigint();
    for (const [key, value] of deprecatedOnlinePlayers) {
        if (now - value.timestamp > expireNanoseconds) {
            deprecatedOnlinePlayers.delete(key);
        }
    }
}

app.post('/data/update', function (req, res) {
    const json = req.body;

    if (debug) {
        console.log(json);
    }

    if (validateDeprecatedPlayerRequest(json)) {
        deprecatedUpdatePlayerData(json);

        const friends = deprecatedGetPlayersData(json);
        return res.json({
            friends: friends,
        });
    }
    return res.status(400).send('400 Bad request');
});

app.listen(port, () => {
    console.log(`Newworld minimap server started at the port: ${port}`);

    setInterval(function () {
        evictPlayersData();
        deprecatedEvictPlayersData();
        console.log(`Currently are stored ${channels.size} channels (${deprecatedOnlinePlayers.size} legacy)`);
    }, 5000);
});
