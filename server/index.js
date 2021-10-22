require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT;
const debug = process.env.DEBUG === 'true';
const expire = process.env.EXPIRE;

// Set CORS
app.use(function(req, res, next) {
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
app.use(function(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        res.status(400).send("400 Bad request");
    } else next();
});

// JSON update request structure:
//   id: string
//   data:
//       name: string
//       location: {}
//   friends: string[]
const onlinePlayers = new Map();

function updatePlayerData(player, data) {
    console.log(expire);
    if (expire > 0) {
        const existingPlayer = onlinePlayers.get(player);
        if (existingPlayer) {
            clearTimeout(existingPlayer.interval);
        }
    }
    onlinePlayers.set(player, {
        data: data,
        interval: expire > 0 ? setTimeout(() => deletePlayerData(player), expire * 1000) : undefined,
    });
}

function deletePlayerData(player) {
    if (debug) {
        console.log('Expired ' + player);
    }

    onlinePlayers.delete(player);
}

function getPlayersData(players) {
    var data = [];
    for (key in players) {
        const playerData = onlinePlayers.get(players[key]);
        if (playerData)
            data.push(playerData.data);
    }
    return data;
}

function validateJSON(json) {
    if (typeof json === 'object'
        && typeof json.id === 'string'
        && Array.isArray(json.friends)
        && json.friends.every(f => typeof f === 'string')
        && typeof json.data === 'object'
        && typeof json.data.name === 'string'
        && typeof json.data.location === 'object'
        && typeof json.data.location.x === 'number'
        && typeof json.data.location.y === 'number') {
        return true;
    }
    return false;
}

function sanitizeData(data) {
    return {
        name: data.name,
        location: {
            x: data.location.x,
            y: data.location.y,
        },
    };
}

app.post('/data/update', function(req, res) {
    const json = req.body;

    if (debug) {
        console.log(json);
    }

    if (validateJSON(json)) {
        const sanitizedData = sanitizeData(json.data);
        updatePlayerData(json.id, sanitizedData);

        const friends = getPlayersData(json.friends);
        return res.json({"friends": friends});
    }
    return res.status(400).send("400 Bad request");
});

app.listen(port, () => {
    console.log(`Newworld minimap server started at the port: ${port}`);

    setInterval(function() {
        console.log(`Currently are stored ${onlinePlayers.size} players`);
    }, 5000);
});