const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "maglev.proxy.rlwy.net",
    user: "root",
    password: "oQNwBWAuzOEwfIdXMlOCzeDQOZjVzPYc",
    database: "railway",
    port: 10245,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.message);
        return;
    }
    console.log("MySQL Connected Successfully");
    connection.release();
});

module.exports = pool;