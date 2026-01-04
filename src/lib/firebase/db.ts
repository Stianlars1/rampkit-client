import { getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "./app";
export const db = getFirestore(getFirebaseApp());
