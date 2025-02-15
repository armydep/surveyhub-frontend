// import React from 'react';
import {Outlet} from 'react-router-dom';
import '../styles/Layout.css';

export default function Layout() {
    return (
        <div id="test12345">
            <header>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/">Dashboard</a></li>
                        <li><a href="/">Surveys</a></li>
                        <li><a href="/">Answers</a></li>
                        <li><a href="/">Statistics</a></li>
                        <li><a href="/">Admin</a></li>
                        <li><a href="/">Settings</a></li>
                        <li><a href="/">Login</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </nav>
            </header>
            <main>
                <Outlet/>
            </main>
            <footer>
                <p>Footer</p>
            </footer>
        </div>
    );
}
