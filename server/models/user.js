const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, unique: true, sparse: true },
	password: { type: String, select: false },
	provider: String,
	id: String,
	mobile: String,
	confirmed: { type: Boolean, default: false },
	verify_key: String,
	address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
	createdAt: { type: Date, default: new Date() }
});
userSchema.index({ provider: 1, id: 1 }, { unique: true, sparse: true }); // TODO:카카오 중복체크 해결필요
module.exports = mongoose.model("User", userSchema);
