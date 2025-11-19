# Fluid Button Forge

**Professional responsive button design system for WordPress**

A WordPress plugin that generates responsive button designs using CSS `clamp()` functions. Create consistent, scalable buttons with state management (normal, hover, active, disabled) that adapt beautifully from mobile to desktop.

![WordPress Plugin Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![WordPress](https://img.shields.io/badge/wordpress-5.8+-green.svg)
![PHP](https://img.shields.io/badge/php-7.4+-purple.svg)
![License](https://img.shields.io/badge/license-GPL--2.0+-red.svg)

## 🚀 Why Fluid Button Forge?

- **Responsive Button Sizing**: Generate CSS `clamp()` functions for buttons that scale fluidly across all device sizes
- **Complete State Management**: Design all four button states (Normal, Hover, Active, Disabled) with full color control
- **Inline Editing**: Click any value to modify it - no complex forms or modal dialogs
- **Live Preview**: See your buttons at different screen sizes and states in real-time
- **Flexible Color System**: Support for solid colors, gradients, and CSS custom properties
- **Border Control**: Toggle borders on/off per button state
- **CSS Output**: Copy ready-to-use CSS with clamp() functions for your projects
- **Dual Units**: Support for both `px` and `rem` units
- **Professional Defaults**: Pre-configured button sizes (small, medium, large)
- **Elementor Integration**: Works seamlessly with Elementor color schemes

## 🎯 Perfect For

- Call-to-Action buttons
- Primary navigation buttons
- Secondary action buttons
- Form submit buttons
- Download/purchase buttons
- Any interactive button system that needs consistent sizing across devices

## 🛠 Installation

### Manual Installation

1. Download the plugin ZIP file
2. Go to **Plugins > Add New > Upload Plugin**
3. Choose the ZIP file and click **Install Now**
4. Click **Activate Plugin**
5. Access via **J Forge > Fluid Button** in the admin menu

### From GitHub

1. Clone this repository to your WordPress plugins directory:
   ```bash
   cd wp-content/plugins
   git clone https://github.com/Mij-Strebor/fluid-button-forge.git
   ```
2. Activate the plugin in WordPress admin
3. Access via **J Forge > Fluid Button**

## 🎯 Quick Start

1. **Configure Settings**: Set viewport range and base font sizes
2. **Design Buttons**: Click any property value to edit inline (width, height, padding, font size, border radius)
3. **Customize Colors**: Set colors for each button state (normal, hover, active, disabled)
4. **Preview Buttons**: See live previews at different screen sizes and states
5. **Copy CSS**: Export your generated CSS code with clamp() functions

## 📊 How It Works

The plugin uses CSS `clamp()` functions to create buttons that scale smoothly between minimum and maximum viewport sizes:

```css
/* Example output for a medium button */
.btn-md {
  width: clamp(140px, calc(120px + 2.5vw), 160px);
  height: clamp(36px, calc(32px + 1vw), 40px);
  padding: clamp(14px, calc(12px + 0.5vw), 16px) clamp(14px, calc(12px + 1vw), 16px);
  font-size: clamp(14.4px, calc(12.8px + 0.4vw), 16px);
  border-radius: clamp(5.4px, calc(4.8px + 0.15vw), 6px);
}

.btn-md:hover {
  background: var(--clr-btn-hover);
}

.btn-md:active {
  background: #DAA520;
}

.btn-md:disabled {
  background: var(--jimr-gray-300);
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Mathematical Foundation

- **Linear Interpolation**: Smooth transitions between viewport breakpoints
- **Proportional Scaling**: All button properties scale proportionally
- **State Consistency**: Color and border settings persist across states

## 🎨 Configuration Options

### Viewport Settings
- **Min Viewport Font Size**: Button base size at smallest screen (default: 16px)
- **Max Viewport Font Size**: Button base size at largest screen (default: 20px)
- **Min Viewport Width**: Smallest screen size (default: 375px)
- **Max Viewport Width**: Largest screen size (default: 1620px)

### Button Properties (Per Button)
- **Width**: Button width in pixels
- **Height**: Button height in pixels
- **Padding X**: Horizontal padding
- **Padding Y**: Vertical padding
- **Font Size**: Button text size
- **Border Radius**: Corner rounding
- **Border Width**: Border thickness (when enabled)

### Color Configuration (Per Button State)
- **Background**: Solid color, gradient, or CSS variable
- **Text Color**: Button text color
- **Border Color**: Border color (when enabled)
- **Use Border**: Toggle border on/off

## 💼 Button States

### Normal State
Default button appearance - the resting state before user interaction.

### Hover State
Appearance when user hovers over button with mouse cursor.

### Active State
Appearance when button is clicked/pressed or has focus.

### Disabled State
Appearance when button is disabled (not interactive).

## 🎨 Color System

Fluid Button Forge supports three color input methods:

1. **CSS Custom Properties**: `var(--clr-accent)`, `var(--clr-primary)`
2. **Solid Colors**: Hex codes like `#F4C542` or color names like `goldenrod`
3. **Gradients**: Linear or radial gradients with multiple color stops

## 🔧 Technical Requirements

- **WordPress**: 5.8 or higher
- **PHP**: 7.4 or higher
- **Browser**: Modern browsers with CSS `clamp()` support

## 🚨 Browser Support

CSS `clamp()` is supported in:
- ✅ Chrome 79+
- ✅ Firefox 75+
- ✅ Safari 13.1+
- ✅ Edge 79+

For older browsers, consider providing fallback button styles.

## 🎓 Usage Examples

### Basic Implementation
```html
<!-- HTML -->
<button class="btn-sm">Small Button</button>
<button class="btn-md">Medium Button</button>
<button class="btn-lg">Large Button</button>
```

```css
/* Copy generated CSS from plugin into your stylesheet */
.btn-md {
  width: clamp(140px, calc(120px + 2.5vw), 160px);
  height: clamp(36px, calc(32px + 1vw), 40px);
  /* ... additional properties ... */
}
```

### With CSS Variables
```css
/* Define your color scheme */
:root {
  --clr-accent: #F4C542;
  --clr-btn-txt: #3D2F1F;
  --clr-btn-hover: #DDA824;
}

/* Buttons automatically use these variables */
.btn-md {
  background: var(--clr-accent);
  color: var(--clr-btn-txt);
}

.btn-md:hover {
  background: var(--clr-btn-hover);
}
```

### Elementor Integration
When Elementor is active, Fluid Button Forge can integrate with your Elementor color scheme, allowing consistent button colors across your design system.

## 📋 Default Button Sizes

The plugin includes three pre-configured button sizes:

- **btn-sm**: Small buttons (120px wide, 32px tall, 14px font)
- **btn-md**: Medium buttons (160px wide, 40px tall, 16px font)
- **btn-lg**: Large buttons (200px wide, 48px tall, 18px font)

All sizes are fully customizable via inline editing.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup
1. Clone the repository
2. Install in WordPress development environment
3. Make changes and test thoroughly
4. Submit pull request with detailed description

## 🙏 Credits

**Fluid Button Forge** is part of the Jim R Forge CSS Tools series:
- **Jim Roberts (Jim R Forge)** - [JimRForge.com](https://jimrforge.com)
- **Claude AI** - [Anthropic](https://anthropic.com) (Development Assistant)

## 📄 License

This project is licensed under the GPL-2.0+ License - see the LICENSE file for details.

## Documentation

- 📘 **[User Manual](USER-MANUAL.md)** - Comprehensive guide with real-world use cases
- 📖 **[Quick Start Guide](docs/quick-start.md)** - Get started in 5 minutes *(coming soon)*
- 🔧 **[Troubleshooting](docs/troubleshooting.md)** - Common issues and solutions *(coming soon)*
- 💬 **[GitHub Discussions](https://github.com/Mij-Strebor/fluid-font-forge/discussions)** - Ask questions

## 🆘 Support

- **Issues**: Submit via [GitHub Issues](https://github.com/Mij-Strebor/fluid-button-forge/issues)
- **Documentation**: [User Manual](USER-MANUAL.md)
- **Email**: jim@jimrforge.com

## 🗺️ Roadmap

Future features under consideration:
- Icon integration support
- Animation presets for state transitions
- Export to Tailwind CSS config
- Button group utilities
- WordPress.org plugin directory submission

---

**Made with ❤️ for the WordPress community**

*Create beautiful, responsive button systems that scale perfectly across all devices.*
