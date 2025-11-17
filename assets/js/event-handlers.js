/**
 * Event Handlers
 *
 * All event handler functions for Fluid Button Forge
 *
 * @package FluidButtonForge
 * @version 1.1.0
 * @author Jim Roberts (Jim R Forge)
 */

import { getData, selectedButtonId, setSelectedButtonId } from './state.js';
import { validateAndCorrectValue, showValidationFeedback, updateInputLimitsForUnit } from './validation.js';
import { generateDuplicateName, restoreDefaults, showDuplicateSuccess, showNameUpdateSuccess, showCreateSuccess } from './utils.js';
import { generateClassesCSS, generateSingleButtonCSS } from './css-generator.js';
import { generateButtonPreview, updateButtonCardPreview, getButtonCurrentState } from './preview-generator.js';
import { generatePanelContent } from './panel-generator.js';
import { handleSaveButton, handleAutosaveToggle } from './save-utils.js';
import { normalizeColorData, normalizeColorDataForInputs } from './color-utils.js';
import { attachEventListeners } from './event-listeners.js';

export { handleSaveButton, handleAutosaveToggle };

// ========================================================================
// SETTINGS HANDLERS
// ========================================================================

/**
 * Handle settings input changes
 */
export function handleSettingsChange() {
    const data = getData();
    const settings = data.settings;

    settings.minBaseSize = parseInt(document.getElementById('min-base-size').value) || 16;
    settings.maxBaseSize = parseInt(document.getElementById('max-base-size').value) || 20;
    settings.minViewport = parseInt(document.getElementById('min-viewport').value) || 375;
    settings.maxViewport = parseInt(document.getElementById('max-viewport').value) || 1620;

    updateCSSOutputs();
    updatePreview();
}

/**
 * Handle unit type change (PX/REM)
 */
export function handleUnitChange(event) {
    const selectedUnit = event.target.getAttribute('data-unit');
    const data = getData();
    const previousUnit = data.settings.unitType;

    // Only proceed if unit actually changed
    if (previousUnit === selectedUnit) return;

    data.settings.unitType = selectedUnit;

    document.querySelectorAll('.unit-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update all unit labels in property cards
    document.querySelectorAll('.unit-label').forEach(label => {
        label.textContent = selectedUnit;
    });

    // Update input limits and step values for new unit
    updateInputLimitsForUnit(selectedUnit);

    // Convert all property input values
    document.querySelectorAll('.card-property-input').forEach(input => {
        const currentValue = parseFloat(input.value);
        const property = input.getAttribute('data-property');

        // Skip fontSize, borderRadius, borderWidth - they stay in pixels
        if (['fontSize', 'borderRadius', 'borderWidth'].includes(property)) {
            return;
        }

        let newValue;
        if (previousUnit === 'px' && selectedUnit === 'rem') {
            // Convert px to rem (divide by 16, remove trailing zeros)
            newValue = parseFloat((currentValue / 16).toFixed(4));
        } else if (previousUnit === 'rem' && selectedUnit === 'px') {
            // Convert rem to px (multiply by 16, round to integer)
            newValue = Math.round(currentValue * 16);
        } else {
            return; // No conversion needed
        }

        input.value = newValue;

        // Update the underlying data
        const sizeId = parseInt(input.getAttribute('data-size-id'));
        const currentSizes = data.classSizes;
        const sizeItem = currentSizes.find(item => item.id === sizeId);
        if (sizeItem && sizeItem[property] !== undefined) {
            sizeItem[property] = newValue;
        }
    });

    updateCSSOutputs();
    updatePreview();
}

// ========================================================================
// PROPERTY HANDLERS
// ========================================================================

/**
 * Handle property input changes
 */
export function handlePropertyChange(event) {
    const input = event.target;
    let value = parseFloat(input.value);
    const sizeId = parseInt(input.getAttribute('data-size-id'));
    const property = input.getAttribute('data-property');

    if (!sizeId || !property || isNaN(value)) {
        return;
    }

    // Validate and auto-correct the value
    const correctedValue = validateAndCorrectValue(input, value, property);
    if (correctedValue !== value) {
        input.value = correctedValue;
        value = correctedValue;
        showValidationFeedback(input, 'corrected');
    }

    // Find and update the button in data
    const data = getData();
    const currentSizes = data.classSizes;
    const button = currentSizes.find(item => item.id === sizeId);

    if (button) {
        button[property] = value;
        updateCSSOutputs();
        updatePreview();
        updateButtonCardPreview(sizeId, true); // true = update dimensions
    }
}

// ========================================================================
// NAME HANDLERS
// ========================================================================

/**
 * Handle inline name editing
 */
export function handleNameChange(event) {
    const input = event.target;
    const newName = input.value.trim();
    const sizeId = parseInt(input.getAttribute('data-size-id'));

    const data = getData();
    const currentSizes = data.classSizes;

    if (!newName || !sizeId) {
        // Revert to original name if empty
        const button = currentSizes.find(item => item.id === sizeId);
        if (button) {
            input.value = button.className;
        }
        return;
    }

    // Check if name already exists
    const nameExists = currentSizes.some(item => item.className === newName && item.id !== sizeId);

    if (nameExists) {
        alert(`Button class "${newName}" already exists. Please choose a different name.`);
        // Revert to original name
        const button = currentSizes.find(item => item.id === sizeId);
        if (button) {
            input.value = button.className;
        }
        return;
    }

    // Update the button name
    const button = currentSizes.find(item => item.id === sizeId);
    if (button) {
        button.className = newName;
        updateCSSOutputs();
        showNameUpdateSuccess(newName);
    }
}

/**
 * Handle name input keydown
 */
export function handleNameKeydown(event) {
    if (event.key === 'Enter') {
        event.target.blur(); // Trigger the blur event to save
    } else if (event.key === 'Escape') {
        // Revert to original name
        const sizeId = parseInt(event.target.getAttribute('data-size-id'));
        const data = getData();
        const currentSizes = data.classSizes;
        const button = currentSizes.find(item => item.id === sizeId);
        if (button) {
            event.target.value = button.className;
            event.target.blur();
        }
    }
}

/**
 * Handle new button name input keydown
 */
export function handleNewButtonNameKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleCreateButton();
    }
}

// ========================================================================
// BUTTON CREATION HANDLERS
// ========================================================================

/**
 * Handle create button
 */
export function handleCreateButton() {
    const nameInput = document.getElementById('new-button-name');
    const name = nameInput.value.trim();

    if (!name) {
        alert('Please enter a button name');
        nameInput.focus();
        return;
    }

    const data = getData();
    const currentData = data.classSizes;

    // Check if name already exists
    const nameExists = currentData.some(item => item.className === name);
    if (nameExists) {
        alert(`Button class "${name}" already exists. Please choose a different name.`);
        nameInput.focus();
        return;
    }

    // Generate new ID
    const maxId = currentData.length > 0 ? Math.max(...currentData.map(item => item.id)) : 0;
    const newId = maxId + 1;

    // Get current unit type for defaults
    const unitType = data.settings.unitType;
    const isRem = unitType === 'rem';

    // Create new button with default values
    const newButton = {
        id: newId,
        className: name,
        width: isRem ? 10 : 160,
        height: isRem ? 2.5 : 40,
        paddingX: isRem ? 1 : 16,
        paddingY: isRem ? 0.5 : 8,
        fontSize: 16,
        borderRadius: 6,
        borderWidth: 2,
        colors: {
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
        }
    };

    // Add to data array
    data.classSizes.push(newButton);

    // Clear the input
    nameInput.value = '';

    // Regenerate the UI
    const panelContainer = document.getElementById('sizes-table-container');
    if (panelContainer) {
        panelContainer.innerHTML = generatePanelContent();
        attachEventListeners();
    }

    // Update CSS and preview
    updateCSSOutputs();
    updatePreview();

    // Show success message
    showCreateSuccess(name);
}

// ========================================================================
// COLOR HANDLERS
// ========================================================================

/**
 * Handle button-specific color changes
 */
export function handleButtonColorChange(event) {
    const input = event.target;
    const value = input.value;
    const sizeId = parseInt(input.getAttribute('data-size-id'));

    // Extract color type from class name (e.g., 'background-input' -> 'background')
    const colorType = input.classList.toString().match(/(background|text|border)-input/)?.[1];

    if (!sizeId || !colorType) {
        console.error('No size ID or color type found for color input', {
            sizeId,
            colorType,
            classList: input.classList.toString()
        });
        return;
    }

    const data = getData();
    const currentSizes = data.classSizes;
    const button = currentSizes.find(item => item.id === sizeId);

    if (!button || !button.colors) {
        console.error('Button or button colors not found');
        return;
    }

    // Get the current state for this button (default to normal)
    const buttonState = getButtonCurrentState(sizeId) || 'normal';

    // Ensure the state exists
    if (!button.colors[buttonState]) {
        button.colors[buttonState] = {};
    }

    // Update the specific color property using simplified structure
    switch (colorType) {
        case 'background':
            // Update both old structure (for compatibility) and add new structure
            button.colors[buttonState].background1 = value;
            button.colors[buttonState].background = value;
            break;
        case 'text':
            button.colors[buttonState].text = value;
            break;
        case 'border':
            button.colors[buttonState].border = value;
            break;
    }

    updateCSSOutputs();
    updatePreview();
    updateButtonCardPreview(sizeId);
}

/**
 * Handle button card state changes
 */
export function handleCardStateChange(event) {
    const button = event.target;
    const sizeId = parseInt(button.getAttribute('data-size-id'));
    const newState = button.getAttribute('data-state');

    // Update active state for this button's state buttons
    const stateButtons = document.querySelectorAll(`[data-size-id="${sizeId}"].card-state-button`);
    stateButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Update color inputs to show this state's colors
    updateCardColorInputs(sizeId, newState);

    // Update the card preview to show this state's colors
    updateButtonCardPreview(sizeId);
}

/**
 * Handle border checkbox changes for specific buttons
 */
export function handleCardBorderChange(event) {
    const checkbox = event.target;
    const sizeId = parseInt(checkbox.getAttribute('data-size-id'));
    const isChecked = checkbox.checked;

    const data = getData();
    const currentSizes = data.classSizes;
    const button = currentSizes.find(item => item.id === sizeId);
    if (!button || !button.colors) return;

    const currentState = getButtonCurrentState(sizeId) || 'normal';
    if (!button.colors[currentState]) button.colors[currentState] = {};

    button.colors[currentState].useBorder = isChecked;

    // Enable/disable border color input
    const borderInput = document.querySelector(`[data-size-id="${sizeId}"].border-input`);
    if (borderInput) {
        borderInput.disabled = !isChecked;
    }

    updateCSSOutputs();
    updatePreview();
    updateButtonCardPreview(sizeId);
}

/**
 * Update color inputs for a specific button and state
 */
export function updateCardColorInputs(sizeId, state) {
    const data = getData();
    const currentSizes = data.classSizes;
    const button = currentSizes.find(item => item.id === sizeId);
    if (!button || !button.colors) return;

    // Get state colors, fallback to normal if state doesn't exist
    const stateColors = button.colors[state] || button.colors.normal;

    // Normalize the colors first for inputs (resolves CSS variables)
    const normalizedColors = normalizeColorDataForInputs({
        [state]: stateColors
    });
    const normalizedStateColors = normalizedColors[state];

    // Update color inputs
    const backgroundInput = document.querySelector(`[data-size-id="${sizeId}"].background-input`);
    const textInput = document.querySelector(`[data-size-id="${sizeId}"].text-input`);
    const borderInput = document.querySelector(`[data-size-id="${sizeId}"].border-input`);

    if (backgroundInput) backgroundInput.value = normalizedStateColors.background || 'var(--clr-accent)';
    if (textInput) textInput.value = normalizedStateColors.text || 'var(--clr-btn-txt)';
    if (borderInput) {
        borderInput.value = normalizedStateColors.border || 'var(--clr-btn-bdr)';
        borderInput.disabled = !normalizedStateColors.useBorder;
    }

    // Update checkboxes
    const borderCheckbox = document.querySelector(`[data-size-id="${sizeId}"].use-border-checkbox`);
    if (borderCheckbox) borderCheckbox.checked = normalizedStateColors.useBorder !== false;

    // Update preview immediately
    updateButtonCardPreview(sizeId);
}

// ========================================================================
// BUTTON ACTION HANDLERS
// ========================================================================

/**
 * Handle duplicate button click
 */
export function handleDuplicate(event) {
    const sizeId = parseInt(event.target.getAttribute('data-id'));
    const data = getData();
    const currentData = data.classSizes;
    const originalItem = currentData.find(item => item.id === sizeId);
    if (!originalItem) return;

    // Generate new ID
    const maxId = currentData.length > 0 ? Math.max(...currentData.map(item => item.id)) : 0;
    const newId = maxId + 1;

    const originalName = originalItem.className;
    const duplicateName = generateDuplicateName(originalName, currentData);

    // Create complete duplicate item
    const duplicateItem = {
        id: newId,
        className: duplicateName,
        width: originalItem.width,
        height: originalItem.height,
        paddingX: originalItem.paddingX,
        paddingY: originalItem.paddingY,
        fontSize: originalItem.fontSize,
        borderRadius: originalItem.borderRadius,
        borderWidth: originalItem.borderWidth,
        colors: JSON.parse(JSON.stringify(originalItem.colors || {}))
    };

    // Add to data array
    data.classSizes.push(duplicateItem);

    // Refresh UI completely
    const panelContainer = document.getElementById('sizes-table-container');
    if (panelContainer) {
        panelContainer.innerHTML = generatePanelContent();
        attachEventListeners();
    }

    updateCSSOutputs();
    updatePreview();

    // Show success feedback
    showDuplicateSuccess(originalName, duplicateName);
}

/**
 * Handle reset to defaults
 */
export function handleReset() {
    const confirmed = confirm(`Reset to defaults?\n\nThis will replace all current entries with the original 3 default sizes.\n\nAny custom entries will be lost.`);

    if (!confirmed) return;

    restoreDefaults();

    const panelContainer = document.getElementById('sizes-table-container');
    if (panelContainer) {
        panelContainer.innerHTML = generatePanelContent();
        attachEventListeners();
    }

    updateCSSOutputs();
    updatePreview();
}

/**
 * Handle clear all button click
 */
export function handleClearAll() {
    const data = getData();
    const currentData = [...data.classSizes];

    const confirmed = confirm(`Are you sure you want to clear all Button Classes?\n\nThis will remove all ${currentData.length} entries.`);

    if (!confirmed) return;

    data.classSizes = [];

    const panelContainer = document.getElementById('sizes-table-container');
    if (panelContainer) {
        panelContainer.innerHTML = generatePanelContent();
        attachEventListeners();
    }

    updateCSSOutputs();
    updatePreview();
}

/**
 * Handle delete button click
 */
export function handleDelete(event) {
    const sizeId = parseInt(event.target.getAttribute('data-id'));
    const data = getData();
    const currentData = data.classSizes;

    const itemToDelete = currentData.find(item => item.id === sizeId);
    if (!itemToDelete) return;

    const itemName = itemToDelete.className;
    const confirmed = confirm(`Delete "${itemName}"?\n\nThis action cannot be undone.`);

    if (!confirmed) return;

    const itemIndex = currentData.findIndex(item => item.id === sizeId);
    if (itemIndex !== -1) {
        data.classSizes.splice(itemIndex, 1);
    }

    const panelContainer = document.getElementById('sizes-table-container');
    if (panelContainer) {
        panelContainer.innerHTML = generatePanelContent();
        attachEventListeners();
    }

    updateCSSOutputs();
    updatePreview();
}

// ========================================================================
// COPY HANDLERS
// ========================================================================

/**
 * Handle copy all button click
 */
export function handleCopyAll() {
    const generatedCode = document.getElementById('generated-code');
    if (generatedCode) {
        navigator.clipboard.writeText(generatedCode.textContent).then(() => {
            // Show success feedback
            const btn = document.getElementById('copy-all-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="copy-icon">✅</span> copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    }
}

/**
 * Handle copy selected button click
 */
export function handleCopySelected() {
    const selectedCode = document.getElementById('selected-code');
    if (selectedCode && selectedCode.textContent !== '/* Click a button card to select it and view its CSS */') {
        navigator.clipboard.writeText(selectedCode.textContent).then(() => {
            // Show success feedback
            const btn = document.getElementById('copy-selected-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="copy-icon">✅</span> copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    }
}

// ========================================================================
// CARD SELECTION HANDLERS
// ========================================================================

/**
 * Handle card selection
 */
export function handleCardSelection(event) {
    // Prevent selection when clicking on inputs or buttons within the card
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON') {
        return;
    }

    const card = event.currentTarget;
    const sizeId = parseInt(card.getAttribute('data-id'));

    if (!sizeId) return;

    // Update selection
    setSelectedButtonId(sizeId);

    // Update visual selection state
    updateCardSelectionVisual();

    // Update selected CSS panel
    updateSelectedButtonCSS();
}

/**
 * Update card selection visual state
 */
export function updateCardSelectionVisual() {
    // Remove selection from all cards
    document.querySelectorAll('.button-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selection to current card
    if (selectedButtonId) {
        const selectedCard = document.querySelector(`[data-id="${selectedButtonId}"].button-card`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
    }
}

/**
 * Update selected button CSS output
 */
export function updateSelectedButtonCSS() {
    const selectedCode = document.getElementById('selected-code');
    const selectedTitle = document.getElementById('selected-code-title');

    if (!selectedCode) return;

    if (!selectedButtonId) {
        selectedCode.textContent = '/* Click a button card to select it and view its CSS */';
        if (selectedTitle) {
            selectedTitle.textContent = 'Selected Button CSS';
        }
        return;
    }

    const data = getData();
    const currentSizes = data.classSizes;
    const selectedButton = currentSizes.find(item => item.id === selectedButtonId);

    if (!selectedButton) {
        selectedCode.textContent = '/* Selected button not found */';
        return;
    }

    // Generate CSS for just this button
    const settings = data.settings;
    const colors = data.colors;
    const css = generateSingleButtonCSS(selectedButton, settings, colors);

    selectedCode.textContent = css;

    if (selectedTitle) {
        selectedTitle.textContent = `Selected Button CSS (${selectedButton.className})`;
    }
}

// ========================================================================
// UPDATE FUNCTIONS
// ========================================================================

/**
 * Update CSS outputs
 */
export function updateCSSOutputs() {
    const data = getData();
    const settings = data.settings;
    const colors = data.colors;
    const currentSizes = data.classSizes;

    const css = generateClassesCSS(currentSizes, settings, colors, 2);
    const generatedCode = document.getElementById('generated-code');
    if (generatedCode) {
        generatedCode.textContent = css;
    }

    // Also update selected button CSS
    updateSelectedButtonCSS();
}

/**
 * Update preview
 */
export function updatePreview() {
    const data = getData();
    const currentSizes = data.classSizes;
    generateButtonPreview(currentSizes);
}
