CREATE TABLE "token_requests" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "token_requests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"address" varchar NOT NULL,
	"chain" varchar NOT NULL,
	"network" varchar NOT NULL,
	"amount" integer NOT NULL,
	"status" varchar(255) DEFAULT 'successful' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
