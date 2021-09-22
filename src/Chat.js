import { Avatar, Button, IconButton } from "@material-ui/core";
import { AttachFile, InsertEmoticon } from "@material-ui/icons";
import MoreVert from "@material-ui/icons/MoreVert";
import React, { useState, useEffect, useRef } from "react";
import "./chat.css";
import MicIcon from "@material-ui/icons/Mic";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import Pusher from "pusher-js";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";
import Picker from "emoji-picker-react";
import GetAppIcon from "@material-ui/icons/GetApp";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckIcon from '@material-ui/icons/Check';
import Phone from "./Phone";

function Chat() {
  const [{ user }] = useStateValue();
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [eachRoomMessages, setEachRoomMessages] = useState([]);
  const [lastSeen, setLastSeen] = useState("");
  const endOfMessagesRef = useRef(null);
  let div,typing,element,file,a,startingValue;
  let condition = true;
  const host = "http://localhost:9000";
  
  const [typingCondition, setTypingCondition] = useState(false);
  let emojiCondition = false;
  
  const inputREF = useRef(null);
  
  const match = "uploads/";

  useEffect(() => {
    const fetchData = async () => {
      if (roomId) {
        await axios
          .get(`${host}/query/${roomId}`)
          .then((response) => {
            setEachRoomMessages(response.data);
            response.data.length === 0
              ? setLastSeen("..")
              : dateFormat(new Date().toUTCString(), "d mmmm yyyy") ===
                dateFormat(
                  response.data[response.data.length - 1].timestamp,
                "d mmmm yyyy"
                )
              ? setLastSeen(
                  "Last seen Today at " +
                    dateFormat(
                      response.data[response.data.length - 1].timestamp,
                      "h:MM TT"
                    )
                )
              : setLastSeen(
                  "Last seen on " +
                    dateFormat(
                      response.data[response.data.length - 1].timestamp,
                      "mm/d/yyyy"
                    )
                );
          });
      }
    }
    fetchData();
    
  }, [roomId]);


  useEffect(() => {
    // Extract from pusher
    
    const pusher = new Pusher("5701d7355c6d0df0206a", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessage) => {
      setEachRoomMessages([...eachRoomMessages, newMessage]);
    });

    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    };
  }, [eachRoomMessages]);

  useEffect(() => {
  // One task
      a = document.querySelector("#scroll-bottom");
      if (a.scrollHeight !== a.clientHeight) {
        a.scrollTop = a.scrollHeight - a.clientHeight;
      } else {
        a.scrollTop = a.clientHeight;
      }
      startingValue = a.scrollTop;
  // Second Task
      div = document.getElementById("slide-div");
      element = document.getElementById("chat__emoji_id");
      typing = document.getElementById("messageField");
      if (typing.value !== "") {
        setTypingCondition(true);
      } else {
        setTypingCondition(false);
      }
  }); 
  

  const downloadLink = () => {
    let span = document.getElementById("chat__download__icon");
    span.classList.add("chat__download__animation");
  };

  const downArrowEvent = () => {
    a = document.querySelector("#scroll-bottom");
    a.scrollTop = a.scrollHeight - a.clientHeight;
  };

  const fileClick = () => {
    const inputFile = document.getElementById("file-input");
    inputFile.onclick = function () {
      this.value = null;
    };

    inputFile.onchange = async function () {
      file = this.files[0];

      let data = new FormData();
      data.append("message", file);
      data.append("name", user.displayName);
      data.append("timestamp", new Date().toUTCString());
      data.append("email", user.email);

      await axios.post(
        `${host}/uploadProfilePicture/${roomId}`,
        data
      );
    };
  };

  const handleShowEmojis = () => {
    if (emojiCondition) {
      element.style.display = "none";
      emojiCondition = !emojiCondition;
    } else {
      element.style.display = "block";
      emojiCondition = !emojiCondition;
    }
  };

  const emojiClick = (event, emojiObject) => {
    event.preventDefault();
    inputREF.current.focus();
    setInput(input + emojiObject.emoji);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post(`${host}/newMessage/${roomId}`, {
      message: input,
      name: user.displayName,
      timestamp: new Date().toUTCString(),
      email: user.email,
    });

    setInput("");
  };

  const downArrow = (e) => {
    e.preventDefault();
    a = document.querySelector("#scroll-bottom");
    let downArrow = document.getElementById("chat__down__arrow");
    
    if (!(a.scrollTop > startingValue - 66)) {
      downArrow.classList.add("chat__down__arrow_animation");
    } 
    else {
      downArrow.classList.remove("chat__down__arrow_animation");
    }
  };  

  const threeDots = (e) => {
    e.preventDefault();
    if (condition) {
      div.classList.add("displaySlideDiv");
      condition = !condition;
    } else {
      div.classList.remove("displaySlideDiv");
      condition = !condition;
    }
  };

  const clearChat = async (e) => {
    e.preventDefault();
    div.classList.remove("displaySlideDiv");
    condition = !condition;

    await axios.delete(`${host}/delete/${roomId}`);

    await axios
      .get(`${host}/query/${roomId}`)
      .then((response) => {
        setEachRoomMessages(response.data);
        response.data.length === 0
          ? setLastSeen("..")
          : dateFormat(new Date().toUTCString(), "d mmmm yyyy") ===
            dateFormat(
              response.data[response.data.length - 1].timestamp,
              "d mmmm yyyy"
            )
          ? setLastSeen(
              "Last seen Today at " +
                dateFormat(
                  response.data[response.data.length - 1].timestamp,
                  "h:MM TT"
                )
            )
          : setLastSeen(
              "Last seen on " +
                dateFormat(
                  response.data[response.data.length - 1].timestamp,
                  "mm/d/yyyy"
                )
            );
      });
  };

  const deleteChat = async (e) => {
    e.preventDefault();
    await axios.delete(`${host}/deleteCollection/${roomId}`);
    div.classList.remove("displaySlideDiv");
    condition = !condition;
    // <Phone />
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${roomId}.svg`} />

        <div className="chat__headerInfor">
          <h3>{roomId}</h3>
          <p>{typingCondition ? `typing...` : lastSeen}</p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <label for="file-input" className="iconLabel">
              <AttachFile />
            </label>
            <input
              type="file"
              id="file-input"
              accept="image/png, image/gif, image/jpeg"
              onClick={fileClick}
            />
          </IconButton>

          <IconButton onClick={threeDots}>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body" id="scroll-bottom" onScroll={downArrow}>
        {eachRoomMessages.map((message) => (
          <p
            className={`chat__message ${
              message.email === user.email && "chat__receiver"
            }`}
          >
            <span className="chat__name">
              {message.email === user.email ? "" : message.name}
            </span>

            {new RegExp("\\b" + match + "\\b").test(message.message) ? (
              <span className="chat__download">
                <img src={`/${message.message}`} alt="uploads/" />
                <a href={`/${message.message}`} download onClick={downloadLink}>
                  <span
                    className="chat__download__icon"
                    id="chat__download__icon"
                  >
                    <GetAppIcon fontSize="medium"></GetAppIcon>
                  </span>
                </a>
              </span>
            ) : (
              message.message
            )}

            {new RegExp("\\b" + match + "\\b").test(message.message) ? (
              <span className="chat__image__timestamp">
                {message.timestamp
                  ? dateFormat(message.timestamp, "h:MM TT")
                  : "..."}
                  <span className='tick__container'>
              {message.email === user.email ? <span className='single__tick'><CheckIcon fontSize='small'></CheckIcon></span> : ""}
              
            </span>  
              </span>
            ) : (
              <span className="chat__timestamp">
                {message.timestamp
                  ? dateFormat(message.timestamp, "h:MM TT")
                  : "..."}
                  <span className='tick__container'>
              {message.email === user.email ? <span className='single__tick'><CheckIcon fontSize='small'></CheckIcon></span> : ""}
              
            </span>  
              </span>
            )}   

                     
          </p>
        ))}

        <div className="endOfMessage" ref={endOfMessagesRef}></div>
      </div>

      <span
        className="chat__down__arrow"
        id="chat__down__arrow"
        onClick={downArrowEvent}
      >
        <ExpandMoreIcon></ExpandMoreIcon>
      </span>

      <div className="chat__options" id="slide-div">
        <Button onClick={deleteChat} id="chat____">
          <Link to='/'>Delete Chat</Link>
        </Button>
        <br></br>
        <Button onClick={clearChat} id="chat____">
          Clear Chat
        </Button>
      </div>

      <div className="chat__footer">
        <div className="chat__emoji" id="chat__emoji_id">
          <Picker onEmojiClick={emojiClick} />
        </div>
        <IconButton>
          <InsertEmoticon onClick={handleShowEmojis} />
        </IconButton>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
            id="messageField"
            ref={inputREF}
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
