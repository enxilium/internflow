import React from "react";
import "./Resources.scss";
import { motion } from "framer-motion";

function Resources(props) {
    return (
        <div className="resources">
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    duration: 1,
                    ease: "easeIn",
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
                className="heading-primary"
            >
                Coming Soon!
            </motion.h1>
        </div>
    );
}

export default Resources;
