import { Router } from "express";
import { appController } from "../controllers/app.js";
import { authController } from "../controllers/auth.js";
import { bulkTasksController } from "../controllers/bulk-tasks.js";
import { milestonesController } from "../controllers/milestones.js";
import { projectsController } from "../controllers/projects.js";
import { tagsController } from "../controllers/tags.js";
import { tasksController } from "../controllers/tasks.js";
import { usersController } from "../controllers/users.js";
import { asyncHandler } from "../lib/async-handler.js";
import { requireAuth } from "../middlewares/auth.js";

export const router = Router();

router.get("/", appController.version);
router.post("/auth/login", asyncHandler(authController.login));
router.post("/auth/refresh", asyncHandler(authController.refresh));
router.delete("/auth/refresh", authController.clearRefresh);

router.use(requireAuth);

router.get("/users/me", usersController.me);
router.get("/users/tasks", asyncHandler(tasksController.list));
router.post("/users/tasks", asyncHandler(tasksController.create));
router.get("/users/tasks/:id", asyncHandler(tasksController.show));
router.patch("/users/tasks/:id", asyncHandler(tasksController.update));
router.put("/users/tasks/:id/archive", asyncHandler(tasksController.archive));
router.put("/users/tasks/:id/complete", asyncHandler(tasksController.complete));
router.put("/users/tasks/:id/reopen", asyncHandler(tasksController.reopen));

router.put("/bulk/tasks/archive", asyncHandler(bulkTasksController.archive));
router.put("/bulk/tasks/complete", asyncHandler(bulkTasksController.complete));
router.put("/bulk/tasks/reopen", asyncHandler(bulkTasksController.reopen));

router.get("/users/projects", asyncHandler(projectsController.list));
router.post("/users/projects", asyncHandler(projectsController.create));
router.get("/users/projects/:slug", asyncHandler(projectsController.show));
router.patch("/users/projects/:slug", asyncHandler(projectsController.update));
router.patch(
	"/users/projects/:slug/archive",
	asyncHandler(projectsController.archive),
);
router.patch(
	"/users/projects/:slug/reopen",
	asyncHandler(projectsController.reopen),
);

router.get("/users/tags", asyncHandler(tagsController.list));

router.get(
	"/projects/:slug/milestones",
	asyncHandler(milestonesController.list),
);
router.put(
	"/projects/:slug/milestones/:id/archive",
	asyncHandler(milestonesController.archive),
);
