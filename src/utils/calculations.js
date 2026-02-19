exports.calculateItemTotal = (unitPrice, qty) => {
    return parseFloat(unitPrice) * parseFloat(qty);
};

exports.calculateOrderTotal = (products) => {
    return products.reduce((sum, p) => sum + parseFloat(p.total_price), 0);
};