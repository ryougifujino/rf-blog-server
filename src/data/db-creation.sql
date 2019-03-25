create table albums
(
  id         integer,
  name       text     not null,
  created_on datetime not null,
  primary key (id)
);

create table comments
(
  id         integer,
  content    text     not null,
  from_user  text     not null,
  post_id    integer  not null,
  created_on datetime not null,
  primary key (id)
);

create table post_tag
(
  id      integer,
  post_id integer not null,
  tag_id  integer not null,
  primary key (id)
);

create table posts
(
  id            integer,
  title         text     not null,
  body          text     not null,
  is_private    integer  not null,
  album_id      integer,
  created_on    datetime not null,
  primary key (id)
);

create table replies
(
  id         integer,
  content    text     not null,
  from_user  text     not null,
  comment_id integer  not null,
  created_on datetime not null,
  primary key (id)
);

create table share_categories
(
  id         integer,
  name       text     not null,
  created_on datetime not null,
  primary key (id)
);

create table shares
(
  id                integer,
  title             text     not null,
  url               text     not null,
  share_category_id integer  not null,
  created_on        datetime not null,
  primary key (id)
);

create table tags
(
  id         integer,
  name       text     not null,
  created_on datetime not null,
  primary key (id)
);
