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
import SchematicDetail from '../pages/general/SchematicDetail';
import BrokenComponents from '../pages/general/BrokenComponents';
import NotFound from "../pages/general/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<Navigate to="/front-main" />} />

    <Route path="/front-main" element={<Main />} />
    <Route path="/front-dashboard" element={<Dashboard />} />
    <Route path="/front-сategories" element={<Categories />} />
    <Route path="/front-components" element={<Components />} />
    <Route path="/front-history" element={<History />} />
    <Route path="/front-needs" element={<Needs />} />
    <Route path="/front-users" element={<Users />} />
    <Route path="/front-wishlist" element={<Wishlist />} />
    <Route path="/front-profile" element={<Profile />} />
    <Route path="/front-components/:id" element={<Component />} />
    <Route path="/front-schematics/:id" element={<SchematicDetail />} />
    <Route path="/front-brokenComponents" element={<BrokenComponents />} />
    <Route path="*" element={<NotFound />} />
  </Route>
</Routes>

  );
};

export default AppRoutes;
