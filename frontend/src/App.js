import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Sidebar} from "./components/sidebar";
import {MainMenu} from "./components/home/MainMenu";

export function App(){
  return(
      <>
        <div className="app-container">
            <Sidebar/>
            <MainMenu/>
        </div>
      </>
  );
}