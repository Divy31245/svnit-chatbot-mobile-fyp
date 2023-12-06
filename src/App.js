// import logo from './logo.svg';
// import { useState } from "react";
import "./App.css";
import ChatMobile from "./components/ChatMobile/ChatMobile";
import MainChat from "./components/Chat/mainchat";
import Mictest from "./components/mictest/Mictest";
// import ChatIcon from "@mui/icons-material/Chat";
// import CloseIcon from "@mui/icons-material/Close";
function App() {
  // const [openmodal, setopenModal] = useState(false);
  // const handleClick = () => {
  //   setopenModal(!openmodal);
  // };
  // console.log(openmodal);
  return (
    <div className="main-app">
      {/* <MainChat /> */}
      <ChatMobile />
      {/* <Mictest /> */}
      {/* <button className="profile_div" onClick={() => handleClick()}>
        {openmodal === false ? <ChatIcon /> : <CloseIcon />}
      </button> */}
    </div>
  );
}

export default App;
