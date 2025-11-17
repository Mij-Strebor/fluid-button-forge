/**
 * Preview Generator
 *
 * Generate button preview displays for min and max viewports
 *
 * @package FluidButtonForge
 * @version 1.1.0
 * @author Jim Roberts (Jim R Forge)
 */

import { getData } from './state.js';
import { normalizeColorData } from './color-utils.js';
import { getMinValue } from './calculations.js';

// ========================================================================
// PREVIEW GENERATION
// ========================================================================

/**
 * Generate button preview for current sizes
 *
 * @param {Array} currentSizes - Array of button size objects
 */
export function generateButtonPreview(currentSizes) {
    const data = getData();
    const settings = data.settings;
    const colors = data.colors;

    const minContainer = document.getElementById('preview-min-container');
    if (minContainer) {
        minContainer.innerHTML = generatePreviewContent(currentSizes, settings, colors, 'min');
    }

    const maxContainer = document.getElementById('preview-max-container');
    if (maxContainer) {
        maxContainer.innerHTML = generatePreviewContent(currentSizes, settings, colors, 'max');
    }
}

/**
 * Generate preview content HTML
 *
 * @param {Array} sizes - Array of button size objects
 * @param {object} settings - Settings object
 * @param {object} globalColors - Global color object
 * @param {string} sizeType - Preview type ('min' or 'max')
 * @returns {string} HTML string
 */
export function generatePreviewContent(sizes, settings, globalColors, sizeType) {
    const titleText = sizeType === 'min' ? 'Small Screen Buttons' : 'Large Screen Buttons';

    return `
    <div style="font-family: Arial, sans-serif;">
        <h4 style="margin: 0 0 16px 0; color: var(--clr-txt); font-size: var(--fs-sm); font-weight: var(--fw-semibold);">${titleText}</h4>
        ${sizes.map(size => {
            const name = size.className;
            const buttonColors = normalizeColorData(size.colors || globalColors);

            return `
                <div style="margin-bottom: var(--sp-5); padding: var(--sp-3); background: var(--clr-gray-50); border-radius: var(--br-md); border-left: 3px solid var(--clr-info); display: block; position: relative;">
                    <div style="font-size: 11px; color: var(--clr-txt-muted); margin-bottom: var(--sp-2); font-weight: var(--fw-semibold);">${name}</div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        ${Object.keys(buttonColors).map(state => {
                            const stateColors = buttonColors[state];
                            const previewStyle = generateButtonPreviewStyle(size, stateColors, sizeType);

                            // Convert style object to inline CSS string
                            const styleString = Object.entries(previewStyle)
                                .map(([key, value]) => {
                                    // Convert camelCase to kebab-case
                                    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                                    return `${cssKey}: ${value}`;
                                })
                                .join('; ');

                            return `
                                <button class="preview-button" style="${styleString}">
                                    ${state}
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('')}
    </div>
`;
}

/**
 * Generate button preview style object
 *
 * @param {object} button - Button object
 * @param {object} stateColors - State color object
 * @param {string} context - Context ('main', 'min', 'max', or 'card')
 * @returns {object} Style object
 */
export function generateButtonPreviewStyle(button, stateColors, context = 'main') {
    const data = getData();
    const settings = data.settings;

    // Calculate responsive values based on context
    let scaleFactor;
    let sizeType;

    if (context === 'card') {
        // Card previews are smaller, use min viewport scaling
        scaleFactor = 0.6;
        sizeType = 'min';
    } else if (context === 'min') {
        scaleFactor = 0.7;
        sizeType = 'min';
    } else {
        scaleFactor = 1.0;
        sizeType = 'max';
    }

    // Calculate dimensions - use raw values for preview, not responsive calculations
    const properties = ['width', 'height', 'paddingX', 'paddingY', 'fontSize', 'borderRadius', 'borderWidth'];
    const style = {};

    properties.forEach(prop => {
        // For preview panels, use raw button values with simple scaling
        const rawValue = button[prop] || 0;
        let scaledValue = Math.max(rawValue * scaleFactor, getMinValue(prop));

        switch (prop) {
            case 'width':
                style.width = scaledValue + 'px';
                style.minWidth = scaledValue + 'px';
                break;
            case 'height':
                style.height = scaledValue + 'px';
                style.minHeight = scaledValue + 'px';
                break;
            case 'paddingX':
                style.paddingLeft = scaledValue + 'px';
                style.paddingRight = scaledValue + 'px';
                break;
            case 'paddingY':
                style.paddingTop = scaledValue + 'px';
                style.paddingBottom = scaledValue + 'px';
                break;
            case 'fontSize':
                style.fontSize = scaledValue + 'px';
                break;
            case 'borderRadius':
                if (button[prop] === 0) {
                    style.borderRadius = '0';
                } else {
                    style.borderRadius = scaledValue + 'px';
                }
                break;
            case 'borderWidth':
                if (stateColors.useBorder !== false && scaledValue > 0) {
                    style.borderWidth = scaledValue + 'px';
                    style.borderStyle = 'solid';
                } else if (scaledValue === 0) {
                    style.border = 'none';
                }
                break;
        }
    });

    // Apply color styles
    if (stateColors) {
        style.background = stateColors.background;
        style.color = stateColors.text;

        // Get the actual border width from the button data
        const currentSizes = data.classSizes;
        const buttonItem = currentSizes.find(item => item.id === button.id);
        const borderWidth = buttonItem ? buttonItem.borderWidth : 0;

        if (stateColors.useBorder !== false && borderWidth > 0) {
            style.borderColor = stateColors.border;
        } else {
            style.border = 'none';
        }
    }

    // Common button styles
    style.fontFamily = 'inherit';
    style.fontWeight = '600';
    style.cursor = 'pointer';
    style.transition = 'all 0.2s ease';
    style.textTransform = 'capitalize';
    style.display = 'inline-flex';
    style.alignItems = 'center';
    style.justifyContent = 'center';
    style.boxSizing = 'border-box';

    return style;
}

/**
 * Update all card previews
 */
export function updateAllCardPreviews() {
    const currentSizes = getData().classSizes;
    currentSizes.forEach(size => {
        updateButtonCardPreview(size.id, true); // true = update dimensions too
    });
}

/**
 * Update individual button card preview
 *
 * @param {number} sizeId - Button size ID
 * @param {boolean} updateDimensions - Whether to update dimensions
 */
export function updateButtonCardPreview(sizeId, updateDimensions = false) {
    const previewButton = document.querySelector(`[data-size-id="${sizeId}"].header-preview-btn`);
    if (!previewButton) return;

    const data = getData();
    const currentSizes = data.classSizes;
    const button = currentSizes.find(item => item.id === sizeId);
    if (!button) return;

    // Get current state and colors
    const currentState = getButtonCurrentState(sizeId) || 'normal';
    const buttonColors = normalizeColorData(button.colors || data.colors);
    const stateColors = buttonColors[currentState] || buttonColors.normal;

    // Update dimensions only when explicitly requested (property changes)
    if (updateDimensions) {
        previewButton.style.width = Math.max(button.width * 0.5, 60) + 'px';
        previewButton.style.height = Math.max(button.height * 0.8, 28) + 'px';
        previewButton.style.paddingLeft = Math.max(button.paddingX * 0.7, 8) + 'px';
        previewButton.style.paddingRight = Math.max(button.paddingX * 0.7, 8) + 'px';
        previewButton.style.paddingTop = Math.max(button.paddingY * 0.7, 4) + 'px';
        previewButton.style.paddingBottom = Math.max(button.paddingY * 0.7, 4) + 'px';
        previewButton.style.fontSize = Math.max(button.fontSize * 0.8, 12) + 'px';
        previewButton.style.borderRadius = Math.max(button.borderRadius * 0.9, 0) + 'px';
        previewButton.style.borderWidth = button.borderWidth > 0 ? Math.max(button.borderWidth, 1) + 'px' : '0px';
    }

    // Always update colors
    previewButton.style.background = stateColors.background;
    previewButton.style.color = stateColors.text;

    if (stateColors.useBorder !== false && button.borderWidth > 0) {
        previewButton.style.borderColor = stateColors.border;
        previewButton.style.borderStyle = 'solid';
    } else {
        previewButton.style.border = 'none';
    }

    // Update the button text to match the class name
    previewButton.textContent = button.className.replace('btn-', '');
}

/**
 * Get the current active state for a specific button
 *
 * @param {number} sizeId - Button size ID
 * @returns {string} Current state ('normal', 'hover', 'active', or 'disabled')
 */
export function getButtonCurrentState(sizeId) {
    const activeStateButton = document.querySelector(`[data-state][data-size-id="${sizeId}"].active`);
    return activeStateButton ? activeStateButton.getAttribute('data-state') : 'normal';
}
