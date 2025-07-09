#!/bin/bash

# Blog Management Script - All-in-One
# Usage: ./blog.sh [command] [args...]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
POSTS_DIR="_posts"
DRAFTS_DIR="_drafts"
EDITOR="${EDITOR:-code}"
SERVER_PORT="${PORT:-4000}"

# Print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

# Show main menu
show_menu() {
    print_color $CYAN "Blog Management System"
    echo
    print_color $BLUE "Writing Commands:"
    print_color $YELLOW "  ./blog.sh write \"Title\"       - Quick post creation"
    print_color $YELLOW "  ./blog.sh draft \"Title\"       - Create draft"
    print_color $YELLOW "  ./blog.sh publish \"Title\"     - Publish draft"
    echo
    print_color $BLUE "Management Commands:"
    print_color $YELLOW "  ./blog.sh list                 - List all posts"
    print_color $YELLOW "  ./blog.sh drafts               - List all drafts"
    print_color $YELLOW "  ./blog.sh edit \"Title\"        - Edit post/draft"
    print_color $YELLOW "  ./blog.sh delete \"Title\"      - Delete post/draft"
    echo
    print_color $BLUE "Server Commands:"
    print_color $YELLOW "  ./blog.sh serve                - Start dev server"
    print_color $YELLOW "  ./blog.sh build                - Build site"
    print_color $YELLOW "  ./blog.sh deploy               - Deploy to production"
    echo
    print_color $BLUE "Utility Commands:"
    print_color $YELLOW "  ./blog.sh status               - Show blog status"
    print_color $YELLOW "  ./blog.sh clean                - Clean build files"
    print_color $YELLOW "  ./blog.sh backup               - Backup posts"
    echo
    print_color $GREEN "Examples:"
    print_color $GREEN "  ./blog.sh write \"My New Post\""
    print_color $GREEN "  ./blog.sh draft \"Work in Progress\""
    print_color $GREEN "  ./blog.sh serve"
    exit 1
}

# Create slug from title
create_slug() {
    echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g'
}

# Find file by title (checks both posts and drafts)
find_file() {
    local title="$1"
    local slug=$(create_slug "$title")

    # Check posts first
    for file in "$POSTS_DIR"/*.md; do
        if [ -f "$file" ]; then
            local file_title=$(grep -m 1 "^title:" "$file" | sed 's/title: *"//' | sed 's/"$//' | sed "s/title: *'//" | sed "s/'$//")
            local file_slug=$(create_slug "$file_title")
            if [ "$file_slug" = "$slug" ]; then
                echo "$file"
                return 0
            fi
        fi
    done

    # Check drafts
    for file in "$DRAFTS_DIR"/*.md; do
        if [ -f "$file" ]; then
            local file_title=$(grep -m 1 "^title:" "$file" | sed 's/title: *"//' | sed 's/"$//' | sed "s/title: *'//" | sed "s/'$//")
            local file_slug=$(create_slug "$file_title")
            if [ "$file_slug" = "$slug" ]; then
                echo "$file"
                return 0
            fi
        fi
    done

    return 1
}

# Quick write - creates and opens post immediately
quick_write() {
    local title="$1"
    if [ -z "$title" ]; then
        print_color $RED "Title is required!"
        exit 1
    fi

    mkdir -p "$POSTS_DIR"

    local date=$(date +"%Y-%m-%d")
    local slug=$(create_slug "$title")
    local filename="${date}-${slug}.md"
    local filepath="${POSTS_DIR}/${filename}"

    # Check if file exists
    if [ -f "$filepath" ]; then
        print_color $YELLOW "Post already exists. Opening existing file..."
    else
        # Create new post
        cat > "$filepath" << EOF
---
layout: post
title: "$title"
date: $(date +"%Y-%m-%d %H:%M:%S %z")
categories: general
---

# $title

Write your post here...

## Key Points

- Point 1
- Point 2

## Conclusion

Wrap up your thoughts.

---

*Written on $(date +"%B %d, %Y")*
EOF
        print_color $GREEN "Post created: $filepath"
    fi

    # Open in editor
    print_color $BLUE "Opening in $EDITOR..."
    "$EDITOR" "$filepath"

    # Ask to start server
    if ! lsof -i :$SERVER_PORT > /dev/null 2>&1; then
        read -p "Start development server? (Y/n): " start_server
        if [[ ! "$start_server" =~ ^[Nn]$ ]]; then
            serve_blog
        fi
    fi
}

# Create draft
create_draft() {
    local title="$1"
    if [ -z "$title" ]; then
        print_color $RED "Title is required!"
        exit 1
    fi

    mkdir -p "$DRAFTS_DIR"

    local slug=$(create_slug "$title")
    local filename="${slug}.md"
    local filepath="${DRAFTS_DIR}/${filename}"

    if [ -f "$filepath" ]; then
        print_color $YELLOW "Draft already exists. Opening existing file..."
    else
        cat > "$filepath" << EOF
---
layout: post
title: "$title"
categories: general
---

# $title

Draft content here...

## Notes

- [ ] Todo item 1
- [ ] Todo item 2

## Ideas

- Idea 1
- Idea 2

---

*Draft created: $(date)*
EOF
        print_color $GREEN "Draft created: $filepath"
    fi

    "$EDITOR" "$filepath"
}

# List posts
list_posts() {
    print_color $BLUE "Published Posts:"
    echo

    if [ ! -d "$POSTS_DIR" ] || [ -z "$(ls -A "$POSTS_DIR" 2>/dev/null)" ]; then
        print_color $YELLOW "No posts found."
        return
    fi

    for file in "$POSTS_DIR"/*.md; do
        if [ -f "$file" ]; then
            local title=$(grep -m 1 "^title:" "$file" | sed 's/title: *"//' | sed 's/"$//' | sed "s/title: *'//" | sed "s/'$//")
            local date=$(grep -m 1 "^date:" "$file" | sed 's/date: *//' | cut -d' ' -f1)
            local filename=$(basename "$file")
            printf "${GREEN}%s${NC} - ${YELLOW}%s${NC} ${BLUE}(%s)${NC}\n" "$title" "$date" "$filename"
        fi
    done
    echo
}

# List drafts
list_drafts() {
    print_color $BLUE "Draft Posts:"
    echo

    if [ ! -d "$DRAFTS_DIR" ] || [ -z "$(ls -A "$DRAFTS_DIR" 2>/dev/null)" ]; then
        print_color $YELLOW "No drafts found."
        return
    fi

    for file in "$DRAFTS_DIR"/*.md; do
        if [ -f "$file" ]; then
            local title=$(grep -m 1 "^title:" "$file" | sed 's/title: *"//' | sed 's/"$//' | sed "s/title: *'//" | sed "s/'$//")
            local filename=$(basename "$file")
            local modified=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$file" 2>/dev/null || date -r "$file" "+%Y-%m-%d %H:%M")
            printf "${GREEN}%s${NC} - ${BLUE}%s${NC} ${YELLOW}(%s)${NC}\n" "$title" "$modified" "$filename"
        fi
    done
    echo
}

# Edit post or draft
edit_file() {
    local title="$1"
    if [ -z "$title" ]; then
        print_color $RED "Title is required!"
        exit 1
    fi

    local filepath=$(find_file "$title")
    if [ $? -ne 0 ]; then
        print_color $RED "Post/draft not found: $title"
        print_color $BLUE "Available posts:"
        list_posts
        list_drafts
        exit 1
    fi

    print_color $GREEN "Opening: $filepath"
    "$EDITOR" "$filepath"
}

# Publish draft
publish_draft() {
    local title="$1"
    if [ -z "$title" ]; then
        print_color $RED "Title is required!"
        exit 1
    fi

    local draft_file=$(find_file "$title")
    if [ $? -ne 0 ] || [[ ! "$draft_file" =~ ^_drafts/ ]]; then
        print_color $RED "Draft not found: $title"
        list_drafts
        exit 1
    fi

    mkdir -p "$POSTS_DIR"

    # Get title from draft
    local post_title=$(grep -m 1 "^title:" "$draft_file" | sed 's/title: *"//' | sed 's/"$//' | sed "s/title: *'//" | sed "s/'$//")
    local date=$(date +"%Y-%m-%d")
    local slug=$(create_slug "$post_title")
    local post_filename="${date}-${slug}.md"
    local post_filepath="${POSTS_DIR}/${post_filename}"

    # Update front matter with date
    local temp_file=$(mktemp)
    awk '
        /^---$/ && !in_frontmatter { in_frontmatter = 1; print; next }
        /^---$/ && in_frontmatter {
            print "date: " strftime("%Y-%m-%d %H:%M:%S %z")
            print
            in_frontmatter = 0
            next
        }
        in_frontmatter && /^date:/ { next }
        { print }
    ' "$draft_file" > "$temp_file"

    mv "$temp_file" "$post_filepath"

    print_color $GREEN "Published: $post_filepath"

    # Ask to delete draft
    read -p "Delete draft? (Y/n): " delete_draft
    if [[ ! "$delete_draft" =~ ^[Nn]$ ]]; then
        rm "$draft_file"
        print_color $GREEN "Draft deleted"
    fi

    # Ask to build and serve
    read -p "Build and serve site? (Y/n): " serve_site
    if [[ ! "$serve_site" =~ ^[Nn]$ ]]; then
        serve_blog
    fi
}

# Delete post or draft
delete_file() {
    local title="$1"
    if [ -z "$title" ]; then
        print_color $RED "Title is required!"
        exit 1
    fi

    local filepath=$(find_file "$title")
    if [ $? -ne 0 ]; then
        print_color $RED "Post/draft not found: $title"
        exit 1
    fi

    print_color $YELLOW "Are you sure you want to delete: $filepath"
    read -p "Type 'yes' to confirm: " confirm
    if [ "$confirm" = "yes" ]; then
        rm "$filepath"
        print_color $GREEN "Deleted: $filepath"
    else
        print_color $BLUE "Aborted."
    fi
}

# Start development server
serve_blog() {
    print_color $BLUE "Starting Jekyll development server..."

    if lsof -i :$SERVER_PORT > /dev/null 2>&1; then
        print_color $YELLOW "Server already running on port $SERVER_PORT"
        print_color $BLUE "Visit: http://localhost:$SERVER_PORT"
    else
        print_color $GREEN "Starting server on http://localhost:$SERVER_PORT"
        bundle exec jekyll serve --livereload --drafts --port $SERVER_PORT
    fi
}

# Build site
build_site() {
    print_color $BLUE "Building Jekyll site..."
    bundle exec jekyll build
    print_color $GREEN "Site built successfully!"
}

# Deploy site
deploy_site() {
    print_color $BLUE "Deploying to production..."

    # Build first
    build_site

    # Check if git repo
    if [ -d ".git" ]; then
        print_color $BLUE "Pushing to Git..."
        git add .
        git commit -m "Update blog posts - $(date)"
        git push origin main
        print_color $GREEN "Deployed successfully!"
    else
        print_color $YELLOW "No git repository found. Please set up deployment manually."
    fi
}

# Show blog status
show_status() {
    print_color $CYAN "Blog Status Report"
    echo

    # Count posts
    if [ -d "$POSTS_DIR" ]; then
        local post_count=$(ls -1 "$POSTS_DIR"/*.md 2>/dev/null | wc -l)
        print_color $GREEN "Published Posts: $post_count"
    else
        print_color $YELLOW "Published Posts: 0"
    fi

    # Count drafts
    if [ -d "$DRAFTS_DIR" ]; then
        local draft_count=$(ls -1 "$DRAFTS_DIR"/*.md 2>/dev/null | wc -l)
        print_color $BLUE "Draft Posts: $draft_count"
    else
        print_color $YELLOW "Draft Posts: 0"
    fi

    # Server status
    if lsof -i :$SERVER_PORT > /dev/null 2>&1; then
        print_color $GREEN "Server Status: Running on port $SERVER_PORT"
    else
        print_color $YELLOW "Server Status: Not running"
    fi

    # Git status
    if [ -d ".git" ]; then
        print_color $GREEN "Git Repository: Initialized"
        local changes=$(git status --porcelain 2>/dev/null | wc -l)
        if [ "$changes" -gt 0 ]; then
            print_color $YELLOW "Uncommitted Changes: $changes files"
        else
            print_color $GREEN "Repository Status: Clean"
        fi
    else
        print_color $YELLOW "Git Repository: Not initialized"
    fi

    echo
}

# Clean build files
clean_build() {
    print_color $BLUE "Cleaning build files..."

    rm -rf _site
    rm -rf .sass-cache
    rm -rf .jekyll-cache
    rm -rf .jekyll-metadata

    print_color $GREEN "Build files cleaned!"
}

# Backup posts
backup_posts() {
    local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"

    if [ -d "$POSTS_DIR" ]; then
        cp -r "$POSTS_DIR" "$backup_dir/"
        print_color $GREEN "Posts backed up to: $backup_dir"
    fi

    if [ -d "$DRAFTS_DIR" ]; then
        cp -r "$DRAFTS_DIR" "$backup_dir/"
        print_color $GREEN "Drafts backed up to: $backup_dir"
    fi

    print_color $GREEN "Backup completed!"
}

# Main command handler
case "${1:-}" in
    "write" | "w")
        quick_write "$2"
        ;;
    "draft" | "d")
        create_draft "$2"
        ;;
    "publish" | "p")
        publish_draft "$2"
        ;;
    "list" | "l")
        list_posts
        ;;
    "drafts")
        list_drafts
        ;;
    "edit" | "e")
        edit_file "$2"
        ;;
    "delete" | "del")
        delete_file "$2"
        ;;
    "serve" | "s")
        serve_blog
        ;;
    "build" | "b")
        build_site
        ;;
    "deploy")
        deploy_site
        ;;
    "status")
        show_status
        ;;
    "clean")
        clean_build
        ;;
    "backup")
        backup_posts
        ;;
    "help" | "h" | "")
        show_menu
        ;;
    *)
        print_color $RED "Unknown command: $1"
        show_menu
        ;;
esac
