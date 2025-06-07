import React from "react";
import Layout from "../../components/layout/Layout";

const TermsAndConditions = () => {
  return (
    <Layout>
      <div className="bg-gray-900 text-gray-200 p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>

          <p className="mb-4">Last updated: January 10, 2025</p>

          <p className="mb-6">
            Welcome to Soft Game Studio! By accessing or using our website (
            <a
              href="https://softgamestudio.web.app"
              className="text-blue-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://softgamestudio.web.app
            </a>
            ), you agree to be bound by these Terms & Conditions. If you
            disagree with any part of these terms, you may not access the
            website or use our services.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Account Creation</h2>
          <p className="mb-6">
            To access certain features of our website, you must create an
            account. When creating an account, you agree to provide accurate and
            complete information, including your name, email address, phone
            number, and address. You are responsible for maintaining the
            confidentiality of your account credentials and for any activities
            that occur under your account.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            Services and Purchases
          </h2>
          <p className="mb-6">
            Our website offers both free and paid courses, notes, and services.
            Users can purchase goods, items, or services through one-time
            payments only. By making a purchase, you agree to provide accurate
            payment information and comply with any additional terms related to
            the transaction.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Ownership of Content</h2>
          <p className="mb-6">
            All content on our website, including our logo, visual design,
            trademarks, and other intellectual property, is the exclusive
            property of Soft Game Studio. Unauthorized use of our content is
            strictly prohibited.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            Feedback and Suggestions
          </h2>
          <p className="mb-6">
            By submitting feedback or suggestions, you grant us the right to
            implement and use them without any obligation to compensate you.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            Promotions and Contests
          </h2>
          <p className="mb-6">
            We may offer promotions, contests, and sweepstakes from time to
            time. These activities may have additional terms and conditions,
            which will be provided when applicable.
          </p>

          <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
          <p className="mb-6">
            You agree to use our website and services in compliance with all
            applicable laws and regulations. Any misuse of our services or
            violation of these Terms & Conditions may result in the suspension
            or termination of your account.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-6">
            If you have any questions about these Terms & Conditions, you can
            contact us by visiting our contact page at:{" "}
            <a
              href="https://softgamestudio.web.app/ContactUs"
              className="text-blue-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://softgamestudio.web.app/ContactUs
            </a>
          </p>

          <p className="text-sm text-gray-400">
            These Terms & Conditions are effective as of the date above and are
            subject to change at any time. Please review them regularly for
            updates.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsAndConditions;
