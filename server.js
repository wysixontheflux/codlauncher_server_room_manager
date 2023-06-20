const express = require('express')
const { exec } = require('child_process')

const app = express()
const port = 3000

app.get('/execute', (req, res) => {
    exec('echo "Hello world"', (err, stdout, stderr) => {
        if (err) {
            console.log(err)
            return
        }
        console.log(stdout)
    })
})

app.listen(port, () => {
    console.log(`API démarrée sur http://localhost:${port}`)
});
