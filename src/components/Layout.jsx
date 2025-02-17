import {Outlet, useNavigate} from "react-router-dom";
import '../styles/Layout.css';
import {useEffect, useState} from "react";

export default function Layout() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const isLoggedOut = !localStorage.getItem("jwtToken") ||
            localStorage.getItem("jwtToken") === 'null' || localStorage.getItem("jwtToken") === '';
        setLoggedIn(!isLoggedOut);
    }, []);

    const myLogout = () => {
        localStorage.setItem("jwtToken", null);
        setLoggedIn(false);
        navigate("/wallet/login");
    };

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
                        <li>
                            {loggedIn ? (
                                <a href="#" onClick={myLogout}>Logout</a>
                            ) : (
                                <a href="/wallet/login">Login</a>
                            )}
                        </li>
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
