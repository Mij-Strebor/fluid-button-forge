/**
 * Panel Generator
 *
 * Generate HTML panels for button design cards
 *
 * @package FluidButtonForge
 * @version 1.1.0
 * @author Jim Roberts (Jim R Forge)
 */

import { getData } from './state.js';
import { convertValueForDisplay } from './utils.js';
import { normalizeColorDataForInputs } from './color-utils.js';

// ========================================================================
// PANEL CONTENT GENERATION
// ========================================================================

/**
 * Generate panel content (main entry point)
 *
 * @returns {string} HTML string
 */
export function generatePanelContent() {
    const data = getData();

    if (!data || !data.classSizes) {
        console.error('Panel content generation failed - missing data');
        return '<div style="text-align: center; padding: 40px;">Error: Button data not available</div>';
    }

    return generateClassesPanel(data.classSizes);
}

/**
 * Generate classes panel with button cards
 *
 * @param {Array} sizes - Array of button size objects
 * @returns {string} HTML string
 */
export function generateClassesPanel(sizes) {
    if (!sizes || sizes.length === 0) {
        return generateEmptyPanel();
    }

    // Initialize button colors if missing - using design system colors
    sizes.forEach(size => {
        if (!size.colors) {
            size.colors = getDefaultColors();
        }
    });

    const data = getData();
    const unitType = data.settings.unitType;

    return `
    <!-- Button Classes Panel -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-5);">
        <h2 style="margin: 0; flex: 0 0 auto;">Button Classes</h2>

        <div class="fbf-autosave-flex" style="flex: 0 0 auto;">
            <label data-tooltip="Automatically save changes as you make them">
                <input type="checkbox" id="autosave-toggle" checked data-tooltip="Toggle automatic saving of your button settings">
                <span>Autosave</span>
            </label>
            <button id="save-btn" class="fbf-btn" data-tooltip="Save all current settings and designs to database">
                Save
            </button>
            <div id="autosave-status" class="autosave-status idle">
                <span id="autosave-icon">💾</span>
                <span id="autosave-text">Ready</span>
            </div>
        </div>

        <div class="fbf-table-buttons" style="flex: 0 0 auto;">
            <button id="reset-defaults" class="fbf-btn">reset</button>
            <button id="clear-sizes" class="fbf-btn fbf-btn-danger">clear all</button>
        </div>
    </div>

    <div>
        <div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: var(--sp-6);">
            ${sizes.map(size => generateButtonCard(size, unitType)).join('')}
        </div>
    </div>
    `;
}

/**
 * Generate empty panel (no buttons)
 *
 * @returns {string} HTML string
 */
function generateEmptyPanel() {
    return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-5);">
        <h2 style="margin: 0; flex: 0 0 auto;">Button Classes</h2>

        <div class="fbf-autosave-flex" style="flex: 0 0 auto;">
            <label data-tooltip="Automatically save changes as you make them">
                <input type="checkbox" id="autosave-toggle" checked data-tooltip="Toggle automatic saving of your button settings">
                <span>Autosave</span>
            </label>
            <button id="save-btn" class="fbf-btn" data-tooltip="Save all current settings and designs to database">
                Save
            </button>
            <div id="autosave-status" class="autosave-status idle">
                <span id="autosave-icon">💾</span>
                <span id="autosave-text">Ready</span>
            </div>
        </div>

        <div class="fbf-table-buttons" style="flex: 0 0 auto;">
            <button id="reset-defaults" class="fbf-btn">reset</button>
            <button id="clear-sizes" class="fbf-btn fbf-btn-danger">clear all</button>
        </div>
    </div>

    <div style="text-align: center; color: var(--clr-gray-500); font-style: italic; padding: var(--sp-9) var(--sp-5);">
        No button classes created yet. Use the form above to create your first button.
    </div>
    `;
}

/**
 * Generate individual button card HTML
 *
 * @param {object} size - Button size object
 * @param {string} unitType - Current unit type (px or rem)
 * @returns {string} HTML string
 */
function generateButtonCard(size, unitType) {
    const data = getData();
    const colors = normalizeColorDataForInputs(size.colors || data.colors);

    return `
        <div class="button-card" data-id="${size.id}">
            <!-- Button Card Header -->
            ${generateCardHeader(size)}

            <!-- Button Preview Section -->
            ${generateCardPreview(size)}

            <!-- Button Card Content -->
            <div class="button-card-content">
                <!-- Left Panel: Properties -->
                ${generatePropertiesPanel(size, unitType)}

                <!-- Right Panel: States & Colors -->
                ${generateStatesPanel(size, colors)}
            </div>
        </div>
    `;
}

/**
 * Generate card header with name and action buttons
 *
 * @param {object} size - Button size object
 * @returns {string} HTML string
 */
function generateCardHeader(size) {
    return `
    <div class="button-card-header">
        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <div class="drag-handle">⋮⋮</div>
            <input type="text" class="editable-name" data-size-id="${size.id}" value="${size.className}">
        </div>

        <div class="card-action-buttons">
            <button class="card-action-btn" data-id="${size.id}">📋 duplicate</button>
            <button class="card-action-btn card-delete-btn" data-id="${size.id}">🗑️ delete</button>
        </div>
    </div>
    `;
}

/**
 * Generate card preview section
 *
 * @param {object} size - Button size object
 * @returns {string} HTML string
 */
function generateCardPreview(size) {
    return `
    <div style="background: var(--clr-light); padding: 16px; margin: 12px; border-radius: var(--br-md); border-bottom: 2px solid var(--clr-secondary);">
        <div class="header-preview-container" style="height: 80px; display: flex; align-items: center; justify-content: center;">
            <button class="header-preview-btn" data-size-id="${size.id}"
                style="width: ${Math.max(size.width * 0.5, 60)}px; height: ${Math.max(size.height * 0.8, 28)}px;
                padding: ${Math.max(size.paddingY * 0.7, 4)}px ${Math.max(size.paddingX * 0.7, 8)}px;
                font-size: ${Math.max(size.fontSize * 0.8, 12)}px;
                border-radius: ${Math.max(size.borderRadius * 0.9, 0)}px;
                border-width: ${size.borderWidth > 0 ? Math.max(size.borderWidth, 1) : 0}px;
                ${size.borderWidth > 0 ? 'border-style: solid;' : 'border: none;'}">
                ${size.className.replace('btn-', '')}
            </button>
        </div>
    </div>
    `;
}

/**
 * Generate properties panel (left side)
 *
 * @param {object} size - Button size object
 * @param {string} unitType - Current unit type
 * @returns {string} HTML string
 */
function generatePropertiesPanel(size, unitType) {
    return `
    <div class="button-properties-panel" style="margin: 12px;">
        <div class="card-panel-title">Properties</div>
        ${generatePropertyRow(size, 'width', 'Width', unitType)}
        ${generatePropertyRow(size, 'height', 'Height', unitType)}
        ${generatePropertyRow(size, 'paddingX', 'Padding X', unitType)}
        ${generatePropertyRow(size, 'paddingY', 'Padding Y', unitType)}
        ${generatePropertyRow(size, 'fontSize', 'Font Size', 'px')}
        ${generatePropertyRow(size, 'borderRadius', 'Border Radius', 'px')}
        ${generatePropertyRow(size, 'borderWidth', 'Border Width', 'px')}
    </div>
    `;
}

/**
 * Generate individual property row
 *
 * @param {object} size - Button size object
 * @param {string} property - Property name
 * @param {string} label - Display label
 * @param {string} unit - Unit label
 * @returns {string} HTML string
 */
function generatePropertyRow(size, property, label, unit) {
    const value = convertValueForDisplay(size[property], property);
    const limits = getPropertyLimits(property, unit);

    return `
    <div class="card-property-row">
        <span class="card-property-label">${label}</span>
        <div>
            <input type="number" class="card-property-input"
                   data-size-id="${size.id}"
                   data-property="${property}"
                   value="${value}"
                   ${limits}
                   style="width: 65px; text-align: right;">
            <span style="font-size: 11px; margin-left: 6px; display: inline-block; width: 30px; text-align: left;" class="unit-label">${unit}</span>
        </div>
    </div>
    `;
}

/**
 * Get property limits attributes
 *
 * @param {string} property - Property name
 * @param {string} unit - Unit type
 * @returns {string} HTML attributes string
 */
function getPropertyLimits(property, unit) {
    const limits = {
        width: { minPx: 30, maxPx: 800, minRem: 1.875, maxRem: 50 },
        height: { minPx: 20, maxPx: 150, minRem: 1.25, maxRem: 9.375 },
        paddingX: { minPx: 0, maxPx: 50, minRem: 0, maxRem: 3.125 },
        paddingY: { minPx: 0, maxPx: 30, minRem: 0, maxRem: 1.875 },
        fontSize: { min: 10, max: 32 },
        borderRadius: { min: 0, max: 100 },
        borderWidth: { min: 0, max: 8 }
    };

    const propLimits = limits[property];
    if (!propLimits) return '';

    if (['fontSize', 'borderRadius', 'borderWidth'].includes(property)) {
        return `min="${propLimits.min}" max="${propLimits.max}" step="1"`;
    }

    if (unit === 'rem') {
        return `data-min-px="${propLimits.minPx}" data-max-px="${propLimits.maxPx}" data-min-rem="${propLimits.minRem}" data-max-rem="${propLimits.maxRem}"`;
    }

    return `data-min-px="${propLimits.minPx}" data-max-px="${propLimits.maxPx}" data-min-rem="${propLimits.minRem}" data-max-rem="${propLimits.maxRem}"`;
}

/**
 * Generate states panel (right side)
 *
 * @param {object} size - Button size object
 * @param {object} colors - Normalized colors object
 * @returns {string} HTML string
 */
function generateStatesPanel(size, colors) {
    return `
    <div class="button-states-panel" style="margin: 12px;">
        <div class="card-panel-title">States</div>

        <div class="card-state-buttons">
            <button class="card-state-button active" data-state="normal" data-size-id="${size.id}">Normal</button>
            <button class="card-state-button" data-state="hover" data-size-id="${size.id}">Hover</button>
            <button class="card-state-button" data-state="active" data-size-id="${size.id}">Active</button>
            <button class="card-state-button" data-state="disabled" data-size-id="${size.id}">Disabled</button>
        </div>

        <div style="margin-top: 20px;">
            <div class="card-panel-title">Colors</div>

            ${generateColorInputs(size, colors)}
        </div>
    </div>
    `;
}

/**
 * Generate color inputs section
 *
 * @param {object} size - Button size object
 * @param {object} colors - Normalized colors object
 * @returns {string} HTML string
 */
function generateColorInputs(size, colors) {
    const useBorder = colors.normal.useBorder !== false;

    return `
    <div class="card-checkbox-row">
        <input type="checkbox" class="use-border-checkbox" data-size-id="${size.id}" ${useBorder ? 'checked' : ''}>
        <span>Show Border</span>
    </div>

    <div style="display: flex; gap: 12px; align-items: end;">
        <div class="card-color-section" style="flex: 1;">
            <span class="card-color-label">Background</span>
            <input type="color" class="card-color-input background-input" data-size-id="${size.id}" value="${colors.normal.background}">
        </div>
        <div class="card-color-section" style="flex: 1;">
            <span class="card-color-label">Text</span>
            <input type="color" class="card-color-input text-input" data-size-id="${size.id}" value="${colors.normal.text}">
        </div>
        <div class="card-color-section" style="flex: 1;">
            <span class="card-color-label">Border</span>
            <input type="color" class="card-color-input border-input" data-size-id="${size.id}" value="${colors.normal.border}" ${useBorder ? '' : 'disabled'}>
        </div>
    </div>
    `;
}

/**
 * Get default button colors using design system variables
 *
 * @returns {object} Default color object
 */
function getDefaultColors() {
    return {
        normal: {
            background: 'var(--clr-accent)',
            text: 'var(--clr-btn-txt)',
            border: 'var(--clr-btn-bdr)',
            useBorder: true
        },
        hover: {
            background: 'var(--clr-btn-hover)',
            text: 'var(--clr-btn-txt)',
            border: 'var(--clr-btn-bdr)',
            useBorder: true
        },
        active: {
            background: 'var(--clr-secondary)',
            text: 'var(--clr-btn-txt)',
            border: 'var(--clr-btn-bdr)',
            useBorder: true
        },
        disabled: {
            background: 'var(--clr-gray-300)',
            text: 'var(--clr-gray-600)',
            border: 'var(--clr-gray-500)',
            useBorder: true
        }
    };
}
