# Fluid Button Forge — Quick Start Guide

**Version 1.0.0**

Get from install to a copy-ready, responsive button CSS system in about five minutes.

---

## 1. Install and Activate

1. In WordPress admin, go to **Plugins → Add New → Upload Plugin**.
2. Choose the Fluid Button Forge ZIP file and click **Install Now**.
3. Click **Activate Plugin**.

## 2. Open the Tool

Go to **Tools → Fluid Button Forge** in the WordPress admin menu.

(Requires the `manage_options` capability — Administrators only, by default.)

## 3. Set Your Scaling Range

At the top of the page, under **Settings**, set:

- **Min Viewport Font Size** — the smallest button text size (default 16px)
- **Min Viewport Width** — the screen width that size applies at (default 375px)
- **Max Viewport Font Size** — the largest button text size (default 20px)
- **Max Viewport Width** — the screen width that size applies at (default 1620px)
- **Button Units** — **PX** or **REM**

Every button's dimensions scale proportionally between these two endpoints using CSS `clamp()`.

## 4. Edit a Button

The plugin ships with three default button classes: `btn-sm`, `btn-md`, and `btn-lg`. Each appears as a card under **Button Classes**.

On any card, you can:

- Click the **name** in the card header to rename it
- Click any value in the **Properties** panel (Width, Height, Padding X, Padding Y, Font Size, Border Radius, Border Width) to edit it inline
- Use the **Normal / Hover / Active / Disabled** state buttons to switch which state you're editing, then set its **Background**, **Text**, and **Border** colors and toggle **Show Border**

Changes update the live preview and generated CSS instantly — there's no separate "apply" step per field.

## 5. Add a New Button (Optional)

Type a name in the **new button** field above the card grid and press **Enter** (or click the add control) to create a new button class with default values, ready to customize.

## 6. Save Your Work

- **Autosave** is on by default and saves automatically every 30 seconds while you work.
- Click **save** at any time to save immediately.

Data is stored in the WordPress options table — nothing is written to files.

## 7. Get Your CSS

- Click any button card to select it, then use **copy** under **Selected Button CSS** to copy just that button's CSS.
- Use **copy all** under **Generated CSS (All Button Classes)** to copy CSS for every button class at once.

Paste the copied CSS into your theme's stylesheet or Elementor's custom CSS field. Apply the class name (e.g. `btn-md`) to any button element.

---

That's the core workflow. For the full settings reference, color system details, and every control on the page, see the [User Manual](user-manual.md).
