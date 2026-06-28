<?php
/**
 * RP Catalog SSR — relying-party catalog subclass of the shared
 * Fides_Catalog_SSR_Renderer base class shipped by fides-community-tools-tiles.
 *
 * Registers the `rp` catalog type, listing URL, and optional detail SSR
 * (meta rows, chip sections, WebApplication JSON-LD enrichment).
 *
 * When the shared base class is not loaded (e.g. tiles plugin disabled), this
 * file provides a no-op shim with the same public surface.
 *
 * @package fides-rp-catalog
 */

if (! defined('ABSPATH')) {
    exit;
}

if (! class_exists('Fides_RP_Catalog_SSR')) {

    if (! class_exists('Fides_Catalog_SSR_Renderer')) {

        class Fides_RP_Catalog_SSR {
            const TYPE                 = 'rp';
            const DEFAULT_CATALOG_PATH = '/ecosystem-explorer/relying-party-catalog/';
            const OPTION_CATALOG_URL   = 'fides_rp_catalog_page_url';
            const MAX_LISTING_ITEMS    = 30;
            public static function bootstrap() { /* no-op without base */ }
            public static function build_initial_html(array $atts) { return ''; }
        }

    } else {

        class Fides_RP_Catalog_SSR extends Fides_Catalog_SSR_Renderer {

            const TYPE                 = 'rp';
            const DEFAULT_CATALOG_PATH = '/ecosystem-explorer/relying-party-catalog/';
            const OPTION_CATALOG_URL   = 'fides_rp_catalog_page_url';
            const MAX_LISTING_ITEMS    = 30;

            /** @var self|null */
            private static $instance = null;

            public static function bootstrap(): void {
                if (self::$instance === null) {
                    self::$instance = new self();
                    self::$instance->bootstrap_renderer();
                    add_action('admin_init', array(__CLASS__, 'register_settings'));
                }
            }

            public static function build_initial_html(array $atts): string {
                self::bootstrap();
                return self::$instance->render_initial_html($atts);
            }

            protected function type(): string              { return self::TYPE; }
            protected function text_domain(): string       { return 'fides-rp-catalog'; }
            protected function shortcode_root_id(): string { return 'fides-rp-catalog-root'; }
            protected function loading_label(): string     { return __('Loading relying party catalog…', 'fides-rp-catalog'); }
            protected function max_listing_items(): int    { return self::MAX_LISTING_ITEMS; }

            public function register_with_core(): void {
                if (! class_exists('Fides_Catalog_Registry')) {
                    return;
                }
                Fides_Catalog_Registry::register(self::TYPE, array(
                    'label'             => __('Relying parties', 'fides-rp-catalog'),
                    'json_url'          => 'https://raw.githubusercontent.com/FIDEScommunity/fides-rp-catalog/main/data/aggregated.json',
                    'local_json_path'   => dirname(__DIR__) . '/data/aggregated.json',
                    'collection_key'    => 'relyingParties',
                    'id_field'          => 'id',
                    'name_field'        => 'name',
                    'description_field' => 'description',
                    'logo_field'        => 'logo',
                    'detail_param'      => 'rp',
                    'pages'             => array(
                        'main' => self::catalog_path(),
                    ),
                    'jsonld_type'       => 'WebApplication',
                ));
            }

            public static function register_settings(): void {
                register_setting('fides_rp_catalog_settings', self::OPTION_CATALOG_URL, array(
                    'type'              => 'string',
                    'default'           => self::DEFAULT_CATALOG_PATH,
                    'sanitize_callback' => array(__CLASS__, 'sanitize_path'),
                ));
            }

            public static function sanitize_path($value): string {
                $value = is_string($value) ? trim($value) : '';
                if ($value === '') {
                    return '';
                }
                $path = wp_parse_url($value, PHP_URL_PATH);
                if (! is_string($path) || $path === '') {
                    return '';
                }
                if ($path[0] !== '/') {
                    $path = '/' . $path;
                }
                return user_trailingslashit($path);
            }

            protected function listing_page_name(string $page_slug): string {
                return __('Relying party catalog', 'fides-rp-catalog');
            }

            protected function listing_page_url(string $page_slug): string {
                return home_url(self::catalog_path());
            }

            protected function enrich_jsonld(array $jsonld, array $item): array {
                if (! empty($item['website']) && is_string($item['website'])) {
                    $jsonld['url'] = (string) $item['website'];
                }
                if (! empty($item['logo']) && is_string($item['logo'])) {
                    $jsonld['image'] = (string) $item['logo'];
                }
                if (! empty($item['country']) && is_string($item['country'])) {
                    $jsonld['areaServed'] = (string) $item['country'];
                }
                if (! empty($item['readiness']) && is_string($item['readiness'])) {
                    $jsonld['applicationCategory'] = 'RelyingPartyReadiness:' . (string) $item['readiness'];
                }
                if (! empty($item['updatedAt']) && is_string($item['updatedAt'])) {
                    $ts = strtotime($item['updatedAt']);
                    if ($ts) {
                        $jsonld['dateModified'] = gmdate('Y-m-d', $ts);
                    }
                }
                return $jsonld;
            }

            protected function detail_meta_rows(array $item): array {
                $rows = array();
                $td   = 'fides-rp-catalog';

                if (! empty($item['readiness'])) {
                    $rows[] = array(
                        'label' => __('Readiness', $td),
                        'html'  => esc_html((string) $item['readiness']),
                    );
                }
                if (! empty($item['country'])) {
                    $rows[] = array(
                        'label' => __('Country', $td),
                        'html'  => esc_html((string) $item['country']),
                    );
                }
                if (! empty($item['status'])) {
                    $rows[] = array(
                        'label' => __('Status', $td),
                        'html'  => esc_html((string) $item['status']),
                    );
                }
                if (! empty($item['website']) && is_string($item['website'])) {
                    $rows[] = array(
                        'label' => __('Website', $td),
                        'html'  => sprintf(
                            '<a href="%1$s" rel="nofollow noopener" target="_blank">%2$s</a>',
                            esc_url((string) $item['website']),
                            esc_html((string) $item['website'])
                        ),
                    );
                }
                if (! empty($item['updatedAt']) && is_string($item['updatedAt'])) {
                    $ts = strtotime($item['updatedAt']);
                    if ($ts) {
                        $rows[] = array(
                            'label' => __('Last updated', $td),
                            'html'  => sprintf(
                                '<time datetime="%1$s">%1$s</time>',
                                esc_attr(gmdate('Y-m-d', $ts))
                            ),
                        );
                    }
                }
                return $rows;
            }

            protected function detail_extra_sections(array $item): string {
                $td = 'fides-rp-catalog';
                ob_start();
                echo $this->render_chip_section($this->list_field($item, 'vcFormat'), __('VC formats', $td));
                echo $this->render_chip_section($this->list_field($item, 'sectors'), __('Sectors', $td));
                echo $this->render_chip_section($this->list_field($item, 'interoperabilityProfiles'), __('Interop profiles', $td));
                echo $this->render_chip_section($this->list_field($item, 'presentationProtocols'), __('Presentation protocols', $td));
                echo $this->render_chip_section($this->list_field($item, 'acceptedCredentials'), __('Accepted credentials', $td));
                return (string) ob_get_clean();
            }

            private static function catalog_path(): string {
                $opt = (string) get_option(self::OPTION_CATALOG_URL, '');
                if ($opt === '') {
                    return self::DEFAULT_CATALOG_PATH;
                }

                // Backward compatibility: migrate legacy rp-catalog slug to the live URL slug.
                if (untrailingslashit($opt) === '/ecosystem-explorer/rp-catalog') {
                    return self::DEFAULT_CATALOG_PATH;
                }

                return $opt;
            }
        }
    }
}
