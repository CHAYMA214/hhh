import "./framework.css";
import "./master.css";
import "./style.css";
import photo from "./profile-user.png"
import change from "./cigarette.png"
import setting from "./settings.png"
import multipe from "./multiple-users-silhouette.png"
import React from "react";
import friend from "./friends.png"
import { Link } from 'react-router-dom';
export default function Habit() { 
    return (
<div class="page d-flex">
    <div class="sidebar bg-white p-20 p-relative">
      <h3 class="p-relative txt-c mt-0">habit-up</h3>
      <ul>
      <li>
      <Link to="/dashboard" className=" d-flex align-center fs-14 c-black rad-6 p-10"><img src={photo} style={{ width: '24px' }}/><span>Dashboard</span></Link>
          </li>
          <li>
          <Link to="/setting" className=" d-flex align-center fs-14 c-black rad-6 p-10"><img src={setting} style={{ width: '24px' }}/><span>Setting</span></Link>
          </li>
          <li>
          <Link to="/yourhabits" className=" d-flex align-center fs-14 c-black rad-6 p-10"><img src={change} style={{ width: '24px' }}/><span>habit</span></Link>
          </li>
          <li>
          <Link to="/challenges" className=" d-flex align-center fs-14 c-black rad-6 p-10"><img src={multipe} style={{ width: '24px' }}/><span>challenge</span></Link>
          </li>
          <li>
          <Link to="/friends" className=" d-flex align-center fs-14 c-black rad-6 p-10"><img src={friend} style={{ width: '24px' }}/><span>friends</span></Link>
          </li>
      </ul>
    </div>
    </div>);
    };