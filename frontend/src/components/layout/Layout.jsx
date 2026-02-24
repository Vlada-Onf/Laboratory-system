import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import { useProfileStore } from '../../store/useProfileStore';
import { useAuth } from '@clerk/clerk-react'; 
const HEADER_HEIGHT = 17;
const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
const { isLoaded, isSignedIn } = useAuth();
  const profileStore = useProfileStore();


  useEffect(() => {
    if (isLoaded && isSignedIn) {
      profileStore.fetchProfile();
    }
  }, [isLoaded, isSignedIn, profileStore]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <>
      <Header onMenuClick={toggleSidebar} />
      <Sidebar open={sidebarOpen} />

      <main
        style={{
          marginTop: HEADER_HEIGHT,
          marginLeft: sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          transition: 'margin-left 0.3s',
        }}
      >
        <Outlet />
      </main>
    </>
  );
}
