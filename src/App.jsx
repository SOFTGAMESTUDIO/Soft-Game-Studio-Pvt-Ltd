import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import NotFoundPage from './pages/NoPage/NoPage';
import UserLogin from './pages/Registraction/UserLogin';
import UserSignup from './pages/Registraction/UserSignup';
import UserResetPasswordPage from './pages/Registraction/UserResetPasword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Privacy from './pages/CUSTOMER SERVICE/PrivacyPolicy';
import About from './pages/CUSTOMER SERVICE/About';
import ContactUs from './pages/CUSTOMER SERVICE/Contact_Us';
import ReturnPolicy from './pages/CUSTOMER SERVICE/Return Policy';


import TermsAndConditions from "./pages/CUSTOMER SERVICE/TermsAndConditions";

import CopyrightPage from './pages/CopyrightPage/CopyrightPage';







import ScrollToTop from './ScrollToTop';
import Cart from './pages/Cart/Cart';
import ProductsPage from './pages/Projects/PRoject';
import { MacbookScrollDemo } from './components/Hero/HeroSection';
import FeedbackSection from './pages/CUSTOMER SERVICE/FeedBackFome';
import FAQItem from './pages/CUSTOMER SERVICE/FAQs';





















function App() {
  return (
 
      <Router future={{ 
    v7_startTransition: true, 
    v7_relativeSplatPath: true 
}}>
      <ScrollToTop/>
        <Routes>
          <Route path="/" element={<About/>} />
          
      
       



          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/resetpassword" element={<UserResetPasswordPage />} />


          <Route path="/*" element={<NotFoundPage />} />
          <Route path="/CopyrightPage" element={<CopyrightPage/>} />    
          <Route path="/PrivacyPolicy" element={<Privacy />} />
          <Route path="/ReturnPolicy" element={<ReturnPolicy />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
          <Route path="/About-SGS" element={<About />} />
          <Route path="/Feedback" element={<FeedbackSection />} />
          <Route path="/FAQs" element={<FAQItem />} />



         <Route path="/Cart" element={<Cart />} />
         <Route path="/Project" element={<ProductsPage />} />
          
        </Routes>
        <ToastContainer />
      </Router>
  );
}

export default App 

// user 

export const ProtectedRoute = ({children}) => {
  const user = localStorage.getItem('user')
  if(user){
    return children
  }else{
    return <Navigate to={'/login'}/>
  }
}


export const ProtectedRouteForAdmin = ({children})=> {
  const admin = JSON.parse(localStorage.getItem('user')) 
  if (admin.user.email === import.meta.env.VITE__ADMIN_EMAIL) {
    return children;
  } else {
    return <Navigate to={"/login"} />;
  }
}


