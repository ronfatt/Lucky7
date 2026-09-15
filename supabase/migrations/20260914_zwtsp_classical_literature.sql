-- ======================================================================
-- ZWTSP V1.0: Phase 6.2 - Classical Metaphysics Literature Knowledge Base
-- Canon Collections: Liu Jin-Fu, Cai Ming-Hong, Mei Hua Yi Shu, Flying Stars
-- ======================================================================

-- 1. Table: classical_literature
CREATE TABLE IF NOT EXISTS classical_literature (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(128) NOT NULL,
  lineage VARCHAR(64) NOT NULL,
  lineage_name VARCHAR(64) NOT NULL,
  page_count INTEGER NOT NULL DEFAULT 0,
  file_name VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  core_theories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: literature_chapters
CREATE TABLE IF NOT EXISTS literature_chapters (
  id VARCHAR(64) PRIMARY KEY,
  literature_id VARCHAR(64) REFERENCES classical_literature(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  key_quotes TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}'
);

-- 3. Table: literature_citations
CREATE TABLE IF NOT EXISTS literature_citations (
  id VARCHAR(64) PRIMARY KEY,
  source_literature_id VARCHAR(64) REFERENCES classical_literature(id) ON DELETE CASCADE,
  chapter_title VARCHAR(255),
  original_quote TEXT NOT NULL,
  metaphysical_interpretation TEXT NOT NULL,
  applied_aspect VARCHAR(32) NOT NULL,
  related_digits INTEGER[] DEFAULT '{}',
  related_elements TEXT[] DEFAULT '{}',
  related_transformations TEXT[] DEFAULT '{}'
);

-- 4. Table: flying_star_sihua_patterns
CREATE TABLE IF NOT EXISTS flying_star_sihua_patterns (
  id VARCHAR(64) PRIMARY KEY,
  from_palace VARCHAR(32) NOT NULL,
  sihua_type VARCHAR(16) NOT NULL,
  sihua_name VARCHAR(16) NOT NULL,
  to_palace VARCHAR(32) NOT NULL,
  canonical_meaning TEXT NOT NULL,
  number_implication TEXT NOT NULL,
  source_literature VARCHAR(128) NOT NULL
);

-- Indexes for rapid lookup
CREATE INDEX IF NOT EXISTS idx_literature_lineage ON classical_literature(lineage);
CREATE INDEX IF NOT EXISTS idx_citations_aspect ON literature_citations(applied_aspect);
CREATE INDEX IF NOT EXISTS idx_sihua_from_to ON flying_star_sihua_patterns(from_palace, to_palace, sihua_type);
