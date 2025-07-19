import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Layout from '../layout/Layout';
import { Link } from 'react-router-dom';
import { View } from 'lucide-react';


const HomePage = () => {
  const [activeTab, setActiveTab] = useState('development');
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], ['1', '0']);

  // Development pricing tiers
  const pricingTiers = [
    {
      name: "Basic Pack",
      description: "Perfect for small projects and startups",
      features: [
        "Responsive Design",
        "Basic SEO Optimization",
        "3 Page Website",
        "1 Month Support",
        "Basic Contact Form"
      ]
    },
    {
      name: "Startup Pack",
      description: "Ideal for growing businesses",
      features: [
        "Custom UI/UX Design",
        "Advanced SEO",
        "Up to 10 Pages",
        "CMS Integration",
        "3 Months Support",
        "Basic E-commerce"
      ]
    },
    {
      name: "Professional Pack",
      description: "For established businesses",
      features: [
        "Premium Design",
        "E-commerce Functionality",
        "Unlimited Pages",
        "6 Months Support",
        "Mobile App Integration",
        "Advanced Analytics"
      ]
    },
    {
      name: "Enterprise Pack",
      description: "Tailored solutions for large organizations",
      features: [
        "Custom Web Applications",
        "API Integrations",
        "Enterprise Security",
        "Dedicated Support Team",
        "Scalable Infrastructure",
        "24/7 Monitoring"
      ]
    }
  ];

  // Education resources
  const educationResources = [
    {
      id: 1,
      title: "Notes & Books",
      description: "Detailed study materials for all subjects",
      icon: "📝",
      link:"/Notes&Books"
    },
    {
      id: 2,
      title: "Online Courses",
      description: "Interactive learning with expert instructors",
      icon: "🎓",
      link:"/OurCourse"
    },
    {
      id: 3,
      title: "E-Books Library",
      description: "Thousands of reference books and materials",
      icon: "📚",
      link:"/E-Books"
    },
  ];

  // Exam Compition
  const examPic = [
    {
      id: 1,
      img: "https://lh3.googleusercontent.com/geougc/AF1QipN1tr0TGUCpZgn2iSxgL1OmfApsjRHkpmFX5ChF=w573-h573-p-no",
      title: "Code Vortex - SGS",
      description: "🎉 Soft Game Studio successfully hosted CODE VORTEX — a thrilling coding competition at MIMIT College for BCA students, featuring tracks in C, C++, Python, and Web Dev. With full participation, live challenges, and immense enthusiasm, it was a celebration of tech, teamwork, and innovation. 🙌💻",
    },
    {
      id: 2,
      img: "https://lh3.googleusercontent.com/geougc/AF1QipMB4Bw7gOhIz4SFVKf4iy2i0Stj7LL9ByXS02_s=w573-h573-p-no",
      title: "Code Vortex - SGS",
      description: "🎉 Soft Game Studio successfully hosted CODE VORTEX — a thrilling coding competition at MIMIT College for BCA students, featuring tracks in C, C++, Python, and Web Dev. With full participation, live challenges, and immense enthusiasm, it was a celebration of tech, teamwork, and innovation. 🙌💻",
    },
   
   
  ];

  const Projects = [ { title: "SGS Quiz App", link: "https://github.com/SOFTGAMESTUDIO/sgs-quiz-app", description: "Easy And Actractive Interface Quiz App", img: "https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20Projects%2FUntitled%20design%20(1).png?alt=media&token=7f45671d-5c45-458e-98ef-ad66b9a00786", View: "/" },
                          { title: "CU STUDY HUB", link: "https://github.com/SOFTGAMESTUDIO/CU-Notes-HUB-SGS", description: "Free Notes Sharing and acces", img: "https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/CU-STUDY-HUB-Soft-Game-Studio-07-18-2025_07_45_PM.png?alt=media&token=caea8d02-76e5-4997-bd8e-d4481571e299" ,view: "https://custudyhub.web.app/"},
                          { title: "Coming Soon", link: "#", description: "Coming Soon",  img: "", view: "/" },]



  return (
    <Layout>
      <div ref={containerRef} className="min-h-screen bg-purple-100 dark:bg-neutral-950 text-purple-900 dark:text-purple-100 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div 
            className="inset-0 absolute bg-[url('https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/pexels-kevin-ku-92347-577585.jpg?alt=media&token=10930a5b-7a4f-4cb6-8982-069a363e307c')] bg-cover bg-center"
            style={{ y: yBg }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 to-neutral-950/80" />
          
          <motion.div 
            className="container mx-auto px-6 relative z-10 text-center"
            style={{ y: yText, opacity: opacityText }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
            >
              Welcome to <span className="text-purple-400">Soft Game Studio</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-10 text-purple-200 max-w-3xl mx-auto"
            >
              Where creativity meets technology to build immersive digital experiences
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center"
            >
              
            </motion.div>
          </motion.div>
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <a href="#tabs-section" className="text-white text-3xl">
              ↓
            </a>
          </div>
        </section>

        {/* Tabbed Section */}
        <section id="tabs-section" className="py-20 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-6">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-16">
              <div className="bg-purple-100 dark:bg-neutral-800 rounded-full p-1 flex">
                {['development', 'education'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-purple-900 dark:text-purple-200 hover:text-purple-600 dark:hover:text-purple-400'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'development' ? 'Development Services' : 'Education Resources'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {activeTab === 'development' ? (
                  <div>
                    {/* Development Projects */}
                    <div className="mb-20">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                      >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Development Projects</h2>
                        <p className="text-xl text-purple-700 dark:text-purple-400">
                          Innovative solutions crafted with cutting-edge technology
                        </p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        { Projects.map((project, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-6 border border-purple-200 dark:border-neutral-700 hover:shadow-xl transition-all"
                          >
                            <div className="h-48 rounded-xl overflow-hidden mb-4">
                              <div className="bg-gradient-to-r from-purple-400 to-purple-600 w-full h-full flex items-center justify-center">
  {project.img === "" ? (
    <span className="text-white text-4xl">Project {idx+1}</span>
  ) : (
    <img src={project.img} alt="Project Preview" className="max-h-full max-w-full object-contain" />
  )}
</div>

                            </div>
                            <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                            <p className="text-purple-700 dark:text-purple-300">{project.description}</p>
                            <a href={project.link}>Github Link</a> <br />
                            <a href={project.view}>View Project</a>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="mb-20">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                      >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Development Packages</h2>
                        <p className="text-xl text-purple-700 dark:text-purple-400">
                          Flexible solutions tailored to your business needs
                        </p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pricingTiers.map((tier, idx) => (
                          <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className={`rounded-2xl shadow-lg p-8 border-2 ${
                              tier.name === "Professional Pack"
                                ? "border-purple-500 dark:border-purple-500 bg-purple-50 dark:bg-neutral-800 scale-105"
                                : "border-purple-200 dark:border-neutral-700"
                            }`}
                          >
                            <div className="text-center mb-6">
                              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                {tier.price}
                              </div>
                              <p className="text-purple-700 dark:text-purple-300">{tier.description}</p>
                            </div>
                            <ul className="mb-8 space-y-3">
                              {tier.features.map((feature, i) => (
                                <li key={i} className="flex items-start">
                                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                           
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-700 dark:to-indigo-800 rounded-3xl p-8 md:p-12">
                      <div className="max-w-4xl mx-auto">
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 0.6 }}
                          viewport={{ once: true }}
                          className="text-center mb-10"
                        >
                          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h2>
                          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                            Get in touch to discuss your project requirements
                          </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {[
                            { icon: "✉️", title: "Email", value: "officialsoftgamestudio@gmail.com" },
                            { icon: "📱", title: "Phone", value: "For Hindi: +91 9914267704" },
                            { icon: "📱", title: "Phone", value: "For English: +91 6283400770 " },
                          ].map((contact, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: idx * 0.1 }}
                              viewport={{ once: true }}
                              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
                            >
                              <div className="text-4xl mb-4">{contact.icon}</div>
                              <h3 className="text-xl font-bold text-white mb-2">{contact.title}</h3>
                              <p className="text-purple-100">{contact.value}</p>
                            </motion.div>
                          ))}
                        </div>

                        {/* <div className="mt-12 flex justify-center space-x-6">
                          {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, idx) => (
                            <motion.a
                              key={social}
                              href="#"
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: idx * 0.1 }}
                              viewport={{ once: true }}
                              className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                              <span className="text-white text-xl">{social[0].toUpperCase()}</span>
                            </motion.a>
                          ))}
                        </div> */}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Education Resources */}
                    <div className="mb-20">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                      >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Education Resources</h2>
                        <p className="text-xl text-purple-700 dark:text-purple-400">
                          Comprehensive learning materials for all levels
                        </p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {educationResources.map((resource) => (
                          <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 border border-purple-200 dark:border-neutral-700 hover:shadow-xl transition-all"
                          >
                            <div className="text-4xl mb-4">{resource.icon}</div>
                            <h3 className="text-2xl font-bold mb-3">{resource.title}</h3>
                            <p className="text-purple-700 dark:text-purple-300 mb-6">
                              {resource.description}
                            </p>
                            <Link to={resource.link}>
                            <button  className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-purple-300 flex items-center">
                              Learn More
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                            </Link>
                            
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Exam Gallery */}
                    <div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                      >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Organized Exams</h2>
                        <p className="text-xl text-purple-700 dark:text-purple-400">
                          Professional examination environments for optimal performance
                        </p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {examPic.map((item) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="rounded-2xl overflow-hidden shadow-lg"
                          >
                            <div className="bg-gradient-to-r from-purple-400 to-indigo-500 h-64 flex items-center justify-center">
                              <img className='h-64 w-full object-cover' src={item.img} alt="" />
                             
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800">
                              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                              <p className="text-purple-700 dark:text-purple-300">
                                {item.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;