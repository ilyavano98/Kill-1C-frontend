import React from "react";
import {Header} from "./header";
import {Sidebar} from "./sidebar";

export const MainContents = ({ children }) => {
    return (
        <>
            <div id='app'>
                <Sidebar />
                <main  className="right">
                    <Header />
                    <section className={'content'}>
                        { children }
                        <div className="toast-wrap" id="toastWrap"></div>
                    </section>
                </main>
            </div>
        </>
    );
}
