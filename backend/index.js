import axios from 'axios'
import Server from './server.js'
import Sql from './sql.js'
import mssql from 'mssql'

const server = new Server()
server.create()
server.addRoutes("GET", "/", (req, h) => {
    return "Hello world!"
})

server.addRoutes("POST", "/data", (req, h) => {
    console.dir(req.payload)
    const payload = JSON.parse(Object.keys(req.payload)[0])
    return "Thanks for the data!"
})

axios({
    method: "POST",
    data: JSON.stringify({
        "UserId": "Test",
        "Game": "Roblox"
    }),
    url: "http://localhost:3000/data"
}).catch(err => {
    console.log("Error")
})

const sql = new Sql()
await sql.connect()
sql.create()