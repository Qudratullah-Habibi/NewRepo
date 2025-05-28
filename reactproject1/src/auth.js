import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebase.Config";  // Only import 'app' if you are using it

const auth = getAuth(app);

const OWNER_EMAIL = "greenpointafghanistan@gmail.com";

// Login Function (only for owner)
export const login = async (email, password) => {
    try {
        if (email !== OWNER_EMAIL) {
            throw new Error("Access denied: Only the owner can log in.");
        }
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in:", error.message);
        throw error;
    }
};
