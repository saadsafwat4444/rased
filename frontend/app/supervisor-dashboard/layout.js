 

"use client";

 
import ProtectedRoute from "../Guard/ProtectedRoute";
import Footer from "../shared/footer/page";
import Header from "../shared/header/page";
 
import SupervisorSidebar from "./sidebar/page";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['supervisor']}>
      <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
        {/* Header */}
        <Header />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <SupervisorSidebar />

          {/* Main Content */}
          <main className="flex-1 md:p-8 md:ml-20 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* Footer */}
        <Footer />

      </div>
    </ProtectedRoute>
  );
}