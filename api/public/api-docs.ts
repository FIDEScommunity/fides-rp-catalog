import type { VercelRequest, VercelResponse } from '@vercel/node';

const spec = {
  openapi: '3.1.0',
  info: {
    title: 'FIDES Relying Party Catalog API',
    version: '1.0.0',
    description:
      'Public API for querying relying parties (verifier websites and services that accept verifiable credentials) in the FIDES ecosystem.',
  },
  servers: [{ url: '/api/public' }],
  paths: {
    '/rp': {
      get: {
        summary: 'List relying parties',
        operationId: 'listRelyingParties',
        parameters: [
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description:
              'Search by name, id, description, provider name, website, or accepted credentials',
          },
          {
            name: 'country',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by ISO 3166-1 alpha-2 country code',
          },
          {
            name: 'orgId',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by owning organization id (e.g. org:air-new-zealand)',
          },
          {
            name: 'readiness',
            in: 'query',
            schema: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['technical-demo', 'use-case-demo', 'production-pilot', 'production'],
              },
            },
            description:
              'Filter by readiness level. Repeat the parameter to match any selected value (OR semantics).',
          },
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'array',
              items: { type: 'string', enum: ['development', 'beta', 'live', 'deprecated'] },
            },
            description: 'Filter by operational status (OR semantics).',
          },
          {
            name: 'interactionMode',
            in: 'query',
            schema: { type: 'string', enum: ['proximity', 'remote', 'both'] },
            description: 'Filter by interaction mode',
          },
          {
            name: 'sector',
            in: 'query',
            schema: {
              type: 'array',
              items: {
                type: 'string',
                enum: [
                  'public_sector',
                  'finance',
                  'trade',
                  'supply_chain',
                  'manufacturing',
                  'energy',
                  'agriculture',
                  'food',
                  'retail',
                  'healthcare',
                  'education',
                  'construction',
                  'mobility',
                  'digital',
                ],
              },
            },
            description: 'Filter by sector code (OR semantics).',
          },
          {
            name: 'vcFormat',
            in: 'query',
            schema: {
              type: 'array',
              items: {
                type: 'string',
                enum: [
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
                ],
              },
            },
            description: 'Filter by accepted credential format (OR semantics).',
          },
          {
            name: 'interoperabilityProfile',
            in: 'query',
            schema: { type: 'array', items: { type: 'string' } },
            description: 'Filter by interoperability profile (OR semantics).',
          },
          {
            name: 'featured',
            in: 'query',
            schema: { type: 'boolean' },
            description: 'When true, only return featured relying parties',
          },
          {
            name: 'sort',
            in: 'query',
            schema: { type: 'string', enum: ['name', 'readiness', 'country', 'updatedAt'], default: 'name' },
          },
          {
            name: 'direction',
            in: 'query',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
          },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 0 } },
          { name: 'size', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          '200': {
            description: 'Paginated list of relying parties',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    content: { type: 'array', items: { $ref: '#/components/schemas/RelyingParty' } },
                    totalElements: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    number: { type: 'integer' },
                    size: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/rp/{id}': {
      get: {
        summary: 'Get relying party by id',
        operationId: 'getRelyingPartyById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Relying party catalog id (URL-encoded when needed)',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Relying party',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RelyingParty' },
              },
            },
          },
          '404': {
            description: 'Not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      RPProvider: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          did: { type: 'string' },
          website: { type: 'string', format: 'uri' },
          logo: { type: 'string', format: 'uri' },
          contact: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              support: { type: 'string' },
            },
          },
        },
      },
      AcceptedCredentialRef: {
        type: 'object',
        required: ['credentialCatalogId'],
        properties: {
          credentialCatalogId: { type: 'string', example: 'cred:pid' },
        },
      },
      SupportedWallet: {
        oneOf: [
          { type: 'string' },
          {
            type: 'object',
            required: ['name'],
            properties: {
              name: { type: 'string' },
              walletCatalogId: { type: 'string' },
            },
          },
        ],
      },
      RelyingParty: {
        type: 'object',
        required: ['id', 'name', 'readiness', 'interactionMode', 'orgId'],
        properties: {
          id: { type: 'string', example: 'air-new-zealand' },
          name: { type: 'string' },
          description: { type: 'string' },
          logo: { type: 'string', format: 'uri' },
          website: { type: 'string', format: 'uri' },
          readiness: {
            type: 'string',
            enum: ['technical-demo', 'use-case-demo', 'production-pilot', 'production'],
          },
          interactionMode: { type: 'string', enum: ['proximity', 'remote', 'both'] },
          status: { type: 'string', enum: ['development', 'beta', 'live', 'deprecated'] },
          sectors: { type: 'array', items: { type: 'string' } },
          useCases: { type: 'array', items: { type: 'string' } },
          acceptedCredentials: { type: 'array', items: { type: 'string' } },
          acceptedCredentialRefs: {
            type: 'array',
            items: { $ref: '#/components/schemas/AcceptedCredentialRef' },
          },
          vcFormat: { type: 'array', items: { type: 'string' } },
          presentationProtocols: { type: 'array', items: { type: 'string' } },
          interoperabilityProfiles: { type: 'array', items: { type: 'string' } },
          supportedWallets: {
            type: 'array',
            items: { $ref: '#/components/schemas/SupportedWallet' },
          },
          features: { type: 'array', items: { type: 'string' } },
          documentation: { type: 'string', format: 'uri' },
          testCredentials: { type: 'string' },
          apiEndpoint: { type: 'string', format: 'uri' },
          video: { type: 'string', format: 'uri' },
          country: { type: 'string' },
          countries: { type: 'array', items: { type: 'string' } },
          languages: { type: 'array', items: { type: 'string' } },
          isFeatured: { type: 'boolean' },
          orgId: { type: 'string', example: 'org:air-new-zealand' },
          provider: { $ref: '#/components/schemas/RPProvider' },
          updatedAt: { type: 'string', format: 'date-time' },
          firstSeenAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};

export default function handler(_req: VercelRequest, res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');
  res.status(200).json(spec);
}
