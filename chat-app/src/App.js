import "./App.css";
import Sidebar from "./Sidebar";
import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "./axios";
import Login from "./Login";
import { useStateValue } from "./StateProvider";
import Chat from "./Chat";

function App() {
  const [{ user }] = useStateValue();

  const [messages, setMessages] = useState([]);

  const [groupname, setGroupname] = useState("");

  //​its worth to note that you need to attach a key for each map item like in the messages
  const [groupid, setGroup] = useState("");

  useEffect(() => {
    axios.get(`/messages/sync?group=${groupid}`).then((response) => {
      setMessages(response.data);
    });
  }, [groupid]);

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

  //​its worth to note that you need to attach a key for each map item like in the messages

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get(`/groups/sync`).then((response) => {
      setGroups(response.data);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("d061d5c4829b3f6e3b32", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("groups");
    channel.bind("inserted", (newGroup) => {
      setGroups([...groups, newGroup]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [groups]);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          {/* Sidebar */}
          <Sidebar
            groupname={groupname}
            setGroupname={setGroupname}
            groupid={groupid}
            setGroup={setGroup}
            groups={groups}
          />

          {/* Chat */}
          <Chat groupid={groupid} groupname={groupname} messages={messages} />
        </div>
      )}
    </div>
  );
}

export default App;
