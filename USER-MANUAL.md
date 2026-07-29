# Fluid Button Forge — User Manual

**Version 1.0.0**
Responsive button design system with CSS `clamp()` generation and per-state color management.

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Accessing the Tool](#accessing-the-tool)
4. [Interface Overview](#interface-overview)
5. [Settings Panel](#settings-panel)
6. [Button Classes Panel](#button-classes-panel)
7. [Editing a Button Card](#editing-a-button-card)
8. [Color System](#color-system)
9. [Live Preview](#live-preview)
10. [Generated CSS](#generated-css)
11. [Saving and Autosave](#saving-and-autosave)
12. [Reset and Clear All](#reset-and-clear-all)
13. [How the CSS Is Built](#how-the-css-is-built)
14. [Data Storage](#data-storage)
15. [Technical Requirements](#technical-requirements)
16. [What This Plugin Does Not Do](#what-this-plugin-does-not-do)

---

## Overview

Fluid Button Forge is a WordPress admin tool for building responsive button systems. It generates CSS `clamp()` functions so button dimensions (width, height, padding, font size, border radius, border width) scale smoothly between a minimum and maximum viewport width, instead of jumping at fixed breakpoints.

Each button class supports four independent states — **Normal**, **Hover**, **Active**, and **Disabled** — each with its own background, text, and border color.

The tool is admin-only. It has no public-facing shortcode or front-end output; you copy the generated CSS out of the admin page and paste it into your theme or page builder.

## Installation

### From a ZIP file

1. In WordPress admin, go to **Plugins → Add New → Upload Plugin**.
2. Select the plugin ZIP and click **Install Now**.
3. Click **Activate Plugin**.

### From GitHub (development installs)

```
cd wp-content/plugins
git clone https://github.com/Mij-Strebor/fluid-button-forge.git
```

Then activate it from **Plugins** in WordPress admin.

**Requirements:** WordPress 5.8+, PHP 7.4+.

## Accessing the Tool

Go to **Tools → Fluid Button Forge**.

Access requires the `manage_options` WordPress capability — by default, Administrators only.

## Interface Overview

The admin page is organized top to bottom as:

1. **About Fluid Button Forge** — collapsible summary panel
2. **How to Use Fluid Button Forge** — collapsible quick-reference panel
3. **Settings** — the global viewport/unit configuration
4. **Button Classes** — one card per button, where all editing happens
5. **Button Preview** — live preview at minimum and maximum viewport sizes
6. **Selected Button CSS** — CSS for whichever button card is currently selected
7. **Generated CSS (All Button Classes)** — CSS for every button class

The **About** and **How to Use** sections can be collapsed or expanded by clicking their header bars.

## Settings Panel

Controls that apply globally to every button class:

| Setting | Purpose | Default |
|---|---|---|
| Min Viewport Font Size (px) | Button size at the smallest screen width | 16px |
| Min Viewport Width (px) | Screen width where the minimum size applies | 375px |
| Max Viewport Font Size (px) | Button size at the largest screen width | 20px |
| Max Viewport Width (px) | Screen width where the maximum size applies | 1620px |
| Button Units | **PX** (fixed pixel sizing) or **REM** (scales with the user's browser font size) | PX |

Changing units converts all existing button property values between px and rem automatically (font size, border radius, and border width always stay in pixels).

Changing any setting immediately recalculates the live preview and generated CSS.

## Button Classes Panel

This is the main working area. Each button class (e.g. `btn-sm`, `btn-md`, `btn-lg`) is shown as a card in a two-column grid.

### Default button classes

| Class | Width | Height | Font Size |
|---|---|---|---|
| `btn-sm` | 120px | 32px | 14px |
| `btn-md` | 160px | 40px | 16px |
| `btn-lg` | 200px | 48px | 18px |

### Creating a new button class

Enter a unique name in the new-button field above the card grid and press **Enter**. The plugin rejects names that duplicate an existing class and prompts you to choose another. New buttons start with sensible default dimensions and the same four-state color defaults as the built-in classes.

### Card-level actions

Each card header has:

- **duplicate** — creates a copy of that button with a unique auto-generated name (e.g. `btn-md-copy`)
- **delete** — removes the button after a confirmation prompt

## Editing a Button Card

Every field on a card is edited inline — there are no separate edit forms or modal dialogs.

- **Name** — click the name text in the card header, type the new name, and press Enter or click away to save. Escape reverts the edit.
- **Properties panel** — click into any of these fields and type a new value:
  - Width
  - Height
  - Padding X
  - Padding Y
  - Font Size (always px)
  - Border Radius (always px)
  - Border Width (always px)

  Out-of-range values are auto-corrected to the nearest valid value.

A small live preview button sits at the top of each card and updates immediately as you edit.

## Color System

Each button card has its own **States** and **Colors** section, independent of every other button.

### States

Four state buttons — **Normal**, **Hover**, **Active**, **Disabled** — let you select which state you're currently editing colors for. The active state is highlighted.

### Colors (per state)

- **Background** — color picker
- **Text** — color picker
- **Border** — color picker (only enabled when **Show Border** is checked)
- **Show Border** — checkbox that toggles whether that state renders a border at all

Colors are stored per button, per state — changing the Hover color on `btn-md` has no effect on any other button or state.

Internally, colors default to CSS custom properties (e.g. `var(--clr-accent)`) that resolve against your site's design tokens; the color pickers display and let you override the resolved value directly.

## Live Preview

The **Button Preview** section shows every button class rendered at two sizes side by side:

- **Min Size (Small Screens)** — rendered at the configured minimum viewport width
- **Max Size (Large Screens)** — rendered at the configured maximum viewport width

Each preview button reflects the currently selected state's colors for that card.

## Generated CSS

Two CSS output panels are always kept in sync with your edits:

- **Selected Button CSS** — click any button card (on the card background, not on an input or button) to select it; its complete CSS — base class plus all four state rules — appears here. Click **copy** to copy it to the clipboard.
- **Generated CSS (All Button Classes)** — the combined CSS for every button class on the page. Click **copy all** to copy everything at once.

## Saving and Autosave

- **Autosave** is enabled by default (checkbox in the Button Classes panel header). While on, all settings, button classes, and colors are saved automatically every 30 seconds.
- Click **save** to save immediately without waiting for the autosave interval.
- A status indicator next to the save controls shows **Ready**, **Saving...**, **Saved!**, or **Error**.

Saving requires a valid WordPress nonce and the `manage_options` capability; it is rejected otherwise.

## Reset and Clear All

- **reset** — replaces all current button classes with the original three defaults (`btn-sm`, `btn-md`, `btn-lg`). Requires confirmation. Any custom buttons are lost.
- **clear all** — removes every button class, leaving an empty list. Requires confirmation.

Neither action is reversible once confirmed (aside from re-creating the buttons manually).

## How the CSS Is Built

For each button class, the plugin calculates a `clamp()` value for every scalable property (width, height, padding, font size, border radius, border width) using your configured min/max viewport widths and min/max sizes. The generated class includes:

- Fixed layout properties (`display: inline-flex`, `align-items: center`, `justify-content: center`, etc.)
- Clamp-based sizing for width, height, padding, font size, border radius, and border width
- A separate CSS rule per state: the base class for **Normal**, and `:hover`, `:active` pseudo-class selectors (plus a modifier-style rule) for the other states, each with that state's background, text color, and border

Copy the output directly into your theme's stylesheet, a custom CSS panel, or a page builder's custom CSS field, then apply the class name (e.g. `btn-md`) to your button markup.

## Data Storage

All plugin data is stored in the WordPress options table via the WordPress Options API — no custom database tables, no files written to disk:

| Option key | Contents |
|---|---|
| `button_design_settings` | Viewport range, unit type, autosave preference |
| `button_design_class_sizes` | All button classes and their dimension properties |
| `button_design_colors` | Default color set used for new/uninitialized buttons |

Uninstalling the plugin (via `uninstall.php`) removes this stored data.

## Technical Requirements

- WordPress 5.8 or higher
- PHP 7.4 or higher
- A modern browser with CSS `clamp()` support (Chrome 79+, Firefox 75+, Safari 13.1+, Edge 79+)

## What This Plugin Does Not Do

To avoid confusion with older or aspirational documentation, note that the current version (1.0.0) does **not** include:

- Elementor-specific integration, sync, or a dedicated Elementor panel
- Import/export of button configurations (JSON or otherwise)
- Button categories or grouping (this is a planned future feature — see `ROADMAP.md`)
- Drag-and-drop reordering of button cards
- A gradient editor in the UI (gradient color data exists internally for some default states but is not editable through the interface)
- Any public-facing shortcode, block, or widget — it is an admin-only CSS generator

---

*Fluid Button Forge is part of the Jim R Forge CSS Tools series. Developed by Jim Roberts (Jim R Forge) — [jimrforge.com](https://jimrforge.com).*
