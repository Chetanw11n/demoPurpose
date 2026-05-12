export const ROLES = {
  CITIZEN_PASSENGER: 'CITIZEN_PASSENGER',
  TRANSPORT_OFFICER: 'TRANSPORT_OFFICER',
  PROGRAM_MANAGER: 'PROGRAM_MANAGER',
  ADMINISTRATOR: 'ADMINISTRATOR',
  COMPLIANCE_OFFICER: 'COMPLIANCE_OFFICER',
  GOVERNMENT_AUDITOR: 'GOVERNMENT_AUDITOR',
};

export const roleConfig = {
  [ROLES.CITIZEN_PASSENGER]: {
    name: 'Citizen Passenger',
    canAccess: ['CitizenDashboard', 'Profile', 'Permits', 'ViewComplaints', 'TicketBooking'],
    canPerform: ['viewOwnData', 'submitComplaint', 'viewPermits', 'bookTicket', 'viewTickets', 'checkTicket'],
  },
  [ROLES.TRANSPORT_OFFICER]: {
    name: 'Transport Officer',
    canAccess: ['Dashboard', 'ProgramsResources', 'Routes', 'Vehicles', 'ViewComplaints', 'Documents', 'Users', 'Tickets'],
    canPerform: ['manageRoutes', 'manageSchedules', 'viewComplaints', 'verifyDocuments', 'viewUsers', 'checkTickets', 'viewTickets', 'createRoute', 'updateRoute', 'createSchedule', 'updateSchedule'],
  },
  [ROLES.PROGRAM_MANAGER]: {
    name: 'Program Manager',
    canAccess: ['Dashboard', 'ProgramsResources', 'Reports', 'Compliance', 'Audits', 'Routes', 'Resources', 'Notifications'],
    canPerform: ['managePrograms', 'submitPrograms', 'approvePrograms', 'manageResources', 'allocateResources', 'generateReports', 'viewComplaints', 'createRoute', 'updateRoute', 'createSchedule', 'updateSchedule', 'createNotification', 'viewTicketCount'],
  },
  [ROLES.ADMINISTRATOR]: {
    name: 'Administrator',
    canAccess: ['Dashboard', 'UserManagement', 'ProgramsResources', 'Reports', 'Settings', 'Compliance', 'Audits', 'Routes', 'Vehicles', 'Documents', 'Users', 'Tickets', 'AuditLogs'],
    canPerform: [
      'viewAllData', 'manageUsers', 'generateReports', 'manageRoles', 'manageVehicles', 'allocateResources',
      'viewComplaints', 'approvePrograms', 'deleteAudit', 'viewAuditLogs', 'changeUserRole',
      'verifyDocuments', 'viewTicketCount', 'viewTickets', 'manageRoutes', 'manageSchedules', 
      'deleteRoute', 'deleteSchedule', 'createNotification'
    ],
  },
  [ROLES.COMPLIANCE_OFFICER]: {
    name: 'Compliance Officer',
    canAccess: ['Dashboard', 'Compliance', 'Audits', 'Reports', 'ViewComplaints', 'Documents', 'Resources', 'Notifications'],
    canPerform: [
      'viewComplaints', 'createInspection', 'generateReports', 'viewAnalytics', 'auditPrograms',
      'viewAuditResults', 'saveCompliance', 'updateCompliance', 'deleteCompliance', 'viewComplaints',
      'verifyDocuments', 'allocateResources', 'createNotification', 'viewTicketCount'
    ],
  },
  [ROLES.GOVERNMENT_AUDITOR]: {
    name: 'Government Auditor',
    canAccess: ['Dashboard', 'Reports', 'Audits', 'Compliance', 'ViewComplaints', 'AuditLogs'],
    canPerform: [
      'generateReports', 'viewAnalytics', 'auditPrograms', 'viewComplaints', 'createAudit',
      'updateAudit', 'deleteAudit', 'closeAudit', 'viewAuditSummary', 'viewAuditLogs',
      'viewCompliance', 'viewTicketCount'
    ],
  },
};

export const componentPermissions = {
  // Dashboard
  Dashboard: [ROLES.ADMINISTRATOR, ROLES.COMPLIANCE_OFFICER, ROLES.TRANSPORT_OFFICER, ROLES.PROGRAM_MANAGER, ROLES.GOVERNMENT_AUDITOR],
  CitizenDashboard: [ROLES.CITIZEN_PASSENGER],

  // User Management
  UserManagement: [ROLES.ADMINISTRATOR],
  Users: [ROLES.ADMINISTRATOR, ROLES.TRANSPORT_OFFICER, ROLES.COMPLIANCE_OFFICER],
  PendingUsers: [ROLES.ADMINISTRATOR],

  // Programs & Resources
  ProgramsResources: [ROLES.ADMINISTRATOR, ROLES.PROGRAM_MANAGER, ROLES.TRANSPORT_OFFICER],
  Programs: [ROLES.CITIZEN_PASSENGER, ROLES.TRANSPORT_OFFICER, ROLES.PROGRAM_MANAGER, ROLES.ADMINISTRATOR, ROLES.COMPLIANCE_OFFICER],
  Resources: [ROLES.PROGRAM_MANAGER, ROLES.ADMINISTRATOR, ROLES.COMPLIANCE_OFFICER],
  ResourceManagement: [ROLES.ADMINISTRATOR, ROLES.TRANSPORT_OFFICER, ROLES.PROGRAM_MANAGER],

  // Reports
  Reports: [ROLES.ADMINISTRATOR, ROLES.COMPLIANCE_OFFICER, ROLES.PROGRAM_MANAGER, ROLES.GOVERNMENT_AUDITOR],

  // Settings
  Settings: [ROLES.ADMINISTRATOR],

  // Compliance & Audits
  Compliance: [ROLES.ADMINISTRATOR, ROLES.COMPLIANCE_OFFICER, ROLES.PROGRAM_MANAGER, ROLES.GOVERNMENT_AUDITOR],
  Audits: [ROLES.ADMINISTRATOR, ROLES.COMPLIANCE_OFFICER, ROLES.GOVERNMENT_AUDITOR, ROLES.PROGRAM_MANAGER],
  AuditLogs: [ROLES.ADMINISTRATOR, ROLES.GOVERNMENT_AUDITOR],


  // Citizen Features
  Profile: [ROLES.CITIZEN_PASSENGER, ROLES.ADMINISTRATOR],
  Permits: [ROLES.CITIZEN_PASSENGER, ROLES.TRANSPORT_OFFICER],
  ViewComplaints: [ROLES.CITIZEN_PASSENGER, ROLES.COMPLIANCE_OFFICER, ROLES.TRANSPORT_OFFICER],
  TicketBooking: [ROLES.CITIZEN_PASSENGER],
  Tickets: [ROLES.CITIZEN_PASSENGER, ROLES.TRANSPORT_OFFICER, ROLES.COMPLIANCE_OFFICER],

  // Routes & Schedules
  Routes: [ROLES.TRANSPORT_OFFICER, ROLES.ADMINISTRATOR, ROLES.PROGRAM_MANAGER],
  Vehicles: [ROLES.TRANSPORT_OFFICER, ROLES.ADMINISTRATOR],

  // Documents
  Documents: [ROLES.CITIZEN_PASSENGER, ROLES.TRANSPORT_OFFICER, ROLES.ADMINISTRATOR, ROLES.COMPLIANCE_OFFICER],

  // Notifications
  Notifications: [ROLES.ADMINISTRATOR, ROLES.COMPLIANCE_OFFICER, ROLES.PROGRAM_MANAGER, ROLES.TRANSPORT_OFFICER, ROLES.CITIZEN_PASSENGER, ROLES.GOVERNMENT_AUDITOR],

  // View Transport
  ViewTransport: [ROLES.COMPLIANCE_OFFICER, ROLES.GOVERNMENT_AUDITOR],
  Inspections: [ROLES.COMPLIANCE_OFFICER, ROLES.ADMINISTRATOR],
};