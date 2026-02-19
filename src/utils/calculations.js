exports.calculateItemTotal = (unitPrice, qty) => {
    return unitPrice * qty;
};

exports.calculateOrderTotal = (products) => {
    return products.reduce((sum, p) => sum + p.total_price, 0);
};
