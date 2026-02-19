const db = require("../config/db");

exports.getProducts = () => {
    return new Promise((resolve, reject) => {

        const query = "SELECT * FROM products";

        db.query(query, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

exports.getProductById = (id) => {
    return new Promise((resolve, reject) => {

        const query = "SELECT * FROM products WHERE id = ?";

        db.query(query, [id], (err, results) => {
            if (err) return reject(err);

            if (results.length === 0) {
                return reject(new Error("Product not found"));
            }

            resolve(results[0]);
        });
    });
};

exports.createProduct = ({ name, unit_price }) => {
    return new Promise((resolve, reject) => {

        if (!name || !unit_price) {
            return reject(new Error("Missing required fields"));
        }

        const query = `
            INSERT INTO products (name, unit_price)
            VALUES (?, ?)
        `;

        db.query(query, [name, unit_price], (err) => {
            if (err) reject(err);
            resolve({ message: "Product created" });
        });
    });
};

exports.updateProduct = (id, { name, unit_price }) => {
    return new Promise((resolve, reject) => {

        if (!name || !unit_price) {
            return reject(new Error("Missing required fields"));
        }

        const query = `
            UPDATE products
            SET name = ?, unit_price = ?
            WHERE id = ?
        `;

        db.query(query, [name, unit_price, id], (err, result) => {
            if (err) reject(err);

            if (result.affectedRows === 0) {
                return reject(new Error("Product not found"));
            }

            resolve({ message: "Product updated" });
        });
    });
};

exports.deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM products WHERE id = ?";

        db.query(query, [id], (err, result) => {
            if (err) return reject(err);

            if (!result || result.affectedRows === 0) {
                return reject(new Error("Product not found"));
            }

            resolve({ message: "Product deleted" });
        });
    });
};