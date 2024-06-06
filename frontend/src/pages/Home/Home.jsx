import React, { useState } from "react";
import "./Home.scss";
import { useNavigate } from "react-router-dom";

import homeBrand from "../../assets/home/home-brand.webp";
import searchIcon from "../../assets/search-icon.svg";

// framer motion
import { motion, AnimatePresence } from "framer-motion";

function Home() {
    const navigate = useNavigate();
    // animation
    const [searchText, setSearchText] = useState("");
    const [visible, setVisible] = useState(true);

    const handleSearch = () => {
        navigate(`/results?query=${searchText}`);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            // Trigger search when "Enter" key is pressed
            setVisible(false);
            setTimeout(() => {
                handleSearch();
            }, 300);
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <div className="home padding">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="container"
                    >
                        <img src={homeBrand} alt="" className="home__brand" />
                        <h3 className="heading-tertiary">
                            Unlock your potential.
                        </h3>
                        <div className="home__input-container">
                            <img
                                src={searchIcon}
                                alt=""
                                className="home__input-icon"
                            />
                            <input
                                placeholder="What are you looking for today?"
                                type="text"
                                className="home__input"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default Home;
