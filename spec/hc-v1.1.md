# HyperContext (HC) Standard v1.1 - Full Specification

## Overview

HyperContext (HC) is an open standard for creating portable AI context that works across all LLM platforms. HC files are valid HTML5 documents containing embedded JSON metadata and LLM instructions, enabling both human readability and machine executability.

## Core Principles

### The Three Laws

1. **Container Law**: "Every HC file MUST be valid HTML5"
   - Renders correctly in any web browser
   - Viewable and understandable by humans
   - No special software required

2. **Hidden Brain Law**: "Every HC file MUST contain embedded LLM instructions"
   - JSON metadata in script blocks
   - Step-by-step instructions for AI agents
   - Self-documenting execution logic

3. **Linkage Law**: "Every HC file MUST support referencing and being referenced"
   - Unique artifact identifiers
   - URL-addressable resources
   - Composable context stacking

## File Structure

### Required Blocks

#### 1. Schema.org JSON-LD

Standard SEO metadata for search engines and web crawlers.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "name": "Document Title",
  "version": "1.0.0",
  "datePublished": "2024-02-08",
  "author": {
    "@type": "Organization",
    "name": "Author Name"
  }
}
</script>
```

#### 2. HC Metadata Block

Operational metadata for AI agents.

```html
<script type="application/json" id="hc-metadata">
{
  "hc_version": "1.1",
  "hc_type": "skill",
  "artifact_id": "hc-skill-example-20240208",
  "version": "1.0.0",
  "content_hash": "sha256:...",
  "metadata_hash": "sha256:...",
  "created": "2024-02-08T00:00:00Z",
  "updated": "2024-02-08T00:00:00Z",
  "classification": {
    "category": "content-creation",
    "subcategory": "newsletters",
    "tags": ["writing", "automation"]
  },
  "summary": "50-100 token description of what this artifact does"
}
</script>
```

**Required Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `hc_version` | string | Must be "1.1" |
| `hc_type` | string | One of: registry, skill, artifact, identity, framework |
| `artifact_id` | string | Unique identifier, format: `hc-[type]-[slug]-[timestamp]` |
| `version` | string | Semantic version (1.0.0) |
| `created` | string | ISO 8601 timestamp |
| `updated` | string | ISO 8601 timestamp |
| `summary` | string | 50-100 token description |

**Optional Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `content_hash` | string | SHA-256 of #hc-human-docs content |
| `metadata_hash` | string | SHA-256 of hc-metadata (excluding hashes) |
| `classification` | object | Category, subcategory, tags |

#### 3. LLM Instructions Block

Step-by-step instructions for AI agents.

```html
<script type="text/plain" id="hc-instructions">
## AI Agent Instructions

### Prerequisites
- Load Neural Registry if referenced
- Verify required inputs are available

### Step 1: [Action Name]
Detailed instructions...

### Step 2: [Action Name]
Detailed instructions...

### Output Format
Description of expected output format...

### Quality Gates
- Validation rule 1
- Validation rule 2
</script>
```

#### 4. Human Documentation

Visible content rendered in the browser.

```html
<div id="hc-human-docs">
  <h1>Document Title</h1>
  <p>Human-readable documentation...</p>
</div>
```

### Optional Blocks

#### YAML Frontmatter

Human-readable metadata summary.

```html
<script type="text/yaml" id="hc-frontmatter">
---
title: Document Title
author: Author Name
status: published
---
</script>
```

#### Self-Executing Config (Skills Only)

Enables autonomous skill execution.

```html
<script type="application/json" id="mastery-agent-config">
{
  "agent_id": "skill-newsletter-v1",
  "execution_mode": "interactive",
  "requires_approval": true,
  "output_format": "hc-artifact",
  "max_iterations": 5,
  "quality_threshold": 8.0
}
</script>
```

#### Self-Executing Knowledge (Skills Only)

Structured skill parameters.

```html
<template id="mastery-agent-knowledge">
---
skill_purpose: "Generate newsletters from input content"
inputs_required:
  - name: "content"
    type: "string"
    required: true
  - name: "tone"
    type: "string"
    required: false
    default: "professional"
quality_gates:
  - "Output must be valid HTML"
  - "Word count between 500-2000"
---
</template>
```

## Canonical Types

### Registry

Neural Registry - indexes and routes to HC artifacts.

- Contains artifact catalog with links
- Provides `/registry.json` endpoint for token-efficient loading
- Serves as entry point for context discovery

### Skill

Single-purpose transformation tool.

- Takes specific inputs, produces specific outputs
- Self-executing when properly configured
- Reusable across contexts

### Artifact

Generated output or content.

- Created by skills or manual authoring
- Represents completed work product
- Can reference source skill/framework

### Identity

Voice and style context.

- Defines persona characteristics
- Sets tone, vocabulary, communication style
- Applied across multiple outputs for consistency

### Framework

Methodology or specification.

- Defines processes and standards
- Provides reusable patterns
- Documents best practices

## Neural Registry Format

### HTML Registry Page

The main registry page is an HC file of type "registry" containing an artifact catalog.

### registry.json Endpoint

Token-optimized machine-readable index.

```json
{
  "hc_version": "1.1",
  "registry_id": "ideas-asapai-net",
  "name": "Zargoth's Neural Registry",
  "updated": "2024-02-08T00:00:00Z",
  "artifacts": [
    {
      "id": "hc-skill-substack-toc-20240208",
      "type": "skill",
      "name": "Substack TOC Generator",
      "url": "https://ideas.asapai.net/substack-toc",
      "summary": "Generates table of contents for Substack articles",
      "category": "content-creation",
      "tags": ["substack", "toc", "writing"]
    },
    {
      "id": "hc-identity-zargoth-v1",
      "type": "identity",
      "name": "Foreman Zargoth",
      "url": "https://ideas.asapai.net/identity-zargoth-v1",
      "summary": "Gritty space mining supervisor persona",
      "category": "voice",
      "tags": ["persona", "roleplay"]
    }
  ]
}
```

## Token Economics

### Loading Strategy

1. **Registry Scan** (~100 tokens): Fetch `/registry.json` to discover available artifacts
2. **Selective Load** (~3,000 tokens/artifact): Load only needed artifacts
3. **Maximum Recommendation**: 3 artifacts per session (~10,200 tokens)

### Comparison

| Approach | Tokens | Efficiency |
|----------|--------|------------|
| Lazy loading (HC) | ~10,200 | Baseline |
| Bulk loading (old) | ~250,000 | 96% worse |

## File Naming Convention

Pattern: `[type]-[slug]-v[version].html`

Examples:
- `skill-newsletter-writer-v1.html`
- `registry-dashboard-v1.html`
- `identity-zargoth-v1.html`
- `framework-hc-standard-v1.1.html`

## Validation Checklist

- [ ] Valid HTML5 structure (passes W3C validator)
- [ ] Contains `#hc-metadata` with all required fields
- [ ] Contains `#hc-instructions` with execution steps
- [ ] Contains `#hc-human-docs` with visible content
- [ ] Unique `artifact_id` following naming convention
- [ ] Valid ISO 8601 timestamps
- [ ] Summary is 50-100 tokens
- [ ] Renders correctly in browser
- [ ] LLM can parse and execute instructions

## Versioning

This specification follows semantic versioning:

- **Major**: Breaking changes to required structure
- **Minor**: New optional features, backward compatible
- **Patch**: Clarifications, typo fixes

Current version: **1.1.0**

## License

The HyperContext Standard is released under the MIT License.
