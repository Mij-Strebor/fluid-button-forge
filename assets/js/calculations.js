/**
 * Calculation Functions
 *
 * CSS clamp() generation and responsive calculations
 *
 * @package FluidButtonForge
 * @version 1.1.0
 * @author Jim Roberts (Jim R Forge)
 */

import { getData } from './state.js';

// ========================================================================
// CSS CLAMP GENERATION
// ========================================================================

/**
 * Generate CSS clamp() function for fluid typography/spacing
 *
 * @param {number} minValue - Minimum value
 * @param {number} maxValue - Maximum value
 * @param {number} minViewport - Minimum viewport width (px)
 * @param {number} maxViewport - Maximum viewport width (px)
 * @param {string} unitType - Unit type (px or rem)
 * @returns {string} CSS clamp() function
 */
export function generateClampFunction(minValue, maxValue, minViewport, maxViewport, unitType) {
    // If min and max values are the same, just return the constant value
    if (minValue === maxValue) {
        if (minValue === 0) {
            return '0';
        }
        return unitType === 'rem' ?
            (minValue / 16).toFixed(3).replace(/\.?0+$/, '') + 'rem' :
            minValue + 'px';
    }

    const minPx = unitType === 'rem' ? minValue * 16 : minValue;
    const maxPx = unitType === 'rem' ? maxValue * 16 : maxValue;

    const coefficient = ((maxPx - minPx) / (maxViewport - minViewport) * 100);
    const constant = minPx - (coefficient * minViewport / 100);

    const minUnit = unitType === 'rem' ? (minPx / 16).toFixed(3) + 'rem' : minPx + 'px';
    const maxUnit = unitType === 'rem' ? (maxPx / 16).toFixed(3) + 'rem' : maxPx + 'px';

    const constantFormatted = unitType === 'rem' ?
        (constant / 16).toFixed(4) + 'rem' :
        constant.toFixed(2) + 'px';
    const coefficientFormatted = coefficient.toFixed(4) + 'vw';

    const preferredValue = constant === 0 ?
        coefficientFormatted :
        `calc(${constantFormatted} + ${coefficientFormatted})`;

    return `clamp(${minUnit}, ${preferredValue}, ${maxUnit})`;
}

// ========================================================================
// BUTTON PROPERTY CALCULATIONS
// ========================================================================

/**
 * Calculate button property based on size ID and settings
 *
 * @param {number} sizeId - Button size ID
 * @param {string} property - Property name
 * @param {object} settings - Settings object
 * @returns {object} Min/max values for the property
 */
export function calculateButtonProperty(sizeId, property, settings) {
    const currentSizes = getData().classSizes;
    const buttonItem = currentSizes.find(item => item.id === sizeId);

    if (!buttonItem || !buttonItem[property]) {
        return {
            min: settings.minBaseSize || 16,
            max: settings.maxBaseSize || 20
        };
    }

    // Get the button's defined property value
    let buttonValue = buttonItem[property];

    // Convert stored value to pixels if needed
    // If unit is REM and stored value looks like REM (< 20), convert to pixels
    if (settings.unitType === 'rem' && buttonValue < 20 && ['width', 'height', 'paddingX', 'paddingY'].includes(property)) {
        buttonValue = buttonValue * 16; // Convert REM to pixels for calculation
    }

    // Get the scaling ratios from settings
    const minRatio = settings.minBaseSize / settings.maxBaseSize; // e.g., 16/20 = 0.8
    const maxRatio = 1.0; // Always 100% at max viewport

    // Scale the button property proportionally
    const minSize = Math.round(buttonValue * minRatio);
    const maxSize = buttonValue;

    return {
        min: minSize,
        max: maxSize
    };
}

// ========================================================================
// PREVIEW SCALING
// ========================================================================

/**
 * Get minimum value for a property to ensure readability
 *
 * @param {string} property - Property name
 * @returns {number} Minimum value
 */
export function getMinValue(property) {
    switch (property) {
        case 'width':
            return 40;
        case 'height':
            return 20;
        case 'paddingX':
            return 4;
        case 'paddingY':
            return 2;
        case 'fontSize':
            return 10;
        case 'borderRadius':
            return 0; // Allow perfectly square corners
        case 'borderWidth':
            return 0; // Allow no border
        default:
            return 1;
    }
}
