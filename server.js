const express = require('express')
const { spawn } = require('child_process')

const app = express()
const port = 3000

app.get('/execute', (req, res) => {
    console.log('appel route')
    let port = req.query.port;
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

app.listen(port, () => {
    console.log(`API démarrée sur http://localhost:${port}`)
});


// http://193.38.250.89:3000/execute?port=28965
