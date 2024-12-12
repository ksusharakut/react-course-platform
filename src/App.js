import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LogInForm from "./components/LogInForm";
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import PasswordResetForm from './components/PasswordResetForm';
import UsersTable from './components/UsersTable';
import CreateCourse from './components/CreateCourse';
import CoursesTable from './components/CoursesTable';
import CoursePage from './components/CoursePage';
import UserProfile from './components/UserProfile';
import CreateUnit from './components/CreateUnit';
import CreateLessonsPage from './components/CreateLessonsPage';
import EditCourse from './components/EditCourse';
import UserProfilePage from './components/UserProfilePage';
import ViewPage from './components/ViewPage';
import MyCourses from './components/MyCourses';



function App() {
    return (
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LogInForm />} />
                <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgotpass" element={<ForgotPasswordForm />} />
            <Route path="/resetpass" element={<PasswordResetForm />} />
            <Route path="/users" element={<UsersTable />} /> 
            <Route path="/createcourse" element={<CreateCourse />} />
            <Route path="/getcourses" element={<CoursesTable />} />
            <Route path="/coursepage/:courseId" element={<CoursePage />} />
            <Route path="/viewpage/:courseId" element={<ViewPage/> }/>
            <Route path="/profile" element={< UserProfile />} />
            <Route path="/createcourse/:courseId/createunits" element={<CreateUnit />} />
            <Route path="/createcourse/:courseId/createunits/:unitId/createlessons" element={<CreateLessonsPage />} />
            <Route path="editcourse/:courseId" element={<EditCourse />} />
            <Route path="user/:userId" element={<UserProfilePage />} />
            <Route path="/mycourses" element={<MyCourses />} />
            
            </Routes>
    );
}


export default App;
