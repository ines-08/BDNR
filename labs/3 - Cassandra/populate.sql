-- Insert new bookmark 'http://www.up.pt'

BEGIN BATCH
-- Insert into bookmarks
INSERT INTO bookmarks (url_md5, url_original, time_t, tags) VALUES ('93462762d236aed61c248298584ea5bf', 'http://www.up.pt', toTimestamp(now()), {'education', 'porto'});

-- Always associate with ':all' tag
INSERT INTO bookmarks_by_tags (tag, url_md5, url_original, time_t) VALUES (':all', '93462762d236aed61c248298584ea5bf', 'http://www.up.pt', toTimestamp(now()));

-- Insert into bookmarks_by_tags, one per tags
INSERT INTO bookmarks_by_tags (tag, url_md5, url_original, time_t) VALUES ('education', '93462762d236aed61c248298584ea5bf', 'http://www.up.pt', toTimestamp(now()));
INSERT INTO bookmarks_by_tags (tag, url_md5, url_original, time_t) VALUES ('porto', '93462762d236aed61c248298584ea5bf', 'http://www.up.pt', toTimestamp(now()));

-- Insert new bookmark 'http://www.fe.up.pt'
INSERT INTO bookmarks (url_md5, url_original, time_t, tags) VALUES ('84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()), {'education', 'porto', 'engineering', 'feup', 'portugal'})

INSERT INTO bookmarks_by_tags (tag, url_md5, url_original, time_t) VALUES (':all:', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
INSERT INTO bookmarks_by_tags (tag, url_md5, url_original, time_t) VALUES ('education', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
INSERT INTO bookmarks_by_tags (tag, url_md5, url_original, time_t) VALUES ('porto', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
INSERT INTO bookmarks_by_tags (tag, url_md5, url_original, time_t) VALUES ('engineering', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
INSERT INTO bookmarks_by_tags (tag, url_md5, url_original, time_t) VALUES ('feup', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));
INSERT INTO bookmarks_by_tags (tag, url_md5, url_original, time_t) VALUES ('portugal', '84e5d235df52b73f92a04a21be3a3e52', 'http://www.fe.up.pt', toTimestamp(now()));

APPLY BATCH;