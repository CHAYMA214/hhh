import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../fireba/firebase";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./framework.css";
import "./master.css";
import photo from "./profile-user.png";
import change from "./cigarette.png";
import setting from "./settings.png";
import multipe from "./multiple-users-silhouette.png";
import friend from "./friends.png";
ChartJS.register(ArcElement, Tooltip, Legend);
export default function Habit() {
   const [modal, setModal] = useState(false);
  
   const toggleModal = () => {
     setModal(!modal);
   };
  
   if(modal) {
     document.body.classList.add('active-modal')
   } else {
     document.body.classList.remove('active-modal')
   }
  
  const [newHabit, setNewHabit] = useState({
    habit: "",
    goal: 0,
    reminder: "",
    goalType: "times",
    goalFrequency: "day",
  });
  const [habits, setHabits] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [myhabits, setmyHabits] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Pour stocker le habit ou le challenge sélectionné
  const [selectedType, setSelectedType] = useState(""); // Pour identifier si c'est un habit ou un challenge
  const handleShowDetails = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
    toggleModal();
  };
  
  useEffect(() => {
    if (!currentUser) return;

    async function loadUserData() {
      try {
        // Récupérer les habitudes
        const habitsRef = doc(db, "myhabits", currentUser.uid);
        const habitsSnap = await getDoc(habitsRef);

        let updatedHabits = [];
        if (habitsSnap.exists()) {
          updatedHabits = habitsSnap.data().habits || [];
        }

        // Récupérer les challenges
        const challengeRef = doc(db, "challenge", currentUser.uid);
        const challengeSnap = await getDoc(challengeRef);
        let updatedChallenges = [];
        if (challengeSnap.exists()) {
          updatedChallenges = challengeSnap.data().challenges || [];
        }
        const myhabitRef = doc(db, "habit", currentUser.uid);
        const myhabitSnap = await getDoc(myhabitRef);
        let updatedmyhabit = [];
        if (myhabitSnap.exists()) {
          updatedmyhabit =myhabitSnap.data().habits|| [];
        }

        setmyHabits(updatedmyhabit);
        setChallenges(updatedChallenges);
        setHabits(updatedHabits);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data.");
      }
    }

    loadUserData();
  }, [currentUser]);

  const openForm = () => setIsFormVisible(true);
  const closeForm = () => setIsFormVisible(false);

  const handleAddHabit = async () => {
    if (!newHabit.habit.trim()) {
      alert("Habit name cannot be empty.");
      return;
  }
  if (Number(newHabit.goal) <= 0) {
      alert("Goal must be a positive number.");
      return;
  }
    if (!newHabit.habit || !newHabit.goal || !newHabit.reminder) {
      alert("Please fill in all fields.");
      return;
    }

    const newHabitEntry = {
      id: Date.now(),
      ...newHabit,
      done: false,
      progress: 0, // Initialisation
    };
    

    const updatedHabits = [...habits, newHabitEntry];

    try {
      const habitsRef = doc(db, "myhabits", currentUser.uid);
      await setDoc(habitsRef, { habits: updatedHabits });
      setHabits(updatedHabits);
      setNewHabit({ habit: "", goal: 0, reminder: "", goalType: "times", goalFrequency: "day" });
      closeForm();
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  };

  const toggleHabitDone = async (habitId) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === habitId ? { ...habit, done: !habit.done } : habit
    );

    try {
      const habitsRef = doc(db, "myhabits", currentUser.uid);
      await updateDoc(habitsRef, { habits: updatedHabits });
      setHabits(updatedHabits);
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  const toggleChallengeDone = async (challengeId) => {
    const updatedChallenges = challenges.map((challenge) =>
      challenge.id === challengeId ? { ...challenge, done: !challenge.done } : challenge
    );

    try {
      const challengeRef = doc(db, "challenge", currentUser.uid);
      await updateDoc(challengeRef, { challenges: updatedChallenges });
      setChallenges(updatedChallenges);
    } catch (error) {
      console.error("Error updating challenge:", error);
    }
  };

  const togglemyHabitDone = async (habitId) => {
    const updatedmyHabits =myhabits.map((habit) =>
      habit.id === habitId ? { ...habit, done: !habit.done } : habit
    );

    try {
      const habitsRef = doc(db, "habit", currentUser.uid);
      await updateDoc(habitsRef, { habits: updatedmyHabits });
      setmyHabits(updatedmyHabits);
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };
  const pieData = (data) => ({
    labels: ["Completed", "In Progress"],
    datasets: [
        {
            data: [
                data.filter((item) => item.done).length,
                data.filter((item) => !item.done).length,
            ],
            backgroundColor: ["#36A2EB", "#FF6384"],
        },
    ],
});
const pieDataa = (data1,data2) => ({
  labels: ["Completed", "In Progress"],
  datasets: [
      {
          data: [
              data1.filter((item) => item.done).length,
              data1.filter((item) => !item.done).length,
              data2.filter((item) => item.done).length,
              data2.filter((item) => !item.done).length,
          ],
          backgroundColor: ["#36A2EB", "#FF6384"],
      },
  ],
});
const handleIncrementProgressGeneric = async (item, collectionName, fieldName) => {
  try {
    const docRef = doc(db, collectionName, currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const updatedItems = (data[fieldName] || []).map((element) => {
        if (element.id === item.id) {
          const currentProgress = element.progress || 0;
          const updatedProgress = Math.min(currentProgress + 1, element.goal); // Ensure progress doesn't exceed the goal

          return {
            ...element,
            progress: updatedProgress,
            done: updatedProgress === parseInt(element.goal), // Mark as done if progress equals goal
          };
        }
        return element;
      });

      await updateDoc(docRef, { [fieldName]: updatedItems }); // Correctly use fieldName here

      // Update local state
      if (collectionName === "habit") setmyHabits(updatedItems);
      if (collectionName === "challenge") setChallenges(updatedItems);
      if (collectionName === "myhabits") setHabits(updatedItems);
    }
  } catch (error) {
    console.error("Error incrementing progress:", error);
  }
};




  return (
    <div className="page d-flex">
      <div className="sidebar bg-white p-20 p-relative">
        <h3 className="p-relative txt-c mt-0">habit-up</h3>
        <ul>
          <li>
            <Link to="/dashboard" className="d-flex align-center fs-14 c-black rad-6 p-10">
              <img src={photo} style={{ width: "24px" }} alt="Dashboard" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/setting" className="d-flex align-center fs-14 c-black rad-6 p-10">
              <img src={setting} style={{ width: "24px" }} alt="Setting" />
              <span>Setting</span>
            </Link>
          </li>
          <li>
            <Link to="/yourhabits" className="d-flex align-center fs-14 c-black rad-6 p-10">
              <img src={change} style={{ width: "24px" }} alt="Habit" />
              <span>Habit</span>
            </Link>
          </li>
          <li>
            <Link to="/challenges" className="d-flex align-center fs-14 c-black rad-6 p-10">
              <img src={multipe} style={{ width: "24px" }} alt="Challenge" />
              <span>Challenge</span>
            </Link>
          </li>
          <li>
            <Link to="/friends" className="d-flex align-center fs-14 c-black rad-6 p-10">
              <img src={friend} style={{ width: "24px" }} alt="Friends" />
              <span>Friends</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="content w-full">
        <h1 className="p-relative">My Habits</h1>

        {isFormVisible && (
          <div className="add-habit-form bg-white p-20 rad-6 m-20">
            <h3>Add a New Habit</h3>
            <input
              type="text"
              placeholder="Habit"
              value={newHabit.habit}
              onChange={(e) => setNewHabit({ ...newHabit, habit: e.target.value })}
              className="d-block mb-10 w-full"
            />
            <div className="labels" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label htmlFor="goal" style={{ color: "black" }}>Goal:</label>
              <input
                className="input-form"
                type="number"
                id="goal"
                min="1"
                value={newHabit.goal}
                onChange={(e) => setNewHabit({ ...newHabit, goal: e.target.value })}
                required
              />
              <select
                id="goalType"
                style={{ color: "black" }}
                value={newHabit.goalType}
                onChange={(e) => setNewHabit({ ...newHabit, goalType: e.target.value })}
              >
                <option value="times">Times</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
              <select
                id="goalFrequency"
                style={{ color: "black" }}
                value={newHabit.goalFrequency}
                onChange={(e) => setNewHabit({ ...newHabit, goalFrequency: e.target.value })}
              >
                <option value="day">Per Day</option>
                <option value="week">Per Week</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Reminder"
              value={newHabit.reminder}
              onChange={(e) => setNewHabit({ ...newHabit, reminder: e.target.value })}
              className="d-block mb-10 w-full"
            />

            <button className="btn bg-blue c-white" onClick={handleAddHabit}>
              Add Habit
            </button>
            <button className="btn bg-blue c-white" onClick={closeForm} style={{ margin: "5px" }}>
              Close
            </button>
          </div>
        )}

        <div className="wrapper d-grid gap-20">
          <div className="tasks p-20 bg-white rad-10">
            <h2 className="m-0">Current Habits</h2>
            <div id="habitsContainer">
              {myhabits.filter((habit) => !habit.done).map((habit) => (
                <div key={habit.id}>
                <span>{habit.action}</span>
                <button onClick={() => handleShowDetails(habit, "habit")}>Details</button>
                <button onClick={() => handleIncrementProgressGeneric(habit, "habit", "habits")}>+1</button>
                <button onClick={() => togglemyHabitDone(habit.id)}>Mark as Done</button>
              </div>
              ))}
              {challenges.filter((challenge) => !challenge.done).map((challenge) => (
                <div key={challenge.id}>
                <span>{challenge.title}</span>
                <button onClick={() => handleShowDetails(challenge, "challenge")}>
                  Details
                </button>
                <button onClick={() => toggleChallengeDone(challenge.id)}>Mark as Done</button>
                <button onClick={() => handleIncrementProgressGeneric(challenge, "challenge", "challenges")
}>
                  +1
                </button>
              </div>
              
              ))} 
              {habits.filter((habit) => !habit.done).map((habit) => (
                <div key={habit.id} className="habit-box">
                  <span>{habit.habit}</span>
                  <button onClick={() => handleShowDetails(habit, "myhabits")}>
                  Details
                </button>
                <button onClick={() => toggleHabitDone(habit.id)}>Mark as Done</button>
                <button onClick={() =>handleIncrementProgressGeneric(habit, "myhabits", "habits")
}>
                  +1
                </button>
                  </div>
                
              ))}
            </div>
          </div>

          <div className="tasks p-20 bg-white rad-10">
            <h2 className="m-0">Completed Habits</h2>
            <div id="completedHabits">
               {myhabits.filter((habit) => habit.done).map((habit) => (
    <div key={habit.id} className="habit-box">
      <span>{habit.action}</span>
     
      <button onClick={() => togglemyHabitDone(habit.id)}>Mark as Undone</button>
      <button onClick={() => handleShowDetails(habit, "habit")}>Details</button>
    </div>
  ))}
              {challenges.filter((challenge) => challenge.done).map((challenge) => (
                <div key={challenge.id} className="habit-box">
                  <span>{challenge.title}</span>
                  <button onClick={() => toggleChallengeDone(challenge.id)}>Mark as Undone</button>
                  <button onClick={() => handleShowDetails(challenge, "challenge")}>Details</button>
                  
                 
                </div>
              ))}
               {habits.filter((habit) => habit.done).map((habit) => (
                <div key={habit.id} className="habit-box">
                  <span>{habit.habit}</span>
                  <button onClick={() => toggleHabitDone(habit.id)}>Mark as Undone</button>
                  <button onClick={() => handleShowDetails(habit, "myhabit")}>Details</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className="btn bg-blue c-white"
          onClick={openForm}
          style={{ position: "absolute", top: "20px", right: "20px" }}
        >
          +
        </button>
        <div className="wrapper d-grid gap-20">
          {/* Graphique pour les habitudes */}
          <div className="tasks p-20 bg-white rad-10">
            <h2>Habits Overview</h2>
            <Pie data={pieData(habits)} />
          </div>

          {/* Graphique pour les challenges */}
          <div className="tasks p-20 bg-white rad-10">
            <h2>Challenges Overview</h2>
            <Pie data={pieDataa(challenges,myhabits)} />

          </div>
        </div>
      </div>
     
      {modal && selectedItem && (
          <div className="modal">
            <div className="modal-header">
              <h3>{selectedType === "habit" ? "Habit Details" : "Challenge Details"}</h3>
              <button onClick={toggleModal}>&times;</button>
            </div>
            <div className="modal-body">
              <h4>{selectedItem.habit || selectedItem.title}</h4>
              <Pie
                data={{
                  labels: ["Completed", "Remaining"],
                  datasets: [
                    {
                      data: [
                        selectedItem.progress,
                        selectedItem.goal - selectedItem.progress,
                      ],
                      backgroundColor: ["#36A2EB", "#FF6384"],
                    },
                  ],
                }}
              />
              <p>
                Goal: {selectedItem.goal} {selectedItem.goalType} per {selectedItem.goalFrequency}
              </p>
              <p>Progress: {selectedItem.progress}</p>
            </div>
          </div>
        )}
      </div>
       
  
  
  );
}
