import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Session } from "../models/session.model.js";

const saltRounds = 10;

const signUp = async (req, res) => {
	try {
		const { username, email, password, confirmPassword } = req.body;

		if (!(username && email && password && confirmPassword)) {
			return res.status(400).json({
				success: false,
				message: "All fields are required.",
			});
		}

		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Password and Confirm password should match.",
			});
		}

		const isExisted = await User.findOne({
			$or: [{ username: username }, { email: email }],
		});

		if (isExisted) {
			return res.status(400).json({
				success: false,
				message: "User already exists with the given email.",
			});
		}

		const salt = await bcrypt.genSalt(saltRounds);
		const encryptedPassword = await bcrypt.hash(password, salt);

		const newUser = await User.create({
			username,
			email,
			password: encryptedPassword,
		});

		newUser.password = undefined;

		return res.status(200).json({
			success: true,
			message: "User created successfully.",
			user: newUser,
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
const signIn = async (req, res) => {
	try {
		const { usernameOrEmail, password } = req.body;

		if (!usernameOrEmail || !password) {
			return res.status(400).json({
				success: false,
				message: "Both username/email and password are required",
			});
		}

		const user = await User.findOne({
			$or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
		});

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "Invalid username/email or password",
			});
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(401).json({
				success: false,
				message: "Invalid username/email or password",
			});
		}

		const token = jwt.sign(
			{ userName: user.username, _id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: "5h" }
		);

		user.password = undefined;

		res.cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: 'None' });

		const session = new Session({
			userId: user._id,
			ipAddress: req.ip,
			device: req.headers["user-agent"],
			loginTime: new Date(),
		});
		await session.save();

		return res.status(200).json({
			success: true,
			message: "User signed in successfully",
			userInfo: user,
		});
	} catch (error) {
		console.error("Error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error while signing in",
			error
		});
	}
};

const signOut = async (req, res) => {
	try {
		const accessToken = req.user.accessToken;

		if (!accessToken) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized: No access token provided",
			});
		}

		const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

		const userId = decoded._id;

		const session = await Session.findOne({
			userId: userId,
			logoutTime: { $exists: false }, 
		});

		if (!session) {
			return res.status(404).json({
				success: false,
				message: "Session not found or already expired",
			});
		}

		session.logoutTime = new Date();
		session.duration = Math.round(
			(session.logoutTime - session.loginTime) / 1000
		);

		await session.save();

		res.clearCookie("accessToken");

		return res.status(200).json({
			success: true,
			message: "User signed out successfully",
		});
	} catch (error) {
		console.error("Error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error while signing out",
			error
		});
	}
};

export { signUp, signIn, signOut };
