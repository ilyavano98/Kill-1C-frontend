import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import { store } from './app/store';
// import {
//     createBrowserRouter,
//     RouterProvider
// } from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById('root'));
// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <App />
//     },
//     {
//         path: '/home',
//         element: <App />
//     },
//     {
//         path: '/statistics',
//         element: <Statistic />
//     },
//     {
//         path: '/settings',
//         element: <Settings />
//     },
//     {
//         path: '/washPage',
//         element: <Day />
//     },
//
// ]);
// root.render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
