BEGIN;

INSERT INTO favoreat_places (user_id, place_name, type, hh, hh_start, hh_end, notes, items)
VALUES
    (1, 'Test Place 1', 'Restaurant', 'yes', '4:00 PM', '5:00 PM', 'test notes 1', ARRAY ['item1']),
    (2, 'Test Place 2', 'Bar', 'no', null, null, 'test notes 2', null),
    (3, 'Test Place 3', 'Brewery', 'yes', '5:00 PM', '7:00 PM', null, null),
    (2, 'Test Place 4', 'Bar', 'no', null, null, 'test notes 4', ARRAY ['item1', 'item2', 'item3']);

COMMIT;
    