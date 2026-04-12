import Ajv, { type ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'node:fs/promises';
import yaml from 'js-yaml';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface OpenApiOperation {
  responses?: Record<string, unknown>;
}

interface OpenApiDocument {
  components?: Record<string, unknown>;
  paths: Record<string, Partial<Record<HttpMethod, OpenApiOperation>>>;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, '../../swagger.yaml');

let cachedSpec: Promise<OpenApiDocument> | undefined;
const validators = new Map<string, ValidateFunction>();

const ajv = new Ajv({
  allErrors: true,
  strict: false,
});
addFormats(ajv);

const normalizeNullable = (schema: unknown): unknown => {
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    return schema;
  }

  const record = schema as Record<string, unknown>;
  const cloned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record)) {
    if (key === 'nullable') {
      continue;
    }

    if (Array.isArray(value)) {
      cloned[key] = value.map((item) => normalizeNullable(item));
      continue;
    }

    cloned[key] = normalizeNullable(value);
  }

  if (record.nullable === true) {
    return {
      anyOf: [cloned, { type: 'null' }],
    };
  }

  return cloned;
};

export const loadSpec = async () => {
  cachedSpec ??= fs
    .readFile(schemaPath, 'utf-8')
    .then((source) => normalizeNullable(yaml.load(source) as OpenApiDocument) as OpenApiDocument);
  return cachedSpec;
};

const buildValidator = async (
  pathKey: string,
  method: HttpMethod,
  status: number,
) => {
  const spec = await loadSpec();
  const operation = spec.paths[pathKey]?.[method];
  if (!operation) {
    throw new Error(`Operation is not found: ${method.toUpperCase()} ${pathKey}`);
  }

  const response =
    operation.responses?.[String(status)] ?? operation.responses?.default;
  if (!response || typeof response !== 'object') {
    return undefined;
  }

  const content = (response as Record<string, unknown>).content as
    | Record<string, { schema?: unknown }>
    | undefined;
  const schema =
    content?.['application/json']?.schema ?? content?.['application/problem+json']?.schema;

  if (!schema) {
    return undefined;
  }

  return ajv.compile({
    ...(schema as Record<string, unknown>),
    components: spec.components,
  });
};

export const assertResponseMatchesSpec = async (params: {
  pathKey: string;
  method: HttpMethod;
  status: number;
  body: unknown;
}) => {
  const cacheKey = `${params.method}:${params.pathKey}:${params.status}`;
  let validator = validators.get(cacheKey);
  if (!validator) {
    const compiled = await buildValidator(params.pathKey, params.method, params.status);
    if (!compiled) {
      return;
    }
    validators.set(cacheKey, compiled);
    validator = compiled;
  }

  const valid = validator(params.body);
  if (!valid) {
    throw new Error(
      `Response schema mismatch for ${params.method.toUpperCase()} ${params.pathKey} ${params.status}: ${ajv.errorsText(
        validator.errors,
        { separator: '\n' },
      )}`,
    );
  }
};
