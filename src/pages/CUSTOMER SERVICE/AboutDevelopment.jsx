import { motion } from 'framer-motion';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';

const DevelopmentPage = () => {
  const projects = [
    {
      id: 1,
      title: "Project Aurora",
      description: "Next-gen cloud infrastructure management platform",
      technologies: ["React", "Node.js", "MongoDB", "Kubernetes"],
      github: "https://github.com/sgs/aurora"
    },
    {
      id: 2,
      title: "Nebula API Gateway",
      description: "Secure and scalable API management solution",
      technologies: ["Go", "gRPC", "Redis", "Docker"],
      github: "https://github.com/sgs/nebula"
    },
    {
      id: 3,
      title: "Quantum Analytics",
      description: "Real-time data visualization dashboard",
      technologies: ["TypeScript", "D3.js", "Python", "PostgreSQL"],
      github: "https://github.com/sgs/quantum"
    }
  ];

  return (
    <Layout>
     <Helmet>
  <title>Development Services | Soft Game Studio</title>
  <meta 
    name="description" 
    content="Soft Game Studio offers professional development services including website development, app development, and custom software solutions tailored for startups, students, and businesses." 
  />
  <meta 
    name="keywords" 
    content="Web Development, App Development, Software Development, Custom Software, Startup Development, Full Stack Development, Frontend Backend Services, Soft Game Studio Development Services" 
  />
  <meta name="author" content="Soft Game Studio" />

  {/* Open Graph / Social Media */}
  <meta property="og:title" content="Development Services | Soft Game Studio" />
  <meta 
    property="og:description" 
    content="Explore web, app, and software development services by Soft Game Studio. Scalable and affordable solutions for your digital needs." 
  />
  <meta property="og:url" content="https://softgamestudio.web.app/AboutDevelopmet" />
  <meta property="og:type" content="website" />
</Helmet>

    <div className=" bg-purple-100 dark:bg-neutral-950 text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Hero Section with Parallax */}
      <div className="relative h-screen overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center"
          initial={{ y: 0 }}
          animate={{ y: -20 }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="absolute inset-0 bg-black/60  " />
        
        <div className=" text-gray-200 relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            SGS Development
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Innovating tomorrow's solutions today
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 max-w-2xl">
              <h2 className="text-2xl font-semibold mb-4">Engineering Excellence</h2>
              <p className="mb-4">
                We specialize in building scalable, high-performance applications 
                using cutting-edge technologies and modern development practices.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {["Cloud Architecture", "DevOps", "AI/ML", "Web3", "Cybersecurity", "IoT"].map((item, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 bg-purple-500/20 dark:bg-purple-600/30 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Our Development Philosophy</h2>
          <div className="h-1 w-24 bg-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Clean Code",
              description: "We prioritize maintainable, well-documented code following industry best practices and SOLID principles."
            },
            {
              title: "Agile Delivery",
              description: "Iterative development with continuous feedback loops ensures we build exactly what you need."
            },
            {
              title: "DevSecOps",
              description: "Security integrated throughout our development lifecycle from design to deployment."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-200/50 dark:border-neutral-700 shadow-lg"
            >
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 dark:from-neutral-900 dark:to-black px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Projects</h2>
            <p className="text-lg max-w-2xl mx-auto">
              Explore our open-source contributions and innovative solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-neutral-800"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                      Active
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-5">
                    {project.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <a 
                    href={project.github} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-800 hover:bg-black dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white rounded-lg transition-colors"
                  >
                    <FaGithub className="text-xl" />
                    <span>View Repository</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </Layout>
   
  );
};

export default DevelopmentPage;