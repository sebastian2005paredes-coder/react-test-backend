const db = require("../config/db");
const { calculateItemTotal, calculateOrderTotal } = require("../utils/calculations");

exports.addItem = (orderId, { product_id, qty }) => {
    return new Promise((resolve, reject) => {

        const productQuery = "SELECT unit_price FROM products WHERE id = ?";

        db.query(productQuery, [product_id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error("Product not found"));

            const unit_price = results[0].unit_price;
            const total_price = calculateItemTotal(unit_price, qty);

            const insertQuery = `
                INSERT INTO order_products
                (order_id, product_id, qty, unit_price, total_price)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(insertQuery, [orderId, product_id, qty, unit_price, total_price], (err) => {
                if (err) return reject(err);

                recalcOrderTotal(orderId)
                    .then(() => resolve({ message: "Item added" }))
                    .catch(reject);
            });
        });
    });
};

exports.updateItem = (orderId, itemId, qty) => {
    return new Promise((resolve, reject) => {

        const itemQuery = `
            SELECT unit_price
            FROM order_products
            WHERE id = ? AND order_id = ?
        `;

        db.query(itemQuery, [itemId, orderId], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error("Item not found"));

            const unit_price = results[0].unit_price;
            const total_price = calculateItemTotal(unit_price, qty);

            const updateQuery = `
                UPDATE order_products
                SET qty = ?, total_price = ?
                WHERE id = ?
            `;

            db.query(updateQuery, [qty, total_price, itemId], (err) => {
                if (err) return reject(err);

                recalcOrderTotal(orderId)
                    .then(() => resolve({ message: "Item updated" }))
                    .catch(reject);
            });
        });
    });
};

exports.deleteItem = (orderId, itemId) => {
    return new Promise((resolve, reject) => {

        const deleteQuery = `
            DELETE FROM order_products
            WHERE id = ? AND order_id = ?
        `;

        db.query(deleteQuery, [itemId, orderId], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject(new Error("Item not found"));

            recalcOrderTotal(orderId)
                .then(() => resolve({ message: "Item deleted" }))
                .catch(reject);
        });
    });
};

const recalcOrderTotal = (orderId) => {
    return new Promise((resolve, reject) => {

        const totalsQuery = `
            SELECT total_price FROM order_products WHERE order_id = ?
        `;

        db.query(totalsQuery, [orderId], (err, rows) => {
            if (err) return reject(err);

            const final_price = calculateOrderTotal(rows);

            const updateQuery = `
                UPDATE orders SET final_price = ? WHERE id = ?
            `;

            db.query(updateQuery, [final_price, orderId], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    });
};
