-- migrate:up
create table
    `curiosities` (
        id varchar(255) not null primary key,
        agenda_id varchar(255) not null,
        question TEXT not null,
        created_at timestamp not null,
        updated_at timestamp not null,
        FOREIGN KEY (agenda_id) REFERENCES agenda (id)
    );

-- migrate:down
drop table curiosities;