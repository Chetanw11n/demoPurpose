import React, { useEffect, useState } from "react";
import {
  getUserNotifications,
  getCitizenNotifications,
  markAsRead,
  pushNotification
} from "../../../axios/notification_api";
import "./Notifications.css";
import { useRole } from "../../../hooks/useRole";
 
/*
  ✅ onHasUnreadChange:
  Sends TRUE/FALSE to dashboard
*/
const Notifications = ({ isPopup = false, onHasUnreadChange }) => {
  const { user, role } = useRole();
  const userId = user?.id || user?.userId || user?.phone;
 
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
 
  const [formData, setFormData] = useState({
    targetUserId: "",
    email: "",
    message: "",
    category: "PROGRAM"
  });
 
  const fetchNotifications = async () => {
    try {
      let res;
      if (role === "CITIZEN_PASSENGER") {
        res = await getCitizenNotifications(userId);
      } else {
        res = await getUserNotifications(userId);
      }
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Notification fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, [role, userId]);
 
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
  );
 
  /* ✅ SIMPLE UNREAD CHECK */
  const hasUnread = sortedNotifications.some(
    (n) => n.status === "UNREAD"
  );
 
  /* ✅ SEND ALERT STATE TO DASHBOARD */
  useEffect(() => {
    if (onHasUnreadChange) {
      onHasUnreadChange(hasUnread);
    }
  }, [hasUnread, onHasUnreadChange]);
 
  const handleRead = async (id) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === id ? { ...n, status: "READ" } : n
      )
    );
  };
 
  const handleSend = async () => {
    try {
      await pushNotification({
        userId: Number(formData.targetUserId),
        email: formData.email,
        message: formData.message,
        category: formData.category
      });
      alert("✅ Sent");
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };
 
  if (loading) return <p>Loading...</p>;
 
  /* ✅ POPUP MODE */
  if (isPopup) {
    return (
      <div className="popup-panel">
        <h4>🔔 Notifications</h4>
 
        <div className="popup-scroll">
          {sortedNotifications.length === 0 && (
            <p className="text-muted">No notifications available</p>
          )}
 
          {sortedNotifications.map((n) => (
            <div key={n.notificationId} className="popup-item">
              <span className="category">{n.category}</span>
              <p>{n.message}</p>
 
              {n.status === "UNREAD" && (
                <button onClick={() => handleRead(n.notificationId)}>
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
 
  /* ✅ FULL PAGE MODE (UNCHANGED) */
  return (
    <div className="notification-container">
      <div className="send-box modern-card">
        <h3>Send Notification</h3>
 
        <input
          placeholder="User ID"
          value={formData.targetUserId}
          onChange={(e) =>
            setFormData({ ...formData, targetUserId: e.target.value })
          }
        />
 
        <input
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
 
        <textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />
 
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option>PROGRAM</option>
          <option>ROUTE</option>
          <option>TICKET</option>
          <option>COMPLIANCE</option>
        </select>
 
        <button onClick={handleSend}>Send</button>
      </div>
 
      <button onClick={() => setShowAll(true)}>
        Show My All Notifications
      </button>
 
      {showAll && (
        <div className="notification-grid">
          {sortedNotifications.map((n) => (
            <div
              key={n.notificationId}
             
className={`notification-card ${n.category?.toLowerCase()} ${
  n.status === "READ" ? "read" : ""
}`}
 
            >
              <p>{n.message}</p>
              <span>{n.category}</span>
 
              {n.status === "UNREAD" && (
                <button onClick={() => handleRead(n.notificationId)}>
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
 
export default Notifications;
 
 
 