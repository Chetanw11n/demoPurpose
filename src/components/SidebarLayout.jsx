import React, { useState } from "react"
import { Nav, Button } from "react-bootstrap"
import { FaBars, FaUserCog, FaChartBar, FaCog } from "react-icons/fa"
import "./SidebarLayout.css"



const SidebarLayout = ({ menuItems, activeKey, onSelect, children ,iconMap}) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="layout-container">
      {/* SIDEBAR */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <Button
            variant="link"
            className="toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FaBars />
          </Button>
          {!collapsed && <span className="logo-text">Admin Panel</span>}
        </div>

     
        <Nav
          className="flex-column sidebar-nav"
          activeKey={activeKey}
          onSelect={onSelect}
        >
          {menuItems.map(item => (
            <Nav.Link
              key={item.key}
              eventKey={item.key}
              className="nav-item"
            >
              <span className="icon">
                {iconMap[item.key]}
              </span>
              {!collapsed && (
                <span className="label">{item.label}</span>
              )}
            </Nav.Link>
          ))}
        </Nav>
      </aside>

      {/* CONTENT */}
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default SidebarLayout