// app/about-us/page.tsx
"use client";

import Footer from "../footer/page";
import Header from "../header/page";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      
      <main className="px-4 py-16 sm:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto space-y-12">
         
          {/* Header */}
          <section className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-400">
              About Us
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              We are the team behind <span className="font-semibold text-indigo-300">Raased – Vibe Coding Tasks</span>, 
              a platform designed to report and monitor issues related to electricity stations. 
              Our goal is to provide a seamless, multi-role system for Users, Supervisors, and Admins.
            </p>
          </section>

          {/* Mission */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            <p className="text-gray-300">
              To empower users to quickly report station issues with media attachments, 
              track progress in real-time, and ensure efficient management by supervisors and admins.
            </p>
          </section>

          {/* Vision */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Our Vision</h2>
            <p className="text-gray-300">
              To create a reliable and transparent reporting system that improves 
              electricity station maintenance, reduces downtime, and ensures safety.
            </p>
          </section>

          {/* Values */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Our Values</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong className="text-indigo-300">Transparency:</strong> Clear tracking of reports and actions.</li>
              <li><strong className="text-indigo-300">Efficiency:</strong> Quick reporting and timely responses.</li>
              <li><strong className="text-indigo-300">Collaboration:</strong> Multi-user roles working together effectively.</li>
              <li><strong className="text-indigo-300">Innovation:</strong> Leveraging modern tech for smarter monitoring.</li>
            </ul>
          </section>

          {/* Team / Contact */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Contact & Team</h2>
            <p className="text-gray-300">
              Our dedicated team is always improving the platform. 
              For inquiries or support, you can reach us at 
              <a href="mailto:support@raased.com" className="text-indigo-400 hover:text-indigo-300 underline transition-colors duration-300"> support@raased.com</a>.
            </p>
          </section>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUsPage;