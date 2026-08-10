---
name: "Blog Post Authoring"
description: "Use when creating, drafting, or updating Jekyll blog articles in _posts. Covers intake requirements, product-suffixed titles, front matter, article structure, assets, technical accuracy, and validation."
applyTo: "_posts/**/*.markdown"
---
# Blog Post Authoring

## Workflow

- Treat the user's supplied facts, scripts, logs, links, screenshots, and test results as the source of truth.
- Before drafting, inspect no more than two recent posts about the same product or article type. Reuse their useful conventions without copying stale wording or unrelated sections.
- Create the post directly in `_posts/` unless the user asks for an outline or text-only draft.
- Ask one concise, grouped question only when required information is missing or contradictory. Do not invent missing technical facts, URLs, test results, screenshots, or personal experiences.
- Create or edit only the requested post and explicitly supplied assets. Never rename another post or change a published permalink unless the user specifically requests it.

## Intake Requirements

Require these details before creating a complete post:

- Descriptive title and product name, or a complete standardized title.
- Article type and purpose, such as troubleshooting, how-to guide, script/tool, technical reference, announcement, or presentation.
- Publish date. If no time is supplied, use `12:00:00 -0500`.
- Technical source material: verified steps, code, commands, error text, behavior, constraints, and results that the article must cover.
- Thumbnail path under `/assets/`, with the referenced file present in the workspace.

Accept or infer these details from the supplied material:

- Slug and permalink.
- Existing category tokens and comma-separated keywords.
- Summary.
- Relevant body sections and table of contents setting.

Use these optional details when provided:

- Download, repository, Microsoft Learn, or other reference links.
- Screenshot paths and alt text.
- Product versions, operating systems, prerequisites, and supported environments.
- Security cautions, rollback or cleanup steps, known limitations, and troubleshooting notes.
- A preferred slug, permalink, section order, conclusion, or call to action.

## File And URL Rules

- Name a new post `_posts/YYYY-MM-DD-slug.markdown`. Match the date portion to the front matter date.
- Derive an omitted slug from the descriptive title using concise lowercase kebab-case. Omit repeated product words when the remaining slug is still clear.
- Set the explicit permalink to `/blog/<slug>/` unless the user supplies another permalink.
- Search existing filenames and `permalink:` values before creating the file. Never overwrite or duplicate one.
- After publication, treat the filename and permalink as stable URLs. A later title change must not alter either value.

## Title Rules

- Quote the YAML title and format it as `"<Descriptive Title> - <ProductName>"`.
- Use exactly one spaced ` - ` delimiter to identify the final product suffix. Use a colon or parentheses for an internal subtitle.
- Keep the descriptive portion specific and avoid needlessly repeating the product name already present in the suffix.
- Use the product's official name. Include a well-established acronym in parentheses when that is the site's existing convention.
- Use ASCII punctuation. Never use an em dash in a title or heading.

Canonical suffixes already used by this site include:

- `System Center Operations Manager (SCOM)`
- `Azure Update Manager (AUM)`
- `Azure Communication Services (ACS)`
- `SQL Server Reporting Services (SSRS)`
- `Microsoft Windows`
- `.NET Framework`
- `Azure Arc`
- `Azure Automation`
- `Azure Container Apps`
- `Microsoft Teams`
- `ArmClient-PS`
- `VS Code AI Council`

For a new product family, use its current official product name and add an acronym only when it is established and useful.

## Front Matter

Use this field order and style:

```yaml
---
layout: post
title: "<Descriptive Title> - <ProductName>"
date: 'YYYY-MM-DD 12:00:00 -0500'
categories: azure powershell guides troubleshooting
author: blakedrumm
thumbnail: /assets/img/posts/<image-file>.png
toc: true

summary: >-
  <One concise paragraph stating the problem or goal, the approach, and the useful outcome.>

keywords: keyword one, keyword two, official product name, task or error
permalink: /blog/<slug>/
---
```

- Keep `layout: post` and `author: blakedrumm` unchanged.
- Keep categories as space-delimited tokens, not a YAML array. Prefer the repository's existing vocabulary: `acs`, `ai`, `azure`, `certificates`, `communication-services`, `containerapps`, `email`, `guides`, `linux`, `operationsManager`, `powershell`, `projects`, `security`, `teams`, `troubleshooting`, and `updateManager`.
- Use only categories that genuinely describe the post. Introduce a new token only for a new recurring subject that existing categories cannot represent.
- Default to `toc: true`. Use `false` only for a short reference post or when the user requests it.
- Write a factual summary, not a teaser. Do not make claims that the body does not support.
- Keep keywords relevant and non-duplicative. Include the product name, common acronym, task, technology, and important error terms when applicable.

## Body Style

- Start body headings at `##`; the layout renders the title as the page's `h1`.
- Open with `## :bulb: Introduction` or `## :book: Introduction` and explain the problem, audience, and outcome without generic filler.
- Choose sections based on the article type rather than forcing every post into one outline.
- Use ASCII GitHub emoji shortcodes such as `:gear:` and `:mag:` in major headings when they improve scanning. Do not mix them with Unicode emoji.
- Separate substantial major sections with `---`, following the newer posts.
- Use a direct, practical, first-person technical voice. Use personal claims such as "I tested" only when the user supplied that fact.
- Define acronyms on first use. Preserve official capitalization for products, commands, parameters, event IDs, and error messages.
- Keep paragraphs focused and use ordered steps for procedures.

Use the relevant outline as a starting point:

- Troubleshooting: Introduction, Symptoms or Error Text, Root Cause, Solution, Verification, Known Limitations, Conclusion.
- Script or tool: Introduction, How to Get It, What It Does, Prerequisites, Parameters, Usage Examples, How It Works, Troubleshooting or Security, Conclusion.
- How-to guide: Introduction, Prerequisites, Procedure, Verification, Rollback or Cleanup when relevant, Conclusion.
- Query or reference: Introduction, Prerequisites, Complete Query or Code, How It Works, Results, Adaptations, Conclusion.

Omit sections that add no value, and add topic-specific sections when needed.

## Technical Content

- Use fenced code blocks with an accurate language identifier such as `powershell`, `csharp`, `json`, `kusto`, `sql`, `bash`, `text`, or `plaintext`.
- Preserve the behavior of user-supplied scripts and commands. Do not silently rewrite functional code unless the user requests code changes.
- Use obvious placeholders for tenant IDs, subscription IDs, resource names, domains, email addresses, and secrets. Never publish credentials, access keys, tokens, or private customer identifiers.
- Present exact error output in a `text` code fence or blockquote without changing its technically significant wording.
- Do not claim that a command, script, fix, version, or environment was tested unless evidence was supplied or Copilot actually validated it.
- Link factual product claims to supplied references or authoritative documentation when a citation is useful. Never invent a download or source URL.

Format tables as standard Markdown and add the site's responsive classes immediately after each table:

```markdown
| Column | Description |
|--------|-------------|
| Value | Meaning |
{: .table .table-hover .table-text .d-block .overflow-auto }
```

Format local body images with useful alt text:

```markdown
![Descriptive image text](/assets/img/posts/example.png){:class="img-fluid"}
```

Use only image paths that exist or that the user explicitly asks Copilot to create.

## Ending

- End a full article with a concise conclusion that states the outcome and any important next step. Do not repeat the introduction verbatim.
- Add the page-view counter after the conclusion, using the exact permalink slug:

```markdown
![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/<slug>/)
```

- Add a "last updated" line only when revising an existing article and only when the user requests or supplies the update date.

## Validation

Before completing the request:

- Confirm the target filename and permalink are unique.
- Confirm the filename date matches the front matter date.
- Confirm the title ends in the intended canonical product suffix and contains no em dash.
- Confirm every required front matter field appears exactly once and YAML-sensitive values are quoted or folded correctly.
- Confirm the thumbnail and every referenced local asset exist.
- Confirm the page-view URL matches the permalink.
- Remove unresolved placeholders, drafting notes, fabricated values, and unsupported claims.
- Review the diff and ensure no unrelated post, filename, or permalink changed.
- Run `git diff --check` for the new file.
- Run `bundle exec jekyll build --future --trace` when Ruby and Bundler are available. If the build cannot run, report the missing prerequisite instead of claiming success.