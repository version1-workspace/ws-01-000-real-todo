import type { Request, Response } from "express";

export const notFoundMiddleware = (_req: Request, res: Response) => {
	res.status(404).json({
		statusCode: 404,
		message: "Not Found",
		error: "Error",
	});
};
