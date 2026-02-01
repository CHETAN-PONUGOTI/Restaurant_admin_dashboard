import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import { Loader } from './components/common/Loader';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const MenuPage = lazy(() => import('./pages/MenuPage'));

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans antialiased">
        <Toaster position="top-center" />
        <Navbar />
        <main>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;