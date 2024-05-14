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
                    queue_name varchar(255),
                    author varchar(255),
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
}