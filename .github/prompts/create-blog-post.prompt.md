---
name: "Create Blog Post"
description: "Create a new blakedrumm.com Jekyll article from a title, product, technical source material, and publishing details."
argument-hint: "title, product, date, purpose/source material, thumbnail, links, and optional categories or keywords"
---
# Create A Blog Post

Create one complete Jekyll post directly in `_posts/` from the article details supplied with this prompt.

Follow [Blog Post Authoring](../instructions/blog-post.instructions.md). Inspect up to two recent posts for the same product or article type before writing. Do not modify existing posts or assets unless explicitly requested.

If any required field is missing or contradictory, ask one grouped question before editing. Otherwise, infer the slug, permalink, categories, summary, keywords, body outline, and table of contents setting from the supplied material and repository conventions.

Use this intake format after `/create-blog-post`:

```text
Title:
Product suffix:
Article type:
Publish date:
Purpose and target audience:
Technical source material:
Thumbnail path:

Optional categories:
Optional keywords:
Preferred slug or permalink:
Download or source links:
Reference links:
Screenshot paths and alt text:
Versions and supported environments:
Required sections or examples:
Security, rollback, cleanup, or limitation notes:
```

The technical source material may include rough notes, scripts, commands, logs, exact error text, verified steps, and observed results. Preserve technically significant details and use safe placeholders for secrets or private identifiers.

After creating the article:

- Validate the filename, front matter, title suffix, permalink, local assets, footer URL, and diff.
- Run the available focused checks described in the blog post instructions.
- Report the created file path, important inferred metadata, validation results, and anything that still needs user-supplied evidence or assets.