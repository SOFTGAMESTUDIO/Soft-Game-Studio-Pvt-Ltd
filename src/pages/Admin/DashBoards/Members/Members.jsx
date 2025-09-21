import React, { useState, useEffect } from 'react';
import { 
  collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, 
  deleteDoc, increment, query, where, orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { fireDB, storage } from '../../../../DataBase/firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../../../components/layout/Layout';
import { Helmet } from 'react-helmet';
import { FiSearch, FiEdit, FiTrash2, FiX, FiPlus, FiSave, FiUpload } from 'react-icons/fi';

const AdminTeamMembers = () => {
  const [formData, setFormData] = useState({
    id: null, // For edit mode
    name: '',
    role: '',
    skills: '',
    education: '',
    department: '',
    departmentId: '',
    newDepartment: '',
    newDepartmentId: '',
    experience: '',
    email: ''
  });
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [departments, setDepartments] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch existing departments and team members
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const deptQuerySnapshot = await getDocs(collection(fireDB, 'departments'));
        const deptList = [];
        deptQuerySnapshot.forEach((doc) => {
          deptList.push({ id: doc.id, ...doc.data() });
        });
        setDepartments(deptList);

        // Fetch team members
        const membersQuerySnapshot = await getDocs(
          query(collection(fireDB, 'teamMembers'), orderBy('createdAt', 'desc'))
        );
        const membersList = [];
        membersQuerySnapshot.forEach((doc) => {
          membersList.push({ id: doc.id, ...doc.data() });
        });
        setTeamMembers(membersList);
        setFilteredMembers(membersList);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage({ text: 'Error fetching data', type: 'error' });
      }
    };
    fetchData();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredMembers(teamMembers);
    } else {
      const filtered = teamMembers.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchTerm, teamMembers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If department changes, auto-set departmentId if it's an existing department
    if (name === 'department' && value !== 'new') {
      const selectedDept = departments.find(dept => dept.name === value);
      setFormData({ 
        ...formData, 
        [name]: value,
        departmentId: selectedDept ? selectedDept.code : ''
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateEmployeeId = async (departmentCode) => {
    try {
      // Get the department document to check the last used number
      const deptRef = doc(fireDB, 'departments', departmentCode);
      const deptSnap = await getDoc(deptRef);
      
      if (deptSnap.exists()) {
        const lastNumber = deptSnap.data().lastEmployeeNumber || 0;
        const newNumber = lastNumber + 1;
        
        // Update the department with the new last employee number
        await updateDoc(deptRef, {
          lastEmployeeNumber: newNumber
        });
        
        // Format the employee ID
        return `SGS${departmentCode}${newNumber.toString().padStart(3, '0')}`;
      } else {
        throw new Error('Department not found');
      }
    } catch (error) {
      console.error('Error generating employee ID:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      let departmentCode = formData.departmentId;
      let departmentName = formData.department;

      // If creating a new department
      if (formData.department === 'new' && formData.newDepartment && formData.newDepartmentId) {
        departmentCode = formData.newDepartmentId;
        departmentName = formData.newDepartment;
        
        // Check if department already exists
        const deptRef = doc(fireDB, 'departments', departmentCode);
        const deptSnap = await getDoc(deptRef);
        
        if (!deptSnap.exists()) {
          // Create new department
          await setDoc(deptRef, {
            name: departmentName,
            code: departmentCode,
            lastEmployeeNumber: 0
          });
          
          // Update departments list
          setDepartments([...departments, { id: departmentCode, name: departmentName, code: departmentCode }]);
        }
      }

      // Generate employee ID for new members
      let employeeId = formData.employeeId;
      if (!isEditing) {
        employeeId = await generateEmployeeId(departmentCode);
      }

      // Upload photo if selected
      let photoUrl = formData.photoUrl || '';
      if (photo) {
        // Delete old photo if editing
        if (isEditing && formData.photoUrl) {
          try {
            const oldPhotoRef = ref(storage, formData.photoUrl);
            await deleteObject(oldPhotoRef);
          } catch (error) {
            console.error('Error deleting old photo:', error);
          }
        }
        
        const storageRef = ref(storage, `team-members/${employeeId}/profile.jpg`);
        const snapshot = await uploadBytes(storageRef, photo);
        photoUrl = await getDownloadURL(snapshot.ref);
      }

      // Prepare member data
      const memberData = {
        name: formData.name,
        role: formData.role,
        employeeId: employeeId,
        department: departmentName,
        departmentCode: departmentCode,
        skills: formData.skills,
        education: formData.education,
        photoUrl: photoUrl,
        updatedAt: new Date(),
        experience: formData.experience,
        email: formData.email
      };

      if (isEditing) {
        // Update existing member
        await updateDoc(doc(fireDB, 'teamMembers', formData.id), memberData);
        setMessage({ text: 'Team member updated successfully!', type: 'success' });
      } else {
        // Add new member
        memberData.createdAt = new Date();
        await addDoc(collection(fireDB, 'teamMembers'), memberData);
        setMessage({ text: 'Team member added successfully!', type: 'success' });
      }

      // Refresh data
      const membersQuerySnapshot = await getDocs(
        query(collection(fireDB, 'teamMembers'), orderBy('createdAt', 'desc'))
      );
      const membersList = [];
      membersQuerySnapshot.forEach((doc) => {
        membersList.push({ id: doc.id, ...doc.data() });
      });
      setTeamMembers(membersList);

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving team member:', error);
      setMessage({ text: 'Error saving team member. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setIsEditing(true);
    setFormData({
      id: member.id,
      name: member.name,
      role: member.role,
      skills: member.skills,
      education: member.education,
      department: member.department,
      departmentId: member.departmentCode,
      employeeId: member.employeeId,
      photoUrl: member.photoUrl,
      experience: member.experience,
      email: member.email
    });
    setPreviewUrl(member.photoUrl || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (memberId, employeeId, photoUrl) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(fireDB, 'teamMembers', memberId));
      
      // Delete photo from Storage if exists
      if (photoUrl) {
        const photoRef = ref(storage, photoUrl);
        await deleteObject(photoRef);
      }
      
      setMessage({ text: 'Team member deleted successfully!', type: 'success' });
      setDeleteConfirm(null);
      
      // Refresh data
      const membersQuerySnapshot = await getDocs(
        query(collection(fireDB, 'teamMembers'), orderBy('createdAt', 'desc'))
      );
      const membersList = [];
      membersQuerySnapshot.forEach((doc) => {
        membersList.push({ id: doc.id, ...doc.data() });
      });
      setTeamMembers(membersList);
    } catch (error) {
      console.error('Error deleting team member:', error);
      setMessage({ text: 'Error deleting team member.', type: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      role: '',
      skills: '',
      education: '',
      department: '',
      departmentId: '',
      newDepartment: '',
      newDepartmentId: '',
      experience: '',
      email: ""
    });
    setPhoto(null);
    setPreviewUrl('');
    setIsEditing(false);
  };

  return (
    <Layout>
      <Helmet>
        <title>Team Members Admin - Soft Game Studio</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <motion.h1 
                className="text-3xl font-bold text-indigo-600 dark:text-indigo-400"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {isEditing ? 'Edit Team Member' : 'Add Team Member'}
              </motion.h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {isEditing ? 'Update team member details' : 'Add a new member to your team'}
              </p>
            </div>
            
            {isEditing && (
              <motion.button
                onClick={resetForm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <FiPlus className="rotate-45" /> Cancel Edit
              </motion.button>
            )}
          </div>

          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Add/Edit Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mb-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role/Position *
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Skills (comma separated) *
                  </label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., React, JavaScript, UI/UX Design"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Education *
                  </label>
                  <input
                    type="text"
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., B.Tech Computer Science"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Experience *
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Fressher, 0-2 Year"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact *
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Owner@sgs.web.app, +91-1234567890"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                    <option value="new">+ Create New Department</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department Code *
                  </label>
                  {formData.department === 'new' ? (
                    <input
                      type="text"
                      id="newDepartmentId"
                      name="newDepartmentId"
                      value={formData.newDepartmentId}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 12DEV for Development"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <input
                      type="text"
                      id="departmentId"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleInputChange}
                      required
                      readOnly={!!formData.department}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600"
                    />
                  )}
                </div>
              </div>

              {formData.department === 'new' && (
                <div>
                  <label htmlFor="newDepartment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Department Name *
                  </label>
                  <input
                    type="text"
                    id="newDepartment"
                    name="newDepartment"
                    value={formData.newDepartment}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white opacity-0 absolute inset-0 z-10 cursor-pointer"
                    />
                    <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        {photo ? photo.name : 'Choose file...'}
                      </span>
                      <FiUpload className="text-gray-400" />
                    </div>
                  </div>
                  {previewUrl && (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-300">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <motion.button
                  type="button"
                  onClick={resetForm}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    'Saving...'
                  ) : (
                    <>
                      <FiSave /> {isEditing ? 'Update Member' : 'Add Team Member'}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Team Members List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Team Members</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="relative w-full md:w-64">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No team members found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-3">Name</th>
                      <th scope="col" className="px-4 py-3">Employee ID</th>
                      <th scope="col" className="px-4 py-3">Department</th>
                      <th scope="col" className="px-4 py-3">Role</th>
                      <th scope="col" className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td scope="row" className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {member.photoUrl ? (
                              <img className="w-8 h-8 rounded-full" src={member.photoUrl} alt={member.name}   />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                                {member.name.charAt(0)}
                              </div>
                            )}
                            {member.name}
                          </div>
                        </td>
                        <td className="px-4 py-3">{member.employeeId}</td>
                        <td className="px-4 py-3">{member.department}</td>
                        <td className="px-4 py-3">{member.role}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <motion.button
                              onClick={() => handleEdit(member)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full"
                              title="Edit"
                            >
                              <FiEdit />
                            </motion.button>
                            <motion.button
                              onClick={() => setDeleteConfirm(member)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Delete</h3>
                  <button 
                    onClick={() => setDeleteConfirm(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.employeeId, deleteConfirm.photoUrl)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default AdminTeamMembers;