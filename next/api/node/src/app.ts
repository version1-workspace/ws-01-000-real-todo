import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middlewares/error.js";
import { notFoundMiddleware } from "./middlewares/not-found.js";
import { router } from "./routes/index.js";

export const createApp = () => {
	const app = express();

	console.log("Allow Request URL:", env.ALLOW_REQUEST_URL);
	app.use(
		cors({
			origin: env.ALLOW_REQUEST_URL,
			methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"],
			allowedHeaders: [
				"Origin",
				"X-Requested-With",
				"Authorization",
				"Content-Type",
				"Accept",
			],
			credentials: true,
			optionsSuccessStatus: 204,
		}),
	);
	app.use(express.json());
	app.use(cookieParser());
	app.use("/api/v1", router);
	app.use(notFoundMiddleware);
	app.use(errorMiddleware);

	return app;
};
