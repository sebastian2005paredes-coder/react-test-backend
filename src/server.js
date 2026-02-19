require("dotenv").config();
const app = require("./app");
const initDB = require("./config/initDB");

const PORT = process.env.PORT || 8080;

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
});