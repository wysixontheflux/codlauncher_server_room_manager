require('dotenv').config();
const mariadb = require('mariadb');

class Database {
    constructor() {
        this.host = process.env.DB_HOST;
        this.user = process.env.DB_USER;
        this.password = process.env.DB_PASSWORD;
        this.database = process.env.DB_NAME;
        this.pool = mariadb.createPool({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            connectionLimit: 5
        });
    }

    async query(sql, params) {
        let conn;
        try {
            conn = await this.pool.getConnection();
            let rows = await conn.query(sql, params);
            return rows;
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.release(); //release to pool
        }
    }

    async close() {
        return await this.pool.end();
    }
}

module.exports = Database;
