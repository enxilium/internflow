import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Navbar from "./components/Navbar/Navbar";

import "./App.css";

const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const Resources = lazy(() => import("./pages/Resources/Resources"));
// const Results = lazy(() => import("./pages/Results/Results"));
import Results from "./pages/Results/Results";
const AdminPanel = lazy(() => import("./pages/AdminPanel/AdminPanel"));
const JobDetails = lazy(() => import("./pages/JobDetails/JobDetails"));

const queryClient = new QueryClient();

import CustomSpinner from "./components/CustomSpinner/CustomSpinner";

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <Navbar />
                <Suspense
                    fallback={
                        <div className="full-screen">{<CustomSpinner />}</div>
                    }
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route
                            path="/results"
                            element={<Results queryClient={queryClient} />}
                        />
                        <Route path="/uxmTCXsvrgRgR" element={<AdminPanel />} />
                        <Route
                            path="/results/jobdetails"
                            element={<JobDetails />}
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Suspense>
            </div>
        </QueryClientProvider>
    );
}

export default App;
