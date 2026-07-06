<?php
/**
 * Plugin Name: FIDES RP Catalog
 * Plugin URI: https://github.com/FIDEScommunity/fides-rp-catalog
 * Description: Display an interactive catalog of relying parties (verifiers) that accept verifiable credentials. When the master fides_catalog_ssr_enabled flag (provided by FIDES Community Tools Tiles ≥ 1.6.3) is enabled, the plugin also emits a server-rendered listing fallback, per-deeplink SEO meta tags and a WebApplication JSON-LD payload so RP detail URLs become indexable by search engines.
 * Version: 2.7.9
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
define('FIDES_RP_CATALOG_VERSION', '2.7.9');
define('FIDES_RP_CATALOG_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('FIDES_RP_CATALOG_PLUGIN_URL', plugin_dir_url(__FILE__));
define('FIDES_RP_CATALOG_DEFAULT_UPDATE_FORM_PATH', '/relying-parties-update/');

require_once FIDES_RP_CATALOG_PLUGIN_DIR . 'includes/class-fides-rp-catalog-ssr.php';
require_once FIDES_RP_CATALOG_PLUGIN_DIR . 'includes/class-fides-rp-catalog-media-normalizer.php';
require_once FIDES_RP_CATALOG_PLUGIN_DIR . 'includes/class-fides-rp-catalog-submission-adapter.php';
require_once FIDES_RP_CATALOG_PLUGIN_DIR . 'includes/class-fides-rp-catalog-submission-forms.php';
Fides_RP_Catalog_SSR::bootstrap();
Fides_RP_Catalog_Submission_Adapter::bootstrap();
Fides_RP_Catalog_Submission_Forms::bootstrap();

/**
 * Resolve the public RP update form URL (option or default path).
 *
 * @param string $override Non-empty override URL.
 * @return string
 */
function fides_rp_catalog_resolve_update_form_url($override = '') {
    $override = trim((string) $override);
    if ($override !== '') {
        return esc_url_raw($override);
    }
    $option = trim((string) get_option('fides_rp_catalog_update_form_url', ''));
    if ($option !== '') {
        return esc_url_raw($option);
    }
    return home_url(FIDES_RP_CATALOG_DEFAULT_UPDATE_FORM_PATH);
}

/**
 * Enqueue plugin assets
 */
function fides_rp_catalog_enqueue_assets() {
    if (!fides_rp_catalog_should_enqueue_assets()) {
        return;
    }

    $ui_lib_css_path = FIDES_RP_CATALOG_PLUGIN_DIR . 'assets/lib/fides-catalog-ui.css';
    $ui_lib_css_version = file_exists($ui_lib_css_path) ? filemtime($ui_lib_css_path) : FIDES_RP_CATALOG_VERSION;
    $ui_lib_js_path = FIDES_RP_CATALOG_PLUGIN_DIR . 'assets/lib/fides-catalog-ui.js';
    $ui_lib_js_version = file_exists($ui_lib_js_path) ? filemtime($ui_lib_js_path) : FIDES_RP_CATALOG_VERSION;

    wp_enqueue_style(
        'fides-rp-catalog-style',
        FIDES_RP_CATALOG_PLUGIN_URL . 'assets/style.css',
        array(),
        FIDES_RP_CATALOG_VERSION
    );
    wp_enqueue_style(
        'fides-rp-catalog-ui-lib',
        FIDES_RP_CATALOG_PLUGIN_URL . 'assets/lib/fides-catalog-ui.css',
        array('fides-rp-catalog-style'),
        $ui_lib_css_version
    );
    wp_enqueue_script(
        'fides-rp-catalog-ui-lib',
        FIDES_RP_CATALOG_PLUGIN_URL . 'assets/lib/fides-catalog-ui.js',
        array(),
        $ui_lib_js_version,
        true
    );

    wp_enqueue_script(
        'fides-rp-catalog-script',
        FIDES_RP_CATALOG_PLUGIN_URL . 'assets/rp-catalog.js',
        array('fides-rp-catalog-ui-lib'),
        FIDES_RP_CATALOG_VERSION,
        true
    );

    $current_request_uri = isset($_SERVER['REQUEST_URI']) ? wp_unslash($_SERVER['REQUEST_URI']) : '';
    $current_host = isset($_SERVER['HTTP_HOST']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_HOST'])) : '';
    $current_url = $current_host !== ''
        ? ((is_ssl() ? 'https://' : 'http://') . $current_host . $current_request_uri)
        : home_url('/');
    $oid4vp_options = get_option('universal_openid4vp_options', array());
    $oid4vp_login_url = '';
    if (is_array($oid4vp_options) && ! empty($oid4vp_options['loginUrl'])) {
        $oid4vp_login_url = esc_url_raw((string) $oid4vp_options['loginUrl']);
    }
    $ratings_login_url = $oid4vp_login_url !== '' ? $oid4vp_login_url : wp_login_url($current_url);

    // Pass configuration to JavaScript
    wp_localize_script('fides-rp-catalog-script', 'fidesRPCatalog', array(
        'pluginUrl' => FIDES_RP_CATALOG_PLUGIN_URL,
        'githubDataUrl' => 'https://raw.githubusercontent.com/FIDEScommunity/fides-rp-catalog/main/data/aggregated.json',
        'vocabularyUrl' => 'https://raw.githubusercontent.com/FIDEScommunity/fides-interop-profiles/main/data/vocabulary.json',
        'vocabularyFallbackUrl' => FIDES_RP_CATALOG_PLUGIN_URL . 'assets/vocabulary.json',
        'walletCatalogUrl' => get_option('fides_rp_catalog_wallet_url', 'https://wallets.fides.community'),
        'bluePagesUrl' => get_option('fides_rp_catalog_blue_pages_url', 'https://fides.community/community-tools/blue-pages'),
        'mapPageUrl' => get_option('fides_rp_catalog_map_url', 'https://fides.community/community-tools/map/'),
        'credentialCatalogUrl' => get_option(
            'fides_rp_catalog_credential_catalog_url',
            'https://fides.community/ecosystem-explorer/credential-catalog/'
        ),
        'organizationCatalogUrl' => get_option(
            'fides_rp_catalog_organization_catalog_url',
            'https://fides.community/ecosystem-explorer/organization-catalog/'
        ),
        'credentialAggregatedDataUrl' => get_option(
            'fides_rp_catalog_credential_aggregated_url',
            'https://raw.githubusercontent.com/FIDEScommunity/fides-credential-catalog/main/data/aggregated.json'
        ),
        'issuerAggregatedDataUrl' => get_option(
            'fides_rp_catalog_issuer_aggregated_url',
            'https://raw.githubusercontent.com/FIDEScommunity/fides-issuer-catalog/main/data/aggregated.json'
        ),
        'walletAggregatedDataUrl' => get_option(
            'fides_rp_catalog_wallet_aggregated_url',
            'https://raw.githubusercontent.com/FIDEScommunity/fides-wallet-catalog/main/data/aggregated.json'
        ),
        'useCaseCatalogUrl' => get_option(
            'fides_rp_catalog_use_case_catalog_url',
            'https://fides.community/use-cases/'
        ),
        'useCaseAggregatedDataUrl' => get_option(
            'fides_rp_catalog_use_case_aggregated_url',
            'https://raw.githubusercontent.com/FIDEScommunity/fides-use-case-catalog/main/data/aggregated.json'
        ),
        'ecosystemExplorerUrl' => get_option(
            'fides_rp_catalog_ecosystem_explorer_url',
            'https://fides.community/topics/ecosystem-explorer/'
        ),
        'ratingsApiBase' => rest_url('fides-catalog/v1'),
        'ratingsNonce' => wp_create_nonce('wp_rest'),
        'ratingsIsLoggedIn' => is_user_logged_in(),
        'ratingsLoginUrl' => $ratings_login_url,
        'updateFormUrl' => fides_rp_catalog_resolve_update_form_url(''),
        'editAccess' => class_exists('Fides_Catalog_Org_Tier')
            ? Fides_Catalog_Org_Tier::edit_access_for_user(get_current_user_id())
            : array(
                'isLoggedIn'  => is_user_logged_in(),
                'isAdmin'     => current_user_can('manage_options'),
                'ownedOrgIds' => array(),
                'proOrgIds'   => array(),
            ),
        'tierUiEnabled' => function_exists('fides_catalog_tier_ui_enabled') && fides_catalog_tier_ui_enabled(),
    ));
}
add_action('wp_enqueue_scripts', 'fides_rp_catalog_enqueue_assets');

/**
 * Enqueue frontend assets only when the RP shortcode is present.
 * A filter hook is provided for template-driven pages.
 */
function fides_rp_catalog_should_enqueue_assets() {
    if (is_admin()) {
        return false;
    }

    if (is_singular()) {
        $post = get_post();
        if ($post instanceof WP_Post && has_shortcode($post->post_content, 'fides_rp_catalog')) {
            return true;
        }
    }

    return (bool) apply_filters('fides_rp_catalog_force_enqueue_assets', false);
}

/**
 * Register catalog deep-link query vars (helps SEO plugins and canonical URL handling).
 *
 * @param string[] $vars Public query variables.
 * @return string[]
 */
function fides_rp_catalog_query_vars($vars) {
    foreach (array('theme', 'profile', 'sector', 'rps', 'country', 'rp') as $q) {
        $vars[] = $q;
    }
    return $vars;
}
add_filter('query_vars', 'fides_rp_catalog_query_vars');

/**
 * Avoid redirect_canonical dropping FIDES RP catalog deep-link parameters (empty search in JS).
 *
 * @param string|false $redirect_url Computed canonical URL, or false.
 * @return string|false
 */
function fides_rp_catalog_preserve_redirect_canonical($redirect_url) {
    $keys = array('theme', 'profile', 'sector', 'rps', 'country', 'rp');
    foreach ($keys as $key) {
        if (isset($_GET[$key]) && (string) $_GET[$key] !== '') {
            return false;
        }
    }
    return $redirect_url;
}
add_filter('redirect_canonical', 'fides_rp_catalog_preserve_redirect_canonical', 10, 1);

/**
 * Register shortcode [fides_rp_catalog]
 * 
 * Attributes:
 * - type: Filter by type (demo, sandbox, production)
 * - sector: Filter by sector (canonical code: public_sector, finance, …; legacy "government" is mapped to public_sector in JS)
 * - show_filters: Show/hide filter panel (default: true)
 * - show_search: Show/hide search box (default: true)
 * - columns: Number of columns (2, 3, or 4, default: 3)
 * - theme: Color theme (dark, light, fides, default: dark)
 * - taxonomy_theme: Preset taxonomy theme filter (canonical code); URL uses ?theme=
 */
function fides_rp_catalog_shortcode($atts) {
    $atts = shortcode_atts(array(
        'type' => '',
        'sector' => '',
        'show_filters' => 'true',
        'show_search' => 'true',
        'columns' => '3',
        'theme' => 'dark',
        'taxonomy_theme' => '',
    ), $atts, 'fides_rp_catalog');

    // Sanitize attributes
    $type = sanitize_text_field($atts['type']);
    $sector = sanitize_text_field($atts['sector']);
    $show_filters = $atts['show_filters'] === 'true' ? 'true' : 'false';
    $show_search = $atts['show_search'] === 'true' ? 'true' : 'false';
    $columns = in_array($atts['columns'], array('2', '3', '4')) ? $atts['columns'] : '3';
    $theme = in_array($atts['theme'], array('dark', 'light', 'fides')) ? $atts['theme'] : 'dark';
    $taxonomy_theme = sanitize_text_field((string) $atts['taxonomy_theme']);

    $initial_html = '';
    if (class_exists('Fides_RP_Catalog_SSR')) {
        $initial_html = Fides_RP_Catalog_SSR::build_initial_html(array(
            'type'           => $type,
            'sector'         => $sector,
            'show_filters'   => $show_filters,
            'show_search'    => $show_search,
            'columns'        => $columns,
            'theme'          => $theme,
            'taxonomy_theme' => $taxonomy_theme,
        ));
    }
    if ($initial_html === '') {
        $initial_html = '<div class="fides-loading">Loading relying parties...</div>';
    }

    return sprintf(
        '<div id="fides-rp-catalog-root" class="fides-rp-catalog" data-type="%s" data-sector="%s" data-show-filters="%s" data-show-search="%s" data-columns="%s" data-theme="%s" data-taxonomy-theme="%s">%s</div>',
        esc_attr($type),
        esc_attr($sector),
        esc_attr($show_filters),
        esc_attr($show_search),
        esc_attr($columns),
        esc_attr($theme),
        esc_attr($taxonomy_theme),
        $initial_html
    );
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

    register_setting('fides_rp_catalog_settings', 'fides_rp_catalog_credential_catalog_url', array(
        'type' => 'string',
        'default' => 'https://fides.community/ecosystem-explorer/credential-catalog/',
        'sanitize_callback' => 'esc_url_raw'
    ));

    register_setting('fides_rp_catalog_settings', 'fides_rp_catalog_organization_catalog_url', array(
        'type' => 'string',
        'default' => 'https://fides.community/ecosystem-explorer/organization-catalog/',
        'sanitize_callback' => 'esc_url_raw'
    ));

    register_setting('fides_rp_catalog_settings', 'fides_rp_catalog_credential_aggregated_url', array(
        'type' => 'string',
        'default' => 'https://raw.githubusercontent.com/FIDEScommunity/fides-credential-catalog/main/data/aggregated.json',
        'sanitize_callback' => 'esc_url_raw'
    ));

    register_setting('fides_rp_catalog_settings', 'fides_rp_catalog_update_form_url', array(
        'type'              => 'string',
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
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
                <tr>
                    <th scope="row"><label for="fides_rp_catalog_credential_catalog_url">Credential Catalog URL</label></th>
                    <td>
                        <input type="url" id="fides_rp_catalog_credential_catalog_url" name="fides_rp_catalog_credential_catalog_url"
                               value="<?php echo esc_attr(get_option('fides_rp_catalog_credential_catalog_url', 'https://fides.community/ecosystem-explorer/credential-catalog/')); ?>"
                               class="regular-text">
                        <p class="description">Page URL of the FIDES Credential Catalog (shortcode). Used for ?credential=cred:… deep links from accepted credentials.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="fides_rp_catalog_organization_catalog_url">Organization Catalog URL</label></th>
                    <td>
                        <input type="url" id="fides_rp_catalog_organization_catalog_url" name="fides_rp_catalog_organization_catalog_url"
                               value="<?php echo esc_attr(get_option('fides_rp_catalog_organization_catalog_url', 'https://fides.community/ecosystem-explorer/organization-catalog/')); ?>"
                               class="regular-text">
                        <p class="description">Page URL of the FIDES Organization Catalog. Used for ?org=org:… deep links from RP modals (source <code>rp-catalog.json</code> uses <code>orgId</code>, same as issuer/credential catalogs).</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="fides_rp_catalog_credential_aggregated_url">Credential catalog data (JSON)</label></th>
                    <td>
                        <input type="url" id="fides_rp_catalog_credential_aggregated_url" name="fides_rp_catalog_credential_aggregated_url"
                               value="<?php echo esc_attr(get_option('fides_rp_catalog_credential_aggregated_url', 'https://raw.githubusercontent.com/FIDEScommunity/fides-credential-catalog/main/data/aggregated.json')); ?>"
                               class="regular-text">
                        <p class="description">URL of credential catalog <code>aggregated.json</code>. Used to resolve <strong>ecosystems</strong> and <strong>themes</strong> for RP filters from <code>acceptedCredentialRefs</code> (cred:… IDs).</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="fides_rp_catalog_update_form_url">RP update form page URL</label></th>
                    <td>
                        <input type="url" id="fides_rp_catalog_update_form_url" name="fides_rp_catalog_update_form_url"
                               value="<?php echo esc_attr(get_option('fides_rp_catalog_update_form_url', '')); ?>"
                               class="regular-text"
                               placeholder="<?php echo esc_attr(home_url(FIDES_RP_CATALOG_DEFAULT_UPDATE_FORM_PATH)); ?>">
                        <p class="description">Page with <code>[fides_rp_update_form]</code>. Used for the &quot;Suggest an update&quot; pencil in the RP modal (logged-in users only).</p>
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
                    <td>Filter by sector (same codes as credential / organization catalog)</td>
                    <td>(all)</td>
                    <td>e.g. public_sector, finance, healthcare, education, retail, mobility, digital</td>
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
        
        <p><strong>Show public sector RPs with FIDES theme:</strong></p>
        <code>[fides_rp_catalog sector="public_sector" theme="fides"]</code>
        <p class="description">Legacy shortcode value <code>government</code> is still accepted and mapped to <code>public_sector</code>.</p>
        
        <p><strong>Compact 2-column layout without filters:</strong></p>
        <code>[fides_rp_catalog columns="2" show_filters="false"]</code>

        <hr>
        <h2>Submission forms</h2>
        <p>Requires <code>fides-community-tools-tiles</code> with the shared submission core enabled.</p>
        <p><code>[fides_rp_submit_form]</code> — submit a new relying party (organization lookup first).</p>
        <p><code>[fides_rp_update_form]</code> — suggest changes to an existing entry (<code>?rp=</code> pre-selects the relying party).</p>
    </div>
    <?php
}

