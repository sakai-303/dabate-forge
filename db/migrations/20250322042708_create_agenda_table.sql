-- migrate:up
create table
    `agenda` (
        id varchar(255) not null primary key,
        name varchar(255) not null,
        description text not null,
        created_at timestamp not null,
        updated_at timestamp not null
    );

-- migrate:down
drop table agenda;