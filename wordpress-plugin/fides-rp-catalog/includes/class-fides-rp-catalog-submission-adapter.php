<?php
/**
 * Registers the relying party catalog with the shared submission core.
 *
 * @package fides-rp-catalog
 */

if (! defined('ABSPATH')) {
    exit;
}

if (! class_exists('Fides_RP_Catalog_Submission_Adapter')) {

    class Fides_RP_Catalog_Submission_Adapter {

        const TYPE = 'rp';

        const SCHEMA = 'https://fides.community/schemas/rp-catalog/v1';

        /** Max description length for web form submissions (community JSON is not capped). */
        const DESCRIPTION_MAX_LENGTH = 2000;

        const USE_CASE_AGGREGATED_URL = 'https://raw.githubusercontent.com/FIDEScommunity/fides-use-case-catalog/main/data/aggregated.json';

        const INTEROP_AGGREGATED_URL = 'https://raw.githubusercontent.com/FIDEScommunity/fides-interop-profiles/main/data/aggregated.json';

        /** @var string[] */
        const READINESS_LEVELS = array(
            'technical-demo',
            'use-case-demo',
            'production-pilot',
            'production',
        );

        /** @var string[] */
        const STATUSES = array('development', 'beta', 'live', 'deprecated');

        /** @var string[] */
        const INTERACTION_MODES = array('proximity', 'remote', 'both');

        /** @var string[] Schema-aligned interop profile short names (validation). */
        const INTEROP_PROFILES = array(
            'DIIP v4',
            'DIIP v5',
            'EWC v3',
            'HAIP v1',
            'EUDI Wallet ARF',
        );

        /** @var string[] */
        const VC_FORMATS = array(
            'sd_jwt_vc',
            'mdoc',
            'jwt_vc',
            'vcdm_1_1',
            'vcdm_2_0',
            'anoncreds',
            'idemix',
            'apple_wallet_pass',
            'google_wallet_pass',
            'acdc',
        );

        /** @var string[] Common presentation protocols (form checkboxes). */
        const PRESENTATION_PROTOCOLS = array(
            'OpenID4VP',
            'DIDComm Present Proof v1',
            'DIDComm Present Proof v2',
            'ISO 18013-5',
            'SIOPv2',
        );

        /** @var string[] RP object keys editable via the submission form. */
        const RP_PAYLOAD_KEYS = array(
            'id',
            'name',
            'description',
            'logo',
            'website',
            'readiness',
            'country',
            'interactionMode',
            'status',
            'useCases',
            'acceptedCredentialRefs',
            'acceptedCredentials',
            'vcFormat',
            'presentationProtocols',
            'interoperabilityProfiles',
            'supportedWallets',
            'features',
            'documentation',
            'testCredentials',
            'apiEndpoint',
            'media',
            'languages',
        );

        public static function bootstrap(): void {
            add_action('init', array(__CLASS__, 'register'), 6);
            add_filter('fides_catalog_submission_public_item_url', array(__CLASS__, 'filter_public_item_url'), 10, 4);
        }

        public static function register(): void {
            if (! class_exists('Fides_Catalog_Submission_Registry')) {
                return;
            }

            Fides_Catalog_Submission_Registry::register(
                self::TYPE,
                array(
                    'label'                   => __('Relying parties', 'fides-rp-catalog'),
                    'catalog_type'            => self::TYPE,
                    'id_pattern'              => '/^[a-z0-9-]+$/',
                    'community_filename'      => 'rp-catalog.json',
                    'slug_from_item_id'       => array(__CLASS__, 'slug_from_item_id'),
                    'slug_from_payload'       => array(__CLASS__, 'slug_from_payload'),
                    'validate_payload'        => array(__CLASS__, 'validate_payload'),
                    'payload_to_export'       => array(__CLASS__, 'payload_to_export'),
                    'catalog_item_to_payload' => array(__CLASS__, 'catalog_item_to_payload'),
                    'prepare_payload_for_diff' => array(__CLASS__, 'prepare_payload_for_diff'),
                    'diff_field_labels'       => array(
                        'id'                         => 'RP id',
                        'orgId'                      => 'Organization',
                        'name'                       => 'Name',
                        'description'                => 'Description',
                        'logo'                       => 'Logo URL',
                        'website'                    => 'Website',
                        'readiness'                  => 'Readiness',
                        'country'                    => 'Country',
                        'interactionMode'            => 'Interaction mode',
                        'status'                     => 'Status',
                        'useCases'                   => 'Use cases',
                        'acceptedCredentialRefs'     => 'Accepted credentials (catalog refs)',
                        'acceptedCredentials'        => 'Accepted credentials (labels)',
                        'vcFormat'                   => 'VC formats',
                        'presentationProtocols'      => 'Presentation protocols',
                        'interoperabilityProfiles'   => 'Interop profiles',
                        'supportedWallets'           => 'Supported wallets',
                        'features'                   => 'Features',
                        'documentation'              => 'Documentation',
                        'testCredentials'            => 'Test credentials URL',
                        'apiEndpoint'                => 'API endpoint',
                        'media.videos'               => 'Media videos',
                        'media.images'               => 'Media images',
                        'languages'                  => 'Languages',
                    ),
                )
            );
        }

        /**
         * @return array<string, array<int, string>>
         */
        public static function form_enums(): array {
            return array(
                'readiness'                => self::READINESS_LEVELS,
                'status'                   => self::STATUSES,
                'interactionMode'          => self::INTERACTION_MODES,
                'vcFormat'                 => self::VC_FORMATS,
                'presentationProtocols'    => self::PRESENTATION_PROTOCOLS,
                'interoperabilityProfiles' => self::interop_profile_short_names(),
            );
        }

        /**
         * @return array<string, array<string, string>>
         */
        public static function form_enum_labels(): array {
            return array(
                'readiness' => array(
                    'technical-demo'   => 'Technical demo',
                    'use-case-demo'    => 'Use case demo',
                    'production-pilot' => 'Production pilot',
                    'production'       => 'Production',
                ),
                'interactionMode' => array(
                    'proximity' => 'Proximity',
                    'remote'    => 'Remote',
                    'both'      => 'Both',
                ),
                'vcFormat' => array(
                    'sd_jwt_vc'          => 'SD-JWT VC',
                    'mdoc'               => 'ISO mDoc',
                    'jwt_vc'             => 'JWT VC',
                    'vcdm_1_1'           => 'VCDM1.1',
                    'vcdm_2_0'           => 'VCDM2.0',
                    'anoncreds'          => 'AnonCreds',
                    'idemix'             => 'Idemix',
                    'apple_wallet_pass'  => 'Apple Wallet Pass',
                    'google_wallet_pass' => 'Google Wallet Pass',
                    'acdc'               => 'ACDC',
                ),
            );
        }

        /**
         * Interop profile short names from the interop profiles catalog (schema-valid only).
         *
         * @return string[]
         */
        public static function interop_profile_short_names(): array {
            $allowed = array_flip(self::INTEROP_PROFILES);
            $names   = array();
            foreach (self::interop_profiles_from_catalog() as $profile) {
                $short = isset($profile['shortName']) ? trim((string) $profile['shortName']) : '';
                if ($short !== '' && isset($allowed[ $short ]) && ! in_array($short, $names, true)) {
                    $names[] = $short;
                }
            }
            if ($names === array()) {
                return self::INTEROP_PROFILES;
            }
            usort(
                $names,
                static function ($a, $b) {
                    $order = array_flip(self::INTEROP_PROFILES);
                    $ai    = isset($order[ $a ]) ? (int) $order[ $a ] : 999;
                    $bi    = isset($order[ $b ]) ? (int) $order[ $b ] : 999;
                    if ($ai !== $bi) {
                        return $ai <=> $bi;
                    }
                    return strcasecmp($a, $b);
                }
            );
            return $names;
        }

        /**
         * @param string               $url          Current URL.
         * @param string               $catalog_type Catalog type slug.
         * @param string               $item_id      RP id.
         * @param array<string, mixed> $payload      Published payload.
         * @return string
         */
        public static function filter_public_item_url($url, $catalog_type, $item_id, $payload) {
            unset($payload);
            if ($catalog_type !== self::TYPE) {
                return $url;
            }
            $item_id = trim((string) $item_id);
            if ($item_id === '' || ! class_exists('Fides_RP_Catalog_SSR')) {
                return $url;
            }
            $path = trim((string) get_option(Fides_RP_Catalog_SSR::OPTION_CATALOG_URL, Fides_RP_Catalog_SSR::DEFAULT_CATALOG_PATH));
            if ($path === '') {
                return $url;
            }
            return add_query_arg('rp', rawurlencode($item_id), home_url($path));
        }

        /**
         * @param string $item_id RP id.
         * @return string
         */
        public static function slug_from_item_id($item_id) {
            return sanitize_title((string) $item_id);
        }

        /**
         * @param array<string, mixed> $payload Normalized payload.
         * @param string               $item_id RP id.
         * @return string
         */
        public static function slug_from_payload(array $payload, $item_id) {
            unset($item_id);
            $org_id = isset($payload['orgId']) ? sanitize_text_field((string) $payload['orgId']) : '';
            if ($org_id !== '' && strpos($org_id, 'org:') === 0) {
                return sanitize_title(substr($org_id, 4));
            }
            return '';
        }

        /**
         * @param array<string, mixed> $payload Raw request payload.
         * @param array<string, mixed> $context action, type, optional item_id.
         * @return array<string, mixed>|WP_Error
         */
        public static function validate_payload(array $payload, array $context) {
            $action = isset($context['action']) ? sanitize_key((string) $context['action']) : 'create';

            $org_id = isset($payload['orgId']) ? sanitize_text_field((string) $payload['orgId']) : '';
            if ($org_id === '' || ! preg_match('/^org:[a-z0-9]+(?:-[a-z0-9]+)*$/', $org_id)) {
                return new WP_Error('fides_rp_invalid', __('A valid organization (org:…) is required.', 'fides-rp-catalog'));
            }

            if ($action === 'update') {
                $item_id = isset($context['item_id']) ? sanitize_text_field((string) $context['item_id']) : '';
                if ($item_id === '' || ! Fides_Catalog_Submission_Registry::is_valid_item_id(self::TYPE, $item_id)) {
                    return new WP_Error('fides_rp_invalid', __('Invalid relying party id.', 'fides-rp-catalog'));
                }
            } else {
                $item_id = isset($payload['id']) ? sanitize_text_field((string) $payload['id']) : '';
                if ($item_id === '' || ! preg_match('/^[a-z0-9-]+$/', $item_id)) {
                    return new WP_Error('fides_rp_invalid', __('RP id is required (lowercase letters, numbers, hyphens).', 'fides-rp-catalog'));
                }
            }

            $name = isset($payload['name']) ? sanitize_text_field((string) $payload['name']) : '';
            if ($name === '') {
                return new WP_Error('fides_rp_invalid', __('Relying party name is required.', 'fides-rp-catalog'));
            }

            $readiness = isset($payload['readiness']) ? sanitize_key((string) $payload['readiness']) : '';
            if (! in_array($readiness, self::READINESS_LEVELS, true)) {
                return new WP_Error('fides_rp_invalid', __('Select a readiness level.', 'fides-rp-catalog'));
            }

            $country = self::normalize_country(isset($payload['country']) ? (string) $payload['country'] : '');
            if ($country === '') {
                return new WP_Error('fides_rp_invalid', __('Country is required (ISO-3166-1 alpha-2 or EU).', 'fides-rp-catalog'));
            }

            $interaction_mode = isset($payload['interactionMode']) ? sanitize_key((string) $payload['interactionMode']) : '';
            if (! in_array($interaction_mode, self::INTERACTION_MODES, true)) {
                return new WP_Error('fides_rp_invalid', __('Select an interaction mode.', 'fides-rp-catalog'));
            }

            if ($action === 'update') {
                $existing = self::find_catalog_item($item_id);
                if (is_array($existing) && isset($existing['orgId']) && (string) $existing['orgId'] !== $org_id) {
                    return new WP_Error('fides_rp_invalid', __('Organization cannot be changed when updating a relying party.', 'fides-rp-catalog'));
                }
                $payload_id = isset($payload['id']) ? sanitize_text_field((string) $payload['id']) : '';
                if ($payload_id !== '' && $payload_id !== $item_id) {
                    return new WP_Error('fides_rp_invalid', __('RP id cannot be changed on update.', 'fides-rp-catalog'));
                }
            } elseif (self::find_catalog_item($item_id)) {
                return new WP_Error('fides_rp_invalid', __('This relying party id already exists in the catalog.', 'fides-rp-catalog'));
            }

            if (! self::organization_exists($org_id)) {
                return new WP_Error('fides_rp_invalid', __('The selected organization was not found in the organization catalog.', 'fides-rp-catalog'));
            }

            $normalized = array(
                'item_id'         => $item_id,
                'orgId'           => $org_id,
                'id'              => $item_id,
                'name'            => $name,
                'readiness'       => $readiness,
                'country'         => $country,
                'interactionMode' => $interaction_mode,
            );

            $description = isset($payload['description']) ? trim(wp_kses_post((string) $payload['description'])) : '';
            if ($description !== '') {
                if (mb_strlen($description) > self::DESCRIPTION_MAX_LENGTH) {
                    return new WP_Error(
                        'fides_rp_invalid',
                        sprintf(
                            /* translators: %d: maximum description length in characters */
                            __('Description must be at most %d characters.', 'fides-rp-catalog'),
                            self::DESCRIPTION_MAX_LENGTH
                        )
                    );
                }
                $normalized['description'] = $description;
            }

            foreach (array('logo', 'website', 'documentation', 'testCredentials', 'apiEndpoint') as $key) {
                $value = self::optional_url($payload, $key);
                if ($value !== '') {
                    $normalized[ $key ] = $value;
                }
            }

            if (array_key_exists('media', $payload) || array_key_exists('video', $payload)) {
                $media = Fides_RP_Catalog_Media_Normalizer::normalize_media($payload);
                if ($media !== array()) {
                    $normalized['media'] = $media;
                }
            } elseif ($action === 'update') {
                $existing = self::find_catalog_item($item_id);
                if (is_array($existing)) {
                    $existing_media = Fides_RP_Catalog_Media_Normalizer::normalize_media($existing);
                    if ($existing_media !== array()) {
                        $normalized['media'] = $existing_media;
                    }
                }
            }

            $media_check = Fides_RP_Catalog_Media_Normalizer::validate_media_rules($normalized);
            if (is_wp_error($media_check)) {
                return $media_check;
            }

            $status = isset($payload['status']) ? sanitize_key((string) $payload['status']) : '';
            if ($status !== '' && in_array($status, self::STATUSES, true)) {
                $normalized['status'] = $status;
            }

            $normalized['vcFormat'] = self::normalize_enum_list($payload['vcFormat'] ?? array(), self::VC_FORMATS);
            $presentation = self::normalize_enum_list($payload['presentationProtocols'] ?? array(), self::PRESENTATION_PROTOCOLS);
            if ($action === 'update') {
                $existing = self::find_catalog_item($item_id);
                if (is_array($existing) && ! empty($existing['presentationProtocols']) && is_array($existing['presentationProtocols'])) {
                    foreach ($existing['presentationProtocols'] as $legacy) {
                        $legacy = is_string($legacy) ? trim($legacy) : '';
                        if ($legacy === '' || in_array($legacy, $presentation, true)) {
                            continue;
                        }
                        if (! in_array($legacy, self::PRESENTATION_PROTOCOLS, true)) {
                            $presentation[] = sanitize_text_field($legacy);
                        }
                    }
                }
            }
            if (! empty($presentation)) {
                $normalized['presentationProtocols'] = $presentation;
            }

            $normalized['interoperabilityProfiles'] = self::normalize_enum_list(
                $payload['interoperabilityProfiles'] ?? array(),
                self::interop_profile_short_names()
            );

            $supported_wallets = self::normalize_supported_wallets($payload['supportedWallets'] ?? array());
            if (! empty($supported_wallets)) {
                $normalized['supportedWallets'] = $supported_wallets;
            }

            $accepted_refs = self::normalize_accepted_credential_refs($payload['acceptedCredentialRefs'] ?? array());
            if (! empty($accepted_refs)) {
                $normalized['acceptedCredentialRefs'] = $accepted_refs;
                $normalized['acceptedCredentials']  = self::derive_accepted_credential_labels($accepted_refs);
            }

            $features = self::normalize_string_list($payload['features'] ?? array());
            if (! empty($features)) {
                $normalized['features'] = $features;
            }

            $languages = self::normalize_string_list($payload['languages'] ?? array());
            if (! empty($languages)) {
                $normalized['languages'] = $languages;
            } elseif ($action === 'update') {
                $existing = self::find_catalog_item($item_id);
                if (is_array($existing) && ! empty($existing['languages'])) {
                    $existing_languages = self::normalize_string_list($existing['languages']);
                    if (! empty($existing_languages)) {
                        $normalized['languages'] = $existing_languages;
                    }
                }
            }

            return self::strip_empty_rp_fields($normalized);
        }

        /**
         * @param array<string, mixed> $payload Normalized payload.
         * @return array<string, mixed>
         */
        public static function payload_to_export(array $payload) {
            if (isset($payload['item_id'])) {
                unset($payload['item_id']);
            }

            $org_id = isset($payload['orgId']) ? sanitize_text_field((string) $payload['orgId']) : '';
            $rp_id  = isset($payload['id']) ? sanitize_text_field((string) $payload['id']) : '';

            $rp = array();
            foreach (self::RP_PAYLOAD_KEYS as $key) {
                if (! array_key_exists($key, $payload)) {
                    continue;
                }
                $value = $payload[ $key ];
                if ($value === '' || $value === array() || $value === null) {
                    continue;
                }
                $rp[ $key ] = $value;
            }

            if ($rp_id !== '') {
                $use_cases = self::derive_use_cases_from_catalog($rp_id);
                if (! empty($use_cases)) {
                    $rp['useCases'] = $use_cases;
                }
            }

            if (isset($rp['media']) && is_array($rp['media'])) {
                $media = Fides_RP_Catalog_Media_Normalizer::normalize_media($rp);
                if ($media !== array()) {
                    $rp['media'] = $media;
                } else {
                    unset($rp['media']);
                }
            }

            if (! isset($rp['id']) && $rp_id !== '') {
                $rp['id'] = $rp_id;
            }

            return array(
                '$schema'       => self::SCHEMA,
                'orgId'         => $org_id,
                'relyingParties' => array($rp),
                'lastUpdated'   => gmdate(DATE_ATOM),
            );
        }

        /**
         * @param array<string, mixed> $item Aggregated RP item.
         * @return array<string, mixed>
         */
        public static function catalog_item_to_payload(array $item) {
            $payload = array(
                'orgId' => isset($item['orgId']) ? (string) $item['orgId'] : '',
                'id'    => isset($item['id']) ? (string) $item['id'] : '',
            );

            foreach (self::RP_PAYLOAD_KEYS as $key) {
                if (in_array($key, array('id', 'useCases', 'acceptedCredentials'), true) || ! array_key_exists($key, $item)) {
                    continue;
                }
                $value = $item[ $key ];
                if ($value === '' || $value === array() || $value === null) {
                    continue;
                }
                $payload[ $key ] = $value;
            }

            if (isset($item['supportedWallets'])) {
                $payload['supportedWallets'] = self::normalize_supported_wallets($item['supportedWallets']);
            }
            if (isset($item['acceptedCredentialRefs'])) {
                $payload['acceptedCredentialRefs'] = self::normalize_accepted_credential_refs($item['acceptedCredentialRefs']);
            }

            $media = Fides_RP_Catalog_Media_Normalizer::normalize_media($item);
            if ($media !== array()) {
                $payload['media'] = $media;
            }

            return self::prepare_payload_for_diff($payload);
        }

        /**
         * @param array<string, mixed> $payload Submission or catalog payload.
         * @return array<string, mixed>
         */
        public static function prepare_payload_for_diff(array $payload) {
            return self::strip_empty_rp_fields($payload);
        }

        /**
         * Reverse-link use case titles from the published use case catalog.
         *
         * @param string $rp_id RP catalog id.
         * @return string[]
         */
        public static function derive_use_cases_from_catalog($rp_id) {
            $rp_id = sanitize_text_field(trim((string) $rp_id));
            if ($rp_id === '') {
                return array();
            }

            $items = self::use_cases_from_catalog();
            $out   = array();
            foreach ($items as $use_case) {
                if (! is_array($use_case)) {
                    continue;
                }
                $links = isset($use_case['links']) && is_array($use_case['links']) ? $use_case['links'] : array();
                $rps   = isset($links['rps']) && is_array($links['rps']) ? $links['rps'] : array();
                $match = false;
                foreach ($rps as $link) {
                    if (! is_array($link)) {
                        continue;
                    }
                    $ref = isset($link['refId']) ? trim((string) $link['refId']) : '';
                    if ($ref !== '' && $ref === $rp_id) {
                        $match = true;
                        break;
                    }
                }
                if (! $match) {
                    continue;
                }
                $title = isset($use_case['title']) ? trim(sanitize_text_field((string) $use_case['title'])) : '';
                if ($title === '') {
                    $title = isset($use_case['id']) ? trim(sanitize_text_field((string) $use_case['id'])) : '';
                }
                if ($title !== '' && ! in_array($title, $out, true)) {
                    $out[] = $title;
                }
            }
            return $out;
        }

        /**
         * @return array<int, array<string, mixed>>
         */
        private static function use_cases_from_catalog() {
            static $cache = null;
            if ($cache !== null) {
                return $cache;
            }

            $url = apply_filters('fides_rp_submission_use_case_aggregated_url', self::USE_CASE_AGGREGATED_URL);
            $json = self::cached_remote_json((string) $url);
            if (! is_array($json) || ! isset($json['useCases']) || ! is_array($json['useCases'])) {
                $cache = array();
                return $cache;
            }
            $cache = $json['useCases'];
            return $cache;
        }

        /**
         * @return array<int, array{shortName: string, name: string}>
         */
        private static function interop_profiles_from_catalog() {
            static $cache = null;
            if ($cache !== null) {
                return $cache;
            }

            $url  = apply_filters('fides_rp_submission_interop_aggregated_url', self::INTEROP_AGGREGATED_URL);
            $json = self::cached_remote_json((string) $url);
            $out  = array();
            if (is_array($json) && isset($json['profiles']) && is_array($json['profiles'])) {
                foreach ($json['profiles'] as $row) {
                    if (! is_array($row) || ! isset($row['profile']) || ! is_array($row['profile'])) {
                        continue;
                    }
                    $short = isset($row['profile']['shortName']) ? trim((string) $row['profile']['shortName']) : '';
                    $name  = isset($row['profile']['name']) ? trim((string) $row['profile']['name']) : $short;
                    if ($short === '') {
                        continue;
                    }
                    $out[] = array(
                        'shortName' => $short,
                        'name'      => $name,
                    );
                }
            }
            $cache = $out;
            return $cache;
        }

        /**
         * @param string $url Remote JSON URL.
         * @return array<string, mixed>|null
         */
        private static function cached_remote_json($url) {
            $url = esc_url_raw(trim((string) $url));
            if ($url === '') {
                return null;
            }
            if (class_exists('Fides_Catalog_Aggregated_Loader')) {
                return Fides_Catalog_Aggregated_Loader::fetch_json_url($url);
            }
            $cache_key = 'fides_rp_sub_' . md5($url);
            $cached    = get_transient($cache_key);
            if (is_array($cached)) {
                return $cached;
            }
            $response = wp_remote_get($url, array('timeout' => 15));
            if (is_wp_error($response)) {
                return null;
            }
            $body = wp_remote_retrieve_body($response);
            $json = json_decode((string) $body, true);
            if (! is_array($json)) {
                return null;
            }
            set_transient($cache_key, $json, 10 * MINUTE_IN_SECONDS);
            return $json;
        }

        /**
         * @param mixed $raw Supported wallets from form or catalog.
         * @return array<int, array{name: string, walletCatalogId?: string}>
         */
        private static function normalize_supported_wallets($raw) {
            if (! is_array($raw)) {
                return array();
            }
            $out = array();
            foreach ($raw as $entry) {
                if (is_string($entry)) {
                    $name = sanitize_text_field(trim($entry));
                    if ($name !== '') {
                        $out[] = array('name' => $name);
                    }
                    continue;
                }
                if (! is_array($entry)) {
                    continue;
                }
                $name = isset($entry['name']) ? sanitize_text_field(trim((string) $entry['name'])) : '';
                if ($name === '' && isset($entry['labelRaw'])) {
                    $name = sanitize_text_field(trim((string) $entry['labelRaw']));
                }
                if ($name === '') {
                    continue;
                }
                $row = array('name' => $name);
                $wid = isset($entry['walletCatalogId']) ? sanitize_text_field(trim((string) $entry['walletCatalogId'])) : '';
                if ($wid === '' && isset($entry['refId'])) {
                    $wid = sanitize_text_field(trim((string) $entry['refId']));
                }
                if ($wid !== '' && preg_match('/^[a-z0-9-]+$/', $wid)) {
                    $row['walletCatalogId'] = $wid;
                }
                $out[] = $row;
            }
            return $out;
        }

        /**
         * @param mixed $raw Credential refs from form or catalog.
         * @return array<int, array{credentialCatalogId: string}>
         */
        private static function normalize_accepted_credential_refs($raw) {
            if (! is_array($raw)) {
                return array();
            }
            $out = array();
            foreach ($raw as $entry) {
                if (is_string($entry)) {
                    $id = trim($entry);
                } elseif (is_array($entry)) {
                    $id = isset($entry['credentialCatalogId']) ? trim((string) $entry['credentialCatalogId']) : '';
                    if ($id === '' && isset($entry['refId'])) {
                        $id = trim((string) $entry['refId']);
                    }
                } else {
                    continue;
                }
                if ($id === '' || strpos($id, 'cred:') !== 0) {
                    continue;
                }
                if (! preg_match('/^cred:[A-Za-z0-9:._-]+$/', $id)) {
                    continue;
                }
                $row = array('credentialCatalogId' => $id);
                if (! in_array($row, $out, true)) {
                    $out[] = $row;
                }
            }
            return $out;
        }

        /**
         * @param array<int, array{credentialCatalogId: string}> $refs Credential refs.
         * @return string[]
         */
        private static function derive_accepted_credential_labels(array $refs) {
            $labels = array();
            foreach ($refs as $ref) {
                if (! is_array($ref) || empty($ref['credentialCatalogId'])) {
                    continue;
                }
                $id = (string) $ref['credentialCatalogId'];
                $label = $id;
                if (class_exists('Fides_Catalog_Source') && class_exists('Fides_Catalog_Registry') && Fides_Catalog_Registry::exists('credential')) {
                    $source = Fides_Catalog_Source::for('credential');
                    if ($source) {
                        $item = $source->find_by_id($id);
                        if (is_array($item) && ! empty($item['name'])) {
                            $label = (string) $item['name'];
                        }
                    }
                }
                if ($label !== '' && ! in_array($label, $labels, true)) {
                    $labels[] = $label;
                }
            }
            return $labels;
        }

        /**
         * @param string $rp_id RP catalog id.
         * @return array<string, mixed>|null
         */
        private static function find_catalog_item($rp_id) {
            if (class_exists('Fides_Catalog_Submission_Lookups')) {
                $item = Fides_Catalog_Submission_Lookups::find_item_by_id(self::TYPE, $rp_id);
                if (is_array($item)) {
                    return $item;
                }
            }
            return null;
        }

        /**
         * @param string $org_id org:slug.
         * @return bool
         */
        private static function organization_exists($org_id) {
            if (! class_exists('Fides_Catalog_Source') || ! class_exists('Fides_Catalog_Registry')) {
                return true;
            }
            if (! Fides_Catalog_Registry::exists('organization')) {
                return true;
            }
            $source = Fides_Catalog_Source::for('organization');
            if (! $source) {
                return true;
            }
            return is_array($source->find_by_id($org_id));
        }

        /**
         * @param string $raw Country code.
         * @return string
         */
        private static function normalize_country($raw) {
            $raw = strtoupper(trim((string) $raw));
            if ($raw === 'EU') {
                return 'EU';
            }
            if (preg_match('/^[A-Z]{2}$/', $raw)) {
                return $raw;
            }
            return '';
        }

        /**
         * @param array<string, mixed> $payload Payload.
         * @param string               $key     Field key.
         * @return string
         */
        private static function optional_url(array $payload, $key) {
            if (! isset($payload[ $key ])) {
                return '';
            }
            $raw = trim((string) $payload[ $key ]);
            if ($raw === '') {
                return '';
            }
            return esc_url_raw($raw);
        }

        /**
         * @param mixed        $raw     Raw list.
         * @param string[]     $allowed Allowed values.
         * @return string[]
         */
        private static function normalize_enum_list($raw, array $allowed) {
            $values = is_array($raw) ? $raw : explode(',', (string) $raw);
            $out    = array();
            foreach ($values as $value) {
                $value = is_string($value) ? trim($value) : '';
                if ($value === '' || ! in_array($value, $allowed, true) || in_array($value, $out, true)) {
                    continue;
                }
                $out[] = $value;
            }
            return $out;
        }

        /**
         * @param mixed $raw Raw list or comma-separated string.
         * @return string[]
         */
        private static function normalize_string_list($raw) {
            $values = is_array($raw) ? $raw : explode(',', (string) $raw);
            $out    = array();
            foreach ($values as $value) {
                $value = sanitize_text_field(trim((string) $value));
                if ($value === '' || in_array($value, $out, true)) {
                    continue;
                }
                $out[] = $value;
            }
            return $out;
        }

        /**
         * @param array<string, mixed> $payload Payload with metadata keys.
         * @return array<string, mixed>
         */
        private static function strip_empty_rp_fields(array $payload) {
            foreach (array('vcFormat', 'presentationProtocols', 'interoperabilityProfiles', 'supportedWallets', 'acceptedCredentialRefs', 'acceptedCredentials', 'features', 'languages') as $list_key) {
                if (isset($payload[ $list_key ]) && $payload[ $list_key ] === array()) {
                    unset($payload[ $list_key ]);
                }
            }
            if (isset($payload['media']) && $payload['media'] === array()) {
                unset($payload['media']);
            }
            return $payload;
        }
    }
}
