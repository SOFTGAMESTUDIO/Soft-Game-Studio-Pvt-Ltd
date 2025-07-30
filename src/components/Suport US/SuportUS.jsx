import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  FaBook,
  FaCode,
  FaVideo,
  FaTrophy,
  FaArrowRight,
  FaHeart,
  FaQrcode,
  FaHandHoldingUsd,
  FaLightbulb,
} from "react-icons/fa";
import { SiGooglepay, SiPhonepe, SiPaytm } from "react-icons/si";

import qrCode from "../../Assictes/QR.jpeg"; // Adjust the path as necessary
import Layout from "../layout/Layout";

const SupportUs = () => {
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  const slideIn = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  const scaleUp = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };

  

  return (
    <Layout>
 <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900 py-12 px-4 sm:px-6">
      <Helmet>
        <title>Support Us | SOFT GAME STUDIO</title>
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Empower Programming Education
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-indigo-400 to-purple-500 mx-auto mb-6 rounded-full"
          />

          <motion.p
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            At SOFT GAME STUDIO, we create free, high-quality programming
            resources to support learners everywhere. Help us expand this
            mission by contributing to our platform's growth.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-indigo-100 dark:border-gray-700"
              variants={itemVariants}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center">
                <FaLightbulb className="mr-2" /> Why Your Support Matters
              </h3>

              <motion.ul className="space-y-4" variants={containerVariants}>
                <motion.li
                  className="flex items-start p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                  variants={itemVariants}
                >
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg mr-4">
                    <FaBook className="text-indigo-600 dark:text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Educational Notes
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Fund creation of structured notes for C, C++, Python,
                      Java, and more.
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  className="flex items-start p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                  variants={itemVariants}
                >
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg mr-4">
                    <FaCode className="text-indigo-600 dark:text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Source Code
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Expand our library of test-ready programs and project
                      code.
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  className="flex items-start p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                  variants={itemVariants}
                >
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg mr-4">
                    <FaVideo className="text-indigo-600 dark:text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Video Lectures
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Support our development of interactive tutorials and live
                      coding sessions.
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  className="flex items-start p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                  variants={itemVariants}
                >
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg mr-4">
                    <FaTrophy className="text-indigo-600 dark:text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Competitions & Certification
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Sponsor coding quizzes and anti-cheat certifications for
                      learners.
                    </p>
                  </div>
                </motion.li>
              </motion.ul>
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              animate="animate"
            >
              <div className="flex items-start">
                <FaHeart className="text-xl mt-1 mr-3 text-pink-300" />
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Be Part of the Journey
                  </h3>
                  <p>
                    With your help, we can make coding education accessible to
                    every learner across the globe.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
            initial="hidden"
            animate="visible"
            variants={scaleUp}
          >
            <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600">
              <div className="bg-white dark:bg-gray-800 p-7">
                <motion.h3
                  className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white flex items-center justify-center"
                  variants={fadeIn}
                >
                  <FaHandHoldingUsd className="mr-2 text-indigo-600" /> Support
                  in Seconds
                </motion.h3>

                <div className="flex justify-center mb-6">
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                    <button
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-colors ${
                        
                           "bg-white dark:bg-gray-800 shadow text-indigo-600 dark:text-indigo-400"
                          
                      }`}
                      
                    >
                      <FaQrcode className="mr-2" /> UPI
                    </button>
                  </div>
                </div>

                <motion.div
                  className="flex flex-col items-center mb-6"
                  initial="hidden"
                  animate="visible"
                  variants={slideIn}
                >
                  <motion.div
                    className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-xl mb-5"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                      {/* QR Code Placeholder */}
                      <div className="relative">
                        <div className="w-64 h-64 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center rounded-lg">
                          
                          <img
                            src={qrCode}
                            alt="Donate via UPI QR Code"
                            className="w-80 h-80 object-contain rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <p className="text-gray-700 dark:text-gray-300 font-medium text-center mb-4">
                    Scan to donate via UPI
                  </p>

                  <div className="flex space-x-3 mb-6">
                    <span className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md text-3xl flex items-center">
                      <SiPaytm className="mr-1 text-blue-600" /> 
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md text-3xl flex items-center">
                      <SiGooglepay className="mr-1 text-green-600" /> 
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md text-3xl flex items-center">
                      <SiPhonepe className="mr-1 text-purple-600" />
                    </span>
                  </div>

                  <motion.div
                    className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-md text-sm mb-6 font-mono text-gray-900 dark:text-white"
                    whileHover={{ scale: 1.02 }}
                  >
                    UPI ID: liveshgarg@cnrb
                  </motion.div>

                  <motion.div
                    className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 rounded-md text-lg font-medium flex items-center"
                    animate={{
                      background: [
                        "linear-gradient(90deg, #e0e7ff, #ede9fe)",
                        "linear-gradient(90deg, #ede9fe, #e0e7ff)",
                        "linear-gradient(90deg, #e0e7ff, #ede9fe)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaHeart className="text-pink-500 mr-2" /> Livesh Garg
                  </motion.div>
                </motion.div>

                <motion.div
                  className="text-center border-t border-gray-100 dark:border-gray-700 pt-6"
                  variants={fadeIn}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Every contribution supports a student's journey in tech.
                  </p>
                  <motion.a
                    href="mailto:team.softgamestudio@gmail.com?subject=Support%20or%20Sponsorship"
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium group"
                    whileHover={{ x: 5 }}
                  >
                    Contact us about sponsorship
                    <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Other Ways to Support
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-gray-900 dark:text-white">
            <motion.div
              className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5 }}
            >
              <div className="bg-indigo-100 dark:bg-indigo-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <FaBook className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-semibold mb-2">Share Resources</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Help spread our educational content to more learners
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5 }}
            >
              <div className="bg-indigo-100 dark:bg-indigo-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <FaCode className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-semibold mb-2">Contribute Code</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Join our open-source projects on GitHub
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -5 }}
            >
              <div className="bg-indigo-100 dark:bg-indigo-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <FaVideo className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-semibold mb-2">Volunteer</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Help create content or mentor new developers
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
    </Layout>
   
  );
};

export default SupportUs;
