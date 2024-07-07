import { Interaction } from "../models/interaction.model.js";

const createInteraction = async (req, res) => {
	try {
		const { contentId, action, comment, rating } =
			req.body;

		if (!(userId && contentId && contentType && action)) {
			return res.status(400).json({
				success: false,
				message:
					"userId, contentId, contentType, and action are required fields",
			});
		}

		const interaction = new Interaction({
			userId : req.user._id,
			contentId,
			action,
			comment,
			rating,
		});

		await interaction.save();

		return res.status(201).json({
			success: true,
			message: "Interaction created successfully",
			interaction,
		});
	} catch (error) {
		console.error("Error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error while creating new user.",
			error
		});
	}
};

const getInteractionsByUserId = async (req, res) => {
    try {
        const userId = req.user._id;

        const interactions = await Interaction.find({ userId });

        return res.status(200).json({
            success: true,
            message: "Interactions retrieved successfully",
            interactions,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while retrieving interactions",
			error
        });
    }
};


export { createInteraction, getInteractionsByUserId };