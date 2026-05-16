import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useAuthStore } from "@store/useAuthStore";
import Layout from "../components/layout/Layout";
import SyncBackend from '../components/general/SyncBackend';
import UserStatusGuard from './UserStatusGuard';
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";
import Main from "../pages/general/Main";
import Dashboard from "../pages/general/Dashboard";
import Categories from "../pages/general/Categories";
import Components from "../pages/general/Components";
import History from "../pages/general/History";
import Needs from "../pages/general/Needs";
import Users from "../pages/general/Users";
import Wishlist from "../pages/general/Wishlist";
import Profile from "../pages/general/Profile";
import Component from '../pages/general/Component';
import SchematicDetail from '../pages/general/SchematicDetail';
import BrokenComponents from '../pages/general/BrokenComponents';
import Settings from "../pages/general/Settings";
import Blocked from "../pages/general/Blocked";
import NotFound from "../pages/general/NotFound";

const ProtectedLayout = () => {
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useAuth();
  const { isAuthenticated, loading: isBackendLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isClerkLoaded) {
    console.log('ProtectedLayout: Чекаємо Clerk...');
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '15px' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p style={{ fontFamily: 'Geologica, sans-serif', color: '#666' }}>Перевірка автентифікації...</p>
      </div>
    );
  }

  if (!isClerkSignedIn) {
    console.log('ProtectedLayout: Користувач не увійшов у Clerk');
    return <Navigate to="/sign-in" replace />;
  }

  if (isBackendLoading && !isAuthenticated) {
    console.log('ProtectedLayout: Чекаємо бекенд...');
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '15px' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        <p style={{ fontFamily: 'Geologica, sans-serif', color: '#666' }}>Синхронізація профілю з лабораторією...</p>
      </div>
    );
  }

  console.log('Користувач в системі');
  return (
    <UserStatusGuard>
      <SyncBackend />
      <Layout>
        <Outlet />
      </Layout>
    </UserStatusGuard>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Navigate to="/front-main" />} />
        <Route path="front-main" element={<Main />} />
        <Route path="front-settings" element={<Settings />} />
        <Route path="front-dashboard" element={<Dashboard />} />
        <Route path="front-categories" element={<Categories />} />
        <Route path="front-components" element={<Components />} />
        <Route path="front-history" element={<History />} />
        <Route path="front-needs" element={<Needs />} />
        <Route path="front-users" element={<Users />} />
        <Route path="front-wishlist" element={<Wishlist />} />
        <Route path="front-profile" element={<Profile />} />
        <Route path="front-blocked" element={<Blocked />} />
        <Route path="front-components/:id" element={<Component />} />
        <Route path="front-schematics/:id" element={<SchematicDetail />} />
        <Route path="front-brokenComponents" element={<BrokenComponents />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;