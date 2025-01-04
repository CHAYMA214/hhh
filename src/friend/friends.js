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
import { database, ref, push, set ,get,pull} from "../fireba/firebase";

export default function Friend() {
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]); // Membres du groupe sélectionné
const [selectedGroupName, setSelectedGroupName] = useState(""); // Nom du groupe sélectionné

  const { currentUser } = useAuth(); // Get current user info
  const [users, setUsers] = useState([]); // Store list of users
  const [friends, setFriends] = useState([]); // Current user's friends
  const [friendRequests, setFriendRequests] = useState([]); // Current user's friend requests
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isGroupsVisible, setIsGroupsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState(false);
  const [groupName, setGroupName] = useState(""); // Group name
  const [points, setPoints] = useState(0); // Points for the current user
  const [groups, setGroups] = useState([]); // Liste des groupes
const [modal, setModal] = useState(false);
const [badges, setBadges] = useState([]); // Tous les badges disponibles
const [userBadges, setUserBadges] = useState([]); // Badges débloqués par l'utilisateur

   const toggleModal = () => {
     setModal(!modal);
   };
  
   if(modal) {
     document.body.classList.add('active-modal')
   } else {
     document.body.classList.remove('active-modal')
   }
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
  const addFriendToGroup = async (groupId, friendId) => {
    try {
      const groupRef = ref(database, `groups/${groupId}`);
      const snapshot = await get(groupRef);
      if (snapshot.exists()) {
        const groupData = snapshot.val();
        if (!groupData.members.includes(friendId)) {
          const updatedMembers = [...groupData.members, friendId];
          await set(groupRef, { ...groupData, members: updatedMembers });
          window.alert("Friend added to group successfully!");
          fetchGroups(); // Recharger les groupes
        } else {
          window.alert("Friend is already in the group!");
        }
      }
    } catch (error) {
      console.error("Error adding friend to group:", error);
    }
  };
  
  // Fetch current user's friends and friend requests
  const fetchFriends = async () => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const { friends: friendIds = [], friendRequests: requestIds = [], points: userPoints = 0 } = userSnap.data();

        const friendsData = await Promise.all(
          friendIds.map(async (friendId) => {
            const friendDoc = await getDoc(doc(db, "users", friendId));
            return { id: friendId, ...friendDoc.data() };
          })
        );

        const requestsData = await Promise.all(
          requestIds.map(async (requestId) => {
            const requestDoc = await getDoc(doc(db, "users", requestId));
            return { id: requestId, ...requestDoc.data() };
          })
        );

        setFriends(friendsData);
        setFriendRequests(requestsData);
        setPoints(userPoints);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  // Send a friend request to another user
  const sendFriendRequest = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const { friendRequests = [] } = userSnap.data();
        if (!friendRequests.includes(currentUser.uid)) {
          await updateDoc(userRef, { friendRequests: [...friendRequests, currentUser.uid] });
          window.alert("Friend request sent!"); // Use window.alert to avoid scope issues
        } else {
          window.alert("Friend request already sent!");
        }
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  // Accept a friend request
  const acceptFriendRequest = async (requestId) => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const requestRef = doc(db, "users", requestId);
      const userSnap = await getDoc(userRef);
      const requestSnap = await getDoc(requestRef);

      if (userSnap.exists() && requestSnap.exists()) {
        const { friends: userFriends = [], friendRequests: userRequests = [] } = userSnap.data();
        const { friends: requestFriends = [] } = requestSnap.data();

        await updateDoc(userRef, {
          friends: [...userFriends, requestId],
          friendRequests: userRequests.filter((id) => id !== requestId),
        });

        await updateDoc(requestRef, {
          friends: [...requestFriends, currentUser.uid],
        });

        setFriends([...friends, { id: requestId, ...requestSnap.data() }]);
        setFriendRequests(friendRequests.filter((req) => req.id !== requestId));
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  // Remove a friend from the current user's Firestore document
  const removeFriend = async (friendId) => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const updatedFriends = friends.filter((friend) => friend.id !== friendId).map((friend) => friend.id);
      await updateDoc(userRef, { friends: updatedFriends });
      setFriends(friends.filter((friend) => friend.id !== friendId)); // Update local state
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  // Create a group with selected friends
  const createGroup = async () => {
    if (!groupName) {
      window.alert("Please enter a group name"); // Use window.alert to avoid scope issues
      return;
    }
      const groupRef = push(ref(database, 'groups'));
      await set(groupRef, {
        groupName: groupName,
        members: friends.map((friend) => friend.id).concat(currentUser.uid), // Include the current user in the group
      });
      window.alert("Group created successfully!"); // Use window.alert to avoid scope issues
      setGroupName("");
      setIsGroupsVisible(false);
      fetchGroups();

  };
  const fetchGroups = async () => {
    try {
      const groupsRef = ref(database, "groups");
      const snapshot = await get(groupsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const groupsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setGroups(groupsList);
      } else {
        setGroups([]); // Aucun groupe trouvé
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };
  
  // Increment points for completing a challenge
  const completeChallenge = async (pointsEarned) => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const currentPoints = userSnap.data().points || 0;
        const newPoints = currentPoints + pointsEarned;
        await updateDoc(userRef, { points: newPoints });
        setPoints(newPoints); // Update local state
        window.alert(`Challenge completed! You earned ${pointsEarned} points.`); // Use window.alert to avoid scope issues
      }
    } catch (error) {
      console.error("Error completing challenge:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFriends();
    fetchGroups();
    fetchBadges();
  }, []);

  const openForm = () => setIsFormVisible(true);
  const closeForm = () => setIsFormVisible(false);
  const openGroups = () => setIsGroupsVisible(true);
  const closeGroups = () => setIsGroupsVisible(false);
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
        window.alert(error.message); // Use window.alert to avoid scope issues
        setLoader(false);
      });
  };
  const fetchGroupMembers = async (group) => {
    try {
      const membersData = await Promise.all(
        group.members.map(async (memberId) => {
          const memberDoc = await getDoc(doc(db, "users", memberId));
          return { id: memberId, ...memberDoc.data() };
        })
      );
      // Trier les membres par points décroissants
      const sortedMembers = membersData.sort((a, b) => (b.points || 0) - (a.points || 0));
      setSelectedGroupMembers(sortedMembers);
      setSelectedGroupName(group.groupName);
      toggleModal();
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
  };
  
  const fetchBadges = async () => {
    try {
      // Récupérer tous les badges disponibles
      const badgesSnapshot = await getDocs(collection(db, "badges"));
      const allBadges = badgesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBadges(allBadges);
  
      // Récupérer les badges débloqués par l'utilisateur
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const { earnedBadges = [] } = userSnap.data();
        setUserBadges(earnedBadges);
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
    }
  };
  
  const checkAndAwardBadges = async (criteriaKey, criteriaValue) => {
    try {
      // Vérifiez si l'utilisateur remplit les conditions pour un badge
      const earnedBadgeIds = userBadges.map((badge) => badge.id);
  
      const newBadges = badges.filter((badge) => {
        const criteria = badge.criteria[criteriaKey];
        return criteria && criteriaValue >= criteria && !earnedBadgeIds.includes(badge.id);
      });
  
      if (newBadges.length > 0) {
        const userRef = doc(db, "users", currentUser.uid);
        const updatedBadges = [...userBadges, ...newBadges.map((badge) => ({ id: badge.id, ...badge }))];
        await updateDoc(userRef, { earnedBadges: updatedBadges });
  
        setUserBadges(updatedBadges); // Mettre à jour l'état local
        newBadges.forEach((badge) => window.alert(`Badge unlocked: ${badge.name}!`));
      }
    } catch (error) {
      console.error("Error checking badges:", error);
    }
  };
  const addChallengeToGroup = async (groupId, challengeName) => {
    try {
      const groupRef = ref(database, `groups/${groupId}`);
      const snapshot = await get(groupRef);
      if (snapshot.exists()) {
        const groupData = snapshot.val();
        const updatedChallenges = [...(groupData.challenges || []), { name: challengeName }];
        await set(groupRef, { ...groupData, challenges: updatedChallenges });
        window.alert("Challenge added to group!");
        fetchGroups(); // Recharger les groupes
      }
    } catch (error) {
      console.error("Error adding challenge to group:", error);
    }
  };
  
  return (
    <div className="page d-flex">
    {/* Sidebar */}
    <div className="sidebar bg-white p-20 p-relative">
      <h3 className="p-relative txt-c mt-0">habit-up</h3>
      <ul>
        <li>
          <Link to="/dashboard" className="d-flex align-center fs-14 c-black rad-6 p-10">
            <img src={photo} style={{ width: "24px" }} alt="Dashboard Icon" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/setting" className="d-flex align-center fs-14 c-black rad-6 p-10">
            <img src={setting} style={{ width: "24px" }} alt="Settings Icon" />
            <span>Setting</span>
          </Link>
        </li>
        <li>
          <Link to="/yourhabits" className="d-flex align-center fs-14 c-black rad-6 p-10">
            <img src={change} style={{ width: "24px" }} alt="Habit Icon" />
            <span>Habit</span>
          </Link>
        </li>
        <li>
          <Link to="/challenges" className="d-flex align-center fs-14 c-black rad-6 p-10">
            <img src={multipe} style={{ width: "24px" }} alt="Challenge Icon" />
            <span>Challenge</span>
          </Link>
        </li>
        <li>
          <Link to="/friends" className="d-flex align-center fs-14 c-black rad-6 p-10">
            <img src={friend} style={{ width: "24px" }} alt="Friends Icon" />
            <span>Friends</span>
          </Link>
        </li>
      </ul>
    </div>
      <div className="content w-full">
        <h1 className="p-relative">Friends</h1>
        <p className="mt-0" style={{ margin: "5px" }}>Find your friends and add them to your friend list!</p>
        <div className="wrapper d-grid gap-20">
          <div className="tasks p-20 bg-white rad-10">
            <h2 className="mt-0 mb-20">Add Friends</h2>
            <div className="d-flex p-20 mt-20 mb-20  c-white block-mobile">
              <ul>
                {users.map((filteredUser) => (
                  <li key={filteredUser.id} className="user-item d-flex align-center">
                    <span style={{ margin: "10px",color:"black" }}>{filteredUser.name}</span>
                    <button
                      className="btn bg-blue c-white ml-10"
                      onClick={() => sendFriendRequest(filteredUser.id)}
                      style={{ margin: "5px"  }}
                    >
                      Add Friend
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="tasks p-20 bg-white rad-10">
            <h2 className="mt-0 mb-20">Pending Friend Requests</h2>
            <div className="d-flex p-20 mt-20 mb-20 c-black block-mobile">
              <ul>
                {friendRequests.map((request) => (
                  <li key={request.id} className="user-item d-flex align-center">
                    <span style={{ margin: "10px",color:"black"}}>{request.name}</span>
                    <button
                      className="btn bg-blue c-white ml-10"
                      onClick={() => acceptFriendRequest(request.id)}
                      style={{ margin: "5px" }}
                    >
                      Accept
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="tasks p-20 bg-white rad-10">
            <h2 className="mt-0 mb-20">Your Friends</h2>
            <div className="d-flex p-20 mt-20 mb-20 c-white block-mobile">
              <ul>
                {friends.map((friend) => (
                  <li key={friend.id} className="user-item d-flex align-center">
                    <span style={{ margin: "10px",color:"black" }}>{friend.name}</span>
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
          <div className="tasks p-20 bg-white rad-10">
  <h2 className="mt-0 mb-20">Create Group</h2>
 
  {/* Liste des groupes */}
  <ul className="groups-list">
    {groups.map((group) => (
      <li key={group.id} className="group-item d-flex align-center">
        <span style={{ margin: "10px", color: "black" }}>{group.groupName}</span>
        <button
  className="btn bg-blue c-white"
  onClick={() => fetchGroupMembers(group)}
  style={{ margin: "5px" }}
>
  +
</button>

      </li>
    ))}
  </ul>

  {/* Section pour créer un groupe */}
  <div className="d-flex p-20 mt-20 mb-20 c-white block-mobile">
    <button
      className="btn bg-blue c-white"
      onClick={openGroups}
      style={{ margin: "5px" }}
    >
      Create Group
    </button>

    {isGroupsVisible && (
      <>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          style={{ margin: "5px" }}
        />
        <button
          className="btn bg-blue c-white"
          onClick={createGroup}
          style={{ margin: "5px" }}
        >
          Create
        </button>
        <button
          className="btn bg-red c-white"
          onClick={closeGroups}
          style={{ margin: "5px" }}
        >
          Close
        </button>
      </>
    )}
  </div>
</div>

          <div className="tasks p-20 bg-white rad-10">
            <h2 className="mt-0 mb-20">Your Points</h2>
            <div className="d-flex p-20 mt-20 mb-20  c-white block-mobile">
              <span style={{ margin: "10px",color:"black" }}>Points: {points}</span>
              <button
                className="btn bg-blue c-white ml-10"
                onClick={() => completeChallenge(10)}
                style={{ margin: "5px" }}
              >
                Complete Challenge (Earn 10 Points)
              </button>
            </div>
          </div>
    
      {modal && (
  <div className="modal">
    <div className="modal-header">
      <h2>Group: {selectedGroupName}</h2>
      <button onClick={toggleModal}>&times;</button>
    </div>
    <div className="modal-body">
      <ul>
        {selectedGroupMembers.map((member, index) => (
          <li key={member.id} className="user-item d-flex align-center">
            <span style={{ margin: "10px", color: "black" }}>
              {index + 1}. {member.name} - {member.points || 0} points
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}
<div className="tasks p-20 bg-white rad-10">
  <h2 className="mt-0 mb-20">Your Badges</h2>
  <div className="d-flex p-20 mt-20 mb-20 c-white block-mobile">
    {userBadges.length > 0 ? (
      userBadges.map((badge) => (
        <div key={badge.id} className="badge-item">
          <img src={`path/to/icons/${badge.icon}`} alt={badge.name} style={{ width: "50px" }} />
          <span style={{ margin: "10px", color: "black" }}>{badge.name}</span>
        </div>
      ))
    ) : (
      <span style={{ color: "black" }}>No badges earned yet.</span>
    )}
  </div>
</div>
</div>
    </div>
    </div>
  );
}
