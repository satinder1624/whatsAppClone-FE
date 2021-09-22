import "./App.css";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Pusher from "pusher-js";
import axios from "axios";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import { useStateValue } from "./StateProvider";
import Phone from "./Phone";
import "./root.css";


function App() {
  // const [messages, setMessages] = useState([]);

  const [allChatRooms, setAllChatRooms] = useState([]);

  const [{ user }] = useStateValue();

  const host = "http://localhost:9000";

  useEffect(() => {
    const getAllChatRooms = async () => {
      await axios.get(`${host}/allChatRooms`).then((response) => {
        setAllChatRooms(response.data);
      });
    };

    getAllChatRooms();
  }, []);

  useEffect(() => {
    // AddNewChat
    const pusher = new Pusher("fab4e5f0d7f33706efad", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("chatRoom");
    channel.bind("insertion", function (newChatRoom) {
      setAllChatRooms([...allChatRooms, newChatRoom]);
    });

    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    };
  }, [allChatRooms]);

  // Delete Collection or Chat room Pusher

  useEffect(() => {
    const pusher = new Pusher("b30e680c703d7ddb2c0a", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("deleteChat");
    channel.bind("DeletedOnce", function (data) {
      setAllChatRooms(
        allChatRooms.filter((element) => element.name !== data.collectionName)
      );
    });

    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    };
  });
  // console.log(allChatRooms);
  return !user ? (
    <>
      <Login />
    </>
  ) : (
    <div className="app">
      <div className="green"></div>
      <div className="app__body">
        <Router>
          <Sidebar allChatRooms={allChatRooms} />
          <Switch>
            <Route path="/rooms/:roomId">
              {/* <Chat messages={messages} /> */}
              <Chat />
            </Route>

            <Route path="/">
              <Phone />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
