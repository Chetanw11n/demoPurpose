function logout() {
    localStorage.removeItem('token');
    console.log('Token removed from localStorage');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirect to login page
  }
  export { logout };