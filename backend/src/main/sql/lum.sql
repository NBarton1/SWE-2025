-- Using this for now
create table if not exists Account
(
    id int not null,
    name varchar(32) not null,
    username varchar(32) not null,
    picture bytea not null
)