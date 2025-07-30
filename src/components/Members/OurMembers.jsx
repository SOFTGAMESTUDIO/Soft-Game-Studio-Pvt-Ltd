import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import Layout from "../layout/Layout";
import { Helmet } from "react-helmet";
import { FiLinkedin, FiGithub, FiInstagram, FiSearch, FiArrowUp } from "react-icons/fi";
import { FaUnity, FaPython, FaReact } from "react-icons/fa";
import { SiJavascript,SiUnrealengine, SiFirebase, SiCplusplus, SiHtml5, SiCss3, SiC } from "react-icons/si";

const teamMembers = [
  {
    name: "LIVESH KUMAR GARG",
    role: "SENIOR DEVELOPER & FOUNDER",
    bio: "BCA student with expertise in Python, HTML, CSS, JavaScript, React JS, Data Structures & Algorithms (DSA), SQL, Firebase, Unity, and Unreal Engine. Passionate about exploring new technologies and building innovative projects.",
    image: "https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/DEVLOPERS%2FSnapchat-467264900.jpg?alt=media&token=a1f217d0-2444-47d1-8e40-7d69b43a970d",
    accentColor: "bg-pink-500",
    skills: ["Python", "React", "Firebase", "Unity"],
    social: {
      linkedin: "https://www.linkedin.com/in/Livesh-Kumar-Garg",
      github: "https://github.com/SOFTGAMESTUDIO",
      instagram: "https://www.instagram.com/liveshkumargarg/",
    }
  },
  {
    name: "JATIN DUA",
    role: "JUNIOR DEVELOPER",
    bio: "B Tech CSBS student with proficiency in C, C++, DSA, HTML, CSS, JavaScript, and Python. Eager to expand knowledge and apply skills to real-world projects.",
    image: "https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/DEVLOPERS%2FSnapchat-471840155.jpg?alt=media&token=af7951a2-e956-4531-804f-ec448f914083",
    accentColor: "bg-blue-500",
    skills: ["C++", "DSA", "JavaScript", "Python"],
    social: {
      linkedin: "https://www.linkedin.com/in/jatin-2a-kumar-/",
      github: "",
      instagram: "https://www.instagram.com/jatinkumar.dua/",
    }
  },
  {
    name: "SHARIK HASAN",
    role: "JUNIOR DEVELOPER",
    bio: "B Tech CSE student with expertise in C, HTML, CSS, JavaScript, and Firebase database. Focused on enhancing skills and working on practical projects.",
    image: "https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/DEVLOPERS%2F467048382_429449520023246_5293710440583554823_n.jpeg?alt=media&token=c4cacfe1-bea3-43a6-848e-8b5e852e41a1",
    accentColor: "bg-purple-500",
    skills: ["C", "JavaScript", "Firebase", "HTML/CSS"],
    social: {
      linkedin: "www.linkedin.com/in/sharik-hasan",
      github: "https://github.com/0xSharik",
      instagram: "https://www.instagram.com/samar_pb15/",
    }
  }
];

const SocialIcon = ({ platform, url }) => {
  const icons = {
    linkedin: <FiLinkedin className="w-5 h-5" />,
    github: <FiGithub className="w-5 h-5" />,
    instagram: <FiInstagram className="w-5 h-5" />
  };

  return (
    <motion.a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      whileHover={{ y: -3, scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {icons[platform]}
    </motion.a>
  );
};

const SkillIcon = ({ skill }) => {
  const icons = {
    Python: <FaPython className="text-blue-500" />,
    React: <FaReact className="text-blue-400" />,
    Firebase: <SiFirebase className="text-orange-500" />,
    Unity: <FaUnity className="text-gray-800" />,
    "C++": <SiCplusplus className="text-blue-600" />,
    DSA: <div className="font-bold text-xs">DSA</div>,
    JavaScript: <SiJavascript className="text-yellow-400" />,
    "HTML/CSS": (
      <div className="flex">
        <SiHtml5 className="text-orange-500" />
        <SiCss3 className="text-blue-500 ml-1" />
      </div>
    ),
    C: <SiC className="text-blue-400" />
  };

  return (
    <motion.div 
      className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full p-1.5"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={skill}
    >
      {icons[skill] || skill}
    </motion.div>
  );
};

function OurMembers() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 6;
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, "jobApplications"));
        const applicationsData = querySnapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        setApplications(applicationsData);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
      setLoading(false);
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter applications based on search term
  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (app.post && app.post.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (app.qualifications && app.qualifications.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredApplications.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredApplications.length / membersPerPage);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>Our Members - Soft Game Studio | Game Dev & EdTech Experts</title>
        <meta
          name="description"
          content="Meet the talented team members of Soft Game Studio. From game developers to education technologists, discover the people behind our innovative projects."
        />
        <link rel="canonical" href="https://soft-game-studio.web.app/OurMembers" />
        <meta property="og:title" content="Meet Our Members - Soft Game Studio" />
        <meta
          property="og:description"
          content="Explore the profiles of our passionate developers, designers, and educators at Soft Game Studio. We create games and tools that inspire learning and fun."
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20images%2FTeam-Members-Soft-Game-Studio-Game-Developers.png?alt=media&token=your-token-here"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Members | Meet the SGS Team" />
        <meta
          name="twitter:description"
          content="Get to know the game developers, designers, and educators behind Soft Game Studio."
        />
      </Helmet>

      <div 
        ref={containerRef}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden"
      >
        {/* Parallax Background */}
        <motion.div 
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{ 
            y,
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />
        
        {/* Floating Tech Elements */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute opacity-10 dark:opacity-5"
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() > 0.5 ? 30 : -30, 0],
              rotate: [0, Math.random() > 0.5 ? 15 : -15, 0]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3
            }}
            style={{
              top: `${10 + i * 20}%`,
              left: `${10 + i * 15}%`,
              fontSize: `${2 + i * 1}rem`
            }}
          >
            {i % 2 === 0 ? <FaUnity /> : <SiUnrealengine />}
          </motion.div>
        ))}

        {/* Core Team Section */}
        <section className="py-16 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white tracking-tight"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                SOFT GAME STUDIO
              </motion.h1>
              <motion.div className="w-24 h-1 bg-indigo-600 mx-auto mb-6 rounded-full" />
              <motion.h2 
                className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                OUR <span className="text-indigo-600 dark:text-indigo-400">CORE TEAM</span>
              </motion.h2>
              <motion.p 
                className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Meet the passionate developers driving innovation at Soft Game Studio
              </motion.p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="w-full md:w-[calc(33.333%-2rem)]"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-full transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col items-center text-center">
                      <motion.div 
                        className="relative mb-6"
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="relative">
                          <img
                            alt={member.name}
                            className="w-40 h-40 object-cover rounded-full border-4 border-gray-200 dark:border-gray-700 mx-auto"
                            src={member.image}
                          />
                          <motion.div 
                            className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full ${member.accentColor}`}
                            whileHover={{ width: "100%" }}
                          />
                        </div>
                      </motion.div>
                      <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-1 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                        {member.role}
                      </h3>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        {member.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 px-2">
                        {member.bio}
                      </p>
                      
                      <div className="flex justify-center mb-4 gap-2">
                        {member.skills.map((skill) => (
                          <SkillIcon key={skill} skill={skill} />
                        ))}
                      </div>
                      
                      <div className="flex justify-center mt-4 gap-4">
                        {Object.entries(member.social).map(([platform, url]) => (
                          url && <SocialIcon key={platform} platform={platform} url={url} />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Members from Applications */}
        <section className="py-16 px-4 relative z-10 bg-gray-100 dark:bg-gray-950" id="team-members">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                  <motion.h2 
                    className="text-3xl font-bold text-blue-600 dark:text-blue-400"
                    whileInView={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    OUR TEAM MEMBERS
                  </motion.h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Meet the talented individuals contributing to our projects
                  </p>
                </div>
                
                {/* Search and Filter */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full md:w-auto"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search team members..."
                      className="w-full md:w-64 px-4 pl-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                    <FiSearch className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
                  </div>
                </motion.div>
              </div>
              
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstMember + 1}-{Math.min(indexOfLastMember, filteredApplications.length)} of {filteredApplications.length} members
                </p>
              </div>
              
              {loading ? (
                <motion.div 
                  className="flex justify-center py-12"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
                </motion.div>
              ) : filteredApplications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700"
                >
                  <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                  <p className="text-gray-500 dark:text-gray-400 mt-4 mb-6">
                    {searchTerm ? 'No matching team members found.' : 'No team members found. Check back later!'}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-colors"
                  >
                    Join Our Team
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentMembers.map((app, index) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        viewport={{ once: true }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600"
                        whileHover={{ y: -5 }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-indigo-300">
                              {app.name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                              {app.name}
                            </h3>
                            <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                              {app.post || "Team Member"}
                            </p>
                            <div className="mt-3">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Skills:</span> {app.qualifications}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center mt-10"
                    >
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-4 py-2 rounded-lg ${
                                currentPage === pageNum 
                                  ? 'bg-indigo-600 text-white' 
                                  : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </section>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
            aria-label="Scroll to top"
          >
            <FiArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </Layout>
  );
}

export default OurMembers;