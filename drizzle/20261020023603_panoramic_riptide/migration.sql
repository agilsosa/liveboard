CREATE TABLE `account` (
	`id` text PRIMARY KEY,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL UNIQUE,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	CONSTRAINT `fk_session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`is_anonymous` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `classroom` (
	`id` text PRIMARY KEY,
	`owner_id` text NOT NULL,
	`title` text NOT NULL,
	`code` text NOT NULL UNIQUE,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	CONSTRAINT `fk_classroom_owner_id_user_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `roster` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`label` text NOT NULL,
	CONSTRAINT `fk_roster_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `roster_entry` (
	`id` text PRIMARY KEY,
	`roster_id` text NOT NULL,
	`identifier` text NOT NULL,
	`label` text NOT NULL,
	`claimed_by_user_id` text,
	CONSTRAINT `fk_roster_entry_roster_id_roster_id_fk` FOREIGN KEY (`roster_id`) REFERENCES `roster`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_roster_entry_claimed_by_user_id_user_id_fk` FOREIGN KEY (`claimed_by_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE TABLE `upload` (
	`id` text PRIMARY KEY,
	`classroom_id` text NOT NULL,
	`roster_entry_id` text,
	`uploader_user_id` text,
	`kind` text NOT NULL,
	`text_body` text,
	`r2_key` text,
	`file_name` text,
	`mime_type` text,
	`size_bytes` integer NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT `fk_upload_classroom_id_classroom_id_fk` FOREIGN KEY (`classroom_id`) REFERENCES `classroom`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_upload_roster_entry_id_roster_entry_id_fk` FOREIGN KEY (`roster_entry_id`) REFERENCES `roster_entry`(`id`) ON DELETE SET NULL,
	CONSTRAINT `fk_upload_uploader_user_id_user_id_fk` FOREIGN KEY (`uploader_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
CREATE INDEX `classroom_expires_idx` ON `classroom` (`expires_at`);--> statement-breakpoint
CREATE INDEX `classroom_owner_idx` ON `classroom` (`owner_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `roster_label_unique` ON `roster_entry` (`roster_id`,`label`);--> statement-breakpoint
CREATE INDEX `upload_classroom_idx` ON `upload` (`classroom_id`);