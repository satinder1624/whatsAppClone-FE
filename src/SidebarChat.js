import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Pusher from "pusher-js";
import dateFormat from "dateformat";
import ImageIcon from "@material-ui/icons/Image";

function SidebarChat({ id, roomName, addNewChat }) {
  const [seed, setSeed] = useState("");
  const [lastTime, setLastTime] = useState([]);
  const [lastMessage, setLastMessage] = useState([]);
  const match = "uploads/";

  const host = "https://whastapp-mern.herokuapp.com";

  useEffect(async () => {
    if (id) {
      await axios.get(`${host}/query/${id}`).then((response) => {
        if (response.data != 0) {
          if (
            new RegExp("\\b" + match + "\\b").test(
              response.data[response.data.length - 1].message
            )
          ) {
            setLastMessage(<ImageIcon></ImageIcon>);
          } else {
            setLastMessage(response.data[response.data.length - 1].message);
          }
        }
      });
    }
  }, [lastMessage]);

  useEffect(async () => {
    if (id) {
      await axios.get(`${host}/query/${id}`).then((response) => {
        response.data.length === 0
          ? setLastTime("..")
          : dateFormat(new Date().toUTCString(), "d mmmm yyyy") ===
            dateFormat(
              response.data[response.data.length - 1].timestamp,
              "d mmmm yyyy"
            )
          ? setLastTime(
              "" +
                dateFormat(
                  response.data[response.data.length - 1].timestamp,
                  "h:MM TT"
                )
            )
          : setLastTime(
              "" +
                dateFormat(
                  response.data[response.data.length - 1].timestamp,
                  "mm/d/yyyy"
                )
            );
      });
    }
  }, [lastMessage]);

  useEffect(async () => {
    // lastMessage
    const pusher = new Pusher("d2dff77486561bce3c03", {
      cluster: "us2",
    });
    //
    const channel = pusher.subscribe("lastMessages");
    channel.bind("lastInserted", (newMessage) => {
      if (new RegExp("\\b" + match + "\\b").test(newMessage.message)) {
        setLastMessage(<ImageIcon></ImageIcon>);
      } else {
        setLastMessage(newMessage.message);
      }
    });

    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    };
  }, [lastMessage]);

  useEffect(async () => {
    // Extract from pusher
    const pusher = new Pusher("a0c844455e0f95285a77", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("clearChat");
    channel.bind("deleted", () => {
      setLastMessage("");
    });

    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    };
  });

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

  useEffect(async () => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${id}.svg`} />
        <div className="sidebarChat__info">
          <h2>{roomName}</h2>
          <p className="lastMessage">{lastMessage}</p>
        </div>
        <span className="lastTime">{lastTime}</span>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h3>Add New Chat</h3>
    </div>
  );
}

export default SidebarChat;
