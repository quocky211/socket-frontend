import React from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import NotificationMessageProvider from "./Components/Common/NotificationProvider";
import FeatureProvider from "./Components/Common/FeatureProvider";
import ChatWithUserProvider from "./Components/Common/ChatWithUserProvider";

function App() {
  return (
    <div className="App">
      <FeatureProvider>
        <ChatWithUserProvider>
          <NotificationMessageProvider>
            <Outlet />
          </NotificationMessageProvider>
        </ChatWithUserProvider>
      </FeatureProvider>
    </div>
  );
}

export default App;
