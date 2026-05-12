// Utility functions for route and schedule management

/**
 * Extract route ID from route object (handles routeID, routeId, and id fields)
 * @param {Object} route - Route object
 * @returns {string|null} Route ID as string or null if not found
 */
export const getRouteId = (route) => {
    const id = route?.routeID ?? route?.routeId ?? route?.id
    if (!id) {
        console.warn('Route ID is missing:', route)
        return null
    }
    return String(id)
}

/**
 * Normalize ID for comparison (handles undefined/null values)
 * @param {any} id - ID to normalize
 * @returns {string|null} Normalized ID or null
 */
export const normalizeId = (id) => {
    if (id === undefined || id === null) return null
    return String(id)
}