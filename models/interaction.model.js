import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		contentId: {
			type: mongoose.Schema.Types.ObjectId,
			refPath: "contentType",
			required: true,
		},
		action: {
			type: String,
			enum: ["view", "like", "dislike", "comment", "share", "search"],
			required: true,
		},
		comment: {
			type: String,
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
		},
	},
	{
		timestamps: true,
	}
);

interactionSchema.path("contentId").validate(function (value) {
	return ["Videos", "Series"].includes(this.contentType);
}, "Invalid content type");

export const Interaction = mongoose.model("Interaction", interactionSchema);
