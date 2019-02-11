--Needed tables for the project.
CREATE TABLE "person" ("id" SERIAL PRIMARY KEY, 
"username" VARCHAR(80) UNIQUE NOT NULL, "password" VARCHAR(1000));

CREATE TABLE "type" ("id" SERIAL PRIMARY KEY, "type_name" VARCHAR(40));

CREATE TABLE "order" ("id" SERIAL PRIMARY KEY, 
"order_name" VARCHAR(25), 
"person_id" INTEGER, FOREIGN KEY("person_id") REFERENCES "person"("id"), 
"type_id" INTEGER, FOREIGN KEY("type_id") REFERENCES "type"("id"));

CREATE TABLE "product" ("id" SERIAL PRIMARY KEY, "product_name" VARCHAR(40));

CREATE TABLE "status" ("id" SERIAL PRIMARY KEY, "status_name" VARCHAR(40));

CREATE TABLE "note" ("id" SERIAL PRIMARY KEY, "note_entry" VARCHAR(500));

CREATE TABLE "fulfillment" ("id" SERIAL PRIMARY KEY, 
"order_id" INTEGER, FOREIGN KEY("order_id") REFERENCES "order"("id"), 
"person_id" INTEGER, FOREIGN KEY("person_id") REFERENCES "person"("id"), 
"date" DATE, "status_id" INTEGER, FOREIGN KEY("status_id") REFERENCES "status"("id"));

CREATE TABLE "order_product" ("id" SERIAL PRIMARY KEY, 
"order_id" INTEGER, FOREIGN KEY("order_id") REFERENCES "order"("id"), 
"product_id" INTEGER, FOREIGN KEY("product_id") REFERENCES "product"("id"));

CREATE TABLE "product_fulfillment" ("id" SERIAL PRIMARY KEY, 
"fulfillment_id" INTEGER, FOREIGN KEY("fulfillment_id") REFERENCES "fulfillment"("id"), 
"product_id" INTEGER, FOREIGN KEY("product_id") REFERENCES "product"("id"), 
"quantity" INTEGER);

CREATE TABLE "note_fulfillment" ("id" SERIAL PRIMARY KEY, 
"fulfillment_id" INTEGER, FOREIGN KEY("fulfillment_id") REFERENCES "fulfillment"("id"), 
"note_id" INTEGER, FOREIGN KEY("note_id") REFERENCES "note"("id"));

--Optional dummy data.
INSERT INTO "product" ("product_name") 
VALUES('Chicken Breasts'),('Chicken Thighs'),
('Chicken Tenders'),('Chicken Drumsticks'),('Organic Breasts'),
('Organic Thighs'),('Organic Tenders'),('Organic Drumsticks');

INSERT INTO "type" ("type_name") 
VALUES('Meat');

INSERT INTO "order" ("order_name","person_id","type_id") 
VALUES('Meat 1',1,1);

INSERT INTO "order_product" ("order_id","product_id") 
VALUES(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8);

INSERT INTO "note" ("note_entry") 
VALUES('A note about the meat 1 order.'),('A second note about meat 1.');

INSERT INTO "status" ("status_name") 
VALUES('Incomplete'),('Complete'),('Pending Approval'),('Approved');

INSERT INTO "fulfillment" ("order_id", "person_id", "date", "status_id") 
VALUES(1,1,'2019-02-11',2);

INSERT INTO "product_fulfillment" ("fulfillment_id","product_id","quantity") 
VALUES(1,1,1),(1,2,1),(1,3,0),(1,4,2),(1,5,1),(1,6,1),(1,7,0),(1,8,0);

INSERT INTO "note_fulfillment" ("fulfillment_id","note_id") 
VALUES(1,1),(1,2);