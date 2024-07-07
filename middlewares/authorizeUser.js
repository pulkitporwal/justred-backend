import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const authorizeUser = async (req, res, next) => {
	try {
		const token = req.cookies.accessToken;

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Unauthorised Access: No token provided",
			});
		}

		const decodedData = jwt.verify(token, process.env.JWT_SECRET);

		const userData = await User.findById(decodedData._id);
		userData.password = undefined;
		userData.accessToken = undefined;
		req.user = userData;

		next();
	} catch (error) {
		console.error("Error in authentication middleware:", error);
		return res.status(401).json({
			success: false,
			message: "Unauthorised Access: Invalid token",
		});
	}
};


export { authorizeUser }