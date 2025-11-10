# Sora 2 Wiki - Content Management Guide

## Overview

The Sora 2 Wiki uses a hierarchical structure based on categories and articles. All content is stored in `/src/content/sora-v2.json`.

## Content Structure

```
Wiki
└── Categories (e.g., "Getting Started", "Core Concepts")
    └── Articles (e.g., "What is Sora 2?", "How to Get Access")
```

## Adding New Articles

### Method 1: Direct JSON Editing

1. Open `/src/content/sora-v2.json`
2. Find the appropriate category in the `categories` array
3. Add a new article object to that category's `articles` array:

```json
{
  "article_title": "Your Article Title",
  "article_slug": "your-article-slug",
  "seo_description": "A compelling description for SEO (155 chars max recommended)",
  "content_markdown": "# Your Article Title\n\nYour markdown content here..."
}
```

### Method 2: Using Empty Templates

Many articles in the JSON file already have empty `content_markdown` fields. To complete them:

1. Find an article with `"content_markdown": ""`
2. Add your markdown content between the quotes
3. The system will automatically:
   - Generate a summary from the first meaningful sentences
   - Calculate reading time
   - Extract headings for the table of contents

## Article Fields

### Required Fields

- **article_title**: The display title of the article
- **article_slug**: URL-friendly version (lowercase, hyphens, no spaces)
- **seo_description**: Brief description for SEO and previews
- **content_markdown**: The article content in markdown format

### Auto-Generated Fields

These are generated automatically by the content processor:

- **summary**: First meaningful sentence(s) from content
- **readingTimeMinutes**: Estimated reading time based on word count
- **headings**: Extracted from markdown headers for table of contents

## Content Guidelines

### Slugs

- Must be unique within their category
- Use lowercase letters, numbers, and hyphens only
- Should be descriptive and SEO-friendly
- Example: `"sora-2-free-vs-pro-plans"`

### Markdown Content

Supports standard markdown:
- Headers: `# H1`, `## H2`, `### H3`
- Bold: `**text**`
- Italic: `*text*`
- Links: `[text](url)`
- Images: `![alt text](url)`
- Code blocks: ` ```language\ncode\n``` `
- Lists, blockquotes, etc.

### SEO Descriptions

- Keep under 155 characters for optimal display in search results
- Be specific and actionable
- Include relevant keywords naturally
- Example: "Learn how to use the Sora 2 Remix feature to modify existing videos with new prompts and create collaborative content."

## Adding New Categories

To add a new category, add to the `categories` array:

```json
{
  "category_title": "Your Category Name",
  "category_slug": "your-category-slug",
  "category_description": "What this category covers",
  "articles": []
}
```

## URLs and Navigation

### URL Structure

- Homepage: `/`
- Category: `/:categorySlug` (e.g., `/getting-started`)
- Article: `/:categorySlug/:articleSlug` (e.g., `/getting-started/what-is-sora-2-overview`)

### Sidebar Navigation

- Categories are collapsible/expandable
- Click category name to expand/collapse
- Articles without content show "Coming Soon" badge
- Search filters both categories and articles in real-time

## Testing Your Content

After adding content:

1. Save `/src/content/sora-v2.json`
2. The dev server will hot-reload automatically
3. Navigate to your new article's URL
4. Check:
   - Title and description display correctly
   - Markdown renders properly
   - Table of contents appears (if headings present)
   - Reading time is reasonable

## Common Issues

### Article Not Showing

- Check for JSON syntax errors (missing commas, quotes)
- Verify the slug is unique within the category
- Ensure the category_slug in the URL matches exactly

### Empty Content

- Articles with empty `content_markdown` show "Coming Soon"
- They appear in navigation but aren't clickable
- Add markdown content to make them active

### Broken Navigation

- Verify all slugs are lowercase and use hyphens
- Check for duplicate slugs within a category
- Ensure category exists before adding articles to it

## Next.js Migration (Future)

The current structure is designed to be Next.js-friendly:
- Content is already in a structured JSON format
- URL structure follows Next.js conventions
- When migrating, the content files won't need changes
- Only routing and component loading will need updates

## Questions?

If you encounter issues or need to add complex functionality:
1. Check this guide first
2. Review existing articles for examples
3. Test changes on dev server before deploying
