import api from "../config/axios.config";
 
/* ✅ GET USER NOTIFICATIONS */
export const getUserNotifications = (userId) => {
  return api.get("/notification/user", {
    headers: {
      "X-User-Id": userId
    }
  });
};
 
/* ✅ GET CITIZEN NOTIFICATIONS */
export const getCitizenNotifications = (userId) => {
  return api.get("/notification/citizen", {
    headers: {
      "X-User-Id": userId
    }
  });
};
 
/* ✅ MARK AS READ */
export const markAsRead = (notificationId) => {
  return api.patch(`/notification/${notificationId}`);
};
 
/* ✅ CREATE NOTIFICATION (optional) */
export const pushNotification = (data) => {
  return api.post("/notification/save", data);
};
 
 