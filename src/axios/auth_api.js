//auth api calls
import api from "../config/axios.config";
 
const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    //http://localhost:8081/users/pending
    console.log("Backend resposne ",response)
    return response;
}
 
const pendingUsers = async () => {
    const response = await api.get('/users/pending');
    console.log("Pending users response ",response)
    return response;
}
const signup = async (userData) => {
    const response = await api.post('/auth/user/signup', userData);
    console.log("Signup response ", response);
    return response;
}
 
const requestPasswordReset = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    console.log("Password reset request response ", response);
    return response;
}
 
const resetPassword = async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData);
    console.log("Password reset response ", response);
    return response;
}
 
export { login, signup, requestPasswordReset, resetPassword, pendingUsers }
 