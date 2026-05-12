// import React, { useState } from "react"
// import { useRole } from "../../hooks/useRole"
// import UserManagement from "../features/user/UserManagement"
// import SidebarLayout from "../../components/SidebarLayout"
// import "./Dashboard.css"
 
// import {
//   FaUserCog,
//   FaChartBar,
//   FaCog,
//   FaFileAlt,
//   FaClipboardCheck,
//   FaChartLine,
//   FaBus
// } from "react-icons/fa"
 
// import { BiSolidBell, BiSolidBellRing } from "react-icons/bi"
// import { Col, Row } from "react-bootstrap"
 
// import ProgramsResources from "../features/programs_resources/ProgramsResources"
// import ComplianceList from "../features/compliance_audits/complianceList"
// import AuditsList from "../features/compliance_audits/AuditsList"
// import RouteScheduleDashboard from "../features/routes_schedule/RouteScheduleDashboard"
 
// import { ROLES } from "../../config/roleConfig"
 
// const iconMap = {
//   users: <FaUserCog />,
//   "programs-resources": <FaFileAlt />,
//   routes: <FaBus />,
//   compliance: <FaClipboardCheck />,
//   audits: <FaClipboardCheck />,
//   reports: <FaChartBar />,
//   analytics: <FaChartLine />,
//   settings: <FaCog />
// }
 
// const UserDashboard = () => {
//   const { user, role, canAccess } = useRole()
//   const [activeKey, setActiveKey] = useState("programs-resources")
 
//   const baseMenuItems = [
//     { key: "programs-resources", label: "Programs & Resources", requiredComponent: "ProgramsResources" },
//     { key: "routes", label: "Routes & Schedules", requiredComponent: "Routes" },
//     { key: "compliance", label: "Compliance", requiredComponent: "Compliance" },
//     { key: "audits", label: "Audits", requiredComponent: "Audits" },
//     { key: "reports", label: "Reports", requiredComponent: "Reports" },
//   ]
 
 
//   const adminMenuItems = [
//     { key: "users", label: "User Management", requiredComponent: "UserManagement" },
//     { key: "settings", label: "Settings", requiredComponent: "Settings" },
//   ]
 
//   const complianceMenuItems = [
//     { key: "compliance", label: "Compliance", requiredComponent: "Compliance" },
//     { key: "audits", label: "Audits", requiredComponent: "Audits" },
//   ]
 
//   let menuItems = [...baseMenuItems]
 
//   // Add role-specific menu items
//   if (role === ROLES.ADMINISTRATOR) {
//     menuItems = [...adminMenuItems, ...baseMenuItems, ...complianceMenuItems]
//   } else if (role === ROLES.PROGRAM_MANAGER) {
//     menuItems = [...baseMenuItems, ...complianceMenuItems]
//   } else if (role === ROLES.COMPLIANCE_OFFICER || role === ROLES.GOVERNMENT_AUDITOR) {
//     menuItems = [...complianceMenuItems, { key: "reports", label: "Reports", requiredComponent: "Reports" }]
//   } else if (role === ROLES.TRANSPORT_OFFICER) {
//     menuItems = [...baseMenuItems]
//   }
 
//   // const menuItems = allMenuItems//.filter(item => canAccess(item.requiredComponent) || item.requiredComponent === "UserManagement")
 
//   const renderContent = () => {
//     switch (activeKey) {
//       case "users":
//         return canAccess('UserManagement') ? <UserManagement /> : <div className="alert alert-danger">Access Denied</div>
//       case "programs-resources":
//         return canAccess('ProgramsResources') ? <ProgramsResources /> : <div className="alert alert-danger">Access Denied</div>
 
//          return <ProgramsResources />
//       case "routes":
//         return <RouteScheduleDashboard />
//         // return canAccess('ProgramsResources') ? <ProgramsResources /> : <div className="alert alert-danger">You do not have access to this section</div>
//         return <ProgramsResources />
//       case "compliance":
//         // return canAccess('Compliance') ? <ComplianceList /> : <div className="alert alert-danger">Access Denied</div>
//         return <ComplianceList />
//         case "audits":
//         return canAccess('Audits') ? <AuditsList /> : <div className="alert alert-danger">Access Denied</div>
 
//         // return <AuditsList />
//       case "reports":
//         return canAccess('Reports') ? <h4>Reports & Analytics</h4> : <div className="alert alert-danger">Access Denied</div>
//       case "settings":
//         return canAccess('Settings') ? <h4>System Settings</h4> : <div className="alert alert-danger">Access Denied</div>
//       default:
//         return null
//     }
//   }
 
//   const getRoleName = () => {
//     const roleNames = {
//       [ROLES.ADMINISTRATOR]: 'Administrator',
//       [ROLES.PROGRAM_MANAGER]: 'Program Manager',
//       [ROLES.TRANSPORT_OFFICER]: 'Transport Officer',
//       [ROLES.COMPLIANCE_OFFICER]: 'Compliance Officer',
//       [ROLES.GOVERNMENT_AUDITOR]: 'Government Auditor',
//     }
//     return roleNames[role] || role
//   }
 
//   return (
//     <SidebarLayout
//       menuItems={menuItems}
//       activeKey={activeKey}
//       onSelect={setActiveKey}
//       iconMap={iconMap}
//     >
//       <Row className="mb-4 align-items-center justify-content-between">
//         <Col>
//           <h1>Welcome, {user?.name}!</h1>
//           <p>{getRoleName()} Dashboard</p>
//         </Col>
//         <Col xs="auto" className="d-flex gap-3">
//           <BiSolidBell size={24} style={{ cursor: 'pointer' }} />
//           <BiSolidBellRing size={24} style={{ cursor: 'pointer' }} />
//         </Col>
//       </Row>
//       <hr />
//       {renderContent()}
//     </SidebarLayout>
//   )
// }
 
// export default UserDashboard
 

 import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../hooks/useRole";
import { useAuth } from "../../hooks/useAuth";
import SidebarLayout from "../../components/SidebarLayout";
import "./Dashboard.css";
 
import {
  FaUserCog,
  FaChartBar,
  FaCog,
  FaFileAlt,
  FaClipboardCheck,
  FaBus,
} from "react-icons/fa";
import { BiSolidBell } from "react-icons/bi";
import { Col, Row, Alert } from "react-bootstrap";
 
import UserManagement from "../features/user/UserManagement";
import ProgramsResources from "../features/programs_resources/ProgramsResources";
import Reports from "../features/reports/Reports";
import Notifications from "../features/notification/Notifications";
import ComplianceList from "../features/Compliance_audits/ComplianceList";
import AuditsList from "../features/compliance_audits/AuditsList";
import RouteScheduleDashboard from "../features/routes_schedule/RouteScheduleDashboard";
 
import { ROLES, componentPermissions } from "../../config/roleConfig";
 
const iconMap = {
  users: <FaUserCog />,
  "programs-resources": <FaFileAlt />,
  routes: <FaBus />,
  compliance: <FaClipboardCheck />,
  audits: <FaClipboardCheck />,
  reports: <FaChartBar />,
  notifications: <BiSolidBell />,
  settings: <FaCog />,
};
 
const UserDashboard = () => {
  const { user, role, canAccess } = useRole();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("programs-resources");
  const [showPopup, setShowPopup] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const panelRef = useRef(null);
 
  // Check authorization on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
 
    // Check if user is citizen - redirect to citizen dashboard
    if (role === ROLES.CITIZEN_PASSENGER) {
      navigate("/citizen-dashboard");
      return;
    }
 
    // Check if role can access dashboard
    const allowedRoles = [
      ROLES.ADMINISTRATOR,
      ROLES.PROGRAM_MANAGER,
      ROLES.TRANSPORT_OFFICER,
      ROLES.COMPLIANCE_OFFICER,
      ROLES.GOVERNMENT_AUDITOR,
    ];
 
    if (!allowedRoles.includes(role)) {
      navigate("/access-denied");
      return;
    }
  }, [isAuthenticated, role, navigate]);
 
  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
 
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
 
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);
 
  // Build role-based menu
  const baseMenuItems = [
    { key: "programs-resources", label: "Programs & Resources" },
    { key: "routes", label: "Routes & Schedules" },
    { key: "reports", label: "Reports" },
  ];
 
  const adminMenuItems = [
    { key: "users", label: "User Management" },
    { key: "settings", label: "Settings" },
  ];
 
  const complianceMenuItems = [
    { key: "compliance", label: "Compliance" },
    { key: "audits", label: "Audits" },
  ];
 
  const notificationItem = {
    key: "notifications",
    label: "Notifications",
  };
 
  let menuItems = [];
 
  if (role === ROLES.ADMINISTRATOR) {
    menuItems = [
      { key: "users", label: "User Management" },
      notificationItem,
      ...baseMenuItems,
      ...complianceMenuItems,
      { key: "settings", label: "Settings" },
    ];
  } else if (role === ROLES.PROGRAM_MANAGER) {
    menuItems = [
      notificationItem,
      { key: "programs-resources", label: "Programs & Resources" },
      { key: "reports", label: "Reports" },
      ...complianceMenuItems,
    ];
  } else if (role === ROLES.COMPLIANCE_OFFICER) {
    menuItems = [
      notificationItem,
      ...complianceMenuItems,
      { key: "reports", label: "Reports" },
    ];
  } else if (role === ROLES.TRANSPORT_OFFICER) {
    menuItems = [
      notificationItem,
      ...baseMenuItems,
    ];
  } else if (role === ROLES.GOVERNMENT_AUDITOR) {
    menuItems = [
      notificationItem,
      ...complianceMenuItems,
      { key: "reports", label: "Reports" },
    ];
  }
 
  const renderContent = () => {
    // Map activeKey to component name for permission checking
    const componentNameMap = {
      'users': 'UserManagement',
      'programs-resources': 'ProgramsResources',
      'routes': 'Routes',
      'compliance': 'Compliance',
      'audits': 'Audits',  // ✅ This must match componentPermissions key exactly
      'reports': 'Reports',
      'notifications': 'Notifications',
      'settings': 'Settings'
    };

    const componentName = componentNameMap[activeKey];
    
    // Check if user has permission for this component
    const allowedRoles = componentPermissions[componentName];
    const hasPermission = allowedRoles ? allowedRoles.includes(role) : false;

    if (!hasPermission) {
      return (
        <Alert variant="danger">
          <strong>Access Denied:</strong> You do not have permission to access this section.
        </Alert>
      );
    }

    switch (activeKey) {
      case "users":
        return <UserManagement />;
      case "programs-resources":
        return <ProgramsResources />;
      case "routes":
        return <RouteScheduleDashboard />;
      case "compliance":
        return <ComplianceList />;
      case "audits":
        return <AuditsList />;
      case "reports":
        return <Reports />;
      case "notifications":
        return <Notifications />;
      case "settings":
        return <h4>System Settings</h4>;
      default:
        return null;
    }
  };
 
  if (!isAuthenticated || !role) {
    return <div className="alert alert-info">Loading...</div>;
  }
 
  return (
    <SidebarLayout
      menuItems={menuItems}
      activeKey={activeKey}
      onSelect={setActiveKey}
      iconMap={iconMap}
    >
      <Row className="mb-4 align-items-center justify-content-between">
        <Col>
          <h1>Welcome, {user?.name || user?.email}!</h1>
          <p>{role}</p>
        </Col>
 
        <Col xs="auto" style={{ position: "relative" }}>
          <BiSolidBell
            size={24}
            style={{ cursor: "pointer" }}
            onClick={() => setShowPopup((prev) => !prev)}
          />
 
          {hasUnread && (
            <span
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "8px",
                height: "8px",
                backgroundColor: "red",
                borderRadius: "50%"
              }}
            />
          )}
        </Col>
      </Row>
 
      {showPopup && (
        <div ref={panelRef}>
          <Notifications isPopup={true} onHasUnreadChange={setHasUnread} />
        </div>
      )}
 
      <hr />
 
      {renderContent()}
    </SidebarLayout>
  );
};
 
export default UserDashboard;

