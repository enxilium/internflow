import { useState } from "react";
import "./JobDetails.scss";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { useJobContext } from "../../utils/JobContext";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import noResultsBg from "../../assets/search/no-results-img.webp";

const JobDetails = () => {
    const { selectedJob, relatedJobsList } = useJobContext();
    const selectedJobId = selectedJob._id;

    // tabIndex to change on job change in related jobs
    const [tabIndex, setTabIndex] = useState(0);

    // tabs change on click handler
    const handleTabClick = (newIndex) => {
        setTabIndex(newIndex);
    };

    return (
        <div className="job-details-page">
            <Link to="/results?query=" className="back-btn">
                <ArrowLeftOutlined className="icon" />
                <span className="text">BACK</span>
            </Link>
            <div className="job-details-page__job-details">
                <div className="job-details-page__job-details__header">
                    <div className="job-details__image">
                        <img
                            src={selectedJob.image}
                            alt=""
                            className="job-details-page__job-details__header__image__avatar"
                        />
                    </div>
                    <div className="job-details-page__job-details__header__details">
                        <p className="tiny">{selectedJob.company}</p>
                        <h6 className="heading-senary">{selectedJob.title}</h6>
                        <p className="meta gap">
                            <span className="location">{selectedJob.city}</span>
                            <span className="dot">•</span>
                            <span className="opportunity-type">
                                {selectedJob.opportunityType}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="results__response__job-details__active-tags">
                    {selectedJob.attributes.map((tag, index) => (
                        <div
                            key={index}
                            style={{ color: "#6846EE" }}
                            className="tag meta"
                        >
                            {tag}
                        </div>
                    ))}
                    {
                        <div style={{ color: "#EA4192" }} className="tag meta">
                            {selectedJob.field}
                        </div>
                    }
                    {
                        <div className="tag color-pink meta">
                            {selectedJob.opportunityType}
                        </div>
                    }
                </div>
                <Tabs
                    index={tabIndex}
                    onChange={handleTabClick}
                    variant="unstyled"
                    isLazy={true}
                >
                    <TabList className="tabs-list">
                        <Tab className="tabs-item meta">Overview</Tab>
                        <Tab className="tabs-item meta">Related</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel className="tabs-details">
                            <motion.h6
                                initial={{ x: "10vw", opacity: 0 }}
                                animate={{ x: "0", opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="heading-senary"
                            >
                                Overview
                            </motion.h6>
                            <motion.p
                                initial={{ x: "10vw", opacity: 0 }}
                                animate={{ x: "0", opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="body"
                            >
                                {selectedJob.overview}
                            </motion.p>
                        </TabPanel>
                        <TabPanel className="tabs-details">
                            <motion.div
                                initial={{ x: "-10vw", opacity: 0 }}
                                animate={{ x: "0", opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="related-jobs"
                            >
                                {relatedJobsList.length === 0 && (
                                    <img
                                        src={noResultsBg}
                                        alt=""
                                        className="no-data"
                                    />
                                )}
                                {relatedJobsList.map((job) => {
                                    return (
                                        <div
                                            className={`job-posting  ${
                                                job._id === selectedJobId
                                                    ? "active-job-posting"
                                                    : ""
                                            }`}
                                            key={job._id}
                                            // onClick={() =>
                                            //     handleSelectedJob(job._id)
                                            // } // pass job id as argument
                                        >
                                            <div className="job-posting__logo">
                                                <img
                                                    src={job.image}
                                                    alt=""
                                                    className="job-posting__logo__image"
                                                />
                                            </div>
                                            <div className="job-posting__details ">
                                                <p className="tiny ">
                                                    {job.company}
                                                </p>
                                                <h6 className="heading-senary">
                                                    {job.title}
                                                </h6>
                                                <p className="meta gap">
                                                    <span className="location">
                                                        {job.city}
                                                    </span>
                                                    <span className="dot">
                                                        •
                                                    </span>
                                                    <span className="type">
                                                        {job.opportunityType}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                <a
                    href={
                        selectedJob.applyLink.startsWith("https")
                            ? selectedJob.applyLink
                            : `https://${selectedJob.applyLink}`
                    }
                    target="blank"
                    className="btn btn-primary"
                    onClick={() => handleRatingIncrement(selectedJob._id)}
                >
                    Apply Now
                </a>
            </div>
        </div>
    );
};

export default JobDetails;
