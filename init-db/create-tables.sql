CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  body VARCHAR(200),
  CONSTRAINT comments FOREIGN KEY (user_id) REFERENCES users (id) MATCH SIMPLE
);
