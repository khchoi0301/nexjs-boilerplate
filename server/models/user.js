const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, unique: true, sparse: true },
	password: { type: String, select: false },
	provider: String,
	kakaoId: { type: String, unique: true, sparse: true },
	kakaoName: String,
	facebookId: { type: String, unique: true, sparse: true },
	facebookName: String,
	mobile: String,
	confirmed: { type: Boolean, default: false },
	verify_key: String,
	address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
	createdAt: { type: Date, default: new Date() }
});

module.exports = mongoose.model("User", userSchema);
