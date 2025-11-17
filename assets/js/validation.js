/**
 * Validation System
 *
 * Input validation and auto-correction for button properties
 *
 * @package FluidButtonForge
 * @version 1.1.0
 * @author Jim Roberts (Jim R Forge)
 */

import { getData } from './state.js';

// ========================================================================
// VALIDATION LIMITS
// ========================================================================

/**
 * Get property validation limits
 * @param {string} property - Property name
 * @returns {object} Min/max limits for the property
 */
export function getPropertyLimits(property) {
    const limits = {
        // Dimensional properties (support both px and rem)
        width: {
            minPx: 30,
            maxPx: 800,
            minRem: 1.875,
            maxRem: 50
        },
        height: {
            minPx: 20,
            maxPx: 150,
            minRem: 1.25,
            maxRem: 9.375
        },
        paddingX: {
            minPx: 0,
            maxPx: 50,
            minRem: 0,
            maxRem: 3.125
        },
        paddingY: {
            minPx: 0,
            maxPx: 30,
            minRem: 0,
            maxRem: 1.875
        },

        // Fixed pixel properties
        fontSize: {
            min: 10,
            max: 32
        },
        borderRadius: {
            min: 0,
            max: 100
        },
        borderWidth: {
            min: 0,
            max: 8
        }
    };

    return limits[property] || { min: 0, max: 1000 };
}

// ========================================================================
// VALIDATION FUNCTIONS
// ========================================================================

/**
 * Validate and auto-correct a value based on property limits
 * @param {HTMLElement} input - Input element
 * @param {number} value - Value to validate
 * @param {string} property - Property name
 * @returns {number} Validated/corrected value
 */
export function validateAndCorrectValue(input, value, property) {
    const limits = getPropertyLimits(property);
    const unitType = getData().settings.unitType;

    let min, max;

    // Determine limits based on unit type and property
    if (['fontSize', 'borderRadius', 'borderWidth'].includes(property)) {
        // Fixed pixel properties
        min = limits.min;
        max = limits.max;
    } else {
        // Dimensional properties that support px/rem
        if (unitType === 'rem') {
            min = limits.minRem;
            max = limits.maxRem;
        } else {
            min = limits.minPx;
            max = limits.maxPx;
        }
    }

    // Validate and correct
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    }

    return value;
}

/**
 * Update input limits based on current unit type
 * @param {string} unitType - Unit type (px or rem)
 */
export function updateInputLimitsForUnit(unitType) {
    document.querySelectorAll('.card-property-input').forEach(input => {
        const property = input.getAttribute('data-property');

        if (['fontSize', 'borderRadius', 'borderWidth'].includes(property)) {
            // Fixed pixel properties don't change
            return;
        }

        // Update dimensional property limits
        const limits = getPropertyLimits(property);

        if (unitType === 'rem') {
            input.setAttribute('min', limits.minRem);
            input.setAttribute('max', limits.maxRem);
            input.setAttribute('step', '0.1');
        } else {
            input.setAttribute('min', limits.minPx);
            input.setAttribute('max', limits.maxPx);
            input.setAttribute('step', '1');
        }
    });
}

/**
 * Show visual validation feedback
 * @param {HTMLElement} input - Input element
 * @param {string} type - Feedback type ('error' or 'corrected')
 */
export function showValidationFeedback(input, type) {
    // Remove existing feedback
    input.classList.remove('validation-error', 'validation-corrected');

    if (type === 'error') {
        input.classList.add('validation-error');
        setTimeout(() => input.classList.remove('validation-error'), 2000);
    } else if (type === 'corrected') {
        input.classList.add('validation-corrected');
        setTimeout(() => input.classList.remove('validation-corrected'), 2000);
    }
}

/**
 * Initialize input validation limits
 */
export function initializeInputLimits() {
    const unitType = getData().settings.unitType;
    updateInputLimitsForUnit(unitType);
}
