# Fluid Button Forge — Roadmap

Items are listed roughly in priority order. Nothing here is a commitment — this is a working plan, not a release schedule.

---

## Planned Features

### 1. Button Categories

**Status:** Planned  
**Complexity:** High

Today the plugin manages button styles as a single collection. All button entries — sizes, colors, border-radius values — appear together regardless of their role in the design.

The goal is to let the user organize button definitions into named **categories**, each representing a distinct button role or context. Each category has its own set of size entries, its own color palette, and its own section of generated CSS output. Names must be unique across the entire project.

#### Default categories

| Category | Purpose | Example entries |
|----------|---------|-----------------|
| **Regular** | Standard action buttons used throughout the site | primary, secondary, ghost, outline |
| **Call to Action** | High-emphasis conversion buttons — larger, more prominent | hero-cta, section-cta, banner-cta |
| **Menu / Footer** | Navigation and footer utility buttons — typically smaller or text-style | nav-link, footer-link, breadcrumb |

The user can rename, reorder, or delete any default category, and add as many custom categories as needed (e.g., Danger, Icon-only, Social).

#### UX concept

- A **category selector** (tabs or a dropdown) sits above the button style table.
- Switching categories swaps the table to show only that category's entries.
- Each category can carry its own size scaling (CTA buttons might scale more aggressively between mobile and desktop than footer links) and its own default color role.
- The **CSS output panel** groups generated output by category with a comment header per group:

```css
/* === Regular === */
.btn-primary  { font-size: clamp(0.875rem, 0.82rem + 0.27vw, 1.00rem); padding: clamp(0.5rem, ...) clamp(1rem, ...); }
.btn-secondary { ... }

/* === Call to Action === */
.btn-hero-cta { font-size: clamp(1.125rem, 1.00rem + 0.62vw, 1.424rem); padding: clamp(0.875rem, ...) clamp(2rem, ...); }

/* === Menu / Footer === */
.btn-nav-link  { font-size: clamp(0.75rem, 0.72rem + 0.15vw, 0.875rem); ... }
```

#### Name uniqueness rule

Entry names must be unique across the whole project. The UI enforces this: attempting to save `primary` in Call to Action when `primary` already exists in Regular raises a validation error and suggests a prefixed alternative (`cta-primary`).

#### Data model change

Categories introduce a second dimension to the current flat structure:

```
settings
  └── categories[]
        ├── id
        ├── name          ("Regular", "Call to Action", "Menu / Footer", …)
        ├── settings      (size scaling, default color role — or null = inherit global)
        └── buttons[]     (existing button objects: id, name, sizes, colors, skip)
```

Export/import (JSON) and the autosave system will handle the new structure. Backward compatibility: existing saves with no `categories` key load as a single unnamed category preserving all current entries.

---

## Completed

| Version | Feature |
|---------|---------|
| 1.0.0 | Initial public release — responsive button sizing with CSS clamp() generation, color management, Elementor integration |
