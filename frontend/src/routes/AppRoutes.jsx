import Layout from "../components/layout/Layout";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import SyncBackend from '../components/general/SyncBackend';
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
import UserStatusGuard from './UserStatusGuard';

const ProtectedLayout = () => {
  return (
    <>
      <SignedIn>
        <UserStatusGuard>
        <SyncBackend />
        <Layout>
          <Outlet />
        </Layout>
        </UserStatusGuard>
      </SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
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
