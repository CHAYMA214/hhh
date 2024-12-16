import React, { useState, useEffect } from "react";
import "./framework.css";
import "./master.css";
import photo from "./profile-user.png";
import change from "./cigarette.png";
import setting from "./settings.png";
import multipe from "./multiple-users-silhouette.png";
import friend from "./friends.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../fireba/firebase";

export default function Habit() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [myhabit, setMyHabit] = useState([]);
  const [newMyHabit, setNewMyHabit] = useState({ habit: "", goal: "", reminder: "" });
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  const openForm = () => {
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
  };

  useEffect(() => {
    if (!currentUser) return;

    async function loadMyHabitData() {
      try {
        const habitSources = ["myhabit", "challenge", "habit"];
        const habitPromises = habitSources.map(async (source) => {
          const docRef = doc(db, source, currentUser.uid);
          const docSnap = await getDoc(docRef);
          return docSnap.exists() ? docSnap.data().habit || [] : [];
        });

        const allHabits = await Promise.all(habitPromises);
        const mergedHabits = allHabits.flat();
        setMyHabit(mergedHabits);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data.");
      }
    }

    loadMyHabitData();
  }, [currentUser]);

  const handleAddHabit = async () => {
    if (!newMyHabit.habit || !newMyHabit.goal || !newMyHabit.reminder) {
      alert("Please fill in all fields.");
      return;
    }
    const updatedMyHabits = [
      ...myhabit,
      {
        id: myhabit.length + 1,
        habit: newMyHabit.habit,
        goal: newMyHabit.goal,
        reminder: newMyHabit.reminder,
        done: false,
      },
    ];

    try {
      const myHabitRef = doc(db, "myhabit", currentUser.uid);
      await setDoc(myHabitRef, { habit: updatedMyHabits });
      setMyHabit(updatedMyHabits);
      setNewMyHabit({ habit: "", goal: "", reminder: "" });
      closeForm();
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  };

  const handleMyHabitAsDone = async (habitId) => {
    const updatedMyHabits = myhabit.map((habit) =>
      habit.id === habitId ? { ...habit, done: !habit.done } : habit
    );

    try {
      const myHabitRef = doc(db, "myhabit", currentUser.uid);
      await updateDoc(myHabitRef, { habit: updatedMyHabits });
      setMyHabit(updatedMyHabits);
    } catch (error) {
      console.error("Error updating habit:", error);
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
        <h1 className="p-relative">My habits</h1>

        {isFormVisible && (
          <div className="add-habit-form bg-white p-20 rad-6 m-20">
            <h3>Add a New Habit</h3>
            <input
              type="text"
              placeholder="Habit"
              value={newMyHabit.habit}
              onChange={(e) => setNewMyHabit({ ...newMyHabit, habit: e.target.value })}
              className="d-block mb-10 w-full"
            />
            <div className="labels" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label htmlFor="goal" style={{ color: "black" }}>Goal:</label>
              <input
                className="input-form"
                type="number"
                id="goal"
                min="1"
                value={newMyHabit.goal}
                onChange={(e) => setNewMyHabit({ ...newMyHabit, goal: e.target.value })}
                required
              />
              <select
                id="goalType"
                style={{ color: "black" }}
                onChange={(e) => setNewMyHabit({ ...newMyHabit, goalType: e.target.value })}
              >
                <option value="times">Times</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
              <select
                id="goalFrequency"
                style={{ color: "black" }}
                onChange={(e) => setNewMyHabit({ ...newMyHabit, goalFrequency: e.target.value })}
              >
                <option value="day">Per Day</option>
                <option value="week">Per Week</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Reminder"
              value={newMyHabit.reminder}
              onChange={(e) => setNewMyHabit({ ...newMyHabit, reminder: e.target.value })}
              className="d-block mb-10 w-full"
              style={{ margin: "5px" }}
            />

            <button className="btn bg-blue c-white" onClick={handleAddHabit}>
              Add Habit
            </button>
            <button className="btn bg-blue c-white" onClick={closeForm} style={{ margin: '5px' }}>
              Close
            </button>
          </div>
        )}

        <div className="wrapper d-grid gap-20">
          <div className="tasks p-20 bg-white rad-10">
            <h2 className="m-0">Current Habits</h2>
            <div id="habitsContainer">
              {myhabit.filter((habit) => !habit.done).map((habit) => (
                <div key={habit.id} className="habit-box">
                  <span>{habit.habit || habit.action || habit.title}</span>
                  <button onClick={() => handleMyHabitAsDone(habit.id)}>Mark as Done</button>
                </div>
              ))}
            </div>
          </div>
          <div className="tasks p-20 bg-white rad-10">
            <h2 className="m-0">Completed Habits</h2>
            <div id="completedHabits">
              {myhabit.filter((habit) => habit.done).map((habit) => (
                <div key={habit.id} className="habit-box">
                  <span>{habit.habit || habit.action || habit.title}</span>
                  <button onClick={() => handleMyHabitAsDone(habit.id)}>Mark as Undone</button>
                </div>
              ))}
            </div>
            </div>
        </div>

        <button className="btn bg-blue c-white" onClick={openForm} style={{ position: 'absolute', top: '20px', right: '20px' }}>
          +
        </button>
      </div>
    </div>
  );
}
