/**
 * Main Entry Point
 *
 * Fluid Button Forge - WordPress Admin Interface
 *
 * @package FluidButtonForge
 * @version 1.1.0
 * @author Jim Roberts (Jim R Forge)
 * @link https://jimrforge.com
 */

// ========================================================================
// MODULE IMPORTS
// ========================================================================

// Core modules (no initialization needed - provides state and utilities)
import './state.js';
import './utils.js';
import './validation.js';
import './calculations.js';

// Specialized modules
import './color-utils.js';
import './css-generator.js';
import './save-utils.js';

// UI modules
import './panel-generator.js';
import './preview-generator.js';
import './event-handlers.js';
import './event-listeners.js';

// Initialization (auto-runs on DOMContentLoaded)
import './init.js';

// ========================================================================
// GLOBAL EXPORTS (for debugging in console)
// ========================================================================

// Export main functions to window for debugging
if (window.fbfDebug) {
    window.FBF = {
        version: '1.1.0',
        // Add debug functions here if needed
    };
}

console.log('Fluid Button Forge v1.1.0 - Modules loaded');
