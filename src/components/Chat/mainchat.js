import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import "./mainchat.css";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

const MainChat = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [openmodal, setopenModal] = useState(false);
  const [textinput,setTextInput] = useState(true);
  const handleClick = () => {
    setopenModal(!openmodal);
  };
  const chatRef = useRef();
  // console.log(chats);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  });
  const chat = async (e, msg) => {
    e.preventDefault();

    if (!msg) return;
    setIsTyping(true);

    let msgs = chats;
    msgs.push({ message: msg });
    setChats(msgs);
    setTextInput(false);
    setMessage("");
    // console.log(msg);
    fetch(
      "https://7679-34-74-223-18.ngrok-free.app/chatai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      }
    )
      .then((response) => {
        // console.log(respon);

        return response.json();
      })
      .then((data) => {
        console.log(data);
        msgs.push({ response: data.response });
        setChats(msgs);
        setTextInput(true);
        setIsTyping(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(chats);
  return (
    <>
      {openmodal && (
        <div className="widget-chatbot">
          <header className="header-chatbot">
            <img
              src="https://www.nicepng.com/png/full/250-2505532_svnit.png"
              alt="svnit logo"
              className="img-chatbot"
            />
            Chat Bot
          </header>

          <div className="section">
            {chats && chats.length
              ? chats.map((chat, index) => (
                  <p
                    key={index}
                    className={`${chat.response ? "user_msg2" : "user_msg"}`}
                  >
                    <span>{chat.response ? chat.response : chat.message}</span>
                  </p>
                ))
              : ""}
            <div className={isTyping ? "" : "hide"}>
              <p className="user_msg2">
                <i>
                  {isTyping ? (
                    <div className="stage">
                      {" "}
                      <div class="dot-pulse"></div>
                    </div>
                  ) : (
                    ""
                  )}
                </i>
              </p>
            </div>

            <div id="chatRef" ref={chatRef}></div>
          </div>
          <form
            className="text-form-chatbot"
            action=""
            onSubmit={(e) => chat(e, message)}
          >
            <input
              disabled={textinput === false}
              autoComplete="one-time-code"
              className={`${textinput === true ? "text-input-chatbot" : "text-input-chatbot-disabled"}`}
              type="text"
              name="message"
              value={message}
              placeholder="Type a message here and hit Enter..."
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn-chatbot" onSubmit={(e) => chat(e, message)}>
              <SendIcon />
            </button>
          </form>
        </div>
      )}
      <button className="profile_div" onClick={() => handleClick()}>
        {openmodal === false ? <ChatIcon /> : <CloseIcon />}
      </button>
    </>
  );
};

export default MainChat;
