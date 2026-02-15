<?php
/**
 * Plugin Name: FIDES RP Catalog
 * Plugin URI: https://github.com/FIDEScommunity/fides-rp-catalog
 * Description: Display an interactive catalog of relying parties (verifiers) that accept verifiable credentials
 * Version: 1.9.4
 * Author: FIDES Community
 * Author URI: https://fides.community
 * License: Apache-2.0
 * Text Domain: fides-rp-catalog
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('FIDES_RP_CATALOG_VERSION', '1.9.2');
define('FIDES_RP_CATALOG_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('FIDES_RP_CATALOG_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Enqueue plugin assets
 */
function fides_rp_catalog_enqueue_assets() {
    wp_enqueue_style(
        'fides-rp-catalog-style',
        FIDES_RP_CATALOG_PLUGIN_URL . 'assets/style.css',
        array(),
        FIDES_RP_CATALOG_VERSION
    );

    wp_enqueue_script(
        'fides-rp-catalog-script',
        FIDES_RP_CATALOG_PLUGIN_URL . 'assets/rp-catalog.js',
        array(),
        FIDES_RP_CATALOG_VERSION,
        true
    );

    // Pass configuration to JavaScript
    wp_localize_script('fides-rp-catalog-script', 'fidesRPCatalog', array(
        'pluginUrl' => FIDES_RP_CATALOG_PLUGIN_URL,
        'githubDataUrl' => 'https://raw.githubusercontent.com/FIDEScommunity/fides-rp-catalog/main/data/aggregated.json',
        'vocabularyUrl' => 'https://raw.githubusercontent.com/FIDEScommunity/fides-interop-profiles/main/data/vocabulary.json',
        'vocabularyFallbackUrl' => FIDES_RP_CATALOG_PLUGIN_URL . 'assets/vocabulary.json',
        'walletCatalogUrl' => get_option('fides_rp_catalog_wallet_url', 'https://wallets.fides.community'),
        'bluePagesUrl' => get_option('fides_rp_catalog_blue_pages_url', 'https://fides.community/community-tools/blue-pages'),
        'mapPageUrl' => get_option('fides_rp_catalog_map_url', 'https://fides.community/community-tools/map/')
    ));
}
add_action('wp_enqueue_scripts', 'fides_rp_catalog_enqueue_assets');

/**
 * Register shortcode [fides_rp_catalog]
 * 
 * Attributes:
 * - type: Filter by type (demo, sandbox, production)
 * - sector: Filter by sector
 * - show_filters: Show/hide filter panel (default: true)
 * - show_search: Show/hide search box (default: true)
 * - columns: Number of columns (2, 3, or 4, default: 3)
 * - theme: Color theme (dark, light, fides, default: dark)
 */
function fides_rp_catalog_shortcode($atts) {
    $atts = shortcode_atts(array(
        'type' => '',
        'sector' => '',
        'show_filters' => 'true',
        'show_search' => 'true',
        'columns' => '3',
        'theme' => 'dark'
    ), $atts, 'fides_rp_catalog');

    // Sanitize attributes
    $type = sanitize_text_field($atts['type']);
    $sector = sanitize_text_field($atts['sector']);
    $show_filters = $atts['show_filters'] === 'true' ? 'true' : 'false';
    $show_search = $atts['show_search'] === 'true' ? 'true' : 'false';
    $columns = in_array($atts['columns'], array('2', '3', '4')) ? $atts['columns'] : '3';
    $theme = in_array($atts['theme'], array('dark', 'light', 'fides')) ? $atts['theme'] : 'dark';

    // Build container with data attributes
    $html = sprintf(
        '<div id="fides-rp-catalog-root" class="fides-rp-catalog" data-type="%s" data-sector="%s" data-show-filters="%s" data-show-search="%s" data-columns="%s" data-theme="%s">',
        esc_attr($type),
        esc_attr($sector),
        esc_attr($show_filters),
        esc_attr($show_search),
        esc_attr($columns),
        esc_attr($theme)
    );
    $html .= '<div class="fides-loading">Loading relying parties...</div>';
    $html .= '</div>';

    return $html;
}
add_shortcode('fides_rp_catalog', 'fides_rp_catalog_shortcode');

/**
 * Add admin menu
 */
function fides_rp_catalog_admin_menu() {
    add_options_page(
        'FIDES RP Catalog Settings',
        'FIDES RP Catalog',
        'manage_options',
        'fides-rp-catalog',
        'fides_rp_catalog_settings_page'
    );
}
add_action('admin_menu', 'fides_rp_catalog_admin_menu');

/**
 * Register plugin settings
 */
function fides_rp_catalog_register_settings() {
    register_setting('fides_rp_catalog_settings', 'fides_rp_catalog_wallet_url', array(
        'type' => 'string',
        'default' => 'https://wallets.fides.community',
        'sanitize_callback' => 'esc_url_raw'
    ));

    register_setting('fides_rp_catalog_settings', 'fides_rp_catalog_blue_pages_url', array(
        'type' => 'string',
        'default' => 'https://fides.community/community-tools/blue-pages',
        'sanitize_callback' => 'esc_url_raw'
    ));
}
add_action('admin_init', 'fides_rp_catalog_register_settings');

/**
 * Settings page
 */
function fides_rp_catalog_settings_page() {
    ?>
    <div class="wrap">
        <h1>FIDES RP Catalog</h1>
        
        <form method="post" action="options.php">
            <?php settings_fields('fides_rp_catalog_settings'); ?>
            <h2>Settings</h2>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="fides_rp_catalog_wallet_url">Wallet Catalog URL</label></th>
                    <td>
                        <input type="url" id="fides_rp_catalog_wallet_url" name="fides_rp_catalog_wallet_url"
                               value="<?php echo esc_attr(get_option('fides_rp_catalog_wallet_url', 'https://wallets.fides.community')); ?>"
                               class="regular-text">
                        <p class="description">Base URL for wallet deep links (e.g., https://wallets.fides.community)</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="fides_rp_catalog_blue_pages_url">Blue Pages URL</label></th>
                    <td>
                        <input type="url" id="fides_rp_catalog_blue_pages_url" name="fides_rp_catalog_blue_pages_url"
                               value="<?php echo esc_attr(get_option('fides_rp_catalog_blue_pages_url', 'https://fides.community/community-tools/blue-pages')); ?>"
                               class="regular-text">
                        <p class="description">Base URL for Blue Pages DID lookups (e.g., https://fides.community/community-tools/blue-pages)</p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
        
        <hr>
        
        <h2>Shortcode Usage</h2>
        <p>Use the following shortcode to display the relying party catalog:</p>
        <code>[fides_rp_catalog]</code>
        
        <h3>Available Attributes</h3>
        <table class="widefat" style="max-width: 800px;">
            <thead>
                <tr>
                    <th>Attribute</th>
                    <th>Description</th>
                    <th>Default</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>type</code></td>
                    <td>Filter by deployment type</td>
                    <td>(all)</td>
                    <td>demo, sandbox, production</td>
                </tr>
                <tr>
                    <td><code>sector</code></td>
                    <td>Filter by industry sector</td>
                    <td>(all)</td>
                    <td>government, finance, healthcare, etc.</td>
                </tr>
                <tr>
                    <td><code>show_filters</code></td>
                    <td>Show filter panel</td>
                    <td>true</td>
                    <td>true, false</td>
                </tr>
                <tr>
                    <td><code>show_search</code></td>
                    <td>Show search box</td>
                    <td>true</td>
                    <td>true, false</td>
                </tr>
                <tr>
                    <td><code>columns</code></td>
                    <td>Grid columns</td>
                    <td>3</td>
                    <td>2, 3, 4</td>
                </tr>
                <tr>
                    <td><code>theme</code></td>
                    <td>Color theme</td>
                    <td>dark</td>
                    <td>dark, light, fides</td>
                </tr>
            </tbody>
        </table>
        
        <h3>Examples</h3>
        <p><strong>Show only demo verifiers:</strong></p>
        <code>[fides_rp_catalog type="demo"]</code>
        
        <p><strong>Show government sector with FIDES theme:</strong></p>
        <code>[fides_rp_catalog sector="government" theme="fides"]</code>
        
        <p><strong>Compact 2-column layout without filters:</strong></p>
        <code>[fides_rp_catalog columns="2" show_filters="false"]</code>
    </div>
    <?php
}

