import React, { useEffect, useState } from "react";
import "./sidebar.css";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "./SidebarChat";
import { useStateValue } from "./StateProvider";
import { Link } from "react-router-dom";
import axios from "axios";
//
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
//
import { auth } from "./firebase.js";
import { actionTypes } from "./reducer";

function Sidebar({ allChatRooms }) {
  const [{ user }, dispatch] = useStateValue();
  let condition = true;
  const [checkedA,setCheckedA] = useState(false);
  const host = "http://localhost:9000";

  useEffect(()=>{
    let theme = localStorage.getItem("data-theme");
    if(theme === 'dark'){
      setCheckedA(true);
      changeThemeToDark();
    }else{
      setCheckedA(false);
      changeThemeToLight();
    }
  },[])


  const changeThemeToDark = () => {
    document.documentElement.setAttribute("data-theme", "dark"); // set theme to dark
    localStorage.setItem("data-theme", "dark"); // save theme to local storage
  };

  const changeThemeToLight = () => {
    document.documentElement.setAttribute("data-theme", "light"); // set theme light
    localStorage.setItem("data-theme", "light"); // save theme to local storage
  };

  const menu = (e) => {
    e.preventDefault();
    let div = document.getElementById("menu_options");

    if (condition) {
      div.classList.add("sidebar__options_animation");
      condition = !condition;
    } else {
      div.classList.remove("sidebar__options_animation");
      condition = !condition;
    }
  };

  const signOut = () => {
    auth.signOut().then((result) => {
      dispatch({
        type: actionTypes.SET_USER,
        user: null,
      });
    });
  };

  const changeTheme = () => {
    let theme = localStorage.getItem("data-theme"); // Retrieve saved them from local storage
    if (theme === "dark") {
      changeThemeToLight();
      setCheckedA(false);
    } else {
      changeThemeToDark();
      setCheckedA(true);
    }

  };

  const createChat = async (e) => {
    e.preventDefault();
    const roomName = prompt("Please enter name for chat room");
    if (roomName) {
      // do some clever database stuff.....
      await axios.post(`${host}/newCollection`, {
        roonName: roomName,
      });
      await axios.post(`${host}/chatRooms`, {
        name: roomName,
      });
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton onClick={createChat}>
            <ChatIcon />
          </IconButton>
          <IconButton onClick={menu}>
            <MoreVertIcon />
          </IconButton>
        </div>
        <div className="sidebar__options" id="menu_options">
          <span className="sidebar__options__signOut" onClick={signOut}>
            <Link to="/">Sign Out</Link>
          </span>
          <br></br>

          <span className="sidebar__options__dark">
            <span className="sidebar__options__dark__content">Dark Mode</span>
            <FormControlLabel
              value="start"
              labelPlacement="start"
              onClick={changeTheme}
              control={<Switch color="primary" checked={checkedA}/>}
            />
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>

      {/* ChatRoom */}
      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {allChatRooms.map((room) => (
          <SidebarChat roomName={room.name} key={room.name} id={room.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
