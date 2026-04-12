import bcrypt from "bcrypt";
import crypto from "crypto";
import { env } from "../config/env.js";

export const stretchCount = (createdAt: Date) =>
  Math.max(1, Math.floor(createdAt.getSeconds()) % 5);

export const hashPassword = async (password: string, createdAt: Date) => {
  console.log("debug ==============+", env.AUTH_SUGAR, password);
  return bcrypt.hash(
    [password, env.AUTH_SUGAR].join("_"),
    stretchCount(createdAt),
  );
};

export const comparePassword = async (password: string, hashed: string) => {
  console.log("debug ==============+", env.AUTH_SUGAR, password);
  return bcrypt.compare([password, env.AUTH_SUGAR].join("_"), hashed);
};

export const generateRefreshToken = async () => {
  const base = crypto.randomBytes(64).toString("base64");
  return bcrypt.hash([base, env.AUTH_SUGAR].join("_"), 3);
};
