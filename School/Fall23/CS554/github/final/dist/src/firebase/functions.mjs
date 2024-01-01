var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { getAuth, createUserWithEmailAndPassword, signOut, updateProfile, signInWithEmailAndPassword, updatePassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, } from "firebase/auth";
import { addDoc, collection, doc, query, where, orderBy, getDocs, getDoc, arrayUnion, updateDoc, limit, deleteDoc, } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject, getBytes } from "firebase/storage";
import initFirebaseConfig from "./firebase.mjs";
// Create user with email and password
// Called from signup page
function signUpWithEmailAndPassword(email, password, displayName) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, db, auth, docRef, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (email.length > 50) {
                        throw "Email is too long!";
                    }
                    if (password.length > 60) {
                        throw "Password is too long!";
                    }
                    if (displayName.length > 50) {
                        throw "Display Name is too long";
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    _a = initFirebaseConfig(), db = _a.db, auth = _a.auth;
                    // Create user
                    return [4 /*yield*/, createUserWithEmailAndPassword(auth, email, password)];
                case 2:
                    // Create user
                    _b.sent();
                    if (!auth.currentUser)
                        throw "User unable to be created";
                    // Update user profile
                    return [4 /*yield*/, updateProfile(auth.currentUser, { displayName: displayName })];
                case 3:
                    // Update user profile
                    _b.sent();
                    return [4 /*yield*/, addDoc(collection(db, "users"), {
                            uid: auth.currentUser.uid,
                            displayName: displayName,
                            email: email,
                            followers: [],
                            following: [],
                            posts: [],
                            drafts: [],
                            profile_img: "empty-profile.png"
                        })];
                case 4:
                    docRef = _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _b.sent();
                    console.error("Error adding document: ", e_1);
                    throw e_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function updateDisplayName(newDisplayName) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, db, auth, usersCollectionRef, q, querySnapshot, userDocRef, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    _a = initFirebaseConfig(), db = _a.db, auth = _a.auth;
                    if (!auth.currentUser) {
                        throw "No user is logged in";
                    }
                    usersCollectionRef = collection(db, "users");
                    q = query(usersCollectionRef, where("uid", "==", auth.currentUser.uid));
                    return [4 /*yield*/, getDocs(q)];
                case 1:
                    querySnapshot = _b.sent();
                    if (!!querySnapshot.empty) return [3 /*break*/, 4];
                    userDocRef = querySnapshot.docs[0].ref;
                    //update the profile for auth
                    return [4 /*yield*/, updateProfile(auth.currentUser, { displayName: newDisplayName })];
                case 2:
                    //update the profile for auth
                    _b.sent();
                    //update the db for the collection
                    return [4 /*yield*/, updateDoc(userDocRef, { displayName: newDisplayName })];
                case 3:
                    //update the db for the collection
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4: throw "This user does not exist";
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_2 = _b.sent();
                    console.error("Error updating the display name: ", e_2);
                    throw e_2;
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Change user password
// Not implemented anywhere yet
function changePassword(email, oldPassword, newPassword) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, credential, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    auth = initFirebaseConfig().auth;
                    if (!auth.currentUser)
                        throw "No user is logged in";
                    credential = EmailAuthProvider.credential(email, oldPassword);
                    return [4 /*yield*/, reauthenticateWithCredential(auth.currentUser, credential)];
                case 1:
                    _a.sent();
                    // Change password
                    return [4 /*yield*/, updatePassword(auth.currentUser, newPassword)];
                case 2:
                    // Change password
                    _a.sent();
                    return [4 /*yield*/, logOutUser()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _a.sent();
                    console.error("Error changing password: ", e_3);
                    throw e_3;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Sign in with email and password
// Called from login page
function logInWithEmailAndPassword(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, credential, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    auth = initFirebaseConfig().auth;
                    return [4 /*yield*/, signInWithEmailAndPassword(auth, email, password)];
                case 1:
                    credential = _a.sent();
                    if (!credential.user)
                        throw "User unable to be created";
                    return [3 /*break*/, 3];
                case 2:
                    e_4 = _a.sent();
                    console.error("Error logging in: ", e_4);
                    throw e_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Sign-up/Log-in with Google
// Called from login/signup page
function doGoogleSignIn() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, db, auth, googleProvider, usersCollectionRef, q, querySnapshot, docRef, e_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    _a = initFirebaseConfig(), db = _a.db, auth = _a.auth;
                    googleProvider = new GoogleAuthProvider();
                    return [4 /*yield*/, signInWithPopup(auth, googleProvider)];
                case 1:
                    _b.sent();
                    if (!auth.currentUser)
                        throw new Error("User unable to be created");
                    usersCollectionRef = collection(db, "users");
                    q = query(usersCollectionRef, where("email", "==", auth.currentUser.email));
                    return [4 /*yield*/, getDocs(q)];
                case 2:
                    querySnapshot = _b.sent();
                    if (!!querySnapshot.empty) return [3 /*break*/, 4];
                    return [4 /*yield*/, updateProfile(auth.currentUser, querySnapshot.docs[0].data())];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, addDoc(usersCollectionRef, {
                        uid: auth.currentUser.uid,
                        displayName: auth.currentUser.displayName,
                        email: auth.currentUser.email,
                        followers: [],
                        following: [],
                        posts: [],
                        drafts: []
                    })];
                case 5:
                    docRef = _b.sent();
                    if (!docRef)
                        throw "User unable to be created";
                    _b.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_5 = _b.sent();
                    console.error("Error adding document: ", e_5);
                    throw e_5;
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Extracts user's canvas and creates a post out of it
// Called from PostButton component
function postCanvasToProfile(canvas, description) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, db_1, auth_1, storage_1, e_6;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = initFirebaseConfig(), db_1 = _a.db, auth_1 = _a.auth, storage_1 = _a.storage;
                    if (!auth_1.currentUser || !auth_1.currentUser.uid)
                        throw new Error("User not logged in");
                    // TODO: Maybe add check to see if canvas is blank and prevent user from posting
                    //Wrap in new Promise to synchronize operation
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            // Convert canvas to blob
                            canvas.toBlob(function (blob) { return __awaiter(_this, void 0, void 0, function () {
                                var storageRef, snapshot, path, postsColRef, postRef, q, querySnapshot, userRef, error_1;
                                var _a, _b, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _d.trys.push([0, 5, , 6]);
                                            // Ensure blob was created
                                            if (!blob)
                                                throw new Error("Blob is null");
                                            storageRef = ref(storage_1, "images/".concat((_a = auth_1.currentUser) === null || _a === void 0 ? void 0 : _a.uid, "/").concat(Date.now()));
                                            return [4 /*yield*/, uploadBytes(storageRef, blob)];
                                        case 1:
                                            snapshot = _d.sent();
                                            if (!snapshot)
                                                throw new Error("Snapshot is null");
                                            path = snapshot.ref.fullPath;
                                            postsColRef = collection(db_1, "posts");
                                            return [4 /*yield*/, addDoc(postsColRef, {
                                                    description: description,
                                                    tags: description.split(" "), // Change to actual tags later
                                                    userid: (_b = auth_1 === null || auth_1 === void 0 ? void 0 : auth_1.currentUser) === null || _b === void 0 ? void 0 : _b.uid, //We're storing the user's authentication id (different from their database id)
                                                    comments: [],
                                                    imageURL: path,
                                                    likes: [],
                                                    timestamp: new Date().toISOString()
                                                })];
                                        case 2:
                                            postRef = _d.sent();
                                            q = query(collection(db_1, "users"), where("uid", "==", (_c = auth_1 === null || auth_1 === void 0 ? void 0 : auth_1.currentUser) === null || _c === void 0 ? void 0 : _c.uid));
                                            return [4 /*yield*/, getDocs(q)];
                                        case 3:
                                            querySnapshot = _d.sent();
                                            if (querySnapshot.empty)
                                                throw "User does not exist in database";
                                            userRef = doc(db_1, "users", querySnapshot.docs[0].id);
                                            // Add post to user's posts array
                                            return [4 /*yield*/, updateDoc(userRef, {
                                                    posts: arrayUnion(postRef.id),
                                                })];
                                        case 4:
                                            // Add post to user's posts array
                                            _d.sent();
                                            // Resolve the promise to indicate completion
                                            resolve();
                                            return [3 /*break*/, 6];
                                        case 5:
                                            error_1 = _d.sent();
                                            // Reject the promise in case of an error
                                            reject(error_1);
                                            return [3 /*break*/, 6];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
                case 1:
                    // TODO: Maybe add check to see if canvas is blank and prevent user from posting
                    //Wrap in new Promise to synchronize operation
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_6 = _b.sent();
                    console.error("Error posting canvas: ", e_6);
                    throw e_6;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Reset user password
// Not implemented anywhere yet
function resetPassword(email) {
    return __awaiter(this, void 0, void 0, function () {
        var auth, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    auth = initFirebaseConfig().auth;
                    // Send password reset email
                    return [4 /*yield*/, sendPasswordResetEmail(auth, email)];
                case 1:
                    // Send password reset email
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_7 = _a.sent();
                    console.error("Error resetting password: ", e_7);
                    throw e_7;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Sign out user
// Called from canvas page
function logOutUser() {
    return __awaiter(this, void 0, void 0, function () {
        var auth, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    auth = getAuth();
                    if (!auth)
                        throw "Auth is not initialized";
                    // Sign out
                    return [4 /*yield*/, signOut(auth)];
                case 1:
                    // Sign out
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_8 = _a.sent();
                    console.error("Error logging out: ", e_8);
                    throw e_8;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Get user's posts array
// Called from profile page
function getUserPosts(uid) {
    return __awaiter(this, void 0, void 0, function () {
        var db, q, querySnapshot, userRef, docSnapshot, posts, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    db = initFirebaseConfig().db;
                    q = query(collection(db, "users"), where("uid", "==", uid));
                    return [4 /*yield*/, getDocs(q)];
                case 1:
                    querySnapshot = _a.sent();
                    if (querySnapshot.empty)
                        throw "User does not exist in database";
                    userRef = doc(db, "users", querySnapshot.docs[0].id);
                    return [4 /*yield*/, getDoc(userRef)];
                case 2:
                    docSnapshot = _a.sent();
                    posts = querySnapshot.docs.map(function (doc) {
                        var ret = doc.data();
                        ret.post_id = doc.id;
                        return ret;
                    });
                    if (!posts)
                        throw "User has no posts";
                    return [2 /*return*/, posts];
                case 3:
                    e_9 = _a.sent();
                    console.error("Error getting user posts:", e_9);
                    throw e_9;
                case 4: return [2 /*return*/];
            }
        });
    });
}
//getUserPosts iwth limit option
function getUserPostsLimit(uid, limitValue) {
    if (limitValue === void 0) { limitValue = null; }
    return __awaiter(this, void 0, void 0, function () {
        var db, q, querySnapshot, posts, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    db = initFirebaseConfig().db;
                    q = void 0;
                    // Find posts in database
                    if (!limitValue)
                        q = query(collection(db, "posts"), where("userid", "==", uid));
                    else
                        q = query(collection(db, "posts"), where("userid", "==", uid), limit(limitValue));
                    return [4 /*yield*/, getDocs(q)];
                case 1:
                    querySnapshot = _a.sent();
                    if (querySnapshot.empty)
                        throw "No posts exist in database";
                    posts = querySnapshot.docs.map(function (doc) {
                        //console.log(JSON.stringify(doc));
                        var ret = doc.data();
                        ret.post_id = doc.id;
                        return ret;
                    });
                    //console.log(posts)
                    if (!posts)
                        throw "User has no posts";
                    return [2 /*return*/, posts];
                case 2:
                    error_2 = _a.sent();
                    console.log("Error getting user posts:", error_2);
                    return [2 /*return*/, []
                        //throw error;
                    ];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Get post from database
// Called from post component
function getPost(postId) {
    return __awaiter(this, void 0, void 0, function () {
        var db, postRef, post, ret, e_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    db = initFirebaseConfig().db;
                    postRef = doc(db, "posts", postId);
                    return [4 /*yield*/, getDoc(postRef)];
                case 1:
                    post = _a.sent();
                    if (!post || !post.data())
                        throw "Post does not exist in database";
                    ret = post.data();
                    if (!ret)
                        throw "Post data is undefined";
                    ret.post_id = postId;
                    return [2 /*return*/, ret];
                case 2:
                    e_10 = _a.sent();
                    console.error("Error getting post: ", e_10);
                    throw e_10;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function deletePost(postId) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var _b, db, storage, postData, photoRef, q, querySnapshot, userRef, docSnapshot, newPosts, postRef, e_11;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 7, , 8]);
                    _b = initFirebaseConfig(), db = _b.db, storage = _b.storage;
                    return [4 /*yield*/, getPost(postId)];
                case 1:
                    postData = _c.sent();
                    photoRef = ref(storage, postData === null || postData === void 0 ? void 0 : postData.imageURL);
                    return [4 /*yield*/, deleteObject(photoRef)];
                case 2:
                    _c.sent();
                    q = query(collection(db, "users"), where("uid", "==", postData === null || postData === void 0 ? void 0 : postData.userid));
                    return [4 /*yield*/, getDocs(q)];
                case 3:
                    querySnapshot = _c.sent();
                    if (querySnapshot.empty)
                        throw "User does not exist in database";
                    userRef = doc(db, "users", querySnapshot.docs[0].id);
                    return [4 /*yield*/, getDoc(userRef)];
                case 4:
                    docSnapshot = _c.sent();
                    newPosts = (_a = docSnapshot.data()) === null || _a === void 0 ? void 0 : _a.posts.filter(function (id) { return id !== postId; });
                    return [4 /*yield*/, updateDoc(userRef, { posts: newPosts })];
                case 5:
                    _c.sent();
                    postRef = doc(db, "posts", postId);
                    return [4 /*yield*/, deleteDoc(postRef)];
                case 6:
                    _c.sent();
                    return [2 /*return*/, newPosts];
                case 7:
                    e_11 = _c.sent();
                    console.log("Error deleting post: ", e_11);
                    throw e_11;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function deleteDraft(draftUrl, userid) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var _b, db, storage, draftRef, q, querySnapshot, userRef, docSnapshot, newDrafts, e_12;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    _b = initFirebaseConfig(), db = _b.db, storage = _b.storage;
                    draftRef = ref(storage, draftUrl);
                    return [4 /*yield*/, deleteObject(draftRef)];
                case 1:
                    _c.sent();
                    q = query(collection(db, "users"), where("uid", "==", userid), where("drafts", "array-contains", draftUrl));
                    return [4 /*yield*/, getDocs(q)];
                case 2:
                    querySnapshot = _c.sent();
                    if (querySnapshot.empty)
                        throw "User does not exist in database";
                    userRef = doc(db, "users", querySnapshot.docs[0].id);
                    return [4 /*yield*/, getDoc(userRef)];
                case 3:
                    docSnapshot = _c.sent();
                    newDrafts = (_a = docSnapshot.data()) === null || _a === void 0 ? void 0 : _a.drafts.filter(function (draft) { return draft !== draftUrl; });
                    if (!newDrafts)
                        throw "User has no drafts";
                    return [4 /*yield*/, updateDoc(userRef, { drafts: newDrafts })];
                case 4:
                    _c.sent();
                    return [2 /*return*/, newDrafts];
                case 5:
                    e_12 = _c.sent();
                    console.log("Error deleting post: ", e_12);
                    throw e_12;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getImageFromUrl(imageUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var storage, storageRef, url, e_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    storage = initFirebaseConfig().storage;
                    storageRef = ref(storage, imageUrl);
                    return [4 /*yield*/, getDownloadURL(storageRef)];
                case 1:
                    url = _a.sent();
                    if (!url)
                        throw "Image does not exist in storage";
                    return [2 /*return*/, url];
                case 2:
                    e_13 = _a.sent();
                    console.error("Error getting image: ", e_13);
                    throw e_13;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getDraftUrl(draftId) {
    return __awaiter(this, void 0, void 0, function () {
        var storage, storageRef, url, e_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    storage = initFirebaseConfig().storage;
                    storageRef = ref(storage, "drafts/".concat(draftId));
                    return [4 /*yield*/, getDownloadURL(storageRef)];
                case 1:
                    url = _a.sent();
                    if (!url)
                        throw "Image does not exist in storage";
                    return [2 /*return*/, url];
                case 2:
                    e_14 = _a.sent();
                    console.error("Error getting image: ", e_14);
                    throw e_14;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function saveDraft(canvas) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, db_2, auth_2, storage_2, path_1, e_15;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = initFirebaseConfig(), db_2 = _a.db, auth_2 = _a.auth, storage_2 = _a.storage;
                    if (!auth_2.currentUser || !auth_2.currentUser.uid)
                        throw new Error("User not logged in");
                    //Wrap in new Promise to synchronize operation
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            // Convert canvas to blob
                            canvas.toBlob(function (blob) { return __awaiter(_this, void 0, void 0, function () {
                                var storageRef, snapshot, q, querySnapshot, userRef, error_3;
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _c.trys.push([0, 4, , 5]);
                                            // Ensure blob was created
                                            if (!blob)
                                                throw new Error("Blob is null");
                                            storageRef = ref(storage_2, "drafts/".concat((_a = auth_2.currentUser) === null || _a === void 0 ? void 0 : _a.uid, "/").concat(Date.now()));
                                            return [4 /*yield*/, uploadBytes(storageRef, blob)];
                                        case 1:
                                            snapshot = _c.sent();
                                            if (!snapshot)
                                                throw new Error("Snapshot is null");
                                            // Get path to image in storage bucket
                                            path_1 = snapshot.ref.fullPath;
                                            q = query(collection(db_2, "users"), where("uid", "==", (_b = auth_2 === null || auth_2 === void 0 ? void 0 : auth_2.currentUser) === null || _b === void 0 ? void 0 : _b.uid));
                                            return [4 /*yield*/, getDocs(q)];
                                        case 2:
                                            querySnapshot = _c.sent();
                                            if (querySnapshot.empty)
                                                throw "User does not exist in database";
                                            userRef = doc(db_2, "users", querySnapshot.docs[0].id);
                                            // Add draft to user's draft array
                                            return [4 /*yield*/, updateDoc(userRef, {
                                                    drafts: arrayUnion(path_1),
                                                })];
                                        case 3:
                                            // Add draft to user's draft array
                                            _c.sent();
                                            // Resolve the promise to indicate completion
                                            resolve();
                                            return [3 /*break*/, 5];
                                        case 4:
                                            error_3 = _c.sent();
                                            // Reject the promise in case of an error
                                            reject(error_3);
                                            return [3 /*break*/, 5];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
                case 1:
                    //Wrap in new Promise to synchronize operation
                    _b.sent();
                    return [2 /*return*/, path_1];
                case 2:
                    e_15 = _b.sent();
                    console.error("Error posting draft: ", e_15);
                    throw e_15;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getUserDrafts(uid) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var db, q, querySnapshot, userRef, docSnapshot, drafts, e_16;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    db = initFirebaseConfig().db;
                    q = query(collection(db, "users"), where("uid", "==", uid));
                    return [4 /*yield*/, getDocs(q)];
                case 1:
                    querySnapshot = _b.sent();
                    if (querySnapshot.empty)
                        throw "User does not exist in database";
                    userRef = doc(db, "users", querySnapshot.docs[0].id);
                    return [4 /*yield*/, getDoc(userRef)];
                case 2:
                    docSnapshot = _b.sent();
                    drafts = (_a = docSnapshot.data()) === null || _a === void 0 ? void 0 : _a.drafts;
                    if (!drafts)
                        throw "User has no drafts";
                    return [2 /*return*/, drafts];
                case 3:
                    e_16 = _b.sent();
                    console.error("Error getting user drafts: ", e_16);
                    throw e_16;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getBytesFromUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        var storage, storageRef, bytes, e_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    storage = initFirebaseConfig().storage;
                    storageRef = ref(storage, url);
                    return [4 /*yield*/, getBytes(storageRef)];
                case 1:
                    bytes = _a.sent();
                    if (!bytes)
                        throw "Image does not exist in storage";
                    return [2 /*return*/, bytes];
                case 2:
                    e_17 = _a.sent();
                    console.error("Error getting image: ", e_17);
                    throw e_17;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getUserStats(uid) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var db, q, querySnapshot, userRef, docSnapshot, drafts, followers, following, posts, data, e_18;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 3, , 4]);
                    db = initFirebaseConfig().db;
                    q = query(collection(db, "users"), where("uid", "==", uid));
                    return [4 /*yield*/, getDocs(q)];
                case 1:
                    querySnapshot = _e.sent();
                    if (querySnapshot.empty)
                        throw "User does not exist in database";
                    userRef = doc(db, "users", querySnapshot.docs[0].id);
                    return [4 /*yield*/, getDoc(userRef)];
                case 2:
                    docSnapshot = _e.sent();
                    drafts = (_a = docSnapshot.data()) === null || _a === void 0 ? void 0 : _a.drafts;
                    followers = (_b = docSnapshot.data()) === null || _b === void 0 ? void 0 : _b.followers;
                    following = (_c = docSnapshot.data()) === null || _c === void 0 ? void 0 : _c.following;
                    posts = (_d = docSnapshot.data()) === null || _d === void 0 ? void 0 : _d.posts;
                    data = {
                        drafts: drafts,
                        followers: followers,
                        following: following,
                        posts: posts,
                    };
                    return [2 /*return*/, data];
                case 3:
                    e_18 = _e.sent();
                    console.error("Error getting user drafts: ", e_18);
                    throw e_18;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updatePostLikes(postId, userUid, likerUid) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var db, q, querySnapshot, postRef, _i, _d, doc_1, oldLikes, newLikes, oldLikes, newLikes, e_19;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 8, , 9]);
                    db = initFirebaseConfig().db;
                    q = query(collection(db, "posts"), where("userid", "==", userUid));
                    return [4 /*yield*/, getDocs(q)];
                case 1:
                    querySnapshot = _e.sent();
                    if (querySnapshot.empty)
                        throw "User does not exist in database";
                    postRef = void 0;
                    for (_i = 0, _d = querySnapshot.docs; _i < _d.length; _i++) {
                        doc_1 = _d[_i];
                        if (doc_1.id === postId) {
                            postRef = doc_1;
                            break;
                        }
                    }
                    if (!postRef) return [3 /*break*/, 6];
                    if (!((_a = postRef.data()) === null || _a === void 0 ? void 0 : _a.likes.includes(likerUid))) return [3 /*break*/, 3];
                    oldLikes = (_b = postRef.data()) === null || _b === void 0 ? void 0 : _b.likes;
                    newLikes = oldLikes.filter(function (myUid) { return myUid !== likerUid; });
                    return [4 /*yield*/, updateDoc(postRef.ref, { likes: newLikes })];
                case 2:
                    _e.sent();
                    return [3 /*break*/, 5];
                case 3:
                    oldLikes = (_c = postRef.data()) === null || _c === void 0 ? void 0 : _c.likes;
                    newLikes = __spreadArray(__spreadArray([], oldLikes, true), [likerUid], false);
                    return [4 /*yield*/, updateDoc(postRef.ref, { likes: newLikes })];
                case 4:
                    _e.sent();
                    _e.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6: throw 'Post not found';
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_19 = _e.sent();
                    console.error("Error getting the post for the user: ", e_19);
                    throw e_19;
                case 9: return [2 /*return*/];
            }
        });
    });
}
function getUserbyUid(uid) {
    return __awaiter(this, void 0, void 0, function () {
        var db, q, querySnapshot, userRef, docSnapshot, e_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    db = initFirebaseConfig().db;
                    q = query(collection(db, "users"), where("uid", "==", uid));
                    return [4 /*yield*/, getDocs(q)];
                case 1:
                    querySnapshot = _a.sent();
                    if (querySnapshot.empty)
                        throw "User does not exist in database";
                    userRef = doc(db, "users", querySnapshot.docs[0].id);
                    return [4 /*yield*/, getDoc(userRef)];
                case 2:
                    docSnapshot = _a.sent();
                    return [2 /*return*/, docSnapshot.data()];
                case 3:
                    e_20 = _a.sent();
                    console.error("Error getting user drafts: ", e_20);
                    throw e_20;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function searchUsers(searchTerm) {
    return __awaiter(this, void 0, void 0, function () {
        var db, users_1, nameQ, nameSnapshot, emailQ, emailSnapshot, e_21;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    db = initFirebaseConfig().db;
                    users_1 = [] // todo figure out proper typescript
                    ;
                    nameQ = query(collection(db, "users"), where("displayName", ">=", searchTerm), where("displayName", "<=", searchTerm + "\uf8ff"), orderBy("displayName"));
                    return [4 /*yield*/, getDocs(nameQ)];
                case 1:
                    nameSnapshot = _a.sent();
                    nameSnapshot.forEach(function (doc) {
                        var data = doc.data();
                        if (!users_1.some(function (user) { return user.uid === data.uid; }))
                            users_1.push(data);
                    });
                    emailQ = query(collection(db, "users"), where("email", ">=", searchTerm), where("email", "<=", searchTerm + "\uf8ff"), orderBy("email"));
                    return [4 /*yield*/, getDocs(emailQ)];
                case 2:
                    emailSnapshot = (_a.sent());
                    emailSnapshot.forEach(function (snapshot) {
                        var data = snapshot.data();
                        if (!users_1.some(function (user) { return user.uid === data.uid; }))
                            users_1.push(data);
                    });
                    return [2 /*return*/, users_1];
                case 3:
                    e_21 = _a.sent();
                    console.error("Error searching for users: ", e_21);
                    throw e_21;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updatePostComments(postId, comment, userUid) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var db, postRef, q, querySnapshot, postDoc, oldComments, newComments, e_22;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    db = initFirebaseConfig().db;
                    postRef = doc(collection(db, "posts"), postId);
                    q = query(collection(db, "users"), where("uid", "==", userUid));
                    return [4 /*yield*/, getDocs(q)];
                case 1:
                    querySnapshot = _b.sent();
                    if (querySnapshot.empty)
                        throw "User does not exist in database";
                    // // Get post from database
                    // const postRef = doc(db, "posts", postId);
                    // const post = await getDoc(postRef);
                    // if (!post || !post.data()) throw "Post does not exist in database";
                    // const ret = post.data();
                    console.log(postRef);
                    return [4 /*yield*/, getDoc(postRef)];
                case 2:
                    postDoc = _b.sent();
                    console.log("from updatepost " + postDoc.data());
                    if (!postDoc.exists()) return [3 /*break*/, 4];
                    oldComments = ((_a = postDoc.data()) === null || _a === void 0 ? void 0 : _a.comments) || [];
                    newComments = __spreadArray(__spreadArray([], oldComments, true), [comment], false);
                    return [4 /*yield*/, updateDoc(postDoc.ref, { comments: newComments })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4: throw 'Post not found';
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_22 = _b.sent();
                    console.error("Error updating post comments: ", e_22);
                    throw e_22;
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getAllPosts() {
    return __awaiter(this, void 0, void 0, function () {
        var db, q, querySnapshot, posts, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    db = initFirebaseConfig().db;
                    q = query(collection(db, "posts"));
                    return [4 /*yield*/, getDocs(q)];
                case 1:
                    querySnapshot = _a.sent();
                    if (querySnapshot.empty)
                        throw "No posts exist in database";
                    posts = querySnapshot.docs.map(function (doc) {
                        var ret = doc.data();
                        ret.post_id = doc.id;
                        return ret;
                    });
                    if (!posts)
                        throw "User has no posts";
                    return [2 /*return*/, posts];
                case 2:
                    error_4 = _a.sent();
                    console.log("Error getting user posts:", error_4);
                    return [2 /*return*/, []
                        //throw error;
                    ];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function followUser(otherUid, userUid) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var _c, db, auth, usersCollectionRef, q, querySnapshot, userDocRef, userDoc, oldFollowing, newFollowing, q1, querySnapshot1, userDocRef, userDoc, oldFollowers, newFollowers, e_23;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 11, , 12]);
                    _c = initFirebaseConfig(), db = _c.db, auth = _c.auth;
                    if (!auth.currentUser) {
                        throw "No user is logged in";
                    }
                    usersCollectionRef = collection(db, "users");
                    q = query(usersCollectionRef, where("uid", "==", userUid));
                    return [4 /*yield*/, getDocs(q)];
                case 1:
                    querySnapshot = _d.sent();
                    if (!!querySnapshot.empty) return [3 /*break*/, 4];
                    userDocRef = querySnapshot.docs[0].ref;
                    return [4 /*yield*/, getDoc(userDocRef)];
                case 2:
                    userDoc = _d.sent();
                    oldFollowing = (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.following;
                    newFollowing = __spreadArray(__spreadArray([], oldFollowing, true), [otherUid], false);
                    return [4 /*yield*/, updateDoc(userDocRef, { following: newFollowing })];
                case 3:
                    _d.sent();
                    return [3 /*break*/, 5];
                case 4: throw "This user does not exist";
                case 5:
                    q1 = query(usersCollectionRef, where("uid", "==", otherUid));
                    return [4 /*yield*/, getDocs(q1)];
                case 6:
                    querySnapshot1 = _d.sent();
                    if (!!querySnapshot1.empty) return [3 /*break*/, 9];
                    userDocRef = querySnapshot1.docs[0].ref;
                    return [4 /*yield*/, getDoc(userDocRef)];
                case 7:
                    userDoc = _d.sent();
                    oldFollowers = (_b = userDoc.data()) === null || _b === void 0 ? void 0 : _b.followers;
                    newFollowers = __spreadArray(__spreadArray([], oldFollowers, true), [userUid], false);
                    return [4 /*yield*/, updateDoc(userDocRef, { followers: newFollowers })];
                case 8:
                    _d.sent();
                    return [3 /*break*/, 10];
                case 9: throw "This user does not exist";
                case 10: return [3 /*break*/, 12];
                case 11:
                    e_23 = _d.sent();
                    console.error("Error updating the follower count: ", e_23);
                    throw e_23;
                case 12: return [2 /*return*/];
            }
        });
    });
}
function unfollowUser(otherUid, userUid) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var _c, db, auth, usersCollectionRef, q, querySnapshot, userDocRef, userDoc, oldFollowing, newFollowing, q1, querySnapshot1, userDocRef, userDoc, oldFollowers, newFollowers, e_24;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 10, , 11]);
                    _c = initFirebaseConfig(), db = _c.db, auth = _c.auth;
                    if (!auth.currentUser) {
                        throw "No user is logged in";
                    }
                    usersCollectionRef = collection(db, "users");
                    q = query(usersCollectionRef, where("uid", "==", userUid));
                    return [4 /*yield*/, getDocs(q)];
                case 1:
                    querySnapshot = _d.sent();
                    if (!!querySnapshot.empty) return [3 /*break*/, 4];
                    userDocRef = querySnapshot.docs[0].ref;
                    return [4 /*yield*/, getDoc(userDocRef)];
                case 2:
                    userDoc = _d.sent();
                    oldFollowing = (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.following;
                    newFollowing = oldFollowing.filter(function (myUid) { return myUid !== otherUid; });
                    return [4 /*yield*/, updateDoc(userDocRef, { following: newFollowing })];
                case 3:
                    _d.sent();
                    return [3 /*break*/, 5];
                case 4: throw "This user does not exist";
                case 5:
                    q1 = query(usersCollectionRef, where("uid", "==", otherUid));
                    return [4 /*yield*/, getDocs(q1)];
                case 6:
                    querySnapshot1 = _d.sent();
                    if (!!querySnapshot1.empty) return [3 /*break*/, 9];
                    userDocRef = querySnapshot1.docs[0].ref;
                    return [4 /*yield*/, getDoc(userDocRef)];
                case 7:
                    userDoc = _d.sent();
                    oldFollowers = (_b = userDoc.data()) === null || _b === void 0 ? void 0 : _b.followers;
                    newFollowers = oldFollowers.filter(function (myUid) { return myUid !== userUid; });
                    return [4 /*yield*/, updateDoc(userDocRef, { followers: newFollowers })];
                case 8:
                    _d.sent();
                    _d.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    e_24 = _d.sent();
                    console.error("Error updating the follower count: ", e_24);
                    throw e_24;
                case 11: return [2 /*return*/];
            }
        });
    });
}
export { signUpWithEmailAndPassword, doGoogleSignIn, logInWithEmailAndPassword, resetPassword, logOutUser, changePassword, postCanvasToProfile, getUserPosts, getUserPostsLimit, getPost, getImageFromUrl, updateDisplayName, deletePost, getDraftUrl, saveDraft, getUserDrafts, getBytesFromUrl, deleteDraft, getUserStats, updatePostLikes, searchUsers, updatePostComments, getUserbyUid, getAllPosts, followUser, unfollowUser };
