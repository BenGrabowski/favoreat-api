BEGIN;

INSERT INTO favoreat_places (user_id, place_name, type, hh, hh_start, hh_end, notes, items)
VALUES
    (1, 'Linger', 'Restaurant', 'true', '4:00 PM', '6:30 PM', 'Open seating at upstairs bar', ARRAY ['Fried Cheese & Shisitos', 'Boa Buns', 'Spring Rolls']),
    (1, 'Barcelona Wine Bar', 'Restaurant', 'true', '5:00 PM', '7:00 PM', 'Half Off wine bottles on Sunday', ARRAY ['Croquetas', 'Empenadas']),
    (1, 'El Five', 'Restaurant', 'false', null, null, 'Best view of Denver', ARRAY ['Pheasant Flatbread']),
    (1, 'Bigsbys Folley', 'Winery', 'true', '3:00 PM', '6:00 PM', null, null),
    (4, 'Linger', 'Restaurant', 'true', '4:00 PM', '6:30 PM', 'Open seating at upstairs bar', ARRAY ['Fried Cheese & Shisitos', 'Boa Buns', 'Spring Rolls']),
    (4, 'Barcelona Wine Bar', 'Restaurant', 'true', '5:00 PM', '7:00 PM', 'Half Off wine bottles on Sunday', ARRAY ['Croquetas', 'Empenadas']),
    (4, 'El Five', 'Restaurant', 'false', null, null, 'Best view of Denver', ARRAY ['Pheasant Flatbread']),
    (4, 'Bigsbys Folley', 'Winery', 'true', '3:00 PM', '6:00 PM', null, null);

COMMIT;
    