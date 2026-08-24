CREATE TABLE `compliance_evidence` (
	`id` text PRIMARY KEY NOT NULL,
	`building` text NOT NULL,
	`check_id` text NOT NULL,
	`check_name` text NOT NULL,
	`evidence_type` text NOT NULL,
	`file_name` text NOT NULL,
	`storage_key` text NOT NULL,
	`check_data` text,
	`completed_by` text NOT NULL,
	`uploaded_at` integer NOT NULL
);
