const db = require("./db");

const runQuery = (query, label) => {
    return new Promise((resolve, reject) => {
        db.query(query, (err) => {
            if (err) {
                console.error(`${label} error:`, err.message);
                return reject(err);
            }

            console.log(`${label} ready`);
            resolve();
        });
    });
};

const initDB = async () => {

    console.log("Initializing database...");

    const createProductsTable = `
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            unit_price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    const createOrdersTable = `
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_number VARCHAR(50) NOT NULL,
            date DATE NOT NULL,
            status ENUM('Pending', 'InProgress', 'Completed') DEFAULT 'Pending',
            final_price DECIMAL(10,2) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    const createOrderProductsTable = `
        CREATE TABLE IF NOT EXISTS order_products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT,
            product_id INT,
            qty INT NOT NULL,
            unit_price DECIMAL(10,2) NOT NULL,
            total_price DECIMAL(10,2) NOT NULL,

            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    `;

    const seedProducts = `
        INSERT INTO products (name, unit_price)
        SELECT * FROM (
            SELECT 'Laptop' AS name, 3500 AS unit_price
            UNION ALL
            SELECT 'Mouse', 80
            UNION ALL
            SELECT 'Keyboard', 150
        ) AS tmp
        WHERE NOT EXISTS (
            SELECT name FROM products WHERE products.name = tmp.name
        )
        LIMIT 3
    `;

    try {

        await runQuery(createProductsTable, "Products table");
        await runQuery(createOrdersTable, "Orders table");
        await runQuery(createOrderProductsTable, "OrderProducts table");

        await runQuery(seedProducts, "Seed data");

        console.log("Database initialization completed");

    } catch (error) {

        console.error("Database initialization failed");
    }
};

module.exports = initDB;
