import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AffiliateLinkProvider } from "./context/Affiliate_linksContext";
import { TaskProvider } from "./context/TasksContext";

import Auth_ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TaskPage from "./pages/TaskPage";
import HomePage from "./pages/HomePage";
import TaskFormPage from "./pages/TaskFormPage";
import ProfilePage from "./pages/ProfilePage";
import AffiliateFormPage from "./pages/AffiliateFormPage";
import MyAffiliatesPage from "./pages/MyAffiliatesPage";
import Completado_Route from "./Completado_Route";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import UserDetailPage from "./pages/UserDetailPage";
import WaitingVerificationPage from "./pages/WaitingVerificationPage";

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AffiliateLinkProvider>
          <BrowserRouter>
            <main className="container mx-auto px-4 py-2 bg-zinc-900 min-h-screen">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/waiting-verification"
                  element={<WaitingVerificationPage />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* proteger las rutas para que los no vericados no accedan */}
                <Route element={<Auth_ProtectedRoute />}>
                  {/* <Route path="/tasks" element={<TaskPage />} />
                  <Route path="/add-task" element={<TaskFormPage />} />
                  <Route path="/tasks/:id" element={<TaskFormPage />} /> */}
                  <Route element={<Completado_Route />}>
                    <Route
                      path="/create-affiliate-link"
                      element={<AffiliateFormPage />}
                    />
                    <Route
                      path="/my-affiliates"
                      element={<MyAffiliatesPage />}
                    />
                  </Route>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route element={<AdminRoute />}>
                    <Route path="/admin_page" element={<AdminPage />} />
                    <Route path="/user/:id" element={<UserDetailPage />} />
                  </Route>
                </Route>
              </Routes>
            </main>
          </BrowserRouter>
        </AffiliateLinkProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
