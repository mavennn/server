create table recs
(
    type     text,
    shop_num integer,
    pid1     integer,
    pid2     integer,
    score    double precision
);

create table rests_and_prices
(
    shop_num      integer,
    ware          text,
    rest          integer,
    price         double precision,
    price_wo_disc integer
);

create table sorted_items
(
    pid integer,
    rn  integer
);

create table categories
(
    name      text,
    id        integer,
    parent_id integer
);

create table things
(
    id         integer not null
        constraint things_pk
            primary key,
    ware       text,
    name       text,
    pid        integer,
    color      text,
    size       text,
    categories bigint[],
    pictures   text[]  not null,
    brand      text
);

create unique index things_id_uindex
    on things (id);

create table shk
(
    barcode bigint,
    pid     bigint,
    model   text,
    ware    text
);
