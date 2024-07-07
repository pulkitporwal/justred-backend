import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			index: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		gender: {
			type: String,
			enum: ["Male", "Female", "Other"],
		},
		age: {
			type: Number,
			min: 5,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export { User };
