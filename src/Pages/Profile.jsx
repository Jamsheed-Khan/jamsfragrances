import React, { useState, useEffect } from "react";
import { getAuth, updateProfile, updatePassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";  // Import toast for notifications
import { PuffLoader } from "react-spinners";  // Import PuffLoader for image loading spinner

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Loader state for image upload
  const [isImageLoading, setIsImageLoading] = useState(true); // State for image loading spinner
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      setUser(currentUser);

      // Fetch user data from Firestore
      const userDoc = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setProfilePicture(data.profilePicture || "");
        setName(currentUser.displayName || "");
      } else {
        // Create a default user document if not found
        await setDoc(userDoc, {
          profilePicture: "",
          displayName: currentUser.displayName || "",
          email: currentUser.email || "",
        });
        console.error("User document not found in Firestore. Created new document.");
      }

      // Fetch user's cart items
      const cartRef = collection(db, "users", currentUser.uid, "cart");
      const q = query(cartRef);
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedCartItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(fetchedCartItems);
      });
      return () => unsubscribe(); // Clean up the listener
    };

    fetchUserData();
  }, [auth, db]);

  const handleProfileUpdate = async () => {
    if (!user) return;

    const userDoc = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDoc);

    // Check if the user document exists
    if (!userSnap.exists()) {
      await setDoc(userDoc, {
        profilePicture: "",
        displayName: user.displayName || "",
        email: user.email || "",
      });
      console.error("User document not found in Firestore.");
      alert("User document not found!");
      return;
    }

    try {
      // Update profile picture and name in Firebase Auth
      await updateProfile(user, {
        displayName: name,
        photoURL: profilePicture, // Set photoURL here after upload
      });

      // Update Firestore
      await updateDoc(userDoc, {
        profilePicture,
        displayName: name,
      });

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile!");
    }
  };

  const handlePasswordChange = async () => {
    if (!password) {
      toast.error("Please enter a new password.");
      return;
    }
  
    // Firebase has a minimum password length requirement
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters long.");
      return;
    }
  
    try {
      // Update password in Firebase Authentication
      await updatePassword(user, password);
  
      // Optionally, you can reset the password field after successful change
      setPassword("");
  
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
  
      // Handle specific Firebase errors
      if (error.code === "auth/weak-password") {
        toast.error("The password is too weak. Please choose a stronger password.");
      } else if (error.code === "auth/requires-recent-login") {
        toast.error("You need to re-authenticate to change the password.");
        // Prompt the user to re-sign in (e.g., force logout or prompt for re-login)
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return; // Check if file or user is null

    setIsUploading(true); // Start the loader

    // Initialize storage and get a reference to the storage path
    const storage = getStorage();
    const fileRef = ref(storage, `profilePictures/${user.uid}/${file.name}`); // Use `ref()` correctly
    await uploadBytes(fileRef, file); // Upload the file to Firebase Storage
    const fileUrl = await getDownloadURL(fileRef); // Get the download URL for the uploaded file

    setProfilePicture(fileUrl); // Set the uploaded file URL as the profile picture
    setIsUploading(false); // Stop the loader
  };

  // Handle profile image loading spinner
  useEffect(() => {
    if (profilePicture) {
      setIsImageLoading(false); // Set the image as loaded when the URL is set
    }
  }, [profilePicture]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6 mb-6">
          {/* Profile Picture */}
          <div className="relative">
            {isImageLoading ? (
              <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-800 rounded-full">
                <PuffLoader color="#ffffff" size={50} />
              </div>
            ) : (
              <img
                src={profilePicture || "https://via.placeholder.com/150"}
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border border-gray-300"
              />
            )}
            <label
              htmlFor="fileInput"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer"
            >
              Upload
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                disabled={!isEditing}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Edit Buttons */}
        {isEditing ? (
          <div className="flex items-center space-x-4 mb-6">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={handleProfileUpdate}
            >
              Save Changes
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-6"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}

        {/* Change Password Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            onClick={handlePasswordChange}
          >
            Update Password
          </button>
        </div>

        {/* Cart Items */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My Cart</h2>
          {cartItems.length > 0 ? (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">${item.price}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">
                    Qty: {item.quantity}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No items in the cart</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
