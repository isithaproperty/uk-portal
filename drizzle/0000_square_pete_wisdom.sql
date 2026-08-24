CREATE TABLE `work_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`title` text NOT NULL,
	`building` text NOT NULL,
	`contractor` text NOT NULL,
	`contractor_email` text NOT NULL,
	`priority` text NOT NULL,
	`status` text NOT NULL,
	`description` text,
	`due_date` text,
	`invoice_name` text,
	`invoice_key` text,
	`invoice_status` text DEFAULT 'Awaiting invoice' NOT NULL,
	`created_at` integer NOT NULL
);
