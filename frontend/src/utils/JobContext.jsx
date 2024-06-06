import { createContext, useContext, useState } from "react";

const JobContext = createContext();

export const JobProvider = ({ children }) => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [relatedJobsList, setRelatedJobsList] = useState([]);

    const updateJobData = (currentJob, relatedJobsArary) => {
        setSelectedJob(currentJob);
        setRelatedJobsList(relatedJobsArary);
    };

    return (
        <JobContext.Provider
            value={{ selectedJob, relatedJobsList, updateJobData }}
        >
            {children}
        </JobContext.Provider>
    );
};

export const useJobContext = () => {
    return useContext(JobContext);
};
