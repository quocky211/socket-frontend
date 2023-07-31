import React from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import NotificationMessageProvider from "./Components/Common/NotificationProvider";
import FeatureProvider from "./Components/Common/FeatureProvider";

function App() {
  return (
    <div className="App">
      <FeatureProvider>
        <NotificationMessageProvider>
          <Outlet />
        </NotificationMessageProvider>
      </FeatureProvider>
    </div>
  );
}

export default App;
