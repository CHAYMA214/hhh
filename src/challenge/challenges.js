import React, { useState, useEffect } from "react";
import "./framework.css";
import "./master.css";
import photo from "./profile-user.png";
import change from "./cigarette.png";
import setting from "./settings.png";
import multipe from "./multiple-users-silhouette.png";
import friend from "./friends.png";
import team1 from "./team-01.png";
import team2 from "./team-02.png";
import team3 from "./team-03.png";
import team4 from "./team-04.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../fireba/firebase";
export default function Challenge() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isChallengeVisible, setIsChallengeVisible] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [ismainChallengeVisible, setIsmainChallengeVisible] = useState(false);
  const [selectedmainChallengeId, setSelectedmainChallengeId] = useState(null);
  const { currentUser } = useAuth();
  const [newChallenge, setNewChallenge] = useState({title: "", date: "",description: "", progress: 0,action: "",goal:0,});
  const [challenges, setChallenges] = useState([]);
  const [habits, sethabits] = useState([]);
  const handleDeletechallenge = async (challengeId) => {
    const updatedChallenges = challenges.filter((challenge) => challenge.id !== challengeId);

    try {
      const challengesRef = doc(db, "challenge", currentUser.uid);
      await updateDoc(challengesRef, {challenges: updatedChallenges });
      setChallenges(updatedChallenges);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const openForm = (formId) => {
    setIsFormVisible(true);
    setSelectedFormId(formId);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setSelectedFormId(null);
  };

  const openChallenge = (challengeId) => {
    setIsChallengeVisible(true);
    setSelectedChallengeId(challengeId);
  };

  const closemainChallenge = () => {
    setIsmainChallengeVisible(false);
    setSelectedmainChallengeId(null);
  };
  const openmainChallenge = (challengeId) => {
    setIsmainChallengeVisible(true);
    setSelectedmainChallengeId(challengeId);
  };

  const closeChallenge = () => {
    setIsChallengeVisible(false);
    setSelectedChallengeId(null);
  };
 
  const mainchallenge=[{
    id: 1,
    title: "Elzero Dashboard",
    date: "15/10/2021",
    description: "Elzero Dashboard Project Design And Programming And Hosting",
    action: "Learn new Language",
    team: [team1, team2, team3, team4, team4], 
    goal:3,
  },
  {
    id:2,
    title: "Academy Portal",
    date: "15/6/2022",
    description: "Academy Portal Project Design And Programming",
    action: "Go to Gym",
    team: [team3, team1, team4],
    goal:3,
  },
  {
    id: 3,
    title: "Chatting Application",
    date: "15/6/2022",
    description: "Chatting Application Project Design",
    action: "Learn Design",
    team: [team3, team2, team4],
    goal:3,
  },
  {
    id: 4,
    title: "Ahmed Dashboard",
    date: "15/6/2022",
    description: "Ahmed Dashboard Project Design And Programming And Hosting",
    action: "Stop smoking",
    team: [team1, team2, team3, team4],
    goal:3,
  },
  {
    id: 5,
    title: "Ahmed Portal",
    date: "15/6/2022",
    description: "Ahmed Portal Project Design And Programming",
    action: "Play football",
    team: [team3, team4, team1],
    goal:3,
  }]


  const loadUserData = async () => {
    try {
     const challengeRef = doc(db, "challenge", currentUser.uid);
      const challengeSnap = await getDoc(challengeRef);

      if (challengeSnap.exists()) {
        setChallenges(challengeSnap.data().challenges || []);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [currentUser]);
  const handleAddChallenge = async () => {
    if (
      !newChallenge.title ||
      !newChallenge.description ||
      !newChallenge.action||
      !newChallenge.goal
    ) {
      alert("Please fill all fields.");
      return;
    }

    const updatedChallenges = [
      ...challenges,
      {
        id: challenges.length + 1,
        ...newChallenge,
        team: [team4],
        done: false,

      },
    ];

    try {
      const challengeRef = doc(db, "challenge", currentUser.uid);
      await setDoc(challengeRef, { challenges: updatedChallenges });
      setChallenges(updatedChallenges);
      setNewChallenge({ title: "", date: "", description: "", progress: 0, action: "",goal:0,});
    } catch (error) {
      console.error("Error saving challenge:", error);
    }
  };
  
  const enrol = async () => {
    try {
      const mainChallenge = mainchallenge.find(
        (challenge) => challenge.id === selectedmainChallengeId
      );
      const newHabit = {
        id: habits.length + 1,
        title: mainChallenge.title,
        date: mainChallenge.date,
        description: mainChallenge.description,
        progress: 0,
        action: mainChallenge.action,
        done: false,
        goal: mainChallenge.goal,
      
      };
  
      const updatedhabits = [...habits, newHabit];
      const habitRef = doc(db, "habit", currentUser.uid);
  
      const habitSnap = await getDoc(habitRef);
      if (habitSnap.exists()) {
        await updateDoc(habitRef, { habits: updatedhabits });
      } else {
        await setDoc(habitRef, { habits: updatedhabits });
      }

      sethabits(updatedhabits);
      closemainChallenge();
    } catch (error) {
      console.error("Error enrolling to challenge:", error);
    }
  };
  
  
  
  return (
    <div className="page d-flex">
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
        <h1 className="p-relative">Community Challenges</h1>
{isFormVisible && (
        <div className="add-challenge-form bg-white p-20 rad-6 m-20">
          <h3>Add a New Challenge</h3>
          <input
            type="text"
            placeholder="Title"
            value={newChallenge.title}
            onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
            className="d-block mb-10 w-full"
          />
          <input
            type="text"
            placeholder={new Date().toLocaleString()}
            value={new Date().toLocaleString()}
            onChange={(e) => setNewChallenge({ ...newChallenge, date: e.target.value })}
            className="d-block mb-10 w-full"
          />
          <input
            type="text"
            placeholder="description"
            value={newChallenge.description}
            onChange={(e) =>
              setNewChallenge({ ...newChallenge, description: e.target.value })}
            className="d-block mb-10 w-full"
          />
          <input
            type="text"
            placeholder="Action"
            value={newChallenge.action}
            onChange={(e) => setNewChallenge({ ...newChallenge, action: e.target.value })}
            className="d-block mb-10 w-full"
          />
          <input
            type="number"
            value={newChallenge.goal}
            onChange={(e) => setNewChallenge({ ...newChallenge, goal: e.target.value })}
            className="d-block mb-10 w-full"
          />
          <button onClick={handleAddChallenge} className="btn bg-blue c-white">
            Add Challenge
          </button>
          <button className="btn bg-blue c-white" onClick={closeForm} style={{margin:'5px'}}>
              Close
            </button>
        </div>)}
        <button className="btn bg-blue c-white" onClick={openForm} style={{ position: 'absolute',top: '20px',
  right: '20px'}}>
          +
        </button>
        <div className="projects-page d-grid m-20 gap-20">
  {challenges.map((challenge) => (
    <div key={challenge.id} className="projects-page d-grid m-20 gap-20">
      <div className="project bg-white p-20 rad-6 p-relative">
      <span className="date fs-13 c-grey">{new Date().toLocaleString()}</span>
      <h4 className="m-0">{challenge.title}</h4>
      <p className="c-grey mt-10 mb-10 fs-14">{challenge.description}</p>
      <div className="team">
        {challenge.team.map((team2, index) => (
          <a key={index} href="#!">
            <img src={team2} alt="Team member" />
          </a>
        ))}
      </div>
      <div className="do d-flex">
        <span className="fs-13 rad-6 bg-eee">{challenge.action}</span>
      </div>
      <div className="do d-flex">
        <span className="fs-13 rad-6 bg-eee">{challenge.goal}</span>
      </div>
      <button
        className="see-more d-block fs-14 bg-blue c-white w-fit btn-shape"
        onClick={() => openChallenge(challenge.id)}
      >
        See More..
      </button> 
      </div>
      {isChallengeVisible && selectedChallengeId === challenge.id && (
        <div className="popup d-flex p-20 bg-eee">
          <h2 className="mt-0 mb-10 p-10">Challenge Details</h2>
         
          <input
            className="close d-block fs-14 bg-blue c-white w-fit btn-shape"
            type="submit"
            value="Close"
            style={{ margin: '5px' }}
            onClick={closeChallenge}
          /> 
          <input
            className="close d-block fs-14 bg-blue c-white w-fit btn-shape"
            type="submit"
            value="remove"
            style={{ margin: '5px' }}
            onClick={() => handleDeletechallenge(challenge.id)}
          /> 
        </div>
      )}
    </div>
    
  ))}

{mainchallenge.map((mainchallenge) => (
      <div key={mainchallenge.id} className="projects-page d-grid m-20 gap-20">
        <div className="project bg-white p-20 rad-6 p-relative">
        <span className="date fs-13 c-grey">{mainchallenge.date}</span>
        <h4 className="m-0">{mainchallenge.title}</h4>
        <p className="c-grey mt-10 mb-10 fs-14">{mainchallenge.description}</p>
        <div className="team">
          {mainchallenge.team.map((team2, index) => (
            <a key={index} href="#!">
              <img src={team2} alt="Team member" />
            </a>
          ))}
        </div>
        <div className="do d-flex">
          <span className="fs-13 rad-6 bg-eee">{mainchallenge.action}</span>
        </div>
        <div className="do d-flex">
          <span className="fs-13 rad-6 bg-eee">{mainchallenge.goal}</span>
        </div>
        <button
          className="see-more d-block fs-14 bg-blue c-white w-fit btn-shape"
          onClick={() => openmainChallenge(mainchallenge.id)}
        >
          See More..
        </button>

        {/* Show the popup for the specific challenge */}
       
      </div> 
      {ismainChallengeVisible && selectedmainChallengeId === mainchallenge.id && (
          <div className="popup d-flex p-20 bg-eee">
            <h2 className="mt-0 mb-10 p-10">Challenge Details</h2>
            <input
              className="enrol d-block fs-14 bg-blue c-white w-fit btn-shape"
              type="submit"
              value="Enroll"
              style={{ margin: '5px' }}
              onClick={() => enrol(mainchallenge)}
            />
            <input
              className="close d-block fs-14 bg-blue c-white w-fit btn-shape"
              type="submit"
              value="Close"
              style={{ margin: '5px' }}
              onClick={closemainChallenge}
            />
          </div>
        )}
        </div>
    ))}
            </div>
            </div>
      </div>
  );
}
