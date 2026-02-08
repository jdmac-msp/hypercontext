#!/usr/bin/env node
/**
 * HyperContext Validator
 * Validates HC files against the v1.1 specification
 *
 * Usage: node validate.js <file.html>
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_BLOCKS = ['hc-metadata', 'hc-instructions', 'hc-human-docs'];
const VALID_TYPES = ['registry', 'skill', 'artifact', 'identity', 'framework'];
const REQUIRED_METADATA_FIELDS = ['hc_version', 'hc_type', 'artifact_id', 'version', 'created', 'updated', 'summary'];

function validate(filePath) {
  const errors = [];
  const warnings = [];

  // Read file
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    console.error(`Error reading file: ${e.message}`);
    process.exit(1);
  }

  // Check HTML5 doctype
  if (!content.trim().toLowerCase().startsWith('<!doctype html>')) {
    errors.push('Missing HTML5 doctype (<!DOCTYPE html>)');
  }

  // Check required blocks
  for (const blockId of REQUIRED_BLOCKS) {
    if (!content.includes(`id="${blockId}"`)) {
      errors.push(`Missing required block: #${blockId}`);
    }
  }

  // Extract and validate hc-metadata
  const metadataMatch = content.match(/<script[^>]*id="hc-metadata"[^>]*>([\s\S]*?)<\/script>/);
  if (metadataMatch) {
    try {
      const metadata = JSON.parse(metadataMatch[1]);

      // Check required fields
      for (const field of REQUIRED_METADATA_FIELDS) {
        if (!metadata[field]) {
          errors.push(`Missing required metadata field: ${field}`);
        }
      }

      // Validate hc_version
      if (metadata.hc_version && metadata.hc_version !== '1.1') {
        warnings.push(`hc_version should be "1.1", found "${metadata.hc_version}"`);
      }

      // Validate hc_type
      if (metadata.hc_type && !VALID_TYPES.includes(metadata.hc_type)) {
        errors.push(`Invalid hc_type: ${metadata.hc_type}. Must be one of: ${VALID_TYPES.join(', ')}`);
      }

      // Validate artifact_id format
      if (metadata.artifact_id) {
        const idPattern = /^hc-(registry|skill|artifact|identity|framework)-[a-z0-9-]+-\d+$/;
        if (!idPattern.test(metadata.artifact_id)) {
          warnings.push(`artifact_id format should be: hc-[type]-[slug]-[timestamp]`);
        }
      }

      // Validate timestamps
      for (const tsField of ['created', 'updated']) {
        if (metadata[tsField]) {
          const date = new Date(metadata[tsField]);
          if (isNaN(date.getTime())) {
            errors.push(`Invalid ${tsField} timestamp: ${metadata[tsField]}`);
          }
        }
      }

      // Check summary length
      if (metadata.summary) {
        const wordCount = metadata.summary.split(/\s+/).length;
        if (wordCount < 10) {
          warnings.push(`Summary seems short (${wordCount} words). Aim for 50-100 tokens.`);
        }
      }

    } catch (e) {
      errors.push(`Invalid JSON in hc-metadata: ${e.message}`);
    }
  }

  // Check hc-instructions has content
  const instructionsMatch = content.match(/<script[^>]*id="hc-instructions"[^>]*>([\s\S]*?)<\/script>/);
  if (instructionsMatch) {
    const instructions = instructionsMatch[1].trim();
    if (instructions.length < 100) {
      warnings.push('hc-instructions seems very short. Include detailed steps.');
    }
    if (!instructions.includes('Step')) {
      warnings.push('hc-instructions should include numbered steps');
    }
  }

  // Check hc-human-docs has content
  const humanDocsMatch = content.match(/<div[^>]*id="hc-human-docs"[^>]*>([\s\S]*?)<\/div>/);
  if (humanDocsMatch) {
    const docs = humanDocsMatch[1].trim();
    if (docs.length < 200) {
      warnings.push('hc-human-docs seems very short. Include comprehensive documentation.');
    }
  }

  // Output results
  console.log(`\nValidating: ${path.basename(filePath)}\n`);

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Valid HC file!');
    return 0;
  }

  if (errors.length > 0) {
    console.log('❌ Errors:');
    errors.forEach(e => console.log(`   - ${e}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(w => console.log(`   - ${w}`));
  }

  console.log(`\nSummary: ${errors.length} error(s), ${warnings.length} warning(s)`);

  return errors.length > 0 ? 1 : 0;
}

// Main
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node validate.js <file.html>');
  console.log('       node validate.js examples/*.html');
  process.exit(1);
}

let exitCode = 0;
for (const arg of args) {
  const result = validate(arg);
  if (result !== 0) exitCode = result;
}

process.exit(exitCode);
