CREATE EXTENSION pg_trgm;

create table
  players (
    uid text not null,
    nick text not null,
    nicklower text not null,
    level integer not null,
    xp bigint not null,
    squad text null,
    "killsELO" double precision not null,
    "gamesELO" double precision not null,
    coins bigint null,
    number_of_jumps integer null,
    steam boolean null,
    constraint players_pkey primary key (uid)
  );

create index if not exists squad_index on players using hash (squad);

create index if not exists player_search_index on players using gin (nicklower gin_trgm_ops);

create index if not exists killselo_index on players using btree ("killsELO");

create index if not exists gameselo_index on players using btree ("gamesELO");

create index if not exists xp_index on players using btree (xp);

create index if not exists level_index on players using btree (level);

insert into
  players (
    uid,
    nick,
    nicklower,
    level,
    xp,
    squad,
    "killsELO",
    "gamesELO",
    coins,
    number_of_jumps,
    steam
  )
values
  (
    '59fa1b83d142af26216274ce',
    'Dipper',
    'dipper',
    127,
    2844330,
    'DEV',
    1520.31,
    1179.02,
    179961,
    125418,
    false
  ),
  (
    '5d2ead35d142affb05757778',
    'POMP',
    'pomp',
    377,
    9083300,
    'LP',
    1890.43,
    2020.1,
    20,
    280603,
    true
  ),
  (
    '5ab2a1a9fd3c7a5019977b68',
    'JoJa15',
    'joja15',
    1005,
    24779665,
    NULL,
    1805.57,
    2557.66,
    86640,
    1028367,
    true
  ),
  (
    '5c9d4680fe3c7aa46c57642a',
    'REKT',
    'rekt',
    444,
    10754415,
    'LP',
    1863.72,
    2151.44,
    5564,
    499046,
    true
  ),
  (
    '60d08b15d142afee4b1dfabe',
    'Did You Get Sniped?',
    'did you get sniped?',
    787,
    19342980,
    'APG',
    2104.38,
    1384.49,
    51,
    787051,
    true
  );