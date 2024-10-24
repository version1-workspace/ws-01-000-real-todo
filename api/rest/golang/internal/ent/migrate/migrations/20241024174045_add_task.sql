-- Create "tasks" table
CREATE TABLE `tasks` (`id` bigint NOT NULL AUTO_INCREMENT, `uuid` char(36) NOT NULL, `created_at` timestamp NOT NULL, `updated_at` timestamp NOT NULL, PRIMARY KEY (`id`), UNIQUE INDEX `uuid` (`uuid`)) CHARSET utf8mb4 COLLATE utf8mb4_bin;
