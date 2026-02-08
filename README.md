# HyperContext (HC) Standard

**Portable AI Context That Works Across All LLM Platforms**

[![HC Version](https://img.shields.io/badge/HC-v1.1-blue)](https://ideas.asapai.net/hypercontext-hc-standard)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## What is HyperContext?

HyperContext is an open standard for creating **portable AI context** that works across Claude, ChatGPT, Gemini, and any LLM platform. It enables:

- **Recursive Context Injection (RCI)** - Outputs become inputs, creating compound learning
- **Self-Executing Skills** - AI agents that run autonomously without manual intervention
- **Token-Optimized Loading** - 96% reduction through lazy loading and semantic indexing
- **Universal Compatibility** - Works in any browser, readable by any AI

## The Three Laws

1. **Container Law**: Every HC file MUST be valid HTML5 (renders in browsers)
2. **Hidden Brain Law**: Every HC file MUST contain embedded LLM instructions
3. **Linkage Law**: Every HC file MUST support referencing and being referenced

## Five Canonical Types

| Type | Purpose | Example |
|------|---------|---------|
| `registry` | Neural Registry - indexes and routes to artifacts | Homepage with artifact catalog |
| `skill` | Single-purpose transformation tool | TOC generator, newsletter writer |
| `artifact` | Generated output/content | Blog post, report, analysis |
| `identity` | Voice and style context | Persona definition, tone guide |
| `framework` | Methodology and specification | This standard, process docs |

## Quick Start

### 1. Create an HC File

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Skill - HyperContext</title>

  <!-- HC Metadata (Required) -->
  <script type="application/json" id="hc-metadata">
  {
    "hc_version": "1.1",
    "hc_type": "skill",
    "artifact_id": "hc-skill-my-skill-20240208",
    "version": "1.0.0",
    "created": "2024-02-08T00:00:00Z",
    "updated": "2024-02-08T00:00:00Z",
    "summary": "Brief description of what this skill does"
  }
  </script>

  <!-- LLM Instructions (Required) -->
  <script type="text/plain" id="hc-instructions">
  ## Instructions for AI
  Step 1: ...
  Step 2: ...
  </script>
</head>
<body>
  <!-- Human-Readable Documentation -->
  <div id="hc-human-docs">
    <h1>My Skill</h1>
    <p>Documentation visible in browser...</p>
  </div>
</body>
</html>
```

### 2. Add to Neural Registry

Your Neural Registry (`registry.json`) indexes all your HC artifacts:

```json
{
  "hc_version": "1.1",
  "registry_id": "my-registry",
  "artifacts": [
    {
      "id": "hc-skill-my-skill-20240208",
      "type": "skill",
      "name": "My Skill",
      "url": "https://example.com/my-skill",
      "summary": "Brief description"
    }
  ]
}
```

### 3. Load in Any LLM

```
Load the skill from: https://example.com/my-skill

Then execute it with this input: [your input]
```

## Token Economics

| Operation | Tokens | Notes |
|-----------|--------|-------|
| Registry scan | ~100 | Fetch /registry.json |
| Identity load | ~500 | Voice/style context |
| Per artifact | ~3,000 | Full context |
| Max per session | ~10,200 | 3 artifacts recommended |
| Bulk load (old way) | ~250,000 | Everything at once |
| **Savings** | **96%** | Through lazy loading |

## Repository Structure

```
hypercontext/
├── README.md                 # This file
├── LICENSE                   # MIT License
├── spec/
│   └── hc-v1.1.md           # Full specification
├── examples/
│   ├── registry.html        # Neural Registry example
│   ├── skill.html           # Skill example
│   ├── identity.html        # Identity example
│   ├── framework.html       # Framework example
│   └── artifact.html        # Artifact example
├── templates/
│   └── hc-template.html     # Blank starter template
├── schemas/
│   ├── hc-metadata.json     # JSON Schema for hc-metadata
│   └── registry.json        # JSON Schema for registry.json
└── validators/
    └── validate.js          # Node.js validation script
```

## Resources

- **Full Specification**: [ideas.asapai.net/hypercontext-hc-standard](https://ideas.asapai.net/hypercontext-hc-standard)
- **Live Registry Example**: [ideas.asapai.net](https://ideas.asapai.net)
- **Skills Directory**: [skills.masterymade.com](https://skills.masterymade.com)

## Contributing

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Created by [MasteryMade](https://masterymade.com) | Maintained by the HC Community
