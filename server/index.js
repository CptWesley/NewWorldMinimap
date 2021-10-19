require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;
const debug = process.env.DEBUG === 'true';
const expire = process.env.EXPIRE;

// Set rate limiter
const limiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 1 // 1 request max
});
app.use(limiter);

// Set CORS
app.use(function(req, res, next) {
    console.log('cors');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// app.use(cors());

// Set json body parser
app.use(bodyParser.json());
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
            data.push(playerData);
    }
    return data;
}

function validateJSON(json) {
    if (json !== undefined
            && json.id !== undefined
            && json.friends !== undefined
            && json.data !== undefined
            && json.data.name !== undefined
            && json.data.location !== undefined
            && json.data.location.x !== undefined
            && json.data.location.x !== undefined) {
        return true;
    }
    return false;
}

app.post('/data/update', function(req, res) {
    const json = req.body;

    if (debug) {
        console.log(json);
    }

    if (validateJSON(json)) {
        updatePlayerData(json.id, json.data);

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