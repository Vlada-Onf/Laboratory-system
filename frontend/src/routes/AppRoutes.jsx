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
import Component from '../pages/general/Component';
import BrokenComponents from '../pages/general/BrokenComponents';
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
        <Route path="/components/:id" element={<Component />} />
        <Route path="/brokenComponents" element={<BrokenComponents />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
