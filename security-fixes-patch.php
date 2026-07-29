<?php
/**
 * SECURITY FIXES FOR FLUID BUTTON FORGE v1.0.1
 *
 * This file contains the code changes needed to fix security issues.
 * Apply these changes to fluid-button-forge.php
 *
 * Changes:
 * 1. Replace stripslashes() with wp_unslash() (lines 2718, 2725, 2732)
 * 2. Add sanitization calls before update_option() (lines 2739-2741)
 * 3. Add new sanitization methods (after line 2756, before closing class brace)
 */

// ============================================================================
// CHANGE #1: Update AJAX Handler (lines 2717-2741)
// ============================================================================
// Replace the entire try block in save_settings() method with this:

/*
        try {
            // Use wp_unslash instead of stripslashes for WordPress compatibility
            $settings_json = wp_unslash($_POST['settings'] ?? '');
            $settings = json_decode($settings_json, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                wp_send_json_error(['message' => 'Invalid settings data']);
                return;
            }

            $sizes_json = wp_unslash($_POST['sizes'] ?? '');
            $sizes = json_decode($sizes_json, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                wp_send_json_error(['message' => 'Invalid sizes data']);
                return;
            }

            $colors_json = wp_unslash($_POST['colors'] ?? '');
            $colors = json_decode($colors_json, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                wp_send_json_error(['message' => 'Invalid colors data']);
                return;
            }

            // Sanitize all data before saving
            $sanitized_settings = $this->sanitize_settings($settings);
            $sanitized_sizes = $this->sanitize_sizes($sizes['classSizes'] ?? []);
            $sanitized_colors = $this->sanitize_colors($colors);

            $result1 = update_option(self::OPTION_SETTINGS, $sanitized_settings);
            $result2 = update_option(self::OPTION_CLASS_SIZES, $sanitized_sizes);
            $result3 = update_option(self::OPTION_COLORS, $sanitized_colors);

            wp_cache_delete(self::OPTION_SETTINGS, 'options');
            wp_cache_delete(self::OPTION_CLASS_SIZES, 'options');
            wp_cache_delete(self::OPTION_COLORS, 'options');

            wp_send_json_success([
                'message' => 'All button design data saved successfully',
                'saved_settings' => $result1,
                'saved_sizes' => $result2,
                'saved_colors' => $result3
            ]);
        } catch (Exception $e) {
            wp_send_json_error(['message' => 'Save failed: ' . $e->getMessage()]);
        }
*/

// ============================================================================
// CHANGE #2: Add New Sanitization Methods
// ============================================================================
// Add these methods after the save_settings() method (after line 2756, before the closing class brace on line 2757)

?>

    // ========================================================================
    // SANITIZATION METHODS
    // ========================================================================

    /**
     * Sanitize settings data
     *
     * @param array $settings Raw settings data
     * @return array Sanitized settings
     */
    private function sanitize_settings($settings)
    {
        if (!is_array($settings)) {
            return $this->default_settings;
        }

        return [
            'minBaseSize' => $this->sanitize_numeric_value(
                $settings['minBaseSize'] ?? self::DEFAULT_MIN_BASE_SIZE,
                self::MIN_BUTTON_SIZE_RANGE[0],
                self::MIN_BUTTON_SIZE_RANGE[1],
                self::DEFAULT_MIN_BASE_SIZE
            ),
            'maxBaseSize' => $this->sanitize_numeric_value(
                $settings['maxBaseSize'] ?? self::DEFAULT_MAX_BASE_SIZE,
                self::MIN_BUTTON_SIZE_RANGE[0],
                self::MIN_BUTTON_SIZE_RANGE[1],
                self::DEFAULT_MAX_BASE_SIZE
            ),
            'minViewport' => $this->sanitize_numeric_value(
                $settings['minViewport'] ?? self::DEFAULT_MIN_VIEWPORT,
                self::VIEWPORT_RANGE[0],
                self::VIEWPORT_RANGE[1],
                self::DEFAULT_MIN_VIEWPORT
            ),
            'maxViewport' => $this->sanitize_numeric_value(
                $settings['maxViewport'] ?? self::DEFAULT_MAX_VIEWPORT,
                self::VIEWPORT_RANGE[0],
                self::VIEWPORT_RANGE[1],
                self::DEFAULT_MAX_VIEWPORT
            ),
            'unitType' => in_array($settings['unitType'] ?? '', self::VALID_UNITS, true)
                ? $settings['unitType']
                : 'px',
            'autosaveEnabled' => !empty($settings['autosaveEnabled'])
        ];
    }

    /**
     * Sanitize button sizes data
     *
     * @param array $sizes Raw sizes data
     * @return array Sanitized sizes
     */
    private function sanitize_sizes($sizes)
    {
        if (!is_array($sizes)) {
            return [];
        }

        return array_map(function ($size) {
            if (!is_array($size)) {
                return null;
            }

            return [
                'id' => absint($size['id'] ?? 0),
                'className' => sanitize_text_field($size['className'] ?? ''),
                'width' => $this->sanitize_numeric_value(
                    $size['width'] ?? 0,
                    self::MIN_BUTTON_SIZE_RANGE[0],
                    self::MIN_BUTTON_SIZE_RANGE[1] * 2,
                    160
                ),
                'height' => $this->sanitize_numeric_value(
                    $size['height'] ?? 0,
                    self::MIN_BUTTON_SIZE_RANGE[0],
                    self::MIN_BUTTON_SIZE_RANGE[1],
                    40
                ),
                'paddingX' => $this->sanitize_numeric_value(
                    $size['paddingX'] ?? 0,
                    0,
                    100,
                    16
                ),
                'paddingY' => $this->sanitize_numeric_value(
                    $size['paddingY'] ?? 0,
                    0,
                    100,
                    8
                ),
                'fontSize' => $this->sanitize_numeric_value(
                    $size['fontSize'] ?? 0,
                    8,
                    72,
                    16
                ),
                'borderRadius' => $this->sanitize_numeric_value(
                    $size['borderRadius'] ?? 0,
                    0,
                    100,
                    6
                ),
                'borderWidth' => $this->sanitize_numeric_value(
                    $size['borderWidth'] ?? 0,
                    0,
                    20,
                    1
                )
            ];
        }, $sizes);
    }

    /**
     * Sanitize colors data
     *
     * @param array $colors Raw colors data
     * @return array Sanitized colors
     */
    private function sanitize_colors($colors)
    {
        if (!is_array($colors)) {
            return $this->default_colors;
        }

        $sanitized = [];
        $states = ['normal', 'hover', 'active', 'disabled'];

        foreach ($states as $state) {
            if (isset($colors[$state]) && is_array($colors[$state])) {
                $sanitized[$state] = [
                    'background' => $this->sanitize_color_value($colors[$state]['background'] ?? ''),
                    'text' => $this->sanitize_color_value($colors[$state]['text'] ?? ''),
                    'border' => $this->sanitize_color_value($colors[$state]['border'] ?? ''),
                    'useBorder' => !empty($colors[$state]['useBorder'])
                ];
            } else {
                $sanitized[$state] = $this->default_colors[$state] ?? [];
            }
        }

        return $sanitized;
    }

    /**
     * Sanitize a numeric value with range validation
     *
     * @param mixed $value The value to sanitize
     * @param int $min Minimum allowed value
     * @param int $max Maximum allowed value
     * @param int $default Default value if invalid
     * @return int Sanitized value
     */
    private function sanitize_numeric_value($value, $min, $max, $default)
    {
        $sanitized = absint($value);

        if ($sanitized < $min || $sanitized > $max) {
            return $default;
        }

        return $sanitized;
    }

    /**
     * Sanitize color value (supports hex, CSS variables, gradients)
     *
     * @param mixed $color Color value to sanitize
     * @return mixed Sanitized color value
     */
    private function sanitize_color_value($color)
    {
        // Handle gradient objects
        if (is_array($color)) {
            return $this->sanitize_gradient_value($color);
        }

        // Handle string values (hex, CSS variables, color names)
        if (is_string($color)) {
            // Allow CSS custom properties
            if (strpos($color, 'var(') === 0) {
                return sanitize_text_field($color);
            }

            // Allow hex colors
            if (preg_match('/^#([A-Fa-f0-9]{3}){1,2}$/', $color)) {
                return sanitize_hex_color($color);
            }

            // Allow common CSS color names
            $allowed_colors = [
                'transparent', 'inherit', 'currentColor',
                'black', 'white', 'red', 'green', 'blue',
                'yellow', 'orange', 'purple', 'pink', 'brown', 'gray', 'grey'
            ];

            if (in_array(strtolower($color), $allowed_colors, true)) {
                return sanitize_text_field($color);
            }
        }

        return '';
    }

    /**
     * Sanitize gradient color value
     *
     * @param array $gradient Gradient data
     * @return array Sanitized gradient
     */
    private function sanitize_gradient_value($gradient)
    {
        if (!is_array($gradient)) {
            return [];
        }

        $sanitized = [
            'type' => in_array($gradient['type'] ?? '', ['solid', 'gradient'], true)
                ? $gradient['type']
                : 'solid',
            'solid' => $this->sanitize_color_value($gradient['solid'] ?? ''),
        ];

        if (isset($gradient['gradient']) && is_array($gradient['gradient'])) {
            $grad = $gradient['gradient'];

            $sanitized['gradient'] = [
                'type' => in_array($grad['type'] ?? '', ['linear', 'radial'], true)
                    ? $grad['type']
                    : 'linear',
                'angle' => absint($grad['angle'] ?? 135),
                'stops' => []
            ];

            if (isset($grad['stops']) && is_array($grad['stops'])) {
                foreach ($grad['stops'] as $stop) {
                    if (is_array($stop)) {
                        $sanitized['gradient']['stops'][] = [
                            'color' => $this->sanitize_color_value($stop['color'] ?? ''),
                            'position' => absint($stop['position'] ?? 0)
                        ];
                    }
                }
            }
        }

        return $sanitized;
    }
