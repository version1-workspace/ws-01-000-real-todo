-- Modify "projects" table
ALTER TABLE `projects` DROP COLUMN `user_id`;
-- Modify "tasks" table
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_projects_milestones`, DROP FOREIGN KEY `tasks_projects_tasks`, DROP FOREIGN KEY `tasks_users_tasks`;
-- Modify "tasks" table
ALTER TABLE `tasks` MODIFY COLUMN `project_tasks` bigint NULL, MODIFY COLUMN `project_milestones` bigint NULL, MODIFY COLUMN `user_tasks` bigint NULL, ADD CONSTRAINT `tasks_projects_milestones` FOREIGN KEY (`project_milestones`) REFERENCES `projects` (`id`) ON UPDATE NO ACTION ON DELETE SET NULL, ADD CONSTRAINT `tasks_projects_tasks` FOREIGN KEY (`project_tasks`) REFERENCES `projects` (`id`) ON UPDATE NO ACTION ON DELETE SET NULL, ADD CONSTRAINT `tasks_users_tasks` FOREIGN KEY (`user_tasks`) REFERENCES `users` (`id`) ON UPDATE NO ACTION ON DELETE SET NULL;
