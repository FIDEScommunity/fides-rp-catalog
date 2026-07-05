<?php
/**
 * Create RP submit/update form pages on utrecht-demo (idempotent, direct DB).
 */
declare(strict_types=1);

$socket = '/Users/victorvanderhulst/Library/Application Support/Local/run/buO_mZaLl/mysql/mysqld.sock';
$dbName = 'local';
$dbUser = 'root';
$dbPass = 'root';
$tablePrefix = 'wp_';
$siteUrl = 'http://utrecht-demo.local';

if (! is_readable($socket)) {
    fwrite(STDERR, "MySQL socket not found (is Local running?): {$socket}\n");
    exit(1);
}

$mysqli = mysqli_init();
if ($mysqli === false || ! $mysqli->real_connect('localhost', $dbUser, $dbPass, $dbName, null, $socket)) {
    fwrite(STDERR, 'MySQL connect failed: ' . ($mysqli->connect_error ?? 'unknown') . "\n");
    exit(1);
}

$spacer = <<<'HTML'
<!-- wp:stackable/spacer {"uniqueId":"2b03010","height":150} -->
<div class="wp-block-stackable-spacer stk-block-spacer stk--no-padding stk-block stk-2b03010" data-block-id="2b03010"><style>.stk-2b03010 {height:150px !important;}</style></div>
<!-- /wp:stackable/spacer -->

HTML;

$pages = [
    [
        'slug' => 'relying-parties-submit',
        'title' => 'Relying parties - submit',
        'shortcode' => 'fides_rp_submit_form',
    ],
    [
        'slug' => 'relying-parties-update',
        'title' => 'Relying parties - update',
        'shortcode' => 'fides_rp_update_form',
    ],
];

function findPageId(mysqli $db, string $prefix, string $slug): ?int
{
    $stmt = $db->prepare("SELECT ID FROM `{$prefix}posts` WHERE post_type = 'page' AND post_name = ? AND post_status = 'publish' LIMIT 1");
    if ($stmt === false) {
        return null;
    }
    $stmt->bind_param('s', $slug);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result ? $result->fetch_assoc() : null;
    $stmt->close();
    return is_array($row) ? (int) $row['ID'] : null;
}

function upsertPage(mysqli $db, string $prefix, string $siteUrl, array $spec, string $spacer): int
{
    $content = $spacer . "<!-- wp:shortcode -->\n[{$spec['shortcode']}]\n<!-- /wp:shortcode -->";
    $existingId = findPageId($db, $prefix, $spec['slug']);
    $now = gmdate('Y-m-d H:i:s');
    $guid = $siteUrl . '/?page_id=0';
    $empty = '';

    if ($existingId !== null) {
        $stmt = $db->prepare("UPDATE `{$prefix}posts` SET post_title = ?, post_content = ?, post_modified = ?, post_modified_gmt = ? WHERE ID = ?");
        if ($stmt === false) {
            throw new RuntimeException("Prepare failed: {$db->error}");
        }
        $stmt->bind_param('ssssi', $spec['title'], $content, $now, $now, $existingId);
        $stmt->execute();
        $stmt->close();
        echo "Updated page {$spec['slug']} (ID {$existingId})\n";
        return $existingId;
    }

    $stmt = $db->prepare(
        "INSERT INTO `{$prefix}posts`
        (post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count)
        VALUES (1, ?, ?, ?, ?, ?, 'publish', 'closed', 'closed', ?, ?, ?, ?, ?, ?, ?, 0, ?, 0, 'page', '', 0)"
    );
    if ($stmt === false) {
        throw new RuntimeException("Prepare failed: {$db->error}");
    }
    $stmt->bind_param(
        'sssssssssssss',
        $now,
        $now,
        $content,
        $spec['title'],
        $empty,
        $empty,
        $spec['slug'],
        $empty,
        $empty,
        $now,
        $now,
        $empty,
        $guid
    );
    $stmt->execute();
    $id = (int) $stmt->insert_id;
    $stmt->close();

    $guidFull = $guid . $id;
    $stmt = $db->prepare("UPDATE `{$prefix}posts` SET guid = ? WHERE ID = ?");
    $stmt->bind_param('si', $guidFull, $id);
    $stmt->execute();
    $stmt->close();

    echo "Created page {$spec['slug']} (ID {$id})\n";
    return $id;
}

function upsertOption(mysqli $db, string $prefix, string $name, string $value): void
{
    $stmt = $db->prepare("SELECT option_id FROM `{$prefix}options` WHERE option_name = ? LIMIT 1");
    $stmt->bind_param('s', $name);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result ? $result->fetch_assoc() : null;
    $stmt->close();

    if (is_array($row)) {
        $stmt = $db->prepare("UPDATE `{$prefix}options` SET option_value = ? WHERE option_name = ?");
        $stmt->bind_param('ss', $value, $name);
    } else {
        $autoload = 'auto';
        $stmt = $db->prepare("INSERT INTO `{$prefix}options` (option_name, option_value, autoload) VALUES (?, ?, ?)");
        $stmt->bind_param('sss', $name, $value, $autoload);
    }
    $stmt->execute();
    $stmt->close();
}

try {
    foreach ($pages as $page) {
        upsertPage($mysqli, $tablePrefix, $siteUrl, $page, $spacer);
    }

    $updateUrl = rtrim($siteUrl, '/') . '/relying-parties-update/';
    upsertOption($mysqli, $tablePrefix, 'fides_rp_catalog_update_form_url', $updateUrl);
    echo "Set fides_rp_catalog_update_form_url = {$updateUrl}\n";
} catch (Throwable $e) {
    fwrite(STDERR, $e->getMessage() . "\n");
    exit(1);
} finally {
    $mysqli->close();
}
