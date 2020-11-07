import React, { useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined, AttachFile, MoreVert } from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import axios from "./axios";
import { useStateValue } from "./StateProvider";
import ScrollToBottom from "react-scroll-to-bottom";
import CryptoJS from "crypto-js";

function Chat({ messages }) {
  //Get user values
  const [{ user }] = useStateValue();

  var secretkey =
    'BFZ0a>-Ne+jx1<?^U#vj",Z8Jp/Q~]=;yzsj{{OUv5;j2lYoX[K]OIO8dR)C6PH';

  //set state of input
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    if (input) {
      await axios.post("/messages/new", {
        group: "test",
        message: CryptoJS.AES.encrypt(input, secretkey, {
          mode: CryptoJS.mode.CFB,
        }).toString(),
        name: user?.displayName,
        userid: user?.uid,
        timestamp: new Date().toLocaleString(),
      });
    }

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
              message.userid === user?.uid && "chat__receiver"
            }`}
            key={message.id}
            id={message.id}
          >
            <span className="chat__name">{message.name}</span>
            <span className="chat__messagetext">
              {CryptoJS.AES.decrypt(message.message, secretkey, {
                mode: CryptoJS.mode.CFB,
              }).toString(CryptoJS.enc.Utf8)}
            </span>
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
