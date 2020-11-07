import React, { useState, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import "./Sidebar.css";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Avatar, IconButton } from "@material-ui/core";
import SearchOutLined from "@material-ui/icons/SearchOutlined";
import { useStateValue } from "./StateProvider";
import SettingsIcon from "@material-ui/icons/Settings";
import InfoIcon from "@material-ui/icons/Info";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import axios from "./axios";
import "./SidebarChat.css";

function Sidebar({ groups, groupid, setGroup, groupname, setGroupname }) {
  const createChat = () => {
    const roomName = prompt("Please enter a name for the group");
    if (roomName) {
      //make group
      axios
        .post("/groups/new", {
          groupname: roomName,
        })
        .then((res) => {
          //add user to the group
          axios.post("/groupspeople/new", {
            groupid: res.data._id,
            username: user?.displayName,
            user: user?.uid,
          });
        });
    }
  };

  const [open, setOpen] = useState(false);

  //Get user values
  const [{ user }] = useStateValue();

  const [seed, setSeed] = useState("");

  const setGroupnameid = (groupname, groupid) => {
    setGroupname(groupname);
    setGroup(groupid);
  };

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="div sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton onClick={createChat}>
            <ChatIcon />
          </IconButton>
          <IconButton onClick={() => setOpen(!open)}>
            <MoreVertIcon />
          </IconButton>
          {open && <DropdownMenu user={user}></DropdownMenu>}
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutLined />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>
      <div className="sidebar__chats">
        {groups.map((group) => (
          <div
            key={group._id}
            className={`sidebarChat ${group._id === groupid && "active"}`}
            onClick={() => setGroupnameid(group.groupname, group._id)}
            active={group._id === groupid}
          >
            <Avatar
              src={`https://avatars.dicebear.com/api/human/${seed}.svg`}
            />
            <div className="sidebarChat__info">
              <h2>{group.groupname}</h2>
              <p>...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DropdownMenu({ user }) {
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
  }, []);

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    return (
      <a
        href="#"
        className="menu-item"
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem>
            <Avatar src={user?.photoURL} style={{ marginRight: "10px" }} />
            {user?.displayName}
          </DropdownItem>
          <DropdownItem leftIcon={<SettingsIcon />} goToMenu="settings">
            Settings
          </DropdownItem>
          <DropdownItem leftIcon={<InfoIcon />} goToMenu="about">
            About
          </DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === "settings"}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowBackIosIcon />}>
            <h2>My Tutorial</h2>
          </DropdownItem>
          <DropdownItem leftIcon={<ChatIcon />}>HTML</DropdownItem>
          <DropdownItem leftIcon={<ChatIcon />}>CSS</DropdownItem>
          <DropdownItem leftIcon={<ChatIcon />}>JavaScript</DropdownItem>
          <DropdownItem leftIcon={<ChatIcon />}>Awesome!</DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === "about"}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowBackIosIcon />}>
            <h2>About</h2>
          </DropdownItem>
          <p>
            This app is made by Luc Swart. Feel free to get inspiration from
            this.
          </p>
        </div>
      </CSSTransition>
    </div>
  );
}

export default Sidebar;
