import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import "./mainchatmobile.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const ChatMobile = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const [textinput, setTextInput] = useState(true);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const chatRef = useRef();
  // console.log(chats);
  const [ok, setOk] = useState(false);

  const handleMic = () => {
    setOk(!ok);
    if (ok === true) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  useEffect(() => {
    setMessage(transcript);
    return () => {};
  }, [transcript]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  console.log(process.env.REACT_APP_API_URL);
  const chat = async (e, msg) => {
    e.preventDefault();

    if (!msg) return;
    setIsTyping(true);

    let msgs = chats;
    msgs.push({ message: msg });
    setChats(msgs);
    setTextInput(false);
    setMessage("");
    resetTranscript();
    // console.log(msg);
    fetch(process.env.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    })
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
  console.log(listening);
  return (
    <>
      <div className="widget-chatbot-mobile">
        <header className="header-chatbot-mobile">
          <img
            src="https://www.nicepng.com/png/full/250-2505532_svnit.png"
            alt="svnit logo"
            className="img-chatbot-mobile"
          />
          Chat Bot
        </header>

        <div className="section-mobile">
          {chats && chats.length
            ? chats.map((chat, index) => (
                <p
                  key={index}
                  className={`${
                    chat.response ? "user_msg2-mobile" : "user_msg-mobile"
                  }`}
                >
                  <span>{chat.response ? chat.response : chat.message}</span>
                </p>
              ))
            : ""}
          <div className={isTyping ? "" : "hide-mobile"}>
            <p className="user_msg2-mobile">
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
        <div className="form-div-chatbot-mobile">
          <form
            className="text-form-chatbot-mobile"
            action=""
            onSubmit={(e) => chat(e, message)}
          >
            <input
              // disabled={textinput === false}
              autoComplete="one-time-code"
              className={`${
                textinput === true
                  ? "text-input-chatbot-mobile"
                  : "text-input-chatbot-disabled-mobile"
              }`}
              type="text"
              name="message"
              value={message}
              placeholder={
                listening ? "Listening" : "Please Enter Your Query Here"
              }
              onChange={(e) => setMessage(e.target.value)}
            />
          </form>

          <button
            className="btn-chatbot-mobile"
            // onSubmit={(e) => chat(e, message)}
            onClick={() => handleMic()}
          >
            {listening && (
              <div className="mic-icon pulse-animation">
                <div className="mic-inner"></div>
              </div>
            )}
            <MicIcon className="icon-chatbot-mobile" />
          </button>

          <button
            className="btn-chatbot-mobile"
            onClick={(e) => chat(e, message)}
          >
            <SendIcon className="icon-chatbot-mobile" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatMobile;
