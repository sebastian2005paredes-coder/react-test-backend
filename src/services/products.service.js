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

        const query = `UPDATE products SET name = ?, unit_price = ? WHERE id = ?`;

        db.query(query, [name, unit_price, id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject(new Error("Product not found"));

            // Recalcular total de order_products que usan este producto
            const updateItemsQuery = `
                UPDATE order_products 
                SET unit_price = ?, total_price = ? * qty
                WHERE product_id = ?
            `;

            db.query(updateItemsQuery, [unit_price, unit_price, id], (err) => {
                if (err) return reject(err);

                // Recalcular final_price de todas las órdenes afectadas
                const recalcQuery = `
                    UPDATE orders o
                    SET final_price = (
                        SELECT SUM(total_price) 
                        FROM order_products 
                        WHERE order_id = o.id
                    )
                    WHERE o.id IN (
                        SELECT order_id FROM order_products WHERE product_id = ?
                    )
                `;

                db.query(recalcQuery, [id], (err) => {
                    if (err) return reject(err);
                    resolve({ message: "Product updated" });
                });
            });
        });
    });
};

exports.deleteProduct = (id) => {
    return new Promise((resolve, reject) => {

        const checkQuery = `
            SELECT o.order_number 
            FROM order_products op
            JOIN orders o ON op.order_id = o.id
            WHERE op.product_id = ?
        `;

        db.query(checkQuery, [id], (err, results) => {
            if (err) return reject(err);

            if (results.length > 0) {
                const orderNumbers = results.map(r => r.order_number);
                const display = orderNumbers.length > 2
                    ? `${orderNumbers[0]}, ${orderNumbers[1]}...`
                    : orderNumbers.join(", ");
                return reject(new Error(`Cannot delete product, it is used in order(s): ${display}`));
            }

            const deleteQuery = "DELETE FROM products WHERE id = ?";

            db.query(deleteQuery, [id], (err, result) => {
                if (err) return reject(err);

                if (!result || result.affectedRows === 0) {
                    return reject(new Error("Product not found"));
                }

                resolve({ message: "Product deleted" });
            });
        });
    });
};