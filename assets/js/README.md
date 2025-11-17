# Fluid Button Forge JavaScript Modules

Modular JavaScript architecture for Fluid Button Forge plugin.

## Module Structure

### Core Modules

- **state.js** - Global state management and data access
- **utils.js** - Utility functions and helpers
- **validation.js** - Input validation and auto-correction
- **calculations.js** - CSS calculation and clamp() generation

### Color & CSS

- **color-utils.js** - Color normalization and CSS variable resolution
- **css-generator.js** - CSS code generation for button classes

### Data Persistence

- **save-utils.js** - Save and autosave functionality

### UI Modules

- **panel-generator.js** - HTML panel generation (button cards)
- **preview-generator.js** - Button preview generation
- **event-handlers.js** - Event handler functions
- **event-listeners.js** - Event listener attachment

### Entry Points

- **init.js** - Initialization and DOMContentLoaded
- **main.js** - Main entry point (imports all modules)

## Module Dependencies

```
main.js
├── state.js (no dependencies)
├── utils.js → state.js
├── validation.js → state.js
├── calculations.js → state.js
├── color-utils.js (no dependencies)
├── css-generator.js → calculations.js, color-utils.js
├── save-utils.js → state.js
├── panel-generator.js → state.js, utils.js, color-utils.js
├── preview-generator.js → state.js, calculations.js, color-utils.js
├── event-handlers.js → All of the above
├── event-listeners.js → event-handlers.js
└── init.js → panel-generator.js, event-listeners.js, css-generator.js, validation.js
```

## Usage

The main.js file is enqueued by WordPress and serves as the entry point. All other modules are imported as ES6 modules.

## File Sizes

- state.js: ~2KB
- utils.js: ~4KB
- validation.js: ~4KB
- calculations.js: ~4KB
- color-utils.js: ~4KB
- css-generator.js: ~7KB
- save-utils.js: ~4KB
- panel-generator.js: ~15KB
- preview-generator.js: ~6KB
- event-handlers.js: ~20KB
- event-listeners.js: ~5KB
- init.js: ~3KB
- main.js: ~1KB

**Total:** ~80KB (vs. 2,020 lines inline JavaScript)

## Code Style

- ES6 module syntax (`import`/`export`)
- JSDoc comments for all functions
- Consistent error handling
- No global variables (except window.buttonDesignAjax from PHP)
