import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";

const AboutExam = () => {
  const [ref1, inView1] = useInView({ threshold: 0.3, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.3, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.3, triggerOnce: true });
  const [ref4, inView4] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <Layout>
      <Helmet>
  <title>About Exam Platform | Soft Game Studio</title>
  <meta 
    name="description" 
    content="Discover how the SGS Exam Platform by Soft Game Studio delivers secure, scalable, and AI-powered online & offline exam solutions for institutions and certification bodies." 
  />
  <meta 
    name="keywords" 
    content="SGS Exam Platform, Online Exams, Offline Exams, AI Proctoring, Secure Exam System, Anti-Cheating Exams, Educational Assessment, Exam Monitoring, Browser Lockdown, Adaptive Testing, Soft Game Studio Exams" 
  />
  <meta name="author" content="Soft Game Studio" />

  {/* Open Graph / Social Media */}
  <meta property="og:title" content="About SGS Exam Platform | Soft Game Studio" />
  <meta 
    property="og:description" 
    content="Learn about the SGS Exam Platform – a secure and scalable assessment system with AI proctoring, real-time analytics, and instant grading for online and offline exams." 
  />
  <meta property="og:url" content="https://soft-game-studio.web.app/exam-platform" />
  <meta property="og:type" content="website" />
</Helmet>

 <div className="min-h-screen bg-purple-50 dark:bg-neutral-950 transition-colors duration-300">
      {/* Hero Section with Parallax */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-cover bg-center opacity-10 dark:opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-100/30 to-purple-50 dark:from-neutral-950/90 dark:to-neutral-950"></div>
        
        <motion.div 
          className="relative h-full flex flex-col items-center justify-center px-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-purple-900 dark:text-purple-300"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
          >
            SGS Exam Platform
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl text-purple-800 dark:text-purple-200"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Revolutionizing the way assessments are conducted with cutting-edge technology
          </motion.p>
        </motion.div>
      </div>

      {/* About Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          ref={ref1}
          initial={{ opacity: 0, y: 50 }}
          animate={inView1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-900 dark:text-purple-300">
            About Our Examination System
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg mb-6 text-black dark:text-white">
                The SGS Exam Platform is a state-of-the-art assessment system designed to provide secure, reliable, and scalable examination solutions for educational institutions and certification bodies.
              </p>
              <p className="text-lg mb-6 text-black dark:text-white">
                Our platform leverages advanced technologies to prevent cheating, ensure fairness, and deliver a seamless experience for both examiners and candidates.
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-xl border border-purple-200 dark:border-neutral-800"
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-300">Key Features</h3>
              <ul className="space-y-3 text-black dark:text-white">
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                  <span>Advanced anti-cheating mechanisms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                  <span>Real-time monitoring and analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                  <span>Secure question bank management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">✓</span>
                  <span>Automated grading and feedback</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          ref={ref2}
          initial={{ opacity: 0, y: 50 }}
          animate={inView2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-900 dark:text-purple-300">
            How We Conduct Exams
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "1. Secure Authentication",
                desc: "Multi-factor authentication ensures only authorized candidates can access the exam.",
                icon: "🔒"
              },
              {
                title: "2. Proctoring System",
                desc: "AI-powered proctoring monitors candidate activity throughout the exam.",
                icon: "👁️"
              },
              {
                title: "3. Anti-Cheating Measures",
                desc: "Browser lockdown, tab switching detection, and plagiarism checks maintain integrity.",
                icon: "🚫"
              },
              {
                title: "4. Adaptive Testing",
                desc: "Optional adaptive testing adjusts question difficulty based on performance.",
                icon: "🔄"
              },
              {
                title: "5. Instant Results",
                desc: "Automated grading provides immediate results for objective questions.",
                icon: "⚡"
              },
              {
                title: "6. Detailed Analytics",
                desc: "Comprehensive reports help analyze candidate performance and question quality.",
                icon: "📊"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg border border-purple-100 dark:border-neutral-800"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-purple-800 dark:text-purple-300">{item.title}</h3>
                <p className="text-black dark:text-white">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          ref={ref3}
          initial={{ opacity: 0, y: 50 }}
          animate={inView3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-900 dark:text-purple-300">
            Our Technology Stack
          </h2>
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-8 shadow-lg border border-purple-100 dark:border-neutral-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { name: "React", color: "text-blue-500" },
                { name: "Firebase", color: "text-yellow-500" },
                { name: "Node.js", color: "text-green-500" },
                { name: "Tailwind CSS", color: "text-cyan-400" },
                { name: "Framer Motion", color: "text-pink-500" },
                { name: "MongoDB", color: "text-green-600" },
                { name: "AWS", color: "text-orange-500" },
                { name: "AI Proctoring", color: "text-purple-500" }
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="p-4 rounded-lg bg-purple-50 dark:bg-neutral-800"
                >
                  <span className={`font-medium ${tech.color}`}>{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Parallax Section */}
        <motion.div
          ref={ref4}
          initial={{ opacity: 0 }}
          animate={inView4 ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="relative h-96 rounded-xl overflow-hidden mb-20"
        >
          <div 
            className="absolute inset-0 bg-[url('/exam-bg.jpg')] bg-cover bg-center bg-fixed opacity-70 dark:opacity-40"
            style={{ 
              backgroundAttachment: 'fixed',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-purple-600/70 dark:from-neutral-950/80 dark:to-neutral-900/80"></div>
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Thousands of Successful Candidates</h3>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Our platform has helped over 50,000 candidates achieve their certification goals with integrity and confidence.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-purple-900 dark:text-purple-300">
            Ready to Experience the Future of Examinations?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-black dark:text-white">
            Contact us today to learn how SGS Exam Platform can transform your assessment process.
          </p>
          
        </div>
      </div>
    </div>
    </Layout>
   
  );
};

export default AboutExam;