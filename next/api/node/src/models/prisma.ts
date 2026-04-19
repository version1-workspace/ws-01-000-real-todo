import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env.js";
import { PrismaClient } from "../../generated/prisma/client.js";

export {
	Prisma,
	type Project,
	type Tag,
	type Task,
	type User,
} from "../../generated/prisma/client.js";

console.log("Database URL:", env.DATABASE_URL);
const adapter = new PrismaPg({
	connectionString: env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });
