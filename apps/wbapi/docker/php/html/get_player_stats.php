<?php

// https://gist.github.com/rchrd2/c94eb4701da57ce9a0ad4d2b00794131
function require_auth()
{
    $AUTH_USER = 'id';
    $AUTH_PASS = 'pw';

    header('Cache-Control: no-cache, must-revalidate, max-age=0');
    $has_supplied_credentials = !(empty($_SERVER['PHP_AUTH_USER']) && empty($_SERVER['PHP_AUTH_PW']));
    $is_not_authenticated = (
        !$has_supplied_credentials ||
        $_SERVER['PHP_AUTH_USER'] != $AUTH_USER ||
        $_SERVER['PHP_AUTH_PW']   != $AUTH_PASS
    );
    if ($is_not_authenticated) {
        header('HTTP/1.1 401 Authorization Required');
        header('WWW-Authenticate: Basic realm="Access denied"');
        exit;
    }
}

require_auth();

if (!isset($_GET["uid"])) {
    echo "Please provide a UID. Like this: <a href=\"/get_player_stats.php?uid=5d2ead35d142affb05757778\">/get_player_stats.php?uid=5d2ead35d142affb05757778</a>";
    return;
}

$uid = $_GET['uid'];
$filePath = "data/$uid.txt";

if (!file_exists($filePath)) {
    echo "No data for player: $uid";
}

echo file_get_contents($filePath);
