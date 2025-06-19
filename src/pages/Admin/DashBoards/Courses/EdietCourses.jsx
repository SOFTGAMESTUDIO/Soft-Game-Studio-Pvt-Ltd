// src/pages/EditCourses/[id].jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fireDB } from '../../../../DataBase/firebaseConfig';
import Layout from '../../../../components/layout/Layout';

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseType, setCourseType] = useState('single');
  const [courseData, setCourseData] = useState({
    title: '',
    thumbnail: '',
    description: '',
    videoUrl: '',
    notes: '',
    sourceLinks: [''],
    chapters: [{ title: '', videoUrl: '', notes: '', sourceLinks: [''] }]
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const docRef = doc(fireDB, 'courses', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const course = docSnap.data();
          setCourseType(course.type);
          
          // Set initial form data based on course type
          if (course.type === 'single') {
            setCourseData({
              title: course.title,
              thumbnail: course.thumbnail,
              description: course.description,
              videoUrl: course.videoUrl || '',
              notes: course.notes || '',
              sourceLinks: course.sourceLinks || [''],
              chapters: []
            });
          } else {
            setCourseData({
              title: course.title,
              thumbnail: course.thumbnail,
              description: course.description,
              videoUrl: '',
              notes: '',
              sourceLinks: [''],
              chapters: course.chapters || []
            });
          }
        } else {
          console.log('No such course!');
          navigate('/AllCourses');
        }
      } catch (error) {
        console.error('Error fetching course: ', error);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  // Source link handlers
  const handleSourceLinkChange = (index, value) => {
    const newLinks = [...courseData.sourceLinks];
    newLinks[index] = value;
    setCourseData(prev => ({ ...prev, sourceLinks: newLinks }));
  };

  const addSourceLink = () => {
    setCourseData(prev => ({
      ...prev,
      sourceLinks: [...prev.sourceLinks, '']
    }));
  };

  const removeSourceLink = (index) => {
    const newLinks = courseData.sourceLinks.filter((_, i) => i !== index);
    setCourseData(prev => ({ ...prev, sourceLinks: newLinks }));
  };

  // Chapter handlers
  const handleChapterChange = (index, field, value) => {
    const newChapters = [...courseData.chapters];
    newChapters[index][field] = value;
    setCourseData(prev => ({ ...prev, chapters: newChapters }));
  };

  const handleChapterSourceLink = (chapIndex, linkIndex, value) => {
    const newChapters = [...courseData.chapters];
    newChapters[chapIndex].sourceLinks[linkIndex] = value;
    setCourseData(prev => ({ ...prev, chapters: newChapters }));
  };

  const addChapter = () => {
    setCourseData(prev => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        { title: '', videoUrl: '', notes: '', sourceLinks: [''] }
      ]
    }));
  };

  const removeChapter = (index) => {
    setCourseData(prev => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const courseToUpdate = {
        type: courseType,
        title: courseData.title,
        thumbnail: courseData.thumbnail,
        description: courseData.description,
        updatedAt: new Date(),
        ...(courseType === 'single' ? {
          videoUrl: courseData.videoUrl,
          notes: courseData.notes,
          sourceLinks: courseData.sourceLinks.filter(link => link.trim() !== '')
        } : {
          chapters: courseData.chapters.map(chap => ({
            ...chap,
            sourceLinks: chap.sourceLinks.filter(link => link.trim() !== '')
          }))
        })
      };

      const courseRef = doc(fireDB, 'courses', id);
      await updateDoc(courseRef, courseToUpdate);
      alert('Course updated successfully!');
      navigate('/AllCourses');
    } catch (error) {
      console.error('Error updating course: ', error);
      alert('Error updating course');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-purple-100 dark:bg-neutral-950 p-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-400 mb-6">Edit Course</h1>
          
          {/* Course Type Selector */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              Course Type
            </label>
            <div className="flex space-x-4">
              {['single', 'playlist'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCourseType(type)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    courseType === type
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  {type === 'single' ? 'Single Course' : 'Playlist'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Common Fields */}
              <div>
                <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  name="thumbnail"
                  value={courseData.thumbnail}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                {courseData.thumbnail && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Preview:</p>
                    <img 
                      src={courseData.thumbnail} 
                      alt="Thumbnail preview" 
                      className="h-32 object-cover rounded-lg border border-gray-300 dark:border-neutral-700"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Single Course Fields */}
              {courseType === 'single' && (
                <>
                  <div>
                    <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Video URL
                    </label>
                    <input
                      type="text"
                      name="videoUrl"
                      value={courseData.videoUrl}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Course Notes
                    </label>
                    <ReactQuill
                      value={courseData.notes}
                      onChange={(value) => setCourseData(prev => ({ ...prev, notes: value }))}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link'],
                          ['clean']
                        ]
                      }}
                      className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-lg"
                      theme="snow"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Source Links
                    </label>
                    {courseData.sourceLinks.map((link, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="url"
                          value={link}
                          onChange={(e) => handleSourceLinkChange(index, e.target.value)}
                          className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="https://example.com"
                        />
                        {courseData.sourceLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSourceLink(index)}
                            className="ml-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSourceLink}
                      className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      + Add Link
                    </button>
                  </div>
                </>
              )}

              {/* Playlist Fields */}
              {courseType === 'playlist' && (
                <div>
                  <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Chapters
                  </label>
                  
                  {courseData.chapters.map((chapter, chapIndex) => (
                    <div key={chapIndex} className="mb-6 p-4 border border-gray-300 dark:border-neutral-700 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-400">
                          Chapter {chapIndex + 1}
                        </h3>
                        {courseData.chapters.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChapter(chapIndex)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Remove Chapter
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Chapter Title
                          </label>
                          <input
                            type="text"
                            value={chapter.title}
                            onChange={(e) => handleChapterChange(chapIndex, 'title', e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Video URL
                          </label>
                          <input
                            type="url"
                            value={chapter.videoUrl}
                            onChange={(e) => handleChapterChange(chapIndex, 'videoUrl', e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Chapter Notes
                          </label>
                          <ReactQuill
                            value={chapter.notes}
                            onChange={(value) => handleChapterChange(chapIndex, 'notes', value)}
                            modules={{
                              toolbar: [
                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['link'],
                                ['clean']
                              ]
                            }}
                            className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-lg"
                            theme="snow"
                          />
                        </div>

                        <div>
                          <label className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Source Links
                          </label>
                          {chapter.sourceLinks.map((link, linkIndex) => (
                            <div key={linkIndex} className="flex items-center mb-2">
                              <input
                                type="url"
                                value={link}
                                onChange={(e) => handleChapterSourceLink(chapIndex, linkIndex, e.target.value)}
                                className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="https://example.com"
                              />
                              {chapter.sourceLinks.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newLinks = [...chapter.sourceLinks];
                                    newLinks.splice(linkIndex, 1);
                                    handleChapterChange(chapIndex, 'sourceLinks', newLinks);
                                  }}
                                  className="ml-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newLinks = [...chapter.sourceLinks, ''];
                              handleChapterChange(chapIndex, 'sourceLinks', newLinks);
                            }}
                            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            + Add Link
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addChapter}
                    className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Chapter
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition-colors shadow-lg"
                >
                  Update Course
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditCoursePage;