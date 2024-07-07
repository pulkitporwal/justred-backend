import mongoose from "mongoose";

const storageAccountSchema = new mongoose.Schema(
	{
		storageAccountName: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const StorageAccount = mongoose.model("StorageAccount", storageAccountSchema);

export { StorageAccount };
