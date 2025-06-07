import React, { useContext } from "react";
import Layout from "../../components/layout/Layout";


const ReturnPolicy = () => {


  return (
    <Layout>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
            Return and Refund Policy for SOFT GAME STUDIO
          </h1>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>Last updated:</strong> January 09, 2025
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Thank you for shopping at SOFT GAME STUDIO.
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We hope that you are satisfied with your purchase. However, please
            note that due to the nature of our products, all sales are final. We
            do not accept returns or issue refunds under any circumstances.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-6 mb-4">
            Interpretation and Definitions
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>Interpretation</strong>
            <br />
            The words, with the initial letter capitalized, have the meanings
            defined under the following conditions. These definitions shall
            apply regardless of whether they appear in the singular or plural.
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>Definitions</strong>
            <br />
            For the purposes of this Return and Refund Policy:
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Company</strong> (referred to as "the Company," "We,"
                "Us," or "Our") refers to SOFT GAME STUDIO.
              </li>
              <li>
                <strong>Goods</strong> refer to the items offered for sale on
                the Service.
              </li>
              <li>
                <strong>Orders</strong> mean a request by You to purchase Goods
                from Us.
              </li>
              <li>
                <strong>Service</strong> refers to the Website.
              </li>
              <li>
                <strong>Website</strong> refers to SOFT GAME STUDIO, accessible
                from{" "}
                <a
                  href="https://softgamestudio.web.app"
                  className="text-blue-500 dark:text-blue-300"
                >
                  https://softgamestudio.web.app
                </a>
                .
              </li>
              <li>
                <strong>You</strong> means the individual accessing or using the
                Service, or the company, or other legal entity on behalf of
                which such individual is accessing or using the Service.
              </li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-6 mb-4">
            No Return and No Refund Policy
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Once an order is placed and the product is delivered, the product
            cannot be returned or refunded under any circumstances. Please
            ensure that you carefully review your order before confirming your
            purchase.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            By purchasing from us, you acknowledge and agree that:
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              <li>No refunds will be issued under any conditions.</li>
              <li>
                No returns will be accepted after the product has been
                delivered.
              </li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-6 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            If you have any questions about our Return and Refund Policy, please
            contact us:
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            By visiting this page on our website:{" "}
            <a
              href="https://softgamestudio.web.app/ContactUs"
              className="text-blue-500 dark:text-blue-300"
            >
              https://softgamestudio.web.app/ContactUs
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnPolicy;
