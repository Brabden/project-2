const mongoose = require('mongoose');
const coffeeSchema = new mongoose.Schema ({
    name: String,
    category: String,
    quantity: Number,
    status: String,
    inStock : Boolean,
});

const Coffee = mongoose.model("Coffee", coffeeSchema);
module.exports = Coffee;