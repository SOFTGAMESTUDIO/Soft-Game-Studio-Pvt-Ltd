import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import NotFoundPage from "./pages/NoPage/NoPage";
import UserLogin from "./pages/Registraction/UserLogin";
import UserSignup from "./pages/Registraction/UserSignup";
import UserResetPasswordPage from "./pages/Registraction/UserResetPasword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Privacy from "./pages/CUSTOMER SERVICE/PrivacyPolicy";
import About from "./pages/CUSTOMER SERVICE/About";
import ContactUs from "./pages/CUSTOMER SERVICE/Contact_Us";
import ReturnPolicy from "./pages/CUSTOMER SERVICE/Return Policy";

import TermsAndConditions from "./pages/CUSTOMER SERVICE/TermsAndConditions";

import CopyrightPage from "./pages/CopyrightPage/CopyrightPage";

import ScrollToTop from "./ScrollToTop";
import Cart from "./pages/Cart/Cart";
import ProductsPage from "./pages/Projects/Product";
import FeedbackSection from "./pages/CUSTOMER SERVICE/FeedBackFome";
import FAQItem from "./pages/CUSTOMER SERVICE/FAQs";
import CookiesPolicy from "./pages/CUSTOMER SERVICE/CookiesPolicy";
import OurMembers from "./components/Members/OurMembers";

import Exam from "./pages/Admin/DashBoards/Exam/Exam";
import AdminCreateQuiz from "./pages/Admin/DashBoards/Exam/Quiz/CreateQuiz";
import EditQuizDetails from "./pages/Admin/DashBoards/Exam/Quiz/EditQuizDetails";
import EditQuizQuestion from "./pages/Admin/DashBoards/Exam/Quiz/EditQuizQuestions";
import ManageQuiz from "./pages/Admin/DashBoards/Exam/Quiz/ManageQuizzes";
import UserAnswers from "./pages/Admin/DashBoards/Exam/Quiz/UserAnswers";
import DashBoard from "./pages/Admin/DashBoard";
import UsersData from "./pages/Admin/DashBoards/User/UserData";
import DashboardOrder from "./pages/Admin/DashBoards/Orders/Orders";
import Product from "./pages/Admin/DashBoards/Products/Product";
import AddProduct from "./pages/Admin/DashBoards/Products/AddProduct";
import UpdateProduct from "./pages/Admin/DashBoards/Products/UpdateProduct";
import { MyProvider } from "./Library/MyContext";
import ExamDetails from "./pages/Exam/SGS EXAM/ExamDetails";
import SGSEXAM from "./pages/Exam/SGSEXAM";
import ExamQuizDetails from "./pages/Exam/Quiz/EXAM CONTROLER/ExamDetails";
import QuizExam from "./pages/Exam/Quiz/EXAM CONTROLER/QuizExam";
import ExamUplode from "./pages/Admin/DashBoards/Exam/ThuritacalExam.jsx/ExamUplode";
import AboutExam from "./pages/CUSTOMER SERVICE/AboutSGSExam";
import ProductDetailsPage from "./pages/Projects/ProductDetail";
import NotesAndBooks from "./pages/Admin/DashBoards/NotesAndBooks/NotesAndBooks";
import FreeNotesAndBooks from "./pages/NotesAndBooks/FreeNotesAndBooks.jsx";
import HomePage from "./components/Hero/HeroSection.jsx";
import AddCoursePage from "./pages/Admin/DashBoards/Courses/NewCourses.jsx";
import DisplayCourses from "./pages/Courses/Courses.jsx";
import SingleCourse from "./pages/Courses/SingleCourse.jsx";
import PlayListCourse from "./pages/Courses/PlayListCourse.jsx";
import EbookCreator from "./pages/Admin/DashBoards/EBook/EbookCreator.jsx";
import DashBoardEbook from "./pages/Admin/DashBoards/EBook/Ebooks.jsx";
import EditEbook from "./pages/Admin/DashBoards/EBook/EdietEbook.jsx";
import EbookReader from "./pages/EBook/EBooks.jsx";
import EbookCatalog from "./pages/EBook/DesplayEbboks.jsx";
import DevelopmentPage from "./pages/CUSTOMER SERVICE/AboutDevelopment.jsx";
import ProfilePage from "./pages/Profile/Profile.jsx";
import AllCoursesPage from "./pages/Admin/DashBoards/Courses/DisplayCourses.jsx";
import EditCoursePage from "./pages/Admin/DashBoards/Courses/EdietCourses.jsx";



import AdminCreateQuizFREE from "./pages/Admin/DashBoards/Exam/QuizFree/CreateQuiz";
import EditQuizDetailsFREE from "./pages/Admin/DashBoards/Exam/QuizFree/EditQuizDetails";
import EditQuizQuestionFREE from "./pages/Admin/DashBoards/Exam/QuizFree/EditQuizQuestions";
import ManageQuizFREE from "./pages/Admin/DashBoards/Exam/QuizFree/ManageQuizzes";



import AdminCreateQuizDaily from "./pages/Admin/DashBoards/Exam/DailyQuiz/CreateQuiz";
import EditQuizDetailsDaily from "./pages/Admin/DashBoards/Exam/DailyQuiz/EditQuizDetails";
import EditQuizQuestionDaily from "./pages/Admin/DashBoards/Exam/DailyQuiz/EditQuizQuestions";
import ManageQuizDaily from "./pages/Admin/DashBoards/Exam/DailyQuiz/ManageQuizzes";
import UserAnswersDaily from "./pages/Admin/DashBoards/Exam/DailyQuiz/UserAnswers";


function App() {
  return (
    <MyProvider>
       <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <Routes>
        {/*  Basic Links  */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/resetpassword" element={<UserResetPasswordPage />} />
{/* Leagle Documents  */}
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/CopyrightPage" element={<CopyrightPage />} />
        <Route path="/PrivacyPolicy" element={<Privacy />} />
        <Route path="/ReturnPolicy" element={<ReturnPolicy />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
        <Route path="/About-SGS" element={<About />} />
        <Route path="/About-Exam" element={<AboutExam />} />
        <Route path="/Feedback" element={<FeedbackSection />} />
        <Route path="/FAQs" element={<FAQItem />} />
        <Route path="/CookiesPolicy" element={<CookiesPolicy />} />
        <Route path="/OurMembers" element={<OurMembers />} />
        <Route path="/AboutDevelopmet" element={<DevelopmentPage/>} />

{/*  Product and Roots  */}
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Project" element={<ProductsPage />} />
        <Route path="/Project-Details/:id" element={<ProductDetailsPage />} />

{/* Exam Routes */}
         <Route path="/Exam" element={<SGSEXAM/>} />
         <Route path="/Exam-Details/:id" element={<ExamDetails />} />
         <Route path="/Exam-Quiz-Details/:id" element={<ExamQuizDetails />} />
         <Route path="/SGS-Quiz/:id" element={<QuizExam />} />


        


{/* Notes & Books Routes */}

 <Route path="/Notes&Books" element={<FreeNotesAndBooks/>} />


 {/* Our Corses */}

 <Route path="/OurCourse" element={<DisplayCourses/>} />
 <Route path="/SingleCourse/:id" element={<SingleCourse/>} />
 <Route path="/PlayListCourse/:id" element={<PlayListCourse/>} />


 {/* Our Ebooks */}

 <Route path="/E-Books" element={<EbookCatalog/>} />
 <Route path="/E-Books/:id" element={<EbookReader/>} />


  {/* User Profile */}

 <Route path="/Profile" element={<ProfilePage/>} />



         

        {/*  Admin Routes */}
        <Route
          path="/Admin"
          element={
            <ProtectedRouteForAdmin>
              <DashBoard />
            </ProtectedRouteForAdmin>
          }
        />

        {/*  Admin User */}
        <Route
          path="/Admin-UserData"
          element={
            <ProtectedRouteForAdmin>
              <UsersData />
            </ProtectedRouteForAdmin>
          }
        />
         {/*  Admin Orders */}
        <Route
          path="/Admin-Orders"
          element={
            <ProtectedRouteForAdmin>
              <DashboardOrder />
            </ProtectedRouteForAdmin>
          }
        />
           {/*  Admin Product */}
        <Route
          path="/Admin-Products"
          element={
            <ProtectedRouteForAdmin>
              <Product/>
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-Products-Add"
          element={
            <ProtectedRouteForAdmin>
              <AddProduct/>
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-Products-Edit/:id"
          element={
            <ProtectedRouteForAdmin>
              <UpdateProduct />
            </ProtectedRouteForAdmin>
          }
        />

        {/*  Admin Exam */}
        <Route
          path="/Admin-Exam"
          element={
            <ProtectedRouteForAdmin>
              <Exam />
            </ProtectedRouteForAdmin>
          }
        />
         <Route
          path="/Admin-SGSExam"
          element={
            <ProtectedRouteForAdmin>
              <ExamUplode />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-Quiz-Create"
          element={
            <ProtectedRouteForAdmin>
              <AdminCreateQuiz />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-Quiz-Edit-QuizDetails/:id"
          element={
            <ProtectedRouteForAdmin>
              <EditQuizDetails />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-Quiz-Edit-QuizQuestion/:id"
          element={
            <ProtectedRouteForAdmin>
              <EditQuizQuestion />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-Quiz-Manage"
          element={
            <ProtectedRouteForAdmin>
              <ManageQuiz />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-Quiz-User-Answers"
          element={
            <ProtectedRouteForAdmin>
              <UserAnswers />
            </ProtectedRouteForAdmin>
          }
        />

 {/* Admin Quiz Free */}
 <Route
          path="/Admin-QuizFree-Create"
          element={
            <ProtectedRouteForAdmin>
              <AdminCreateQuizFREE />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-QuizFree-Edit-QuizDetails/:id"
          element={
            <ProtectedRouteForAdmin>
              <EditQuizDetailsFREE />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-QuizFree-Edit-QuizQuestion/:id"
          element={
            <ProtectedRouteForAdmin>
              <EditQuizQuestionFREE />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-QuizFree-Manage"
          element={
            <ProtectedRouteForAdmin>
              <ManageQuizFREE />
            </ProtectedRouteForAdmin>
          }
        />




        {/* Admin Daily Quiz */}

              <Route
          path="/Admin-DailyQuiz-Create"
          element={
            <ProtectedRouteForAdmin>
              <AdminCreateQuizDaily />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-DailyQuiz-Edit-QuizDetails/:id"
          element={
            <ProtectedRouteForAdmin>
              <EditQuizDetailsDaily />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-DailyQuiz-Edit-QuizQuestion/:id"
          element={
            <ProtectedRouteForAdmin>
              <EditQuizQuestionDaily />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-DailyQuizQuiz-Manage"
          element={
            <ProtectedRouteForAdmin>
              <ManageQuizDaily />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-DailyQuizQuiz-User-Answers"
          element={
            <ProtectedRouteForAdmin>
              <UserAnswersDaily />
            </ProtectedRouteForAdmin>
          }
        />

         {/*  Admin Notes & Books */}
         <Route
          path="/Admin-Notes&Books"
          element={
            <ProtectedRouteForAdmin>
              <NotesAndBooks />
            </ProtectedRouteForAdmin>
          }
        />


         {/*  Admin Courses */}
         <Route
          path="/Admin-Courses"
          element={
            <ProtectedRouteForAdmin>
              <AllCoursesPage />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-Courses-Add"
          element={
            <ProtectedRouteForAdmin>
              <AddCoursePage />
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-Courses-Ediet/:id"
          element={
            <ProtectedRouteForAdmin>
              <EditCoursePage/>
            </ProtectedRouteForAdmin>
          }
        />

        {/*  Admin E Book */}
         <Route
          path="/Admin-EBook"
          element={
            <ProtectedRouteForAdmin>
              <DashBoardEbook/>
            </ProtectedRouteForAdmin>
          }/>
          <Route
          path="/Admin-EBookADD"
          element={
            <ProtectedRouteForAdmin>
              <EbookCreator/>
            </ProtectedRouteForAdmin>
          }
        />
        <Route
          path="/Admin-EBookEdiet/:ebookId"
          element={
            <ProtectedRouteForAdmin>
              <EditEbook/>
            </ProtectedRouteForAdmin>
          }
        />




     
          
      
      </Routes>
      <ToastContainer />
    </Router>
    </MyProvider>
   

    
  );
}

export default App;

// user

export const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  if (user) {
    return children;
  } else {
    return <Navigate to={"/Login"} />;
  }
};

export const ProtectedRouteForAdmin = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("user"));
  if (admin.email === import.meta.env.VITE__ADMIN_EMAIL_SGS) {
    return children;
  } else {
    return <Navigate to={"/Login"} />;
  }
};
