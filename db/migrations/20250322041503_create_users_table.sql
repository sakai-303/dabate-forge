-- migrate:up
create table
    `users` (
        id varchar(255) NOT NULL PRIMARY KEY,
        created_at timestamp NOT NULL,
        updated_at timestamp NOT NULL
    );

-- migrate:down
drop table users;