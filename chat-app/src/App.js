import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "./axios";
import Login from "./Login";
import { useStateValue } from "./StateProvider";

function App() {
  const [{ user }, dispatch] = useStateValue();

  //​its worth to note that you need to attach a key for each map item like in the messages

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("/messages/sync").then((response) => {
      setMessages(response.data);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("d061d5c4829b3f6e3b32", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          {/* Sidebar */}
          <Sidebar />

          {/* Chat component */}
          <Chat messages={messages} />
        </div>
      )}
    </div>
  );
}

export default App;
