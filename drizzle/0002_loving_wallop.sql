CREATE TABLE `contractor_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`contractor_id` text NOT NULL,
	`document_type` text NOT NULL,
	`file_name` text NOT NULL,
	`storage_key` text NOT NULL,
	`expiry_date` text,
	`uploaded_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contractors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`trade` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`coverage` text,
	`status` text DEFAULT 'Approved' NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL
);
