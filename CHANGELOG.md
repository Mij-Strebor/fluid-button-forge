# Changelog

All notable changes to Fluid Button Forge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-16

### Added

**Initial Release - Complete Button Design System**

- 🎨 **Responsive Button Generator:** Create fluid button designs using CSS `clamp()` functions
  - Buttons scale smoothly from mobile to desktop viewports
  - All properties scale proportionally (width, height, padding, font size, border radius)
  - Support for both `px` and `rem` units

- 🎭 **Complete State Management:** Design all four button states
  - **Normal State:** Default button appearance
  - **Hover State:** Mouse-over styling
  - **Active State:** Clicked/pressed appearance
  - **Disabled State:** Non-interactive state styling

- 🎨 **Advanced Color System:**
  - Support for solid colors (hex codes, color names)
  - Support for CSS custom properties (`var(--clr-accent)`)
  - Gradient support (linear and radial) with multiple color stops
  - Independent color control per button state (background, text, border)
  - Border toggle per state (enable/disable borders independently)

- ✏️ **Inline Editing Interface:**
  - Click any property value to edit in place
  - Edit button names directly in card headers
  - No complex forms or modal dialogs required
  - Instant visual feedback

- 👁️ **Live Preview System:**
  - Real-time button previews showing all four states
  - See buttons at different screen sizes
  - Interactive hover/active state demonstrations
  - Disabled state visualization

- ⚙️ **Flexible Configuration:**
  - Viewport settings (min/max viewport widths: 375px - 1620px)
  - Base font size settings (min/max base sizes: 16px - 20px)
  - Unit type selection (PX or REM)
  - Customizable button properties per size

- 📋 **Default Button Sizes:**
  - **btn-sm:** Small buttons (120px × 32px, 14px font)
  - **btn-md:** Medium buttons (160px × 40px, 16px font)
  - **btn-lg:** Large buttons (200px × 48px, 18px font)

- 📤 **CSS Output Generation:**
  - Copy ready-to-use CSS code with clamp() functions
  - Includes all button states (normal, hover, active, disabled)
  - Formatted for easy integration into stylesheets

- 🔧 **Button Property Controls:**
  - Width (pixels)
  - Height (pixels)
  - Padding X (horizontal padding)
  - Padding Y (vertical padding)
  - Font Size (button text size)
  - Border Radius (corner rounding)
  - Border Width (when borders enabled)

- 🎯 **WordPress Integration:**
  - Admin menu under "J Forge" parent menu
  - AJAX-powered save system with WordPress nonces
  - WordPress Options API for data persistence
  - Capability checks (`manage_options`)

- 🎨 **Professional UI:**
  - Collapsible About section with plugin information
  - Collapsible How to Use guide with step-by-step instructions
  - Settings panel with tooltips on hover
  - Clean, modern interface using Tailwind CSS

- 🔐 **Security Features:**
  - WordPress nonce verification for AJAX requests
  - Input sanitization and validation
  - Capability checks for admin access
  - Direct access prevention

### Technical Details

- **Version:** 1.0.0
- **Minimum WordPress:** 5.8
- **Minimum PHP:** 7.4
- **Main Class:** `ButtonDesignCalculator`
- **Database Options:**
  - `button_design_settings` - Global plugin settings
  - `button_design_class_sizes` - Button size configurations
  - `button_design_colors` - Color schemes for button states
- **File Structure:** Single-file plugin (monolithic architecture)
- **Dependencies:** Tailwind CSS (CDN), WordPress jQuery

### Known Limitations

- Single-file architecture (planned refactor to modular structure)
- No automated testing suite
- Limited to admin interface (no public-facing shortcodes)
- No WordPress.org release yet (planned for future version)

### Browser Support

CSS `clamp()` function requires:
- Chrome 79+
- Firefox 75+
- Safari 13.1+
- Edge 79+

### Credits

- **Developer:** Jim Roberts (Jim R Forge)
- **Development Assistant:** Claude AI (Anthropic)
- **Organization:** Jim R Forge
- **Website:** https://jimrforge.com

---

**Next Steps for v1.1.0:**
- Refactor to modular plugin structure (separate classes, templates, assets)
- Add JimRForge UI Standards compliance (forge header, brand colors)
- Implement autosave functionality
- Add reset/clear controls
- Improve accessibility (WCAG AA compliance)
- Add comprehensive documentation

---

*Initial release - November 16, 2025*
