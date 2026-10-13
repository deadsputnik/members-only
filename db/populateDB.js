const { Client } = require("pg");
const { loadEnvFile } = require("node:process");
loadEnvFile("./.env");

const SQL = `
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
first_name VARCHAR (50) NOT NULL,
last_name VARCHAR (50) NOT NULL,
username VARCHAR (30) NOT NULL UNIQUE,
password_hash TEXT NOT NULL,
member BOOLEAN NOT NULL DEFAULT FALSE,
admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  posted_on TIMESTAMPTZ NOT NULL DEFAULT now(),
  posted_by INTEGER REFERENCES users
  );
  `;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    connectionString: process.env.DB_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("End");
}

main();
