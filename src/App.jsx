import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import SeoCityPage from './pages/SeoCityPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';

const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 text-sm font-medium">
      Loading admin panel...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Homepage */}
        <Route path="/" element={<Home />} />

        {/* Services Page */}
        <Route path="/home-tuition-services" element={<ServicesPage />} />

        {/* Contact Page */}
        <Route path="/contact-us" element={<ContactPage />} />

        {/* FAQ Page */}
        <Route path="/frequently-asked-questions" element={<FAQPage />} />
        
        {/* Admin dashboard — /dashboard is a fallback if /admin is blocked by the host */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminPanel />
            </Suspense>
          }
        />
        <Route
          path="/admin/"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminPanel />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminPanel />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminPanel />
            </Suspense>
          }
        />
        
        {/* Dynamic SEO Landing Pages */}
        <Route path="/tutors-in-bareilly" element={<SeoCityPage />} />
        <Route path="/tutors-in-meerut" element={<SeoCityPage />} />
        <Route path="/cbse-tuition-classes" element={<SeoCityPage />} />
        <Route path="/icse-home-tutors" element={<SeoCityPage />} />
        <Route path="/online-tuition-india" element={<SeoCityPage />} />
        <Route path="/maths-tutor" element={<SeoCityPage />} />
        <Route path="/science-tuition" element={<SeoCityPage />} />
        
        {/* Fallback redirecting to Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
