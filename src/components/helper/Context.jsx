'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [tenantId, setTenantId] = useState(null);
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        const response = await axios.get('/api/website');
        setWebsite(response.data.website);
        setTenantId(response.data.tenantId);
      } catch (error) {
        console.error('Failed to fetch website config', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin bg-white"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ tenantId, website }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
