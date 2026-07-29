# CLAUDE.md — Fluid Button Forge (FBF)

## INHERITANCE — ADDS TO, NEVER REPLACES

**Parent chain** — every rule from every level above remains fully in effect here:
1. `C:\Users\Owner\.claude\CLAUDE.md` — Root: all Claude Code sessions
2. `E:\projects\.claude\CLAUDE.md` — All E:\projects\ work
3. `E:\projects\plugins\.claude\CLAUDE.md` — All plugin development rules

**This file adds:** FBF-specific rules only.

---

## Plugin Identity

- **Plugin name:** Fluid Button Forge
- **Acronym / folder:** `fbf` → `E:\projects\plugins\fbf`
- **Version:** v1.0.0
- **GitHub:** (not yet published)
- **Text domain:** `fluid-button-forge`
- **Admin page slug:** `fluid-button-forge`
- **Required capability:** `manage_options`
- **Namespace:** `JimRForge\FluidButtonForge`
- **Branding:** Always "Jim R Forge" — never "JimRWeb" or "JimRForge"
- **Author URI:** https://jimrforge.com

---

## What FBF Does

FBF is a WordPress admin tool for responsive button design. It:
- Generates CSS `clamp()` functions for fluid button sizing
- Manages a button color system
- Provides Elementor integration for the generated button styles

---

## CSS / JS Prefix

| Layer | Prefix | Example |
|-------|--------|---------|
| CSS classes | `fbf-` | `fbf-btn`, `fbf-panel` |
| AJAX actions | `fbf_` | `fbf_save_settings` |
| WP option keys | `fbf_` | `fbf_settings` |

---

## FBF-Specific Rules

- **No build process:** Pure PHP/JS/CSS. Hard-refresh (Ctrl+Shift+R) after JS/CSS edits.
- **Data persistence:** WP Options table only — no custom database tables.
- **`security-fixes-patch.php`:** This file applies security patches to the plugin bootstrap. Do not remove it or merge its contents into the main plugin file without verifying all patches are accounted for.

---

## JimRForge UI Standards — FBF Implementation

FSF v1.2.4 is the canonical UI prototype. Match it exactly for all visual work.
Full reference: `E:\projects\JIMRFORGE-UI-STANDARDS.md`

### Brand

- Organization name: **Jim R Forge** — not "JimRWeb", not "JimRForge"
- Author URI: https://jimrforge.com

### Color System — Exact Values

```css
:root {
    --clr-primary:    #3d2f1f;    --clr-secondary:  #6d4c2f;    --clr-tertiary:   #86400e;
    --clr-accent:     #f4c542;    --clr-btn-hover:  #dda824;
    --clr-age-bg:     #faf6f0;    --clr-card-bg:    #ffffff;    --clr-light:      #faf9f6;    --clr-white: #fff;
    --clr-txt:        #6d4c2f;    --clr-txt-light:  #faf9f6;    --clr-txt-muted:  #64748b;
    --clr-link:       #ce6565;    --clr-link-hover: #b54545;
    --clr-border:     #c9b89a;
    --clr-shadow-sm:  0 1px 2px rgba(61, 47, 31, 0.08);
    --clr-shadow-md:  0 4px 6px rgba(61, 47, 31, 0.12);
    --clr-shadow-lg:  0 10px 20px rgba(61, 47, 31, 0.15);
    --clr-shadow-xl:  0 20px 30px rgba(61, 47, 31, 0.18);
    --clr-success: #059669; --clr-success-bg: #ecfdf5;
    --clr-error:   #dc2626; --clr-error-bg:   #fee2e2;
    --clr-warning: #f59e0b; --clr-warning-bg: #fef3c7;
    --clr-info:    #3b82f6; --clr-info-bg:    #dbeafe;
}
```

### Typography

- **Font:** Inter (locally loaded, WOFF2); Base: 16px; Weights: 400, 500, 600, 700

```css
--fs-xxs: 11px; --fs-xs: 13px; --fs-sm: 14px; --fs-md: 16px;
--fs-lg: 18px;  --fs-xl: 20px; --fs-xxl: 24px; --fs-xxxl: 32px;
```

### Spacing Scale

```css
--sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px;
--sp-5: 20px; --sp-6: 24px; --sp-8: 32px; --sp-9: 36px;
```

### Primary Button — `.fbf-btn`

- Background: `--clr-accent`, Text: `--clr-primary`; Font: 14px/600; sentence case in HTML; no border; radius 8px; padding 8px 16px
- Hover: `--clr-btn-hover`, `transform: translate(-2px, -2px)`; Dashicons: `margin-top: 3px`, 8px gap. **No icons in modal buttons.**

### Secondary — `.fbf-btn.fbf-btn-secondary`

Background: `#64748b`, Text: white `!important`; Hover: `#475569`

### Danger — `.fbf-btn.fbf-btn-danger`

Background: `#dc2626`, Text: white; Hover: `#b91c1c`, `transform: translate(-2px, -2px)`

### Standard Dashicon Assignments

Reset/Undo: `dashicons-undo` · Save: `dashicons-yes` · Add: `dashicons-plus-alt` · Delete: `dashicons-trash` · Copy: `dashicons-clipboard` · Export: `dashicons-download` · Import: `dashicons-upload`

### Forge Header

Every admin page: `assets/images/forge-banner.png` + `assets/css/forge-header.css`

### Accessibility — WCAG 2.1 AA minimum

Focus: `2px solid var(--clr-accent)`, `outline-offset: 2px`. All icon-only buttons: `aria-label`. Full keyboard navigation.
