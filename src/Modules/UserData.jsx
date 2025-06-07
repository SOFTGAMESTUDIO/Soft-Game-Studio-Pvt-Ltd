// backend/userService.js
import { fireDB } from "../fireabase/FirebaseConfig"; // Adjust the import path as needed
import { getDocs, collection } from "firebase/firestore";

export const getUserData = async () => {
  try {
    const result = await getDocs(collection(fireDB, "users"));
    const usersArray = [];
    result.forEach((doc) => {
      const data = doc.data();
      // Ensure `photoURL` is always defined
      usersArray.push({
        ...data,
        photoURL: data.photoURL || null,
      });
    });
    return usersArray;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
