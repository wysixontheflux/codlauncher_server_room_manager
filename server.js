
const express = require('express')
const { spawn } = require('child_process')
const cors = require('cors')

const app = express()
app.use(cors())
const port = 3000

app.get('/execute', (req, res) => {
    console.log('appel route')
    let port = req.query.port;  // Récupère le port depuis les paramètres de la requête
    let child = spawn('sh', ['start_server.sh', port], { cwd: 'bash_server_manager' })

    child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
    })

    child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
    })

    child.on('error', (error) => {
        console.error(`error: ${error.message}`)
    })

    child.on('exit', (code, signal) => {
        if (code) console.log(`Process exited with code ${code}`)
        if (signal) console.log(`Process was killed with signal ${signal}`)
    })
})

app.get('/room/:roomType', (req, res) => {
    console.log('request roomtype')
    let roomType = req.params.roomType;
    if (!(roomType in rooms)) {
        res.status(400).send('Invalid room type');
        return;
    }

    let room = rooms[roomType];

    res.send({ players: room.players });
});

let rooms = {
    'deathmatch': { players: 0, server: null },
    'team-deathmatch': { players: 0, server: null },
}

app.post('/room/:roomType/join', (req, res) => {
    console.log('Request room join')
    let roomType = req.params.roomType;
    if (!(roomType in rooms)) {
        res.status(400).send('Invalid room type');
        return;
    }

    let room = rooms[roomType];
    room.players += 1;

    if (room.server === null) {
        let port = 25565;
        room.server = spawn('sh', ['start_server.sh', port], { cwd: 'bash_server_manager' });
    }

    res.send({ players: room.players });
});

app.get('/room/:roomType/leave', (req, res) => {
    let roomType = req.params.roomType;
    if (!(roomType in rooms)) {
        res.status(400).send('Invalid room type');
        return;
    }

    let room = rooms[roomType];
    room.players = Math.max(0, room.players - 1);

    if (room.players === 0 && room.server !== null) {
        room.server.kill('SIGTERM');
        room.server = null;
    }

    res.send({ players: room.players });
});

app.listen(port, () => {
    console.log(`API démarrée sur http://localhost:${port}`)
});


// http://193.38.250.89:3000/execute?port=28965