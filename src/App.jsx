import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/features/authentication/Login";
import SignUp from "./pages/features/authentication/SignUp";
import ForgotPassword from "./pages/features/authentication/ForgotPassword";
import CitizenSignUp from "./pages/features/authentication/CitizenSignUp";
import CitizenForgotPassword from "./pages/features/authentication/CitizenForgotPassword";
import UserSelection from "./pages/features/authentication/UserSelection";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Provider } from "react-redux";
import store from "./redux/store";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import { About } from "./pages/About";
import Contact from "./pages/Contact";
 
import RouteScheduleDashboard from "./pages/features/routes_schedule/RouteScheduleDashboard";
import AccessDenied from "./components/AccessDenied";
 
 
 
function App() {
  return (
    <Provider store={store}>
 
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup-selection" element={<UserSelection />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/citizen-signup" element={<CitizenSignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/citizen/forgot-password" element={<CitizenForgotPassword />} />
        <Route
          path="/dashboard"
          element={  
            <ProtectedRoute componentName="Dashboard">
              <Dashboard />
            </ProtectedRoute>
          }
        />
     
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/access-denied" element={<AccessDenied />} />
       
      </Routes>
      <Footer />
     
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />
 
    </Provider>
  )
}
 
export default App
 