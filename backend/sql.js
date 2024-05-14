import mssql from "mssql"
import "dotenv/config"

const config = {
    "server": "localhost",
    "port": 1433,
    "user": process.env.user,
    "password": process.env.password,
    "options": {
        trustServerCertificate: true
    },
    "database": "discord"
} 

export default class {
    async connect() {
        await mssql.connect(config)
    }

    async create() {
        try{
            await mssql.query`
                IF NOT EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='musicQueues')
                BEGIN
                CREATE TABLE musicQueues (
                    id INT IDENTITY(1,1),
                    serverId INT,
                    author INT,
                    url varchar(255),
                    added DateTime DEFAULT CURRENT_TIMESTAMP,
                    status varchar(10) DEFAULT 'WAITING'
                    PRIMARY KEY (id)
                )
                END
            `
        }
        catch (err) {
            console.log(err)
        }
    }

    async addQueue(author, serverId, url) {
        try {
            await mssql.query`
                IF EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME='musicQueues')
                BEGIN
                INSERT INTO musicQueues(author, serverId, url) VALUES(${author},${serverId},${url})
                SELECT * FROM musicQueues
                END
            `
        }
        catch (err){
            console.log(err)
        }
    }

    async removeQueue(serverId) {
        try {
            await mssql.query`
                DELETE TOP(1) FROM musicQueues
                WHERE serverId = ${serverId}
            `
        }
        catch (err) {

        }
    }

    async cleanup() {
        try {
            await mssql.query`
                drop TABLE IF EXISTS musicQueues
            `
            await this.create()
        }
        catch(err) {
            console.log()
        } 
    }
}