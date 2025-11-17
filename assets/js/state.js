/**
 * State Management
 *
 * Global state variables for Fluid Button Forge
 *
 * @package FluidButtonForge
 * @version 1.1.0
 * @author Jim Roberts (Jim R Forge)
 */

// ========================================================================
// GLOBAL STATE AND DATA
// ========================================================================

/**
 * Autosave timer ID
 * @type {number|null}
 */
export let autosaveTimer = null;

/**
 * Currently selected button ID
 * @type {number|null}
 */
export let selectedButtonId = null;

/**
 * Set the autosave timer
 * @param {number|null} timer - Timer ID
 */
export function setAutosaveTimer(timer) {
    autosaveTimer = timer;
}

/**
 * Set the selected button ID
 * @param {number|null} id - Button ID
 */
export function setSelectedButtonId(id) {
    selectedButtonId = id;
}

/**
 * Get button design data from global WordPress object
 * @returns {object} Button design data
 */
export function getData() {
    return window.buttonDesignAjax?.data || {};
}

/**
 * Get specific data property
 * @param {string} key - Property key (settings, classSizes, colors, etc.)
 * @returns {*} Property value
 */
export function getDataProperty(key) {
    return getData()[key];
}

/**
 * Get AJAX configuration
 * @returns {object} AJAX configuration (ajaxurl, nonce)
 */
export function getAjaxConfig() {
    return {
        ajaxurl: window.buttonDesignAjax?.ajaxurl,
        nonce: window.buttonDesignAjax?.nonce
    };
}
