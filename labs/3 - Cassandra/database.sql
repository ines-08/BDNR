CREATE TABLE bookmarks (
    url_md5 TEXT,
    url_original TEXT,
    time_t TIMESTAMP,
    tags SET<TEXT>,

    PRIMARY KEY (url_md5)
);

CREATE TABLE bookmarks_by_tags (
    tag TEXT,
    url_md5 TEXT,
    url_original TEXT,
    time_t TIMESTAMP,

    PRIMARY KEY ((tag), time_t)
) WITH CLUSTERING ORDER BY (time_t DESC);