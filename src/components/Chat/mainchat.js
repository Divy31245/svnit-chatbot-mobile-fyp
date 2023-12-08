import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import "./mainchat.css";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
// import "./mainchatmobile.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const MainChat = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([
    {
      message:
        "👋 Welcome to the SVNIT Chat Bot! 🤖 Here to assist with all things Sardar Vallabhbhai National Institute of Technology! Admissions, faculty, campus, fees, or any SVNIT query—just type away! Let's explore together! 🎓💬 #SVNIT #ChatBot",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [openmodal, setopenModal] = useState(false);
  const [textinput, setTextInput] = useState(true);
  const handleClick = () => {
    setopenModal(!openmodal);
  };
  const chatRef = useRef();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
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
  const handleSpeechEnd = () => {
    // If speech recognition ended and the mic was previously on, click the mic again
    if (ok === true) {
      setOk(false);
      setTimeout(() => {
        setOk(true);
      }, 0);
    }
  };

  useEffect(() => {
    // Set the onEnd callback to handle the end of speech recognition
    SpeechRecognition.onEnd = handleSpeechEnd();
  }, []);

  useEffect(() => {
    return () => {
      SpeechRecognition.abortListening();
    };
  }, []);

  useEffect(() => {
    if (ok) {
      SpeechRecognition.startListening({ continuous: true });
    }

    return () => {
      SpeechRecognition.stopListening();
      resetTranscript()
    };
  }, [ok]);

  useEffect(() => {
    setMessage(transcript);
    return () => {
      
    };
  }, [transcript]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

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
    fetch("https://0837-34-80-243-123.ngrok-free.app/chat", {
      method: "POST",
      mode: "cors",
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
  // console.log(chats);
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
          <div className="form-div-chatbot">
            <form
              className="text-form-chatbot"
              action=""
              onSubmit={(e) => chat(e, message)}
            >
              <textarea
                disabled={textinput === false}
                autoComplete="one-time-code"
                className={`${
                  textinput === true
                    ? "text-input-chatbot"
                    : "text-input-chatbot-disabled"
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
              className="btn-chatbot"
              // onSubmit={(e) => chat(e, message)}
              onClick={() => handleMic()}
            >
              {listening && (
                <div className="mic-icon pulse-animation">
                  <div className="mic-inner"></div>
                </div>
              )}
              <MicIcon className="icon-chatbot" />
            </button>

            <button
              className="btn-chatbot"
              onClick={(e) => chat(e, message)}
            >
              <SendIcon className="icon-chatbot" />
            </button>
          </div>
        </div>
      )}
      <button className="profile_div" onClick={() => handleClick()}>
        {openmodal === false ? <ChatIcon /> : <CloseIcon />}
      </button>
    </>
  );
};

export default MainChat;
