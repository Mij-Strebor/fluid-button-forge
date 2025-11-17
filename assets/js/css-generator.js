/**
 * CSS Generator
 *
 * Generate CSS code for button classes
 *
 * @package FluidButtonForge
 * @version 1.1.0
 * @author Jim Roberts (Jim R Forge)
 */

import { calculateButtonProperty, generateClampFunction } from './calculations.js';
import { normalizeColorData } from './color-utils.js';

// ========================================================================
// CSS GENERATION
// ========================================================================

/**
 * Generate CSS for all button classes
 *
 * @param {Array} sizes - Array of button size objects
 * @param {object} settings - Settings object
 * @param {object} globalColors - Global color object
 * @returns {string} Generated CSS code
 */
export function generateClassesCSS(sizes, settings, globalColors) {
    const minVp = settings.minViewport;
    const maxVp = settings.maxViewport;
    const unitType = settings.unitType;

    let css = '';

    sizes.forEach(size => {
        const properties = ['width', 'height', 'paddingX', 'paddingY', 'fontSize', 'borderRadius', 'borderWidth'];
        let classCSS = `.${size.className} {\n`;

        properties.forEach(prop => {
            const calc = calculateButtonProperty(size.id, prop, settings);
            const clampFunction = generateClampFunction(calc.min, calc.max, minVp, maxVp, unitType);

            let cssProp;
            switch (prop) {
                case 'paddingX':
                    cssProp = 'padding-left';
                    classCSS += `  ${cssProp}: ${clampFunction};\n`;
                    cssProp = 'padding-right';
                    classCSS += `  ${cssProp}: ${clampFunction};\n`;
                    break;
                case 'paddingY':
                    cssProp = 'padding-top';
                    classCSS += `  ${cssProp}: ${clampFunction};\n`;
                    cssProp = 'padding-bottom';
                    classCSS += `  ${cssProp}: ${clampFunction};\n`;
                    break;
                case 'fontSize':
                    cssProp = 'font-size';
                    classCSS += `  ${cssProp}: ${clampFunction};\n`;
                    break;
                case 'borderRadius':
                    cssProp = 'border-radius';
                    classCSS += `  ${cssProp}: ${clampFunction};\n`;
                    break;
                case 'borderWidth':
                    cssProp = 'border-width';
                    classCSS += `  ${cssProp}: ${clampFunction};\n`;
                    break;
                default:
                    classCSS += `  ${prop}: ${clampFunction};\n`;
            }
        });

        classCSS += '}\n\n';

        // Use button-specific colors if available, fallback to global colors
        const buttonColors = normalizeColorData(size.colors || globalColors);

        // Add state variations using button's individual colors
        Object.keys(buttonColors).forEach(state => {
            const stateColors = buttonColors[state];
            const stateClass = state === 'normal' ? `.${size.className}` : `.${size.className}:${state}`;

            let stateCSS = `${stateClass} {\n`;

            // Background (simplified - no gradients)
            stateCSS += `  background: ${stateColors.background};\n`;

            // Text color
            stateCSS += `  color: ${stateColors.text};\n`;

            // Border
            const buttonItem = sizes.find(s => s.className === size.className);
            const hasBorderWidth = buttonItem && buttonItem.borderWidth > 0;

            if (stateColors.useBorder && hasBorderWidth) {
                stateCSS += `  border-color: ${stateColors.border};\n`;
                stateCSS += `  border-style: solid;\n`;
            } else {
                stateCSS += `  border: none;\n`;
            }

            stateCSS += '}\n\n';
            css += stateCSS;
        });

        css += classCSS;
    });

    return css.trim();
}

/**
 * Generate CSS for a single button
 *
 * @param {object} button - Button object
 * @param {object} settings - Settings object
 * @param {object} globalColors - Global color object
 * @returns {string} Generated CSS code
 */
export function generateSingleButtonCSS(button, settings, globalColors) {
    const minVp = settings.minViewport;
    const maxVp = settings.maxViewport;
    const unitType = settings.unitType;

    let css = '';

    // Generate main class CSS
    const properties = ['width', 'height', 'paddingX', 'paddingY', 'fontSize', 'borderRadius', 'borderWidth'];
    let classCSS = `.${button.className} {\n`;

    properties.forEach(prop => {
        const calc = calculateButtonProperty(button.id, prop, settings);
        const clampFunction = generateClampFunction(calc.min, calc.max, minVp, maxVp, unitType);

        let cssProp;
        switch (prop) {
            case 'paddingX':
                cssProp = 'padding-left';
                classCSS += `  ${cssProp}: ${clampFunction};\n`;
                cssProp = 'padding-right';
                classCSS += `  ${cssProp}: ${clampFunction};\n`;
                break;
            case 'paddingY':
                cssProp = 'padding-top';
                classCSS += `  ${cssProp}: ${clampFunction};\n`;
                cssProp = 'padding-bottom';
                classCSS += `  ${cssProp}: ${clampFunction};\n`;
                break;
            case 'fontSize':
                cssProp = 'font-size';
                classCSS += `  ${cssProp}: ${clampFunction};\n`;
                break;
            case 'borderRadius':
                cssProp = 'border-radius';
                classCSS += `  ${cssProp}: ${clampFunction};\n`;
                break;
            case 'borderWidth':
                if (button[prop] > 0) {
                    cssProp = 'border-width';
                    classCSS += `  ${cssProp}: ${clampFunction};\n`;
                }
                break;
            default:
                classCSS += `  ${prop}: ${clampFunction};\n`;
        }
    });

    classCSS += '}\n\n';
    css += classCSS;

    // Use button-specific colors if available, fallback to global colors
    const buttonColors = normalizeColorData(button.colors || globalColors);

    // Add state variations
    Object.keys(buttonColors).forEach(state => {
        const stateColors = buttonColors[state];
        const stateClass = state === 'normal' ? `.${button.className}` : `.${button.className}:${state}`;

        let stateCSS = `${stateClass} {\n`;

        // Background (simplified - no gradients)
        stateCSS += `  background: ${stateColors.background};\n`;

        // Text color
        stateCSS += `  color: ${stateColors.text};\n`;

        // Border
        if (stateColors.useBorder && button.borderWidth > 0) {
            stateCSS += `  border-color: ${stateColors.border};\n`;
            stateCSS += `  border-style: solid;\n`;
        } else {
            stateCSS += `  border: none;\n`;
        }

        stateCSS += '}\n\n';
        css += stateCSS;
    });

    return css.trim();
}
