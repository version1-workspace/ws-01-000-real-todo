-- Modify "projects" table
ALTER TABLE `projects` ADD INDEX `project_deadline` (`deadline`), ADD INDEX `project_user_id` (`user_id`);
-- Modify "users" table
ALTER TABLE `users` ADD UNIQUE INDEX `user_email` (`email`), ADD INDEX `user_username` (`username`);
