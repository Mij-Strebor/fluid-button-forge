/**
 * Event Listeners
 *
 * Attach event listeners to UI elements
 *
 * @package FluidButtonForge
 * @version 1.1.0
 * @author Jim Roberts (Jim R Forge)
 */

import {
    handleSettingsChange,
    handleUnitChange,
    handlePropertyChange,
    handleNameChange,
    handleNameKeydown,
    handleNewButtonNameKeydown,
    handleCreateButton,
    handleButtonColorChange,
    handleCardStateChange,
    handleCardBorderChange,
    handleDuplicate,
    handleDelete,
    handleReset,
    handleClearAll,
    handleCopyAll,
    handleCopySelected,
    handleCardSelection,
    handleSaveButton,
    handleAutosaveToggle
} from './event-handlers.js';
import { startAutosaveTimer } from './save-utils.js';

// ========================================================================
// EVENT LISTENER ATTACHMENT
// ========================================================================

/**
 * Attach all event listeners
 * Called on initialization and after UI regeneration
 */
export function attachEventListeners() {
    // Settings input listeners
    attachSettingsListeners();

    // Unit button listeners (PX/REM)
    attachUnitListeners();

    // Property input listeners (inline editing)
    attachPropertyListeners();

    // Editable name listeners
    attachNameListeners();

    // Button-specific color input listeners
    attachColorListeners();

    // Button card state button listeners
    attachStateListeners();

    // Button card checkbox listeners
    attachBorderCheckboxListeners();

    // Save and autosave listeners
    attachSaveListeners();

    // Copy button listeners
    attachCopyListeners();

    // Button card selection listeners
    attachCardSelectionListeners();

    // Action button listeners
    attachActionListeners();

    // New button name input Enter key
    attachNewButtonListeners();
}

/**
 * Attach settings input listeners
 */
function attachSettingsListeners() {
    const buttonInputs = ['min-base-size', 'max-base-size', 'min-viewport', 'max-viewport'];
    buttonInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.removeEventListener('input', handleSettingsChange);
            input.addEventListener('input', handleSettingsChange);
        }
    });
}

/**
 * Attach unit button listeners
 */
function attachUnitListeners() {
    const unitButtons = document.querySelectorAll('.unit-button');
    unitButtons.forEach(button => {
        button.removeEventListener('click', handleUnitChange);
        button.addEventListener('click', handleUnitChange);
    });
}

/**
 * Attach property input listeners
 */
function attachPropertyListeners() {
    const propertyInputs = document.querySelectorAll('.card-property-input');
    propertyInputs.forEach(input => {
        input.removeEventListener('input', handlePropertyChange);
        input.addEventListener('input', handlePropertyChange);
    });
}

/**
 * Attach name editing listeners
 */
function attachNameListeners() {
    const editableNames = document.querySelectorAll('.editable-name');
    editableNames.forEach(input => {
        input.removeEventListener('blur', handleNameChange);
        input.removeEventListener('keydown', handleNameKeydown);
        input.addEventListener('blur', handleNameChange);
        input.addEventListener('keydown', handleNameKeydown);
    });
}

/**
 * Attach color input listeners
 */
function attachColorListeners() {
    const buttonColorInputs = document.querySelectorAll('.card-color-input');
    buttonColorInputs.forEach(input => {
        input.removeEventListener('input', handleButtonColorChange);
        input.addEventListener('input', handleButtonColorChange);
    });
}

/**
 * Attach state button listeners
 */
function attachStateListeners() {
    const cardStateButtons = document.querySelectorAll('.card-state-button');
    cardStateButtons.forEach(button => {
        button.removeEventListener('click', handleCardStateChange);
        button.addEventListener('click', handleCardStateChange);
    });
}

/**
 * Attach border checkbox listeners
 */
function attachBorderCheckboxListeners() {
    const borderCheckboxes = document.querySelectorAll('.use-border-checkbox');
    borderCheckboxes.forEach(checkbox => {
        checkbox.removeEventListener('change', handleCardBorderChange);
        checkbox.addEventListener('change', handleCardBorderChange);
    });
}

/**
 * Attach save and autosave listeners
 */
function attachSaveListeners() {
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.removeEventListener('click', handleSaveButton);
        saveBtn.addEventListener('click', handleSaveButton);
    }

    const autosaveToggle = document.getElementById('autosave-toggle');
    if (autosaveToggle) {
        autosaveToggle.removeEventListener('change', handleAutosaveToggle);
        autosaveToggle.addEventListener('change', handleAutosaveToggle);

        if (autosaveToggle.checked) {
            startAutosaveTimer();
        }
    }
}

/**
 * Attach copy button listeners
 */
function attachCopyListeners() {
    const copyAllBtn = document.getElementById('copy-all-btn');
    if (copyAllBtn) {
        copyAllBtn.removeEventListener('click', handleCopyAll);
        copyAllBtn.addEventListener('click', handleCopyAll);
    }

    const copySelectedBtn = document.getElementById('copy-selected-btn');
    if (copySelectedBtn) {
        copySelectedBtn.removeEventListener('click', handleCopySelected);
        copySelectedBtn.addEventListener('click', handleCopySelected);
    }
}

/**
 * Attach card selection listeners
 */
function attachCardSelectionListeners() {
    const buttonCards = document.querySelectorAll('.button-card');
    buttonCards.forEach(card => {
        card.removeEventListener('click', handleCardSelection);
        card.addEventListener('click', handleCardSelection);
    });
}

/**
 * Attach action button listeners
 */
function attachActionListeners() {
    // Create button
    const createBtn = document.getElementById('create-button');
    if (createBtn) {
        createBtn.removeEventListener('click', handleCreateButton);
        createBtn.addEventListener('click', handleCreateButton);
    }

    // Reset button
    const resetBtn = document.getElementById('reset-defaults');
    if (resetBtn) {
        resetBtn.removeEventListener('click', handleReset);
        resetBtn.addEventListener('click', handleReset);
    }

    // Clear all button
    const clearBtn = document.getElementById('clear-sizes');
    if (clearBtn) {
        clearBtn.removeEventListener('click', handleClearAll);
        clearBtn.addEventListener('click', handleClearAll);
    }

    // Duplicate buttons
    const duplicateButtons = document.querySelectorAll('.card-action-btn:not(.card-delete-btn)');
    duplicateButtons.forEach(button => {
        button.removeEventListener('click', handleDuplicate);
        button.addEventListener('click', handleDuplicate);
    });

    // Delete buttons
    const deleteButtons = document.querySelectorAll('.card-action-btn.card-delete-btn');
    deleteButtons.forEach(button => {
        button.removeEventListener('click', handleDelete);
        button.addEventListener('click', handleDelete);
    });
}

/**
 * Attach new button name input listeners
 */
function attachNewButtonListeners() {
    const newButtonName = document.getElementById('new-button-name');
    if (newButtonName) {
        newButtonName.removeEventListener('keydown', handleNewButtonNameKeydown);
        newButtonName.addEventListener('keydown', handleNewButtonNameKeydown);
    }
}
