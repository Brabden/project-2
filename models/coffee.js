const mongoose = require('mongoose');
const coffeeSchema = new mongoose.Schema ({
    name: String,
    price: Number,
    inStock : Boolean,
});

const Coffee = mongoose.model("Coffee", coffeeSchema);
module.exports = Coffee;