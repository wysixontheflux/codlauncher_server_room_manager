const express = require('express')
const { exec } = require('child_process')

const app = express()
const port = 3000

app.get('/execute', (req, res) => {
    let port = req.query.port;  // Récupère le port depuis les paramètres de la requête
    exec(`sudo cd bash_server_manager && sh start_server.sh ${port}`, (err, stdout, stderr) => {
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
