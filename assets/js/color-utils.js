/**
 * Color Utilities
 *
 * Color data normalization and CSS variable resolution
 *
 * @package FluidButtonForge
 * @version 1.1.0
 * @author Jim Roberts (Jim R Forge)
 */

// ========================================================================
// COLOR DATA NORMALIZATION
// ========================================================================

/**
 * Normalize color data structure
 * Handles multiple color data formats (legacy and current)
 *
 * @param {object} colors - Color data object
 * @returns {object} Normalized color data
 */
export function normalizeColorData(colors) {
    if (!colors) return {};

    const normalized = {};

    Object.keys(colors).forEach(state => {
        const stateColors = colors[state];
        let backgroundColor;

        // Handle newer background object structure (priority)
        if (stateColors.background && typeof stateColors.background === 'object') {
            backgroundColor = stateColors.background.solid ||
                            stateColors.background.gradient?.stops?.[0]?.color ||
                            'var(--clr-accent)';
        }
        // Handle old background1/background2 structure
        else if (stateColors.background1) {
            backgroundColor = stateColors.background1;
        }
        // Handle simple background string
        else if (stateColors.background) {
            backgroundColor = stateColors.background;
        }
        // Fallback
        else {
            backgroundColor = 'var(--clr-accent)';
        }

        normalized[state] = {
            background: backgroundColor,
            text: stateColors.text || 'var(--clr-btn-txt)',
            border: stateColors.border || 'var(--clr-btn-bdr)',
            useBorder: stateColors.useBorder !== false
        };
    });

    return normalized;
}

// ========================================================================
// CSS VARIABLE RESOLUTION
// ========================================================================

/**
 * Resolve CSS variable to its mapped value
 * Used for color inputs which need actual hex values
 *
 * @param {string} cssValue - CSS variable or hex color
 * @returns {string} Mapped value or original value
 */
export function resolveCSSVariableToHex(cssValue) {
    // Map of CSS variables to their values
    // This allows the color inputs to work while keeping CSS variables in the data
    const cssVariableMap = {
        'var(--clr-accent)': 'var(--clr-accent)',
        'var(--clr-btn-txt)': 'var(--clr-btn-txt)',
        'var(--clr-btn-bdr)': 'var(--clr-btn-bdr)',
        'var(--clr-btn-hover)': 'var(--clr-btn-hover)',
        'var(--clr-secondary)': 'var(--clr-secondary)',
        'var(--clr-gray-300)': 'var(--clr-gray-300)',
        'var(--clr-gray-600)': 'var(--clr-gray-600)',
        'var(--clr-gray-500)': 'var(--clr-gray-500)'
    };

    // Return mapped value if it's a CSS variable, otherwise return the original value
    return cssVariableMap[cssValue] || cssValue;
}

/**
 * Normalize color data for input elements
 * Resolves CSS variables to usable values for color inputs
 *
 * @param {object} colors - Color data object
 * @returns {object} Normalized color data with resolved CSS variables
 */
export function normalizeColorDataForInputs(colors) {
    if (!colors) return {};

    const normalized = {};

    Object.keys(colors).forEach(state => {
        const stateColors = colors[state];
        let backgroundColor;

        // Handle newer background object structure (priority)
        if (stateColors.background && typeof stateColors.background === 'object') {
            backgroundColor = stateColors.background.solid ||
                            stateColors.background.gradient?.stops?.[0]?.color ||
                            'var(--clr-accent)';
        }
        // Handle old background1/background2 structure
        else if (stateColors.background1) {
            backgroundColor = stateColors.background1;
        }
        // Handle simple background string
        else if (stateColors.background) {
            backgroundColor = stateColors.background;
        }
        // Fallback
        else {
            backgroundColor = 'var(--clr-accent)';
        }

        normalized[state] = {
            background: resolveCSSVariableToHex(backgroundColor),
            text: resolveCSSVariableToHex(stateColors.text || 'var(--clr-btn-txt)'),
            border: resolveCSSVariableToHex(stateColors.border || 'var(--clr-btn-bdr)'),
            useBorder: stateColors.useBorder !== false
        };
    });

    return normalized;
}
