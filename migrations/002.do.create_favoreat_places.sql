CREATE TABLE favoreat_places (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES favoreat_users(id) ON DELETE CASCADE NOT NULL,
    place_name TEXT NOT NULL,
    type TEXT NOT NULL,
    hh BOOLEAN NOT NULL,
    hh_start TIME,
    hh_end TIME,
    notes TEXT,
    items TEXT []
);