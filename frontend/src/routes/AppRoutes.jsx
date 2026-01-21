import React from "react";
import Layout from "../components/layout/Layout";
import { Routes, Route, Navigate } from "react-router-dom";

import Main from "../pages/general/Main";
import Dashboard from "../pages/general/Dashboard";
import Categories from "../pages/general/Categories";
import Components from "../pages/general/Components";
import History from "../pages/general/History";
import Needs from "../pages/general/Needs";
import Users from "../pages/general/Users";
import Wishlist from "../pages/general/Wishlist";
import Profile from "../pages/general/Profile";
import NotFound from "../pages/general/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/main" />} />

        <Route path="/main" element={<Main />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/components" element={<Components />} />
        <Route path="/history" element={<History />} />
        <Route path="/needs" element={<Needs />} />
        <Route path="/users" element={<Users />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
