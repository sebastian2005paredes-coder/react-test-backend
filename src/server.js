const app = require("./app");
const initDB = require("./config/initDB");  

const PORT = 3000;

initDB().then(() => {            
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
});