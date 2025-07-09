# Blog Management System

A simple, clean blogging workflow for Jekyll that lets you focus on writing instead of managing files.

## Quick Start

```bash
# Create and start writing immediately
./blog.sh write "My New Post"

# Start the development server
./blog.sh serve
```

## All Commands

### Writing
- `./blog.sh write "Title"` - Create and open a new post immediately
- `./blog.sh draft "Title"` - Create a draft post
- `./blog.sh publish "Title"` - Publish a draft to live posts

### Management
- `./blog.sh list` - List all published posts
- `./blog.sh drafts` - List all draft posts
- `./blog.sh edit "Title"` - Edit any post or draft
- `./blog.sh delete "Title"` - Delete a post or draft

### Server
- `./blog.sh serve` - Start development server with live reload
- `./blog.sh build` - Build the site for production
- `./blog.sh deploy` - Deploy to production

### Utilities
- `./blog.sh status` - Show blog statistics
- `./blog.sh clean` - Clean build files
- `./blog.sh backup` - Backup all posts and drafts

## Daily Workflow

```bash
# Start server once (keeps running)
./blog.sh serve

# In another terminal, create posts as needed
./blog.sh write "Morning Thoughts"
./blog.sh draft "Complex Topic"
./blog.sh publish "Yesterday's Draft"

# Deploy when ready
./blog.sh deploy
```

## Features

- **Zero file management** - automatic filenames and dates
- **Draft system** - work on posts over time
- **Smart editing** - find posts by partial title
- **Integrated server** - live reload while writing
- **One-command deployment** - build and push automatically

## Configuration

```bash
export EDITOR=code        # Your preferred editor (default: VS Code)
export PORT=4000          # Server port (default: 4000)
```

## File Structure

```
├── _posts/              # Published posts (YYYY-MM-DD-title.md)
├── _drafts/             # Draft posts (title.md)
├── _site/               # Generated site (auto-created)
└── blog.sh              # Main script
```

## Tips

1. Keep the server running during writing sessions
2. Use descriptive titles - they become URLs automatically
3. Start with drafts for complex posts
4. Use `./blog.sh write` for quick thoughts

## Common Scenarios

**I have an idea right now:**
```bash
./blog.sh write "My Idea"
```

**I want to work on something over time:**
```bash
./blog.sh draft "Complex Topic"
# ... work on it over days/weeks ...
./blog.sh publish "Complex Topic"
```

**I want to see what I've written:**
```bash
./blog.sh list
./blog.sh drafts
```

**I want to publish everything:**
```bash
./blog.sh deploy
```

## Getting Help

Run without arguments to see all commands:
```bash
./blog.sh
```

---

**Focus on writing, not file management.**

Just ideas → words → published.