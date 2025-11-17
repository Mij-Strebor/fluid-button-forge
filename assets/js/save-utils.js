/**
 * Save Utilities
 *
 * Save and autosave functionality
 *
 * @package FluidButtonForge
 * @version 1.1.0
 * @author Jim Roberts (Jim R Forge)
 */

import { autosaveTimer, setAutosaveTimer, getData, getAjaxConfig } from './state.js';

// ========================================================================
// SAVE FUNCTIONALITY
// ========================================================================

/**
 * Handle save button click
 * Saves all settings, sizes, and colors to the database
 */
export function handleSaveButton() {
    const saveBtn = document.getElementById('save-btn');
    const autosaveStatus = document.getElementById('autosave-status');
    const autosaveIcon = document.getElementById('autosave-icon');
    const autosaveText = document.getElementById('autosave-text');

    if (autosaveStatus && autosaveIcon && autosaveText) {
        autosaveStatus.className = 'autosave-status saving';
        autosaveIcon.textContent = '⏳';
        autosaveText.textContent = 'Saving...';
    }

    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
    }

    const settings = {
        minBaseSize: document.getElementById('min-base-size')?.value,
        maxBaseSize: document.getElementById('max-base-size')?.value,
        minViewport: document.getElementById('min-viewport')?.value,
        maxViewport: document.getElementById('max-viewport')?.value,
        unitType: document.querySelector('.unit-button.active')?.getAttribute('data-unit'),
        autosaveEnabled: document.getElementById('autosave-toggle')?.checked,
    };

    const data = getData();
    const allSizes = {
        classSizes: data.classSizes || [],
        variableSizes: data.variableSizes || []
    };

    const allColors = data.colors || {};

    const ajaxConfig = getAjaxConfig();
    const postData = {
        action: 'save_button_design_settings',
        nonce: ajaxConfig.nonce,
        settings: JSON.stringify(settings),
        sizes: JSON.stringify(allSizes),
        colors: JSON.stringify(allColors)
    };

    fetch(ajaxConfig.ajaxurl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(postData)
        })
        .then(response => response.json())
        .then(result => {
            if (autosaveStatus && autosaveIcon && autosaveText) {
                autosaveStatus.className = 'autosave-status saved';
                autosaveIcon.textContent = '✅';
                autosaveText.textContent = 'Saved!';

                setTimeout(() => {
                    autosaveStatus.className = 'autosave-status idle';
                    autosaveIcon.textContent = '💾';
                    autosaveText.textContent = 'Ready';
                }, 2000);
            }

            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save';
            }
        })
        .catch(error => {
            console.error('Save error:', error);

            if (autosaveStatus && autosaveIcon && autosaveText) {
                autosaveStatus.className = 'autosave-status error';
                autosaveIcon.textContent = '❌';
                autosaveText.textContent = 'Error';

                setTimeout(() => {
                    autosaveStatus.className = 'autosave-status idle';
                    autosaveIcon.textContent = '💾';
                    autosaveText.textContent = 'Ready';
                }, 3000);
            }

            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save';
            }

            alert('Error saving data');
        });
}

// ========================================================================
// AUTOSAVE FUNCTIONALITY
// ========================================================================

/**
 * Handle autosave toggle change
 */
export function handleAutosaveToggle() {
    const isEnabled = document.getElementById('autosave-toggle')?.checked;

    if (isEnabled) {
        startAutosaveTimer();
    } else {
        stopAutosaveTimer();
    }
}

/**
 * Start autosave timer (30 seconds)
 */
export function startAutosaveTimer() {
    stopAutosaveTimer();
    const timer = setInterval(() => {
        handleSaveButton();
    }, 30000);
    setAutosaveTimer(timer);
}

/**
 * Stop autosave timer
 */
export function stopAutosaveTimer() {
    if (autosaveTimer) {
        clearInterval(autosaveTimer);
        setAutosaveTimer(null);
    }
}
