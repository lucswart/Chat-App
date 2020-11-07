import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import { useBetween } from "use-between";

function SidebarChat({ user, groups }, props) {
  const [seed, setSeed] = useState("");

  const [groupid, setGroup] = useState("");

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  return groups.map((group) => (
    <div
      key={group._id}
      className={`sidebarChat ${group._id === groupid && "active"}`}
      onClick={() => setGroup(group._id)}
      active={group._id === groupid}
    >
      <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
      <div className="sidebarChat__info">
        <h2>{group.groupname}</h2>
        <p>...</p>
      </div>
    </div>
  ));
}

export default SidebarChat;
