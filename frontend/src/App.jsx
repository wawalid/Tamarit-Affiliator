import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AffiliateLinkProvider } from "./context/Affiliate_linksContext";
import { TaskProvider } from "./context/TasksContext";

import Auth_ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Completado_Route from "./Completado_Route";

import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import TaskPage from "./pages/TaskPage";
import TaskFormPage from "./pages/TaskFormPage";
import ProfilePage from "./pages/ProfilePage";
import AffiliateFormPage from "./pages/AffiliateFormPage";
import MyAffiliatesPage from "./pages/MyAffiliatesPage";
import AdminPage from "./pages/AdminPage";
import UserDetailPage from "./pages/UserDetailPage";
import WaitingVerificationPage from "./pages/WaitingVerificationPage";

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AffiliateLinkProvider>
          <BrowserRouter>
            <Routes>
              {/* SIN Navbar */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* CON Navbar */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/waiting-verification"
                  element={<WaitingVerificationPage />}
                />

                <Route element={<Auth_ProtectedRoute />}>
                  {/* <Route path="/tasks" element={<TaskPage />} />
                  <Route path="/add-task" element={<TaskFormPage />} />
                  <Route path="/tasks/:id" element={<TaskFormPage />} /> */}
                  <Route element={<Completado_Route />}>
                    <Route path="/create-affiliate-link" element={<AffiliateFormPage />} />
                    <Route path="/my-affiliates" element={<MyAffiliatesPage />} />
                  </Route>

                  <Route path="/profile" element={<ProfilePage />} />

                  <Route element={<AdminRoute />}>
                    <Route path="/admin_page" element={<AdminPage />} />
                    <Route path="/user/:id" element={<UserDetailPage />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AffiliateLinkProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
