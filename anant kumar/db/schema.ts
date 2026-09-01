import {
  pgTable,
  text,
  serial,
  timestamp,
  boolean,
  integer,
  uuid,
  jsonb,
  vector,
  index,
  pgEnum,
  primaryKey
} from 'drizzle-orm/pg-core';

// --- ENUMS ---
export const visibilityEnum = pgEnum('visibility', ['PUBLIC', 'INTERNAL', 'PRIVATE']);
export const statusEnum = pgEnum('status', ['VERIFIED', 'PENDING', 'CONFLICTED', 'REJECTED']);
export const attributionEnum = pgEnum('attribution', [
  'ANANT_ONLY',
  'JOINT',
  'SHIVAM_ONLY',
  'COMPANY',
  'CLIENT',
  'RESEARCH_COLLABORATION'
]);
export const sourceTierEnum = pgEnum('source_tier', [
  'TIER_1', // First-party Anant sources
  'TIER_2', // Official product/company sources
  'TIER_3', // University/publisher/patent/conference
  'TIER_4', // Professional profiles
  'TIER_5'  // General web sources
]);

// --- PROVENANCE & KNOWLEDGE FOUNDATION ---
export const knowledgeVersions = pgTable('knowledge_versions', {
  id: serial('id').primaryKey(),
  versionNumber: integer('version_number').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sources = pgTable('sources', {
  id: serial('id').primaryKey(),
  url: text('url').notNull().unique(),
  title: text('title'),
  tier: sourceTierEnum('tier').notNull(),
  hash: text('hash'),
  lastCrawledAt: timestamp('last_crawled_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const claims = pgTable('claims', {
  id: uuid('id').defaultRandom().primaryKey(),
  subject: text('subject').notNull(),
  predicate: text('predicate').notNull(),
  objectValue: text('object_value').notNull(),
  status: statusEnum('status').default('PENDING').notNull(),
  visibility: visibilityEnum('visibility').default('PUBLIC').notNull(),
  confidence: integer('confidence').default(100), // 0-100
  validFrom: timestamp('valid_from'),
  validUntil: timestamp('valid_until'),
  lastVerifiedAt: timestamp('last_verified_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const claimSources = pgTable('claim_sources', {
  claimId: uuid('claim_id').references(() => claims.id, { onDelete: 'cascade' }),
  sourceId: integer('source_id').references(() => sources.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.claimId, t.sourceId] }),
}));

export const conflicts = pgTable('conflicts', {
  id: serial('id').primaryKey(),
  claimId: uuid('claim_id').references(() => claims.id),
  description: text('description').notNull(),
  resolved: boolean('resolved').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const verificationQueue = pgTable('verification_queue', {
  id: serial('id').primaryKey(),
  claimId: uuid('claim_id').references(() => claims.id),
  actionRequired: text('action_required').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- DOCUMENTS & EMBEDDINGS (RAG) ---
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  sourceId: integer('source_id').references(() => sources.id),
  title: text('title'),
  assetUrl: text('asset_url'), // Cloudinary URL
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documentChunks = pgTable('document_chunks', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: integer('document_id').references(() => documents.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }),
}, (table) => ({
  embeddingIndex: index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
}));

// --- DOMAIN ENTITIES (Portfolio Data) ---
export const profile = pgTable('profile', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  alias: text('alias'),
  title: text('title'),
  email: text('email'),
  phone: text('phone'),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  tagline: text('tagline'),
  description: text('description'),
  tags: jsonb('tags').$type<string[]>(),
  tier: integer('tier'),
  liveUrl: text('live_url'),
  githubUrl: text('github_url'),
  attribution: attributionEnum('attribution').default('ANANT_ONLY'),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id),
  name: text('name').notNull(),
  status: text('status'),
});

export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url'),
});

export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type'),
});

export const experience = pgTable('experience', {
  id: serial('id').primaryKey(),
  companyId: integer('company_id').references(() => companies.id),
  role: text('role').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
});

export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  institution: text('institution').notNull(),
  degree: text('degree'),
  field: text('field'),
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category'),
});

export const certifications = pgTable('certifications', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  issuer: text('issuer'),
  url: text('url'),
});

export const research = pgTable('research', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  attribution: attributionEnum('attribution').default('ANANT_ONLY'),
});

export const patents = pgTable('patents', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  status: text('status'),
});

export const publications = pgTable('publications', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  publisher: text('publisher'),
});

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  url: text('url'),
  attribution: attributionEnum('attribution').default('ANANT_ONLY'),
});

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  projectTitle: text('project_title'),
  attribution: attributionEnum('attribution').default('ANANT_ONLY'),
});

export const revenue = pgTable('revenue', {
  id: serial('id').primaryKey(),
  entityType: text('entity_type').notNull(), // 'client', 'product'
  entityId: integer('entity_id'),
  amount: text('amount'),
  timeframe: text('timeframe'),
});

export const people = pgTable('people', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role'),
});

export const relationships = pgTable('relationships', {
  id: serial('id').primaryKey(),
  person1Id: integer('person1_id').references(() => people.id),
  person2Id: integer('person2_id').references(() => people.id),
  type: text('type').notNull(), // 'co-founder', 'co-author'
});

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  entityType: text('entity_type').notNull(),
  entityId: integer('entity_id'),
  url: text('url').notNull(),
  label: text('label'),
});

// --- OBSERVABILITY ---
export const queryLogs = pgTable('query_logs', {
  id: serial('id').primaryKey(),
  query: text('query').notNull(),
  response: text('response'),
  tokens: integer('tokens'),
  latencyMs: integer('latency_ms'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  queryLogId: integer('query_log_id').references(() => queryLogs.id),
  isAccurate: boolean('is_accurate'),
  issueReport: text('issue_report'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const evaluations = pgTable('evaluations', {
  id: serial('id').primaryKey(),
  benchmarkVersion: text('benchmark_version').notNull(),
  score: integer('score'), // 0-100
  metrics: jsonb('metrics'),
  createdAt: timestamp('created_at').defaultNow(),
});
