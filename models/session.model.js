import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		ipAddress: String,
		device: String,
		loginTime: Date,
		logoutTime: Date,
		duration: Number,
	},
	{
		timestamps: true,
	}
);

export const Session = mongoose.model("Session", sessionSchema);
