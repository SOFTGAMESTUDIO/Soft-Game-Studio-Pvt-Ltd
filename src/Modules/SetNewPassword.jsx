// app/Library/resetWithEmail.js
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, } from "../DataBase/firebaseConfig";

export async function sendResetPasswordEmail(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
}
