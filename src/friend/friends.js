import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./framework.css";
import "./master.css";
import photo from "./profile-user.png";
import change from "./cigarette.png";
import setting from "./settings.png";
import multipe from "./multiple-users-silhouette.png";
import friend from "./friends.png";
import { db } from "../fireba/firebase"; // Firebase configuration
import { doc, getDoc, getDocs, collection, updateDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { database, ref, push, set } from "../fireba/firebase";

export default function Friend() {
  const { currentUser } = useAuth(); // Get current user info
  const [users, setUsers] = useState([]); // Store list of users
  const [friends, setFriends] = useState([]); // Current user's friends
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isgroupsVisible, setIsgroupsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState(false);
  
  const removeFriend = async (friendId) => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const updatedFriends = friends.filter(friend => friend.id !== friendId).map(friend => friend.id);
      await updateDoc(userRef, { friends: updatedFriends });
      setFriends(friends.filter(friend => friend.id !== friendId)); // Update local state
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };
  
  // Fetch all users except the current user
  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const userList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch current user's friends
  const fetchFriends = async () => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const friendIds = userSnap.data().friends || [];
        const friendsData = await Promise.all(
          friendIds.map(async (friendId) => {
            const friendDoc = await getDoc(doc(db, "users", friendId));
            return { id: friendId, ...friendDoc.data() };
          })
        );
        setFriends(friendsData);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  // Add friend to the current user's Firestore document
  const addFriend = async (friendId) => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const updatedFriends = [...new Set([...friends.map(friend => friend.id), friendId])]; // Prevent duplicates
      await updateDoc(userRef, { friends: updatedFriends });

      const friendDoc = await getDoc(doc(db, "users", friendId));
      const newFriendData = { id: friendId, ...friendDoc.data() };
      setFriends([...friends, newFriendData]); // Update local state
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFriends();
  }, []);

  const openForm = () => setIsFormVisible(true);
  const closeForm = () => setIsFormVisible(false);
  const opengroups = () => setIsgroupsVisible(true);
  const closegroups = () => setIsgroupsVisible(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    const messageRef = ref(database, 'chat');
    const newMessageRef = push(messageRef);
    set(newMessageRef, {
      message: message,
    })
      .then(() => {
        setLoader(false);
        setAlert(true);

        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlert(false);
        }, 3000);

        // Clear form
        setMessage("");
      })
      .catch((error) => {
        alert(error.message);
        setLoader(false);
      });
  };

  return (
    <div className="page d-flex">
      <div className="sidebar bg-white p-20 p-relative">
        <h3 className="p-relative txt-c mt-0">habit-up</h3>
        <ul>
          <li>
            <Link to="/dashboard" className="d-flex align-center fs-14 c-black rad-6 p-10">
              <img src={photo} alt="Dashboard" style={{ width: "24px" }} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/setting" className="d-flex align-center fs-14 c-black rad-6 p-10">
              <img src={setting} alt="Setting" style={{ width: "24px" }} />
              <span>Setting</span>
            </Link>
          </li>
          <li>
            <Link to="/yourhabits" className="d-flex align-center fs-14 c-black rad-6 p-10">
              <img src={change} alt="Habit" style={{ width: "24px" }} />
              <span>Habit</span>
            </Link>
          </li>
          <li>
            <Link to="/challenges" className="d-flex align-center fs-14 c-black rad-6 p-10">
              <img src={multipe} alt="Challenge" style={{ width: "24px" }} />
              <span>Challenge</span>
            </Link>
          </li>
          <li>
            <Link to="/friends" className="d-flex align-center fs-14 c-black rad-6 p-10">
              <img src={friend} alt="Friends" style={{ width: "24px" }} />
              <span>Friends</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="content w-full">
        <h1 className="p-relative">Friends</h1>
        {isFormVisible && (
          <div className="add-challenge-form bg-white p-20 rad-6 m-20">
            <ul className="user-list">
              {users.map((filteredUser) => (
                <li key={filteredUser.id} className="user-item d-flex align-center">
                  <span style={{ margin: "10px" }}>{filteredUser.name}</span>
                  <button
                    className="btn bg-blue c-white ml-10"
                    onClick={() => addFriend(filteredUser.id)} style={{ margin: "5px" }}
                  >
                    Add Friend
                  </button>
                </li>
              ))}
            </ul>
            <button className="btn bg-blue c-white" onClick={closeForm} style={{ margin: "5px" }}>
              Close
            </button>
            </div>
        )}

        <button
          className="btn bg-blue c-white"
          onClick={openForm}
          style={{ position: "absolute", top: "20px", right: "20px" }}
        >
          +
        </button>

        <div className="wrapper d-grid gap-20">
  <div className="welcome bg-white rad-10 txt-c-mobile block-mobile">
    <h2 className="m-0mb-20">List of Friends</h2>
    <div className="body txt-c d-flex p-20 mt-20 mb-20 block-mobile">
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} className="user-item d-flex align-center">
            <span style={{ margin: "10px" }}>{friend.name}</span>
            <button
              className="btn bg-red c-white ml-10"
              onClick={() => removeFriend(friend.id)}
              style={{ margin: "5px" }}
            >
              Remove Friend
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>

 

  {/* Groups Section */}
  <div className="tasks p-20 bg-white rad-10">
    <h2 className="mt-0 mb-20">Groups</h2>
    <div className="body txt-c d-flex p-20 mt-20 mb-20 block-mobile">
      {isgroupsVisible && (
          <>
            <ul className="user-list">
              {users.map((filteredUser) => (
                <li key={filteredUser.id} className="user-item d-flex align-center">
                  <span style={{ margin: "10px" }}>{filteredUser.name}</span>
                  <button
                    className="btn bg-blue c-white ml-10"
                    onClick={() => addFriend(filteredUser.id)} style={{ margin: "5px" }}
                  >
                    Add Friend
                  </button>
                </li>
              ))}
            </ul>
            <button className="btn bg-blue c-white" onClick={closegroups} style={{ margin: "5px" }}>
              Close
            </button>
          </>
        )}

        <button
          className="btn bg-blue c-white"
          onClick={opengroups}
          style={{ position: "relative", top: "20px", right: "20px",flex:"display" }}
        >
          create
        </button>

    </div>
  </div>
</div>
      </div>
    </div>
  );
}
