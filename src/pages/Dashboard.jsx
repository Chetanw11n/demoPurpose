import React from 'react'
import { useRole } from '../hooks/useRole'
import { ROLES } from '../config/roleConfig'
import CitizenDashboard from './dashboards/CitizenDashboard'
import UserDashboard from './dashboards/UserDashboard'
 
const Dashboard = () => {
  const { role, isAuthenticated } = useRole()
  console.log("User role in Dashboard:", role)
 
  if (!isAuthenticated) {
    return <div className="alert alert-warning">Please log in</div>
  }
 
  console.log("Rendering Dashboard for role:", role)
  // Show CitizenDashboard only for citizens
  if (role === ROLES.CITIZEN_PASSENGER) {
    console.log("Rendering CitizenDashboard for role:", role)
    return <CitizenDashboard componentName="CitizenDashboard" />
  }
 
  // All other roles use UserDashboard
  console.log("Rendering UserDashboard for role:", role)
  return <UserDashboard componentName="UserDashboard" />
}
 
export default Dashboard
 