const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "maglev.proxy.rlwy.net",
    user: "root",
    password: "oQNwBWAuzOEwfIdXMlOCzeDQOZjVzPYc",
    database: "railway",
    port: 10245
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.message);
        return;
    }
    console.log("MySQL Connected Successfully");
});

module.exports = connection;