import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../fireba/firebase";
import "./framework.css";
import "./master.css";
import "./style1.css";
import "./dashbord.css";
import profile from "./avatar.png";
import welcome from "./welcome.png";
import photo from "./profile-user.png";
import change from "./cigarette.png";
import setting from "./settings.png";
import friend from "./friends.png";
import multipe from "./multiple-users-silhouette.png";
import check from "./check.png";
import trash from "./trash-can.png";
const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [quickNotes, setQuickNotes] = useState([]);
  const [userData, setUserData] = useState({ name: "", age: "", country: "" });
  const [newTask, setNewTask] = useState({ title: "", remarque: "" });
  const [newQuickNote, setNewQuickNote] = useState({ title: "", text: "" });
  const [month, setMonth] = useState([]);
  const [newMonth, setNewMonth] = useState({ target: "" });
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    async function loadUserData() {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const tasksRef = doc(db, "tasks", currentUser.uid);
        const quickRef = doc(db, "quick", currentUser.uid);
        const monthRef = doc(db, "month", currentUser.uid);

        const [userSnap, tasksSnap, quickSnap, monthSnap] = await Promise.all([
          getDoc(userRef),
          getDoc(tasksRef),
          getDoc(quickRef),
          getDoc(monthRef),
        ]);

        if (userSnap.exists()) setUserData(userSnap.data());
        if (tasksSnap.exists()) setTasks(tasksSnap.data().tasks || []);
        if (quickSnap.exists()) setQuickNotes(quickSnap.data().quickNotes || []);
        if (monthSnap.exists()) setMonth(monthSnap.data().month || []);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data.");
      }
    }

    loadUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.remarque) {
      alert("Please fill in all fields.");
      return;
    }

    const updatedTasks = [
      ...tasks,
      { id: tasks.length + 1, title: newTask.title, remarque: newTask.remarque, done: false },
    ];

    try {
      const tasksRef = doc(db, "tasks", currentUser.uid);
      await setDoc(tasksRef, { tasks: updatedTasks });
      setTasks(updatedTasks);
      setNewTask({ title: "", remarque: "" });
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleAddQuickNote = async () => {
    if (!newQuickNote.title || !newQuickNote.text) {
      alert("Please fill in all fields.");
      return;
    }

    const updatedQuickNotes = [
      ...quickNotes,
      { id: quickNotes.length + 1, title: newQuickNote.title, text: newQuickNote.text },
    ];

    try {
      const quickRef = doc(db, "quick", currentUser.uid);
      await setDoc(quickRef, { quickNotes: updatedQuickNotes });
      setQuickNotes(updatedQuickNotes);
      setNewQuickNote({ title: "", text: "" });
    } catch (error) {
      console.error("Error saving quick note:", error);
    }
  };

  const handleMarkAsDone = async (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, done: !task.done } : task
    );

    try {
      const tasksRef = doc(db, "tasks", currentUser.uid);
      await updateDoc(tasksRef, { tasks: updatedTasks });
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleAddMonth = async () => {
    if (!newMonth.target) {
      alert("Please fill in all fields.");
      return;
    }

    const updatedMonth = [
      ...month,
      { id: month.length + 1, target: newMonth.target, done: false },
    ];

    try {
      const monthRef = doc(db, "month", currentUser.uid);
      await setDoc(monthRef, { month: updatedMonth });
      setMonth(updatedMonth);
      setNewMonth({ target: "" });
    } catch (error) {
      console.error("Error saving month:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);

    try {
      const tasksRef = doc(db, "tasks", currentUser.uid);
      await updateDoc(tasksRef, { tasks: updatedTasks });
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const handleDeleteMonth = async (monthId) => {
    const updatedMonth = month.filter((mounth) => mounth.id !== monthId);
    setMonth(updatedMonth);

    try {
      const monthRef = doc(db, "month", currentUser.uid);
      await updateDoc(monthRef, { month: updatedMonth });
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setError("Une erreur s'est produite lors de la suppression.");
    }
  };


  const handleDeleteNote = async (noteId) => {
    const updatedQuickNotes = quickNotes.filter((note) => note.id !== noteId);

    try {
      const quickRef = doc(db, "quick", currentUser.uid);
      await updateDoc(quickRef, { quickNotes: updatedQuickNotes });
      setQuickNotes(updatedQuickNotes);
    } catch (error) {
      console.error("Error deleting note:", error);
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

      {/* Content */}
      <div className="content w-full">
        <div className="head bg-white p-15 between-flex">
          <div className="icons d-flex align-center">
            <img
              src={profile}
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
              alt="Logout Icon"
            />
            <h6 style={{ marginLeft: "10px" }}>Logout</h6>
          </div>
        </div>
        <h1 className="p-relative">Profile</h1>
        <div className="wrapper d-grid gap-20">
          {/* User Info */}
          <div className="welcome bg-white rad-10 txt-c-mobile block-mobile">
            <div className="intro p-20 d-flex space-between bg-eee">
              <h2 className="m-0">Welcome</h2>
              <img className="hide-mobile" src={welcome} alt="Welcome" />
            </div>
            <img src={profile} alt="Profile Avatar" className="avatar" />
            <div className="body txt-c d-flex p-20 mt-20 mb-20 block-mobile">
              <div>
                {userData.name}
                <span className="d-block c-grey fs-14 mt-10">Name</span>
              </div>
              <div>
                {userData.age}
                <span className="d-block c-grey fs-14 mt-10">Age</span>
              </div>
              <div>
                {userData.country}
                <span className="d-block c-grey fs-14 mt-10">Country</span>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="tasks p-20 bg-white rad-10">
            <h2 className="mt-0 mb-20">Today Tasks</h2>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="d-block mb-10 w-full"
            />
            <input
              type="text"
              placeholder="Task Remark"
              value={newTask.remarque}
              onChange={(e) => setNewTask({ ...newTask, remarque: e.target.value })}
              className="d-block mb-10 w-full"
            />
            <button onClick={handleAddTask} className="btn bg-blue c-white">
              Add Task
            </button>
            <div>
              {tasks.map((task) => (
                <div key={task.id} className={`task-row ${task.done ? "done" : ""}`}>
                  <div className="info">
                    <h3 className="fs-15">{task.title}</h3>
                    <p>{task.remarque}</p>
                  </div>
                  <img
                    src={check}
                    alt="Mark as done"
                    onClick={() => handleMarkAsDone(task.id)}
                    style={{ width: "24px", cursor: "pointer" }}
                  />
                  <img
                    src={trash}
                    alt="Delete task"
                    onClick={() => handleDeleteTask(task.id)}
                    style={{ width: "24px", cursor: "pointer" }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="quick-notes p-20 bg-white rad-10">
            <h2 className="mt-0 mb-20">Quick Notes</h2>
            <input
              type="text"
              placeholder="Note Title"
              value={newQuickNote.title}
              onChange={(e) => setNewQuickNote({ ...newQuickNote, title: e.target.value })}
              className="d-block mb-10 w-full"
            />
            <textarea
              placeholder="Note Content"
              value={newQuickNote.text}
              onChange={(e) => setNewQuickNote({ ...newQuickNote, text: e.target.value })}
              className="d-block mb-10 w-full"
            />
            <button onClick={handleAddQuickNote} className="btn bg-blue c-white">
              Add Note
            </button>
            <div>
              {quickNotes.map((note) => (
                <div key={note.id} className="quick-note">
                  <h3 className="fs-15">{note.title}</h3>
                  <p>{note.text}</p>
                  <img
                    src={trash}
                    alt="Delete quick"
                    onClick={() =>  handleDeleteNote(note.id)}
                    style={{ width: "24px", cursor: "pointer" }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="quick-draft p-20 bg-white rad-10">
      <h2>Monthly Targets List</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="input-section">
        <input
          type="text"
          placeholder="📑 Add your new monthly target here.."
          className="input w-full max-w-xs"
          value={newMonth.target}
          onChange={(e) => setNewMonth({ target: e.target.value })}
        />
        <button onClick={handleAddMonth} className="btn btn-add">
        ADD
        </button>
      </div>

      <ul className="todos-list">
        {month.map((mounth) => (
          <li key={mounth.id} className={`todo-item ${mounth.done ? "done" : ""}`}>
            <span>{mounth.target}</span>
            <button onClick={() => handleDeleteMonth(mounth.id)} className="btn btn-delete">
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      <div className="summary">
        <p>
          Objectifs terminés :{" "}
          <span>
            {month.filter((goal) => goal.done).length} / {month.length}
          </span>
        </p>
      </div>
    </div>
  </div>
  </div>
</div>  
  );
};
export default Dashboard;