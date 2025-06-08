import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { fireDB } from "../../../../DataBase/firebaseConfig";
import Layout from "../../../../components/layout/Layout";

const UsersData = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    setLoading(true);
    try {
      const result = await getDocs(collection(fireDB, "users"));
      const usersArray = [];
      result.forEach((docSnap) => {
        usersArray.push({ ...docSnap.data(), id: docSnap.id });
      });
      usersArray.sort((a, b) => (Number(a.rollNumber) || 0) - (Number(b.rollNumber) || 0));
      setUser(usersArray);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditedData({ ...user });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const key = name.split(".")[1];
      setEditedData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setEditedData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const userRef = doc(fireDB, "users", editedData.id);
      await updateDoc(userRef, editedData);
      getUserData();
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  const filteredUsers = user.filter((item) => {
    const query = searchQuery.toLowerCase();
    if (searchType === "name") return item.name?.toLowerCase().includes(query);
    if (searchType === "email") return item.email?.toLowerCase().includes(query);
    if (searchType === "rollNumber") return item.rollNumber?.toString().includes(query);
    if (searchType === "phone") return item.phone?.toString().includes(query);
    return false;
  });

  return (
    <Layout>
 <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white py-10 transition-colors">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">User Management</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Search and manage user details effortlessly</p>
      </header>

      {/* Search Section */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border dark:border-gray-700"
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="rollNumber">Roll No</option>
          <option value="phone">Phone No</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchType}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 w-64 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border dark:border-gray-700"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mx-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              {["S.No", "Name", "Email", "Roll No", "UID", "Phone", "Address", "Actions"].map((th) => (
                <th key={th} className="px-4 py-3 border-b border-gray-300 dark:border-gray-600 text-left">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-700"}>
                <td className="px-4 py-3 border-b">{index + 1}</td>
                <td className="px-4 py-3 border-b">{item.name}</td>
                <td className="px-4 py-3 border-b">{item.email}</td>
                <td className="px-4 py-3 border-b">{item.rollNumber}</td>
                <td className="px-4 py-3 border-b">{item.uid}</td>
                <td className="px-4 py-3 border-b">{item.phone || "N/A"}</td>
                <td className="px-4 py-3 border-b text-xs">
                  <p>{`#${item.address?.houseno || "N/A"}`}</p>
                  <p>{`Street: ${item.address?.streetno || "N/A"}`}</p>
                  <p>{`Area: ${item.address?.area || "N/A"}`}</p>
                  <p>{`City: ${item.address?.city || "N/A"}`}</p>
                  <p>{`State: ${item.address?.state || "N/A"}`}</p>
                  <p>{`Pincode: ${item.address?.pincode || "N/A"}`}</p>
                </td>
                <td className="px-4 py-3 border-b">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-[600px] p-6 text-gray-900 dark:text-white relative">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" value={editedData.name} onChange={handleChange} className="border px-3 py-2 rounded bg-white dark:bg-gray-700 dark:text-white" placeholder="Name" />
              <input name="email" value={editedData.email} onChange={handleChange} className="border px-3 py-2 rounded bg-white dark:bg-gray-700 dark:text-white" placeholder="Email" />
              <input name="rollNumber" value={editedData.rollNumber} onChange={handleChange} className="border px-3 py-2 rounded bg-white dark:bg-gray-700 dark:text-white" placeholder="Roll No" />
              <input name="phone" value={editedData.phone || ""} onChange={handleChange} className="border px-3 py-2 rounded bg-white dark:bg-gray-700 dark:text-white" placeholder="Phone" />
            </div>
            <div className="flex justify-end mt-6 gap-4">
              <button onClick={() => setEditingUser(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
   
  );
};

export default UsersData;
