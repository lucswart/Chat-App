import React, { useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined, AttachFile, MoreVert } from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import axios from "./axios";
import { useStateValue } from "./StateProvider";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ messages }) {
  //Get user values
  const [{ user }, dispatch] = useStateValue();

  //set state of input
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post("/messages/new", {
      message: input,
      name: user?.displayName,
      timestamp: new Date().toLocaleString(),
      received: false,
    });

    setInput("");
  };

  //its worth to note that you need to attach a key for each map item
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />

        <div className="chat__headerInfo">
          <h3>Room name</h3>
          <p>Last seen at...</p>
        </div>

        <div className="div chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <ScrollToBottom className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__message ${
              message.name == user?.displayName && "chat__receiver"
            }`}
          >
            <span className="chat__name">{message.name}</span>
            <span className="chat__messagetext">{message.message}</span>
            <span className="chat__timestamp">{message.timestamp}</span>
          </p>
        ))}
      </ScrollToBottom>
      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
