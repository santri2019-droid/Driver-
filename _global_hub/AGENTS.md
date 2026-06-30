# LLM Wiki Schema & Operational Guidelines (AGENTS.md)

Welcome. This workspace is configured as an **LLM Wiki**—a persistent, compounding knowledge base that sits between raw, immutable source documents and your interactive research.

You (the AI Agent) are the **Maintainer** of this codebase/wiki. The user is the **Director**. Follow these instructions with absolute discipline.

---

## 1. Directory Structure

```
c:\PROYECTOS Antigravity\
├── Antigravity_Hub\          # Main Repository / Workspace
│   ├── raw/                  # Immutable Source Layer (Agent Read-Only)
│   │   ├── products/         # Raw product catalogs (.txt list of aromas)
│   │   └── rules/            # Marketing/SEO/Copy rules and frameworks
│   │
│   ├── wiki/                 # Compounding Knowledge Layer (Agent Writes)
│   │   ├── index.md          # Central catalog & search index
│   │   ├── log.md            # Chronological ledger of all events
│   │   └── products/         # Compiled, audited product listings
│   │
│   └── AGENTS.md             # This file (Instructions & Schema Rules)
│
└── Dulce/                    # External Compounding Knowledge Layer
    ├── [aroma].md            # Comprehensive aroma profile pages (reallocated)
    └── [concept].md          # Marketing, SEO, and copywriting frameworks (reallocated)
```

---

## 2. Formatting & Syntax Conventions

Every file created in the `wiki/` directory must adhere to these conventions:
1. **Obsidian Compatibility:** Use standard markdown with internal relative file links. Use absolute file URLs for local workspace linking: `[Page Name](file:///c:/PROYECTOS%20Antigravity/Antigravity_Hub/wiki/...)` so they are fully clickable within the editor.
2. **Metadata Frontmatter:** Start every file (except logs/index) with YAML frontmatter containing metadata:
   ```yaml
   ---
   type: product | aroma | concept
   last_updated: YYYY-MM-DD
   source_count: N
   status: draft | audited
   ---
   ```
3. **No Placeholders:** Write full, expressive copy and complete listings. Never use `Lorem Ipsum` or ellipses (`...`).

---

## 3. Core Operations

### A. Ingest Workflow
When a new raw document is added to `/raw` (or an existing one is updated) and the user triggers an ingest:
1. **Read & Extract:** Read the source file. Identify new additions, deletions, or structural changes.
2. **Consult:** Discuss major takeaways with the user, aligning on positioning if necessary.
3. **Generate/Update Pages:**
   - For **Products**: Create or update the product markdown file under `wiki/products/`. Update the list of available aromas. Generate/update the SEO title and description draft.
   - For **Aromas**: Create/update the specific aroma markdown file under `C:\PROYECTOS Antigravity\Dulce\`. Cross-reference all product lines that offer this aroma.
4. **Update Index:** Edit `wiki/index.md` to add or update listings and summaries.
5. **Log Action:** Append a record to `wiki/log.md` with format:
   `## [YYYY-MM-DD] ingest | [Product/Aroma/Rule] - [Summary of action]`

### B. Query Workflow
When the user asks questions or requests marketing assets:
1. **Lookup:** First, scan `wiki/index.md` to locate relevant concept, product, or aroma files.
2. **Read & Synthesize:** Read the identified pages to compile an answer.
3. **Compound the Wiki:** If the query results in an important asset (e.g. a comparative matrix, a bundle description, or a promotional campaign), **do not let it fade in chat history**. Create a new page under `wiki/listings/` or similar, update `wiki/index.md`, and log the addition.

### C. Lint Workflow (Programs & Audits)
The Agent must periodically execute a **Lint Audit** of the entire Wiki. This is the health check.
1. **Broken Link Check:** Verify that all relative links `[Name](file:///...)` correspond to files that exist.
2. **Nestor Arranz SEO Audit:** For every product listing in `wiki/products/`:
   - Verify that the target title is **60 characters or less** (spaces included).
   - Verify it follows the formula: `[Producto Base] + [Marca] + [Modelo] + [Atributo Distintivo]`.
   - Verify that all banned words/prepositions (`de`, `para`, `hermoso`, `increíble`, `envío gratis`, `oferta`) have been **strictly pruned**.
3. **Copywriting Framework Audit:** Verify that the product description strictly contains:
   - A **Hook** addressing customer empathy.
   - **Benefits over Characteristics** (clearly styled with bold formatting).
   - An **FAQ section** addressing 3-5 friction points.
   - A clear **CTA**.
4. **Report & Fix:** Automatically fix any obvious formatting violations. For complex issues, output an audit report detailing findings and log the lint pass in `wiki/log.md`.

---

## 4. Operational Boundaries

- **Immutable Raw:** Never modify files under `/raw`. If a product's raw aroma list is wrong, tell the user to update the source, then re-run Ingest.
- **Persistent Compounding:** Keep the wiki pristine. Refine existing files rather than generating messy, duplicate documents.
