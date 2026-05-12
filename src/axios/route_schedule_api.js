import api from '../config/axios.config'

// Route endpoints
export const getRoutes = async () => {
    // CHANGE: Remove the trailing slash after 'route'
    return api.get('/route') 
}

export const getRouteById = async (routeID) => {
    return api.get(`/route/${routeID}`)
}

export const createRoute = async (routeData) => {
    return api.post('/route', routeData)
}

export const updateRoute = async (routeID, routeData) => {
	if (!routeID) {
		console.error(' updateRoute called with missing routeID')
		throw new Error('Route ID is required for update')
	}
	console.log(' API: updateRoute', { routeID, routeData })
	return api.put(`/route/${routeID}`, routeData)
}

export const deleteRoute = async (routeID) => {
    return api.delete(`/route/${routeID}`)
}

// Schedule endpoints
export const getSchedulesByRouteId = async (routeID) => {
	return api.get(`/schedule/route/${routeID}`)
}

export const getScheduleById = async (scheduleID) => {
	return api.get(`/schedule/${scheduleID}`)
}

export const createSchedule = async (routeID, scheduleData) => {
	return api.post(`/schedule/${routeID}`, scheduleData)
}

export const updateSchedule = async (scheduleID, scheduleData) => {
	return api.put(`/schedule/${scheduleID}`, scheduleData)
}

export const deleteSchedule = async (scheduleID) => {
	return api.delete(`/schedule/${scheduleID}`)
}

// Get fare for a specific route
export const getRouteFare = async (routeId) => {
  return api.get(`/route/${routeId}`)
}

// Get routes by type
export const getRoutesByType = async (type) => {
  return api.get(`/route/type/${type}`)
}