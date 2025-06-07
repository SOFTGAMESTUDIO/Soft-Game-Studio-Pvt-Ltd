import React from "react";
import Layout from "../../components/layout/Layout";

const CopyrightPage = () => {
  return (
    <Layout>
      <div className="bg-gray-900 text-white min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="max-w-5xl w-full bg-gray-800 p-10 rounded-lg shadow-2xl border border-gray-700">
          <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-400">Copyright & Business Information</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-300">Udyam Registration Details</h2>
            <p><strong>Udyam Registration Number:</strong> UDYAM-PB-06-0032977</p>
            <p><strong>Enterprise Name:</strong> Soft Game Studio</p>
            <p><strong>Type of Enterprise:</strong> Micro (2024-25)</p>
            <p><strong>Major Activity:</strong> Services</p>
            <p><strong>Social Category:</strong> General</p>
            <p><strong>Official Address:</strong> Flat No. 574, Soft Game Studio, St. No. 5, Nai Abadi, Abohar, Fazilka, Punjab, 152116</p>
            <p><strong>Contact:</strong> +91 1634358414 | Email: team.softgamestudio@gmail.com</p>
            <p><strong>Date of Incorporation:</strong> 01/01/2025</p>
            <p><strong>Date of Udyam Registration:</strong> 21/01/2025</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-300">Industry Classification</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Computer programming activities (62011 - Software Development)</li>
              <li>Web-page designing (62012)</li>
              <li>IT and Computer Services (62099)</li>
              <li>Web Hosting (63112)</li>
              <li>Educational Services (85499)</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-blue-300">Additional Pages</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="https://softgamestudio.web.app/About" className="text-blue-400 hover:underline">About Us</a></li>
              <li><a href="https://softgamestudio.web.app/ContactUs" className="text-blue-400 hover:underline">Contact Us</a></li>
              <li><a href="https://softgamestudio.web.app/PrivacyPolicy" className="text-blue-400 hover:underline">Privacy Policy</a></li>
              <li><a href="https://softgamestudio.web.app/TermsAndConditions" className="text-blue-400 hover:underline">Terms & Conditions</a></li>
              <li><a href="https://softgamestudio.web.app/ReturnPolicy" className="text-blue-400 hover:underline">Return Policy</a></li>
              <li><a href="https://softgamestudio.web.app/webJlmembers" className="text-blue-400 hover:underline">Our Team Members</a></li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-blue-300">Copyright & Ownership</h2>
            <p>
              &copy; {new Date().getFullYear()} Soft Game Studio. All Rights Reserved.
            </p>
            <p>
              All content, trademarks, logos, graphics, text, images, software, and intellectual property displayed on this website are the exclusive property of Soft Game Studio. Unauthorized use, reproduction, distribution, or modification of any material without prior written consent is strictly prohibited and may result in legal action.
            </p>
            <p>
              By accessing this website, users agree to respect the intellectual property rights of Soft Game Studio. Any breach of these rights may lead to severe penalties under applicable copyright and intellectual property laws.
            </p>
            <p>
              If you wish to use any content from this website for commercial or personal purposes, you must obtain explicit permission from Soft Game Studio. For inquiries, please contact us through our official channels.
            </p>
            <p>
              For more details, visit our official website: <a href="https://softgamestudio.web.app/" className="text-blue-400 hover:underline">Soft Game Studio</a>
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default CopyrightPage;
