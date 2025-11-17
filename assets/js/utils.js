/**
 * Utility Functions
 *
 * Helper functions and utilities for Fluid Button Forge
 *
 * @package FluidButtonForge
 * @version 1.1.0
 * @author Jim Roberts (Jim R Forge)
 */

import { getData } from './state.js';

// ========================================================================
// DEFAULT DATA
// ========================================================================

/**
 * Restore default button data
 */
export function restoreDefaults() {
    const data = getData();
    data.classSizes = [
        {
            id: 1,
            className: 'btn-sm',
            width: 120,
            height: 32,
            paddingX: 12,
            paddingY: 6,
            fontSize: 14,
            borderRadius: 4,
            borderWidth: 1
        },
        {
            id: 2,
            className: 'btn-md',
            width: 160,
            height: 40,
            paddingX: 16,
            paddingY: 8,
            fontSize: 16,
            borderRadius: 6,
            borderWidth: 2
        },
        {
            id: 3,
            className: 'btn-lg',
            width: 200,
            height: 48,
            paddingX: 20,
            paddingY: 10,
            fontSize: 18,
            borderRadius: 8,
            borderWidth: 2
        }
    ];
}

// ========================================================================
// NAME GENERATION
// ========================================================================

/**
 * Generate a unique duplicate name
 *
 * @param {string} originalName - Original button name
 * @param {Array} currentData - Array of current button data
 * @returns {string} Unique duplicate name
 */
export function generateDuplicateName(originalName, currentData) {
    let baseName = originalName.replace(/-copy(-\d+)?$/, '');
    let counter = 1;
    let newName = `${baseName}-copy`;

    while (currentData.some(item => item.className === newName)) {
        counter++;
        newName = `${baseName}-copy-${counter}`;
    }

    return newName;
}

// ========================================================================
// UNIT CONVERSION
// ========================================================================

/**
 * Convert value for display based on current unit type
 *
 * @param {number} value - Value to convert
 * @param {string} property - Property name
 * @returns {number} Converted value for display
 */
export function convertValueForDisplay(value, property) {
    const unitType = getData().settings.unitType;
    const isRem = unitType === 'rem';

    // fontSize, borderRadius, borderWidth always stay in pixels
    if (['fontSize', 'borderRadius', 'borderWidth'].includes(property)) {
        return value;
    }

    // Convert width, height, padding to current unit for display
    if (isRem) {
        // For default buttons (sm, md, lg), assume stored values are pixels and convert to rem
        // For width/height: assume pixels if > 10, for padding: assume pixels if > 2
        const isLikelyPixels = (['width', 'height'].includes(property) && value > 10) ||
            (['paddingX', 'paddingY'].includes(property) && value > 2);

        if (isLikelyPixels) {
            return parseFloat((value / 16).toFixed(3));
        }
    }

    return value;
}

// ========================================================================
// SUCCESS MESSAGES
// ========================================================================

/**
 * Show a success message toast
 *
 * @param {string} text - Message text
 */
export function showSuccessMessage(text) {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50px;
        right: 20px;
        background: var(--clr-success);
        color: white;
        padding: var(--sp-3) 16px;
        border-radius: var(--br-md);
        font-size: var(--fs-sm);
        font-weight: var(--fw-semibold);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transition: all 0.3s ease;
    `;
    message.textContent = text;

    document.body.appendChild(message);

    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 3000);
}

/**
 * Show duplicate success message
 *
 * @param {string} originalName - Original button name
 * @param {string} duplicateName - Duplicate button name
 */
export function showDuplicateSuccess(originalName, duplicateName) {
    showSuccessMessage(`✅ Duplicated "${originalName}" as "${duplicateName}"`);
}

/**
 * Show name update success message
 *
 * @param {string} buttonName - Updated button name
 */
export function showNameUpdateSuccess(buttonName) {
    showSuccessMessage(`✅ Renamed to "${buttonName}"`);
}

/**
 * Show button create success message
 *
 * @param {string} buttonName - Created button name
 */
export function showCreateSuccess(buttonName) {
    showSuccessMessage(`✅ Created button "${buttonName}"`);
}
