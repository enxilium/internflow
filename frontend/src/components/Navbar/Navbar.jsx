import React from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";

// image imports
import navbrand from "../../assets/brand-logo.svg";

function Navbar(props) {
    return (
        <div className="navbar padding">
            <div className="navbar__container boxed ">
                <div className="navbar__navbrand">
                    <Link to="/" className="navbar__navbrand-link">
                        <img
                            src={navbrand}
                            alt=""
                            className="navbar__navbrand-img"
                        />
                    </Link>
                </div>

                <div className="navbar__navlinks">
                    <Link to="/results?query=" className="navbar__navlink">
                        Get Started
                    </Link>
                    <Link to="/about" className="navbar__navlink">
                        About
                    </Link>
                    <Link to="/resources" className="navbar__navlink">
                        Resources
                    </Link>
                    <a
                        href="https://forms.gle/EQNrmchV1FA9xu65A"
                        target="_blank"  // Opens the link in a new tab
                        rel="noopener noreferrer"  // Recommended for security reasons
                        className="navbar__navlink"
                    >
                        Add An Opportunity
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
