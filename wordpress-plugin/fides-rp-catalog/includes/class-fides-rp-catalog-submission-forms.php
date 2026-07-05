<?php
/**
 * Public submission forms (add relying party / suggest update).
 *
 * @package fides-rp-catalog
 */

if (! defined('ABSPATH')) {
    exit;
}

if (! class_exists('Fides_RP_Catalog_Submission_Forms')) {

    class Fides_RP_Catalog_Submission_Forms {

        const VERSION = '2.6.0';

        /**
         * @return array<int, array{code: string, label: string}>
         */
        private static function country_options_for_form(): array {
            static $cache = null;
            if ($cache !== null) {
                return $cache;
            }
            $path = plugin_dir_path(dirname(__FILE__)) . 'assets/form-countries.json';
            if (! is_readable($path)) {
                $cache = array();
                return $cache;
            }
            $json = json_decode((string) file_get_contents($path), true);
            $cache = is_array($json) ? $json : array();
            return $cache;
        }

        /**
         * @param string $mode create|update.
         */
        private static function section_intro_for_mode($mode): string {
            if ($mode === 'update') {
                return __('Search for your relying party, then review and edit the fields below.', 'fides-rp-catalog');
            }
            return __('Select the organization, then enter the relying party details for the FIDES RP Catalog.', 'fides-rp-catalog');
        }

        /** @var array<string, string> */
        const FIELD_HELP = array(
            'orgSearch'                => 'Search the organization catalog and select the provider for this relying party.',
            'rpSearch'                 => 'Search by relying party name or id, then select the correct entry.',
            'id'                       => 'Stable catalog id (lowercase, hyphens). Used in deep links (?rp=…).',
            'name'                     => 'Display name of the relying party service or website.',
            'description'              => 'Brief description of the verifier and its use case. Shown on the public catalog detail page (max 2,000 characters).',
            'readiness'                => 'Maturity of the deployment (demo, pilot, or production).',
            'country'                  => 'ISO country code where the relying party is based, or EU for pan-European services.',
            'interactionMode'          => 'Whether verification happens in proximity, remotely, or both.',
            'status'                   => 'Operational status of the service.',
            'logo'                     => 'Direct URL to a logo image shown on catalog cards and the detail modal.',
            'website'                  => 'Public URL of the relying party service or landing page.',
            'vcFormat'                 => 'Verifiable credential formats this verifier accepts.',
            'presentationProtocols'    => 'Presentation protocols used to request credentials.',
            'interoperabilityProfiles' => 'Interop profiles this verifier supports (from the FIDES interop profiles catalog).',
            'supportedWallets'         => 'Wallets known to work with this relying party. Search the wallet catalog to add entries.',
            'acceptedCredentialRefs'   => 'Credential types from the FIDES Credential Catalog that this verifier accepts.',
            'features'                 => 'Additional capabilities (comma-separated).',
            'documentation'            => 'Link to technical or integration documentation.',
            'testCredentials'          => 'URL where developers can obtain test credentials for this verifier.',
            'apiEndpoint'              => 'Programmatic API endpoint, if applicable.',
            'mediaVideos'              => 'YouTube or Vimeo links to demo or walkthrough videos (up to 3).',
            'mediaImages'              => 'Screenshot or product image URLs shown on the public listing (up to 10). Upload JPEG, PNG, WebP, or GIF.',
            'contactEmail'             => 'Taken from your FIDES account; used for submission review only.',
        );

        public static function bootstrap(): void {
            add_action('wp_enqueue_scripts', array(__CLASS__, 'register_assets'));
            add_shortcode('fides_rp_submit_form', array(__CLASS__, 'render_submit_shortcode'));
            add_shortcode('fides_rp_update_form', array(__CLASS__, 'render_update_shortcode'));
        }

        public static function register_assets(): void {
            $base = plugin_dir_path(dirname(__FILE__));
            $url  = plugin_dir_url(dirname(__FILE__));

            $css_path = $base . 'assets/rp-form.css';
            $js_path  = $base . 'assets/rp-form.js';
            $css_ver  = file_exists($css_path) ? (string) filemtime($css_path) : self::VERSION;
            $js_ver   = file_exists($js_path) ? (string) filemtime($js_path) : self::VERSION;

            wp_register_style(
                'fides-rp-form',
                $url . 'assets/rp-form.css',
                array(),
                $css_ver
            );
            wp_register_script(
                'fides-rp-form',
                $url . 'assets/rp-form.js',
                array(),
                $js_ver,
                true
            );
        }

        /**
         * @param array<string, mixed> $atts Shortcode attributes.
         */
        public static function render_submit_shortcode($atts = array()): string {
            return self::render_form_shortcode('create', $atts);
        }

        /**
         * @param array<string, mixed> $atts Shortcode attributes.
         */
        public static function render_update_shortcode($atts = array()): string {
            $atts = shortcode_atts(
                array(
                    'rp' => '',
                ),
                $atts,
                'fides_rp_update_form'
            );
            $preselect = self::normalize_rp_query_param((string) $atts['rp']);
            if ($preselect === '' && isset($_GET['rp'])) {
                // phpcs:ignore WordPress.Security.NonceVerification.Recommended
                $preselect = self::normalize_rp_query_param((string) wp_unslash($_GET['rp']));
            }
            return self::render_form_shortcode('update', array('preselectRpId' => $preselect));
        }

        /**
         * @param string               $mode create|update.
         * @param array<string, mixed> $extra Extra config for inline script.
         */
        private static function render_form_shortcode($mode, array $extra = array()): string {
            if (! class_exists('Fides_Catalog_Submission_Registry')
                || ! Fides_Catalog_Submission_Registry::exists('rp')) {
                return '<div class="fides-use-case-card"><p>' . esc_html__(
                    'Relying party submissions are unavailable (missing submission core or adapter).',
                    'fides-rp-catalog'
                ) . '</p></div>';
            }

            if (! is_user_logged_in()) {
                wp_enqueue_style('fides-rp-form');
                $login_url = self::form_login_url();
                return sprintf(
                    '<div class="fides-use-case-card"><p>%s</p><p><a class="fides-org-form-login-link" href="%s">%s</a></p></div>',
                    esc_html__('You must be signed in to submit relying party catalog changes.', 'fides-rp-catalog'),
                    esc_url($login_url),
                    esc_html__('Sign in to continue', 'fides-rp-catalog')
                );
            }

            $user = wp_get_current_user();
            if ($mode === 'update' && ! empty($extra['preselectRpId'])
                && class_exists('Fides_Catalog_Org_Tier')) {
                $rp_id    = (string) $extra['preselectRpId'];
                $existing = class_exists('Fides_Catalog_Submission_Lookups')
                    ? Fides_Catalog_Submission_Lookups::find_item_by_id('rp', $rp_id)
                    : null;
                if (! Fides_Catalog_Org_Tier::user_can_edit_item(
                    'rp',
                    $rp_id,
                    (int) $user->ID,
                    is_array($existing) ? $existing : null
                )) {
                    return '<div class="fides-use-case-card"><p>' . esc_html__(
                        'This relying party belongs to a Pro organization. Only the linked owner or a site administrator can suggest updates.',
                        'fides-rp-catalog'
                    ) . '</p></div>';
                }
            }

            wp_enqueue_style('fides-rp-form');
            wp_enqueue_script('fides-rp-form');

            $plugin_url = plugin_dir_url(dirname(__FILE__));
            $config     = array_merge(
                array(
                    'mode'                  => $mode === 'update' ? 'update' : 'create',
                    'apiBase'               => esc_url_raw(rest_url('fides-catalog/v1')),
                    'restNonce'             => wp_create_nonce('wp_rest'),
                    'vocabularyUrl'         => 'https://raw.githubusercontent.com/FIDEScommunity/fides-interop-profiles/main/data/vocabulary.json',
                    'vocabularyFallbackUrl' => $plugin_url . 'assets/vocabulary.json',
                    'contactEmail'          => sanitize_email((string) $user->user_email),
                    'countries'             => self::country_options_for_form(),
                    'enums'                 => class_exists('Fides_RP_Catalog_Submission_Adapter')
                        ? Fides_RP_Catalog_Submission_Adapter::form_enums()
                        : array(),
                    'enumLabels'            => class_exists('Fides_RP_Catalog_Submission_Adapter')
                        ? Fides_RP_Catalog_Submission_Adapter::form_enum_labels()
                        : array(),
                    'fieldHelp'             => self::FIELD_HELP,
                    'sectionIntro'          => self::section_intro_for_mode($mode),
                    'preselectRpId'         => '',
                    'v2Limits'              => class_exists('Fides_RP_Catalog_Media_Normalizer')
                        ? Fides_RP_Catalog_Media_Normalizer::limits_for_form()
                        : array('mediaVideos' => 3, 'mediaImages' => 10),
                ),
                $extra
            );

            wp_add_inline_script(
                'fides-rp-form',
                'window.FIDES_RP_FORM_CONFIG = ' . wp_json_encode($config) . ';',
                'before'
            );

            $root_id = $mode === 'update' ? 'fides-rp-update-form-root' : 'fides-rp-submit-form-root';
            return '<div id="' . esc_attr($root_id) . '" class="fides-rp-submission-root fides-org-submission-root"></div>';
        }

        public static function form_login_url(): string {
            $current_request_uri = isset($_SERVER['REQUEST_URI']) ? wp_unslash($_SERVER['REQUEST_URI']) : '';
            $current_host        = isset($_SERVER['HTTP_HOST']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_HOST'])) : '';
            $current_url         = $current_host !== ''
                ? ((is_ssl() ? 'https://' : 'http://') . $current_host . $current_request_uri)
                : home_url('/');

            $oid4vp_options = get_option('universal_openid4vp_options', array());
            if (is_array($oid4vp_options) && ! empty($oid4vp_options['loginUrl'])) {
                return esc_url_raw(
                    add_query_arg('return_to', $current_url, (string) $oid4vp_options['loginUrl'])
                );
            }
            return wp_login_url($current_url);
        }

        private static function normalize_rp_query_param($raw): string {
            $raw = sanitize_text_field(trim((string) $raw));
            if ($raw === '') {
                return '';
            }
            return Fides_Catalog_Submission_Registry::is_valid_item_id('rp', $raw) ? $raw : '';
        }
    }
}
