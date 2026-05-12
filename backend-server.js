import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8081;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let routes = [];
let schedules = [];
let routeIdCounter = 1;
let scheduleIdCounter = 1;

// Initialize with sample data
routes = [
  {
    routeID: 1,
    title: 'Downtown Circular',
    type: 'Bus',
    startPoint: 'Central Station',
    endPoint: 'North Terminal',
    status: 'Active'
  },
  {
    routeID: 2,
    title: 'Metro Line 1',
    type: 'Metro',
    startPoint: 'Airport',
    endPoint: 'City Center',
    status: 'Active'
  }
];
routeIdCounter = 3;

schedules = [
  {
    scheduleID: 1,
    routeID: 1,
    date: '2026-05-10',
    time: '08:00',
    status: 'Scheduled'
  },
  {
    scheduleID: 2,
    routeID: 1,
    date: '2026-05-10',
    time: '10:30',
    status: 'Scheduled'
  }
];
scheduleIdCounter = 3;

// ========== ROUTE ENDPOINTS ==========

// GET all routes
app.get('/route', (req, res) => {
  console.log('GET /route - returning', routes.length, 'routes');
  res.json({
    success: true,
    data: routes,
    message: 'Routes retrieved successfully'
  });
});

// GET route by ID
app.get('/route/:id', (req, res) => {
  const route = routes.find(r => r.routeID === parseInt(req.params.id));
  if (!route) {
    return res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  }
  res.json({
    success: true,
    data: route,
    message: 'Route retrieved successfully'
  });
});

// CREATE new route
app.post('/route', (req, res) => {
  try {
    const { title, type, startPoint, endPoint, status } = req.body;
    
    if (!title || !startPoint || !endPoint) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, startPoint, endPoint'
      });
    }

    const newRoute = {
      routeID: routeIdCounter++,
      title,
      type: type || 'Bus',
      startPoint,
      endPoint,
      status: status || 'Active'
    };

    routes.push(newRoute);
    console.log('POST /route - created:', newRoute);
    
    res.status(201).json({
      success: true,
      data: newRoute,
      message: 'Route created successfully'
    });
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating route: ' + error.message
    });
  }
});

// UPDATE route
app.put('/route/:id', (req, res) => {
  try {
    const routeIndex = routes.findIndex(r => r.routeID === parseInt(req.params.id));
    
    if (routeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    const { title, type, startPoint, endPoint, status } = req.body;
    routes[routeIndex] = {
      ...routes[routeIndex],
      title: title || routes[routeIndex].title,
      type: type || routes[routeIndex].type,
      startPoint: startPoint || routes[routeIndex].startPoint,
      endPoint: endPoint || routes[routeIndex].endPoint,
      status: status || routes[routeIndex].status
    };

    console.log('PUT /route/:id - updated:', routes[routeIndex]);
    
    res.json({
      success: true,
      data: routes[routeIndex],
      message: 'Route updated successfully'
    });
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating route: ' + error.message
    });
  }
});

// DELETE route
app.delete('/route/:id', (req, res) => {
  try {
    const routeId = parseInt(req.params.id);
    const routeIndex = routes.findIndex(r => r.routeID === routeId);
    
    if (routeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    const deletedRoute = routes.splice(routeIndex, 1)[0];
    // Also delete associated schedules
    schedules = schedules.filter(s => s.routeID !== routeId);
    
    console.log('DELETE /route/:id - deleted:', deletedRoute);
    
    res.json({
      success: true,
      data: deletedRoute,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting route: ' + error.message
    });
  }
});

// ========== SCHEDULE ENDPOINTS ==========

// GET all schedules for a route
app.get('/schedule/route/:routeID', (req, res) => {
  try {
    const routeID = parseInt(req.params.routeID);
    const routeSchedules = schedules.filter(s => s.routeID === routeID);
    
    console.log('GET /schedule/route/:routeID - found', routeSchedules.length, 'schedules');
    
    res.json({
      success: true,
      data: routeSchedules,
      message: 'Schedules retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedules: ' + error.message
    });
  }
});

// GET schedule by ID
app.get('/schedule/:id', (req, res) => {
  const schedule = schedules.find(s => s.scheduleID === parseInt(req.params.id));
  if (!schedule) {
    return res.status(404).json({
      success: false,
      message: 'Schedule not found'
    });
  }
  res.json({
    success: true,
    data: schedule,
    message: 'Schedule retrieved successfully'
  });
});

// CREATE new schedule
app.post('/schedule/:routeID', (req, res) => {
  try {
    const routeID = parseInt(req.params.routeID);
    const { date, time, status } = req.body;

    // Verify route exists
    const route = routes.find(r => r.routeID === routeID);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: date, time'
      });
    }

    const newSchedule = {
      scheduleID: scheduleIdCounter++,
      routeID,
      date,
      time,
      status: status || 'Scheduled'
    };

    schedules.push(newSchedule);
    console.log('POST /schedule/:routeID - created:', newSchedule);
    
    res.status(201).json({
      success: true,
      data: newSchedule,
      message: 'Schedule created successfully'
    });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating schedule: ' + error.message
    });
  }
});

// UPDATE schedule
app.put('/schedule/:id', (req, res) => {
  try {
    const scheduleIndex = schedules.findIndex(s => s.scheduleID === parseInt(req.params.id));
    
    if (scheduleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    const { date, time, status } = req.body;
    schedules[scheduleIndex] = {
      ...schedules[scheduleIndex],
      date: date || schedules[scheduleIndex].date,
      time: time || schedules[scheduleIndex].time,
      status: status || schedules[scheduleIndex].status
    };

    console.log('PUT /schedule/:id - updated:', schedules[scheduleIndex]);
    
    res.json({
      success: true,
      data: schedules[scheduleIndex],
      message: 'Schedule updated successfully'
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating schedule: ' + error.message
    });
  }
});

// DELETE schedule
app.delete('/schedule/:id', (req, res) => {
  try {
    const scheduleIndex = schedules.findIndex(s => s.scheduleID === parseInt(req.params.id));
    
    if (scheduleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    const deletedSchedule = schedules.splice(scheduleIndex, 1)[0];
    console.log('DELETE /schedule/:id - deleted:', deletedSchedule);
    
    res.json({
      success: true,
      data: deletedSchedule,
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting schedule: ' + error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is running',
    routes: routes.length,
    schedules: schedules.length
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Backend server is running on http://localhost:${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}`);
  console.log(`\n📚 Available Endpoints:`);
  console.log(`   GET    /route`);
  console.log(`   POST   /route`);
  console.log(`   GET    /route/:id`);
  console.log(`   PUT    /route/:id`);
  console.log(`   DELETE /route/:id`);
  console.log(`   GET    /schedule/route/:routeID`);
  console.log(`   POST   /schedule/:routeID`);
  console.log(`   GET    /schedule/:id`);
  console.log(`   PUT    /schedule/:id`);
  console.log(`   DELETE /schedule/:id`);
  console.log(`   GET    /health\n`);
});
