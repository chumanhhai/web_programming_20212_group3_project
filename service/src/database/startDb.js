const mysql = require("mysql2/promise")

class Connection {
    static connection = null

    getInstance() {
        if(!this.connection) {
            this.connection = mysql.createPool({
                host: process.env.HOST,
                database: process.env.DB_NAME,
                user: process.env.USER_NAME,
                password: process.env.PASSWORD,
                port: process.env.DB_PORT,
            })
            console.log("DB is connected");
        }
        return this.connection
    }
}

module.exports = new Connection().getInstance()