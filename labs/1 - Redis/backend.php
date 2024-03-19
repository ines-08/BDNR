<?php

// Function to generate unique bookmark ID
function generateBookmarkId($url) {
    return hash('sha256', $url);
}

// Add bookmarks to the sorted set with timestamp
function addBookmark($url, $tags) {

    global $redis;

    // Get urls from db
    $hashID = generateBookmarkId($url);
    $existingBookmarkId = $redis->hget("bookmark:$hashID", "url");

    
    if ($existingBookmarkId) {
        // If the URL already exists, remove all associated tags
        $existingTags = $redis->smembers("bookmark:$hashID:tags");
        foreach ($existingTags as $tag) {
            $redis->srem("bookmark:$hashID:tags", $tag);
        }
        
        // Update the bookmark's tags
        foreach ($tags as $tag) {
            // Add each tag individually to the set
            $redis->sadd("bookmark:$hashID:tags", $tag);
            // Create the tag if it doesn't exist
            $redis->sadd("tag:$tag", $hashID);
        }
    } else {
        // GENERATE NEW ENTRY
        $timestamp = time();
        $redis->zadd("bookmarks", [$hashID => $timestamp]);
        $redis->hmset("bookmark:$hashID", ["url" => $url, "id" => $hashID]);
        foreach ($tags as $tag) {
            // Add each tag individually to the set
            $redis->sadd("bookmark:$hashID:tags", $tag);
            // Create the tag if it doesn't exist
            $redis->sadd("tag:$tag", $hashID);
        }
    }
}


// Function to retrieve recent bookmarks
function getRecentBookmarks($limit = 15) {
    global $redis;
    $bookmarkIds = $redis->zrevrange("bookmarks", 0, $limit - 1);
    $bookmarks = [];
    foreach ($bookmarkIds as $bookmarkId) {
        $bookmarks[] = $redis->hgetall("bookmark:$bookmarkId");
    }
    return $bookmarks;
}

// Function to retrieve bookmarks by tags
function getBookmarksByTags($tags) {
    global $redis;
    $intersectingBookmarks = null;
    foreach ($tags as $tag) {
        $tagBookmarks = $redis->smembers("tag:$tag");
        if ($intersectingBookmarks === null) {
            $intersectingBookmarks = $tagBookmarks;
        } else {
            $intersectingBookmarks = array_intersect($intersectingBookmarks, $tagBookmarks);
        }
    }
    $bookmarks = [];
    if ($intersectingBookmarks !== null) {
        foreach ($intersectingBookmarks as $bookmarkId) {
            $bookmarks[] = $redis->hgetall("bookmark:$bookmarkId");
        }
    }
    return $bookmarks;
}

?>