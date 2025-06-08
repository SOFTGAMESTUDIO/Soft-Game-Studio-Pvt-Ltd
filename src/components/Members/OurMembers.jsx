import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import Layout from "../layout/Layout";
import { Helmet } from "react-helmet";

const teamMembers = [
  {
    name: "LIVESH KUMAR GARG",
    role: "SENIOR DEVELOPER & FOUNDER",
    bio: "I am a BCA student with expertise in Python, HTML, CSS, JavaScript, React JS, Data Structures & Algorithms (DSA), SQL, Firebase, Unity, and Unreal Engine. I am passionate about exploring new technologies and building innovative projects.",
    image: "https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/DEVLOPERS%2FSnapchat-467264900.jpg?alt=media&token=a1f217d0-2444-47d1-8e40-7d69b43a970d",
    accentColor: "bg-pink-500",
    skills: ["Python", "React", "Firebase", "Unity"],
    social: {
      linkedin: "https://www.linkedin.com/in/livesh-kumar-1a7244354/",
      github: "https://github.com/SOFTGAMESTUDIO",
      instagram: "https://www.instagram.com/liveshkumargarg/",
    }
  },
  {
    name: "JATIN DUA",
    role: "JUNIOR DEVELOPER",
    bio: "I am a B Tech CSBS (Computer Science) student with proficiency in C, C++, Data Structures & Algorithms (DSA), HTML, CSS, JavaScript, and Python. I am eager to expand my knowledge and apply my skills to real-world projects.",
    image: "https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/DEVLOPERS%2FSnapchat-471840155.jpg?alt=media&token=af7951a2-e956-4531-804f-ec448f914083",
    accentColor: "bg-blue-500",
    skills: ["C++", "DSA", "JavaScript", "Python"],
    social: {
      linkedin: "https://www.linkedin.com/in/jatin-2a-kumar-/",
      github: "#",
      instagram: "https://www.instagram.com/jatinkumar.dua/",
      
    }
  },
  {
    name: "SHARIK HASAN",
    role: "JUNIOR DEVELOPER",
    bio: "I am a B Tech CSE student with expertise in C, HTML, CSS, JavaScript, and Firebase database. I am focused on enhancing my skills and working on practical projects to further my knowledge in computer science.",
    image: "https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/DEVLOPERS%2F467048382_429449520023246_5293710440583554823_n.jpeg?alt=media&token=c4cacfe1-bea3-43a6-848e-8b5e852e41a1",
    accentColor: "bg-purple-500",
    skills: ["C", "JavaScript", "Firebase", "HTML/CSS"],
    social: {
      linkedin: "#",
      github: "#",
      instagram: "https://www.instagram.com/samar_pb15/",
      
    }
  }
];

const SocialIcon = ({ platform, url }) => {
  const icons = {
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
   instagram: (
  <svg
    className="w-5 h-5 mx-auto"        // mx-auto keeps it centred in most layouts
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 8 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92M7.998 3.892a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
  </svg>
)


  };

  return (
    <motion.a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      whileHover={{ y: -2 }}
    >
      {icons[platform]}
    </motion.a>
  );
};

function OurMembers() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 6;

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

  return (
    <Layout>
      <Helmet>
  {/* Primary Meta Tags */}
  <title>Our Members - Soft Game Studio | Game Dev & EdTech Experts</title>
  <meta
    name="title"
    content="Our Members - Soft Game Studio | Game & EdTech Experts"
  />
  <meta
    name="description"
    content="Meet the talented team members of Soft Game Studio. From game developers to education technologists, discover the people behind our innovative projects."
  />

  {/* Canonical URL */}
  <link rel="canonical" href="https://softgamestudio.web.app/OurMembers" />

  {/* Open Graph / Facebook */}
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:url" content="https://softgamestudio.web.app/OurMembers" />
  <meta
    property="og:title"
    content="Meet Our Members - Soft Game Studio"
  />
  <meta
    property="og:description"
    content="Explore the profiles of our passionate developers, designers, and educators at Soft Game Studio. We create games and tools that inspire learning and fun."
  />
  <meta
    property="og:image"
    content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20images%2FTeam-Members-Soft-Game-Studio-Game-Developers.png?alt=media&token=your-token-here"
  />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta
    property="og:image:alt"
    content="Soft Game Studio Team Members - Game Development & Education"
  />

  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@SoftGameStudio" />
  <meta name="twitter:creator" content="@SGS_Devs" />
  <meta
    name="twitter:title"
    content="Our Members | Meet the SGS Team"
  />
  <meta
    name="twitter:description"
    content="Get to know the game developers, designers, and educators behind Soft Game Studio. We're building the future of interactive learning and gaming."
  />
  <meta
    name="twitter:image"
    content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20images%2FTeam-Members-Soft-Game-Studio-Game-Developers.png?alt=media&token=your-token-here"
  />
  <meta
    name="twitter:image:alt"
    content="Soft Game Studio Members - Creative Game Dev Team"
  />
</Helmet>

      <div 
        ref={containerRef}
        className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden"
      >
        {/* Parallax Background Elements */}
        <motion.div 
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{ 
            y,
            backgroundImage: "url('https://webjl26.web.app/static/media/stars.7d85fe42.png')",
            backgroundSize: "cover"
          }}
        />
        
        {/* Floating Tech Elements */}
        {["💻", "🧑‍💻", "⚛️", "🔌"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-30 dark:opacity-20"
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() > 0.5 ? 30 : -30, 0],
              rotate: [0, Math.random() > 0.5 ? 15 : -15, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            style={{
              top: `${10 + i * 20}%`,
              left: `${10 + i * 15}%`
            }}
          >
            {emoji}
          </motion.div>
        ))}

        {/* Core Team Section */}
        <section className="py-16 px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              SOFT GAME STUDIO
            </motion.h1>
            <motion.h2 
              className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              OUR <span className="text-indigo-500 dark:text-indigo-400">CORE TEAM</span>
            </motion.h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-full md:w-1/3 px-4"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-full transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-gray-900/50">
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      className="relative mb-6"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        alt={member.name}
                        className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 dark:border-gray-700"
                        src={member.image}
                      />
                      <motion.div 
                        className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full ${member.accentColor}`}
                        whileHover={{ width: "100%" }}
                      />
                    </motion.div>
                    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                      {member.role}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {member.bio}
                    </p>
                    <div className={`w-16 h-1 rounded-full ${member.accentColor} mb-4`}></div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white uppercase">
                      {member.name}
                    </h2>
                    <div className="flex flex-wrap justify-center mt-4 gap-2">
                      {member.skills.map((skill) => (
                        <motion.span 
                          key={skill}
                          className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full"
                          whileHover={{ scale: 1.1 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                    <div className="flex justify-center mt-4 space-x-3">
                      {Object.entries(member.social).map(([platform, url]) => (
                        <SocialIcon key={platform} platform={platform} url={url} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Members from Applications */}
        <section className="py-16 px-4 relative z-10" id="team-members">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <motion.h2 
              className="text-3xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400"
              whileInView={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              OUR TEAM MEMBERS
            </motion.h2>
            
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-1/2">
                  <input
                    type="text"
                    placeholder="Search team members..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  <svg
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Showing {indexOfFirstMember + 1}-{Math.min(indexOfLastMember, filteredApplications.length)} of {filteredApplications.length} members
                </div>
              </div>
            </motion.div>
            
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
                className="text-center py-12"
              >
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm ? 'No matching team members found.' : 'No team members found. Check back later!'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg"
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
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 shadow-md"
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-start space-x-4">
                        <motion.div 
                          className="flex-shrink-0"
                          whileHover={{ rotate: 10 }}
                        >
                          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                            {app.name.charAt(0)}
                          </div>
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                            {app.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">
                            <span className="font-medium">Role:</span> {app.post || "Team Member"}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">
                            <span className="font-medium">Skills:</span> {app.qualifications}
                          </p>
                         
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
                    className="flex justify-center mt-8"
                  >
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                      >
                        Prev
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
                            className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-gray-600'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </section>

        {/* Floating CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.a
            href="#team-members"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Team
            <span className="ml-2">↑</span>
          </motion.a>
        </motion.div>
      </div>
    </Layout>
  );
}

export default OurMembers;