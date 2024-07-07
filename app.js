import express from "express";
import cors from "cors";
import coookieParser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(
	cors({
		origin: ["http://localhost:5173","http://localhost:5174", "https://justred-admin.vercel.app"],
        credentials: true
	})
);
// app.use((_, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });
app.use(coookieParser());

import authRouter from "./routes/auth.route.js";
app.use("/api/v1/auth", authRouter);

import seriesRouter from "./routes/series.route.js";
app.use("/api/v1/series", seriesRouter);

import videoRouter from "./routes/video.route.js";
app.use("/api/v1/videos", videoRouter);

import interactionRouter from "./routes/interaction.route.js";
app.use("/api/v1/interaction", interactionRouter);

export default app;
