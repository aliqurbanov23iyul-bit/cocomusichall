CREATE TABLE IF NOT EXISTS admins (id bigserial PRIMARY KEY, username text UNIQUE NOT NULL, password_hash text NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (token_hash text PRIMARY KEY, admin_id bigint NOT NULL REFERENCES admins(id) ON DELETE CASCADE, csrf text NOT NULL, expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS login_attempts (key text PRIMARY KEY, attempts integer NOT NULL DEFAULT 0, window_start timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS categories (id bigserial PRIMARY KEY, name text NOT NULL, sort_order integer NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS dishes (id bigserial PRIMARY KEY, category_id bigint NOT NULL REFERENCES categories(id) ON DELETE RESTRICT, name text NOT NULL, description text NOT NULL DEFAULT '', image_url text NOT NULL DEFAULT '', price numeric(10,2) NOT NULL CHECK(price >= 0), published boolean NOT NULL DEFAULT false);
CREATE TABLE IF NOT EXISTS events (id bigserial PRIMARY KEY, name text NOT NULL, description text NOT NULL DEFAULT '', image_url text NOT NULL DEFAULT '', event_date date NOT NULL, event_time text NOT NULL, price numeric(10,2) NOT NULL CHECK(price >= 0), published boolean NOT NULL DEFAULT false);
CREATE TABLE IF NOT EXISTS socials (id bigserial PRIMARY KEY, name text NOT NULL, url text NOT NULL);
CREATE TABLE IF NOT EXISTS settings (id integer PRIMARY KEY CHECK(id=1), intro text NOT NULL DEFAULT '', address text NOT NULL DEFAULT '', hours text NOT NULL DEFAULT '');
INSERT INTO settings(id) VALUES(1) ON CONFLICT DO NOTHING;
