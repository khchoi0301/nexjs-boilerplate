const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
	// _id: mongoose.Types.ObjectId,
	adrs1: String,
	adrs2: String,
	country: String,
	postcode: String,
	mobile: String
});

module.exports = mongoose.model("Address", addressSchema);
