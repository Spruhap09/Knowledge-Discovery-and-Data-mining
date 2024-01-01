import 'module-alias/register.js';
import { getApps, initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import firebaseConfig from "./config.mjs";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";
export default function initFirebaseConfig() {
    var app, storage, auth, db;
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        storage = getStorage(app);
        auth = getAuth(app);
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
        connectStorageEmulator(storage, '127.0.0.1', 9199);
        connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    }
    else {
        app = getApps()[0];
        db = getFirestore(app);
        storage = getStorage(app);
        auth = getAuth(app);
    }
    return { db: db, storage: storage, auth: auth, app: app };
}
