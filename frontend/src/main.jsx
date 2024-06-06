import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";

import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

import { JobProvider } from "./utils/JobContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <ChakraProvider>
            <JobProvider>
                <App />
            </JobProvider>
        </ChakraProvider>
    </BrowserRouter>
);
