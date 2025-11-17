/**
 * Initialization
 *
 * DOM initialization and setup
 *
 * @package FluidButtonForge
 * @version 1.1.0
 * @author Jim Roberts (Jim R Forge)
 */

import { getData, setSelectedButtonId } from './state.js';
import { generatePanelContent } from './panel-generator.js';
import { updateAllCardPreviews } from './preview-generator.js';
import { attachEventListeners } from './event-listeners.js';
import { updateCSSOutputs, updatePreview, updateCardSelectionVisual, updateSelectedButtonCSS } from './event-handlers.js';
import { initializeInputLimits } from './validation.js';

// ========================================================================
// INITIALIZATION
// ========================================================================

/**
 * Initialize the plugin on DOMContentLoaded
 */
export function initialize() {
    // Standardized toggle functionality for all collapsible panels
    initializeCollapsiblePanels();

    // Initialize the main interface
    initializeInterface();
}

/**
 * Initialize collapsible panels
 */
function initializeCollapsiblePanels() {
    document.querySelectorAll('[data-toggle-target]').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.getAttribute('data-toggle-target');
            const content = document.getElementById(targetId);
            if (content && content.classList.contains('collapsible-text')) {
                content.classList.toggle('expanded');
                toggle.classList.toggle('expanded');
            }
        });
    });
}

/**
 * Initialize main interface
 */
function initializeInterface() {
    const panelContainer = document.getElementById('sizes-table-container');
    if (!panelContainer) {
        console.error('Panel container not found');
        return;
    }

    const data = getData();
    if (!data || !data.classSizes) {
        console.error('Button data not loaded:', data);
        panelContainer.innerHTML = '<div style="padding: 40px; text-align: center;">Data loading error</div>';
        return;
    }

    // Replace panel content
    panelContainer.innerHTML = generatePanelContent();

    // Force update preview containers immediately
    const minContainer = document.getElementById('preview-min-container');
    const maxContainer = document.getElementById('preview-max-container');

    if (minContainer) {
        minContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Loading previews...</div>';
    }
    if (maxContainer) {
        maxContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Loading previews...</div>';
    }

    // Attach event listeners
    attachEventListeners();

    // Update outputs and previews
    updateCSSOutputs();
    updatePreview(); // This should replace the "Loading previews..." content
    updateAllCardPreviews();

    // Auto-select first button if available
    const currentSizes = data.classSizes;
    if (currentSizes && currentSizes.length > 0) {
        setSelectedButtonId(currentSizes[0].id);
        updateCardSelectionVisual();
        updateSelectedButtonCSS();
    }

    // Initialize input validation limits
    initializeInputLimits();

    // Show the container
    const container = document.getElementById('bdc-main-container');
    if (container) {
        container.classList.add('ready');
    }
}

/**
 * Run initialization on DOM ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    // DOM already loaded
    initialize();
}
