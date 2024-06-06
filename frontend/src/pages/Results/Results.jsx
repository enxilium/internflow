import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// data fetching imports
import { useQuery } from "react-query";
import { fetchJobs } from "../../utils/api";

// framer motion
import { motion } from "framer-motion";

// media query
import { useMediaQuery } from "@react-hook/media-query";

import { useJobContext } from "../../utils/JobContext";

import "./Results.scss";

// ant desing imports
import { Select, Space, ConfigProvider, Tooltip } from "antd";

// react-icons
import { FaLocationDot } from "react-icons/fa6";
import { VscSettings } from "react-icons/vsc";

// laoding
import CustomSpinner from "../../components/CustomSpinner/CustomSpinner";

// chakra ui imports
// tabs
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
// dropdown filter
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
} from "@chakra-ui/react";

import { Tag, Box, Flex } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

// image imports
import searchIcon from "../../assets/search-icon.svg";

import sortIcon from "../../assets/search/swap-icon.svg";
import refreshIcon from "../../assets/search/refresh-icon.svg";

import jobDetailsBg from "../../assets/search/job-details-bg.webp";
import noResultsBg from "../../assets/search/no-results-img.webp";

import domain from "../../utils/api";

function Results(props) {
    // search query from url
    const location = useLocation();

    let searchQuery = new URLSearchParams(location.search).get("query");
    // navigation hook
    const navigate = useNavigate();
    const isMobileView = useMediaQuery("(max-width: 600px)");

    // JOb details context
    const { updateJobData } = useJobContext();
    // REact query
    const { queryClient } = props;
    // refresh icon loader state
    const [loader, setLoader] = useState(false);
    // fullscreen loader
    const [isFullLoader, setIsFullLoader] = useState(false);
    // search enter key loader state
    const [searchLoader, setSearchLoader] = useState(false);
    // search state
    const [searchText, setSearchText] = useState(searchQuery);
    // query array for filtering to be used in job filtering function
    const [query, setQuery] = useState(searchText.split(" "));
    // location state
    const [cities, setCities] = useState([]);
    // current job id
    const [selectedJobId, setSelectedJobId] = useState(null);
    // current job details
    const [selectedJob, setSelectedJob] = useState(null);

    // job detaisl related jobs
    const [relatedJobs, setRelatedJobs] = useState(null);

    // Filtered jobs based on the query
    const [filteredJobs, setFilteredJobs] = useState([]);
    // filter state
    const [activeTags, setActiveTags] = useState([]);

    // sorting state
    const [sortingOption, setSortingOption] = useState("latest");

    // jobs filtered from active tags
    const [displayedJobs, setDisplayedJobs] = useState([]);

    // tabIndex to change on job change in related jobs
    const [tabIndex, setTabIndex] = useState(null);

    // filter popover state
    const [filterPopover, setFilterPopover] = useState(false);

    // location popover state
    const [locationPopover, setLocationPopover] = useState(false);

    // Options for filter
    const [optionsRow1, setOptionsRow1] = useState([
        "Internship",
        "Fellowship",
        "Scholarship",
        "Event",
        "Competition",
        "Non-profit",
        "Volunteer",
        "Research",
    ]);
    const [optionsRow2, setOptionsRow2] = useState([
        "Fee Required",
        "Free",
        "Beginner-friendly",
        "Full-time",
        "Pre-requisites",
        "Unpaid",
    ]);
    const [optionsRow3, setOptionsRow3] = useState([
        "Tech",
        "Business",
        "Science",
        "Arts",
        "Social",
        "Mathematics",
        "Other",
    ]);

    // location dropdown options
    const options = [
        // alberta
        { label: "Remote", value: "remote", province: "" },
        { label: "Varies", value: "varies", province: "" },
        { label: "Calgary", value: "calgary", province: "Alberta" },
        { label: "Edmonton", value: "edmonton", province: "Alberta" },
        { label: "Red Deer", value: "red deer", province: "Alberta" },
        { label: "Lethbridge", value: "lethbridge", province: "Alberta" },
        { label: "Medicine Hat", value: "medicine hat", province: "Alberta" },
        { label: "Fort McMurray", value: "fort mcmurray", province: "Alberta" },
        {
            label: "Grande Prairie",
            value: "grande prairie",
            province: "Alberta",
        },
        { label: "Airdrie", value: "airdrie", province: "Alberta" },
        { label: "Spruce Grove", value: "spruce grove", province: "Alberta" },
        { label: "Okotoks", value: "okotoks", province: "Alberta" },
        { label: "Cochrane", value: "cochrane", province: "Alberta" },
        { label: "Banff", value: "banff", province: "Alberta" },
        { label: "Canmore", value: "canmore", province: "Alberta" },
        { label: "Brooks", value: "brooks", province: "Alberta" },
        { label: "High River", value: "high river", province: "Alberta" },
        { label: "Sylvan Lake", value: "sylvan lake", province: "Alberta" },
        { label: "Camrose", value: "camrose", province: "Alberta" },
        { label: "St. Albert", value: "st. albert", province: "Alberta" },
        { label: "Wetaskiwin", value: "wetaskiwin", province: "Alberta" },
        { label: "Drumheller", value: "drumheller", province: "Alberta" },
        // british columbia
        {
            label: "Vancouver",
            value: "vancouver",
            province: "British Columbia",
        },
        { label: "Surrey", value: "surrey", province: "British Columbia" },
        { label: "Burnaby", value: "burnaby", province: "British Columbia" },
        { label: "Victoria", value: "victoria", province: "British Columbia" },
        { label: "Kelowna", value: "kelowna", province: "British Columbia" },
        { label: "Kamloops", value: "kamloops", province: "British Columbia" },
        { label: "Nanaimo", value: "nanaimo", province: "British Columbia" },
        {
            label: "Prince George",
            value: "prince george",
            province: "British Columbia",
        },
        {
            label: "Abbotsford",
            value: "abbotsford",
            province: "British Columbia",
        },
        {
            label: "Chilliwack",
            value: "chilliwack",
            province: "British Columbia",
        },
        { label: "Vernon", value: "vernon", province: "British Columbia" },
        {
            label: "Penticton",
            value: "penticton",
            province: "British Columbia",
        },
        { label: "Duncan", value: "duncan", province: "British Columbia" },
        {
            label: "Courtenay",
            value: "courtenay",
            province: "British Columbia",
        },
        {
            label: "Parksville",
            value: "parksville",
            province: "British Columbia",
        },
        {
            label: "Cranbrook",
            value: "cranbrook",
            province: "British Columbia",
        },
        { label: "Nelson", value: "nelson", province: "British Columbia" },
        { label: "Quesnel", value: "quesnel", province: "British Columbia" },
        {
            label: "Powell River",
            value: "powell river",
            province: "British Columbia",
        },
        { label: "Squamish", value: "squamish", province: "British Columbia" },

        // manitoba
        { label: "Winnipeg", value: "winnipeg", province: "Manitoba" },
        { label: "Brandon", value: "brandon", province: "Manitoba" },
        { label: "Steinbach", value: "steinbach", province: "Manitoba" },
        { label: "Thompson", value: "thompson", province: "Manitoba" },
        {
            label: "Portage la Prairie",
            value: "portage la prairie",
            province: "Manitoba",
        },
        { label: "Selkirk", value: "selkirk", province: "Manitoba" },
        { label: "Winkler", value: "winkler", province: "Manitoba" },
        { label: "Dauphin", value: "dauphin", province: "Manitoba" },
        { label: "Morden", value: "morden", province: "Manitoba" },
        { label: "The Pas", value: "the pas", province: "Manitoba" },
        { label: "Beausejour", value: "beausejour", province: "Manitoba" },
        { label: "Stonewall", value: "stonewall", province: "Manitoba" },
        { label: "Flin Flon", value: "flin flon", province: "Manitoba" },
        { label: "Swan River", value: "swan river", province: "Manitoba" },

        // new brunswick
        { label: "Saint John", value: "saint john", province: "New Brunswick" },
        { label: "Moncton", value: "moncton", province: "New Brunswick" },
        {
            label: "Fredericton",
            value: "fredericton",
            province: "New Brunswick",
        },
        { label: "Miramichi", value: "miramichi", province: "New Brunswick" },
        { label: "Bathurst", value: "bathurst", province: "New Brunswick" },
        { label: "Edmundston", value: "edmundston", province: "New Brunswick" },
        {
            label: "Campbellton",
            value: "campbellton",
            province: "New Brunswick",
        },
        { label: "Oromocto", value: "oromocto", province: "New Brunswick" },
        { label: "Dieppe", value: "dieppe", province: "New Brunswick" },
        { label: "Riverview", value: "riverview", province: "New Brunswick" },
        { label: "Woodstock", value: "woodstock", province: "New Brunswick" },
        { label: "Shediac", value: "shediac", province: "New Brunswick" },
        {
            label: "St. Stephen",
            value: "st. stephen",
            province: "New Brunswick",
        },
        { label: "Sussex", value: "sussex", province: "New Brunswick" },
        {
            label: "Grand Bay-Westfield",
            value: "grand bay-westfield",
            province: "New Brunswick",
        },
        { label: "Hampton", value: "hampton", province: "New Brunswick" },
        { label: "Rothesay", value: "rothesay", province: "New Brunswick" },
        { label: "Quispamsis", value: "quispamsis", province: "New Brunswick" },

        // newfoundland and labrador
        {
            label: "St. John's",
            value: "st. john's",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Mount Pearl",
            value: "mount pearl",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Corner Brook",
            value: "corner brook",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Conception Bay South",
            value: "conception bay south",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Grand Falls-Windsor",
            value: "grand falls-windsor",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Labrador City",
            value: "labrador city",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Gander",
            value: "gander",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Carbonear",
            value: "carbonear",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Happy Valley-Goose Bay",
            value: "happy valley-goose bay",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Stephenville",
            value: "stephenville",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Clarenville",
            value: "clarenville",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Grand Bank",
            value: "grand bank",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Bonavista",
            value: "bonavista",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Marystown",
            value: "marystown",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Gander Bay",
            value: "gander bay",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Harbour Grace",
            value: "harbour grace",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Lewisporte",
            value: "lewisporte",
            province: "Newfoundland and Labrador",
        },
        {
            label: "Twillingate",
            value: "twillingate",
            province: "Newfoundland and Labrador",
        },
        { label: "Fogo", value: "fogo", province: "Newfoundland and Labrador" },
        {
            label: "Bay Roberts",
            value: "bay roberts",
            province: "Newfoundland and Labrador",
        },

        // northwest territories
        {
            label: "Yellowknife",
            value: "yellowknife",
            province: "Northwest Territories",
        },
        {
            label: "Hay River",
            value: "hay river",
            province: "Northwest Territories",
        },
        { label: "Inuvik", value: "inuvik", province: "Northwest Territories" },
        {
            label: "Fort Smith",
            value: "fort smith",
            province: "Northwest Territories",
        },
        {
            label: "Behchoko",
            value: "behchoko",
            province: "Northwest Territories",
        },
        {
            label: "Norman Wells",
            value: "norman wells",
            province: "Northwest Territories",
        },
        {
            label: "Tuktoyaktuk",
            value: "tuktoyaktuk",
            province: "Northwest Territories",
        },
        {
            label: "Aklavik",
            value: "aklavik",
            province: "Northwest Territories",
        },
        {
            label: "Fort Simpson",
            value: "fort simpson",
            province: "Northwest Territories",
        },
        {
            label: "Fort Providence",
            value: "fort providence",
            province: "Northwest Territories",
        },
        {
            label: "Fort McPherson",
            value: "fort mcpherson",
            province: "Northwest Territories",
        },
        {
            label: "Fort Good Hope",
            value: "fort good hope",
            province: "Northwest Territories",
        },
        { label: "Tulita", value: "tulita", province: "Northwest Territories" },
        {
            label: "Sachs Harbour",
            value: "sachs harbour",
            province: "Northwest Territories",
        },
        {
            label: "Fort Liard",
            value: "fort liard",
            province: "Northwest Territories",
        },
        {
            label: "Paulatuk",
            value: "paulatuk",
            province: "Northwest Territories",
        },
        {
            label: "Tsiigehtchic",
            value: "tsiigehtchic",
            province: "Northwest Territories",
        },
        {
            label: "Colville Lake",
            value: "colville lake",
            province: "Northwest Territories",
        },
        {
            label: "Ulukhaktok",
            value: "ulukhaktok",
            province: "Northwest Territories",
        },
        {
            label: "Enterprise",
            value: "enterprise",
            province: "Northwest Territories",
        },

        // nova scotia
        { label: "Halifax", value: "halifax", province: "Nova Scotia" },
        { label: "Sydney", value: "sydney", province: "Nova Scotia" },
        { label: "Truro", value: "truro", province: "Nova Scotia" },
        { label: "New Glasgow", value: "new glasgow", province: "Nova Scotia" },
        { label: "Glace Bay", value: "glace bay", province: "Nova Scotia" },
        { label: "Kentville", value: "kentville", province: "Nova Scotia" },
        { label: "Amherst", value: "amherst", province: "Nova Scotia" },
        { label: "Bridgewater", value: "bridgewater", province: "Nova Scotia" },
        { label: "Yarmouth", value: "yarmouth", province: "Nova Scotia" },
        { label: "Antigonish", value: "antigonish", province: "Nova Scotia" },
        { label: "Dartmouth", value: "dartmouth", province: "Nova Scotia" },
        {
            label: "Sydney Mines",
            value: "sydney mines",
            province: "Nova Scotia",
        },
        { label: "Liverpool", value: "liverpool", province: "Nova Scotia" },
        { label: "Bridgetown", value: "bridgetown", province: "Nova Scotia" },
        { label: "Berwick", value: "berwick", province: "Nova Scotia" },
        {
            label: "Annapolis Royal",
            value: "annapolis royal",
            province: "Nova Scotia",
        },
        { label: "Windsor", value: "windsor", province: "Nova Scotia" },
        { label: "Digby", value: "digby", province: "Nova Scotia" },
        { label: "Middleton", value: "middleton", province: "Nova Scotia" },
        { label: "Shelburne", value: "shelburne", province: "Nova Scotia" },

        // nunavut
        { label: "Iqaluit", value: "iqaluit", province: "Nunavut" },
        { label: "Rankin Inlet", value: "rankin inlet", province: "Nunavut" },
        { label: "Arviat", value: "arviat", province: "Nunavut" },
        { label: "Baker Lake", value: "baker lake", province: "Nunavut" },
        { label: "Cambridge Bay", value: "cambridge bay", province: "Nunavut" },
        { label: "Igloolik", value: "igloolik", province: "Nunavut" },
        { label: "Kugluktuk", value: "kugluktuk", province: "Nunavut" },
        { label: "Pangnirtung", value: "pangnirtung", province: "Nunavut" },
        { label: "Pond Inlet", value: "pond inlet", province: "Nunavut" },
        { label: "Cape Dorset", value: "cape dorset", province: "Nunavut" },
        { label: "Clyde River", value: "clyde river", province: "Nunavut" },

        // ontario
        { label: "Toronto", value: "toronto", province: "Ontario" },
        { label: "Ottawa", value: "ottawa", province: "Ontario" },
        { label: "Mississauga", value: "mississauga", province: "Ontario" },
        { label: "Brampton", value: "brampton", province: "Ontario" },
        { label: "Hamilton", value: "hamilton", province: "Ontario" },
        { label: "London", value: "london", province: "Ontario" },
        { label: "Markham", value: "markham", province: "Ontario" },
        { label: "Vaughan", value: "vaughan", province: "Ontario" },
        { label: "Kitchener", value: "kitchener", province: "Ontario" },
        { label: "Windsor", value: "windsor", province: "Ontario" },
        { label: "Niagara Falls", value: "niagara falls", province: "Ontario" },
        {
            label: "St. Catharines",
            value: "st. catharines",
            province: "Ontario",
        },
        { label: "Oshawa", value: "oshawa", province: "Ontario" },
        { label: "Barrie", value: "barrie", province: "Ontario" },
        { label: "Kingston", value: "kingston", province: "Ontario" },
        { label: "Thunder Bay", value: "thunder bay", province: "Ontario" },
        { label: "Sudbury", value: "sudbury", province: "Ontario" },
        { label: "Guelph", value: "guelph", province: "Ontario" },
        { label: "Waterloo", value: "waterloo", province: "Ontario" },
        { label: "Peterborough", value: "peterborough", province: "Ontario" },

        // prince edward island
        {
            label: "Charlottetown",
            value: "charlottetown",
            province: "Prince Edward Island",
        },
        {
            label: "Summerside",
            value: "summerside",
            province: "Prince Edward Island",
        },
        {
            label: "Stratford",
            value: "stratford",
            province: "Prince Edward Island",
        },
        {
            label: "Cornwall",
            value: "cornwall",
            province: "Prince Edward Island",
        },
        {
            label: "Montague",
            value: "montague",
            province: "Prince Edward Island",
        },
        {
            label: "Kensington",
            value: "kensington",
            province: "Prince Edward Island",
        },
        { label: "Souris", value: "souris", province: "Prince Edward Island" },
        {
            label: "Alberton",
            value: "alberton",
            province: "Prince Edward Island",
        },
        {
            label: "Tignish",
            value: "tignish",
            province: "Prince Edward Island",
        },
        {
            label: "O'Leary",
            value: "o'leary",
            province: "Prince Edward Island",
        },
        {
            label: "Georgetown",
            value: "georgetown",
            province: "Prince Edward Island",
        },

        // quebec
        { label: "Montreal", value: "montreal", province: "Quebec" },
        { label: "Quebec City", value: "quebec city", province: "Quebec" },
        { label: "Laval", value: "laval", province: "Quebec" },
        { label: "Gatineau", value: "gatineau", province: "Quebec" },
        { label: "Longueuil", value: "longueuil", province: "Quebec" },
        { label: "Sherbrooke", value: "sherbrooke", province: "Quebec" },
        { label: "Saguenay", value: "saguenay", province: "Quebec" },
        { label: "Levis", value: "levis", province: "Quebec" },
        {
            label: "Trois-Rivieres",
            value: "trois-rivieres",
            province: "Quebec",
        },
        { label: "Terrebonne", value: "terrebonne", province: "Quebec" },
        { label: "Lachine", value: "lachine", province: "Quebec" },
        { label: "Dorval", value: "dorval", province: "Quebec" },
        {
            label: "Dollard-des-Ormeaux",
            value: "dollard-des-ormeaux",
            province: "Quebec",
        },
        { label: "Pointe-Claire", value: "pointe-claire", province: "Quebec" },
        { label: "Kirkland", value: "kirkland", province: "Quebec" },
        { label: "Beaconsfield", value: "beaconsfield", province: "Quebec" },
        { label: "Baie-d'Urfe", value: "baie-d'urfe", province: "Quebec" },
        { label: "Senneville", value: "senneville", province: "Quebec" },
        {
            label: "Sainte-Anne-de-Bellevue",
            value: "sainte-anne-de-bellevue",
            province: "Quebec",
        },
        { label: "Hudson", value: "hudson", province: "Quebec" },

        // saskatchewan
        { label: "Saskatoon", value: "saskatoon", province: "Saskatchewan" },
        { label: "Regina", value: "regina", province: "Saskatchewan" },
        {
            label: "Prince Albert",
            value: "prince albert",
            province: "Saskatchewan",
        },
        { label: "Moose Jaw", value: "moose jaw", province: "Saskatchewan" },
        {
            label: "Lloydminster",
            value: "lloydminster",
            province: "Saskatchewan",
        },
        {
            label: "North Battleford",
            value: "north battleford",
            province: "Saskatchewan",
        },
        {
            label: "Swift Current",
            value: "swift current",
            province: "Saskatchewan",
        },
        { label: "Yorkton", value: "yorkton", province: "Saskatchewan" },
        { label: "Estevan", value: "estevan", province: "Saskatchewan" },
        { label: "Weyburn", value: "weyburn", province: "Saskatchewan" },
        {
            label: "Martensville",
            value: "martensville",
            province: "Saskatchewan",
        },
        { label: "Warman", value: "warman", province: "Saskatchewan" },
        {
            label: "Meadow Lake",
            value: "meadow lake",
            province: "Saskatchewan",
        },
    ];

    const { data, isLoading, isError } = useQuery("jobs", fetchJobsData);

    useEffect(() => {
        if (!isLoading && !isError) {
            // Perform additional actions after data is loaded successfully
            filterJobs();
        }
    }, [isLoading, isError, data, query]);

    // Effect to run the filter whenever activeTags or cities change
    useEffect(() => {
        // Filter jobs based on active tags and selected cities
        if (!isError && !isLoading) {
            const jobs = filteredJobs.filter((job) => {
                // Check if activeTags is empty, and if so, return the job
                if (activeTags.length === 0) {
                    return true;
                }

                const matchesTags = activeTags.some((activeTag) => {
                    switch (activeTag.row) {
                        case 1:
                            return job.opportunityType === activeTag.tag;
                        case 2:
                            return job.attributes.includes(activeTag.tag);
                        case 3:
                            return job.field === activeTag.tag;
                        default:
                            return false;
                    }
                });

                const matchesCities =
                    cities.length === 0 || cities.includes(job.city);

                return matchesTags && matchesCities;
            });

            if (sortingOption) {
                // Find the selected job in the jobs array
                if (sortingOption === "latest") {
                    setDisplayedJobs(jobs);
                } else if (sortingOption === "name") {
                    setDisplayedJobs(
                        jobs.sort((a, b) => {
                            return a.title.localeCompare(b.title);
                        })
                    );
                } else if (sortingOption === "top-rated") {
                    setDisplayedJobs(
                        jobs.sort((a, b) => {
                            return b.ratings - a.ratings;
                        })
                    );
                }
            }

            // Update displayedJobs state
            setDisplayedJobs(jobs);
            setSelectedJobId(null);
            setTimeout(() => {
                setSearchLoader(false);
            }, 300);
        }
    }, [activeTags, filteredJobs, cities, sortingOption]);

    useEffect(() => {
        if (selectedJobId) {
            // Find the selected job in the jobs array
            const currentSelectedJob = displayedJobs.find((job) => {
                return job._id === selectedJobId;
            });

            setSelectedJob(currentSelectedJob);
            console.log(selectedJob);

            // Find related jobs
            const DetailsRelatedJobs = findRelatedJobs(
                currentSelectedJob,
                data
            );
            setRelatedJobs(DetailsRelatedJobs);

            // Update the job details context
            updateJobData(currentSelectedJob, DetailsRelatedJobs);
        }
    }, [selectedJobId]);

    // api call
    function fetchJobsData() {
        return fetchJobs(); // Call your API function here
    }

    // search button handler
    const handleSearch = () => {
        navigate(`/results?query=${searchText}`);
    };

    // search on enter handler
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            // Trigger search when "Enter" key is pressed
            setSearchLoader(true);
            setQuery(searchText.split(" "));
            handleSearch();
        }
    };

    // filter tags handlers
    const handleAddTag = (tag, row) => {
        setActiveTags([...activeTags, { tag, row }]);
        if (row === 1) {
            setOptionsRow1(optionsRow1.filter((option) => option !== tag));
        } else if (row === 2) {
            setOptionsRow2(optionsRow2.filter((option) => option !== tag));
        } else if (row === 3) {
            setOptionsRow3(optionsRow3.filter((option) => option !== tag));
        }
    };

    // remove a tag
    const handleRemoveTag = (tag, row) => {
        setActiveTags((prevActiveTags) =>
            prevActiveTags.filter((activeTag) => activeTag.tag !== tag)
        );

        if (row === 1) {
            setOptionsRow1((prevOptions) => [...prevOptions, tag]);
        } else if (row === 2) {
            setOptionsRow2((prevOptions) => [...prevOptions, tag]);
        } else if (row === 3) {
            setOptionsRow3((prevOptions) => [...prevOptions, tag]);
        }
    };

    // remove all tags
    const handleTagClear = () => {
        activeTags.forEach((item) => {
            handleRemoveTag(item.tag, item.row);
        });
    };

    // Function to filter jobs based on the query strings
    const filterJobs = () => {
        const filtered = data.map((job) => {
            const jobFields = flattenObjectValues(job).map((value) =>
                String(value).toLowerCase()
            );
            const queryLowerCase = query.map((q) => q.toLowerCase());
    
            // Calculating the score based on the number of matches
            let score = 0;
            queryLowerCase.forEach((q) => {
                if (jobFields.some((field) => field.includes(q))) {
                    score += 1; // Increment score for each match
                }
            });
    
            return { ...job, score }; // Return the job with its score
        })
        .filter(job => job.score > 0) // Filter out jobs with no matches
        .sort((a, b) => b.score - a.score); // Sort jobs based on the score in descending order
    
        setFilteredJobs(filtered);
    };
    

    // Recursive function to flatten object values
    const flattenObjectValues = (obj) => {
        let values = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === "object" && !Array.isArray(value)) {
                    values = [...values, ...flattenObjectValues(value)];
                } else {
                    values.push(value);
                }
            }
        }
        return values;
    };

    // location change handler

    const handleChange = (value) => {
        setCities(value);
    };

    // hadle active job change
    const handleSelectedJob = (jobId) => {
        if (isMobileView) {
            setSelectedJobId(jobId);

            setIsFullLoader(true);
            // Switch to the job details tab
            setTimeout(() => {
                setLoader(false);
                navigate(`/results/jobdetails`);
            }, 1000);
        } else {
            // Handle job selection logic for desktop
            // setIsFullLoader(true);
            setSelectedJobId(jobId);
            handleTabClick(0);
            // setTimeout(() => {
            //     setIsFullLoader(false);
            // }, 1000);
            // Switch to the first tab
        }
    };

    // tabs change on click handler
    const handleTabClick = (newIndex) => {
        setTabIndex(newIndex);
    };

    // handle refresh
    const handleRefresh = async () => {
        setIsFullLoader(true); // Set loading to true when the button is clicked
        queryClient.prefetchQuery("jobs", fetchJobs);

        // Wait for the query to complete (optional)
        await queryClient.getQueryCache().find(["jobs"]);

        setTimeout(() => {
            setIsFullLoader(false); // Set loading back to false after data is fetched
        }, 1000);
    };

    // sorting handler
    const handleSorting = (value) => {
        setSortingOption(value);
    };

    // handle filter popover
    const handleFilterPopover = () => {
        if (locationPopover) {
            setLocationPopover(false);
        }
        setFilterPopover(!filterPopover);
    };

    // handle location popover
    const handleLocationPopover = () => {
        if (filterPopover) {
            setFilterPopover(false);
        }
        setLocationPopover(!locationPopover);
    };

    // handle rating increment
    const handleRatingIncrement = async (jobId) => {
        try {
            const response = await fetch(
                `${domain}/jobs/${jobId}/increment-ratings`,
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to increment ratings");
            }

            if (response.ok) {
                console.log("Ratings incremented successfully");
            }

            // Optionally, you can handle the response data if needed
        } catch (error) {
            console.error("Error incrementing ratings:", error);
            // Handle the error as needed
        }
    };

    // render details functions
    function findRelatedJobs(currentJob, allJobs) {
        // Extract relevant details from the current job
        const { attributes, field, opportunityType } = currentJob;

        // Filter jobs based on similar attributes, field, and opportunity type
        const relatedJobs = allJobs.filter((job) => {
            // Exclude the current job from the comparison
            if (job._id.toString() === currentJob._id.toString()) {
                return false;
            }

            // Check for common attributes
            const commonAttributes = job.attributes.some((attr) =>
                attributes.includes(attr)
            );

            // Check for common field and opportunity type
            const isSameField = job.field === field;
            const isSameOpportunityType =
                job.opportunityType === opportunityType;

            // Return true if there are common attributes, field, and opportunity type
            return commonAttributes && isSameField && isSameOpportunityType;
        });

        // Rank jobs based on similarity (you can customize the ranking logic)
        const rankedJobs = relatedJobs.map((job) => ({
            job,
            similarityScore: calculateSimilarityScore(job, currentJob),
        }));

        // Sort jobs based on similarity score in descending order
        rankedJobs.sort((a, b) => b.similarityScore - a.similarityScore);

        // Select top 3-4 related jobs
        const topRelatedJobs = rankedJobs.slice(0, 4).map((entry) => entry.job);

        return topRelatedJobs;
    }

    // Example similarity score calculation function (you can customize this)
    function calculateSimilarityScore(job1, job2) {
        // Example: Count the number of common words in the job details
        const details1 = job1.overview.toLowerCase();
        const details2 = job2.overview.toLowerCase();

        const commonWords = details1
            .split(" ")
            .filter((word) => details2.includes(word));

        return commonWords.length;
    }

    // Render job details based on selectedJobId
    const renderJobDetails = () => {
        if (selectedJobId === null) {
            // No job selected, display a message or placeholder
            return (
                <div className="job-details-bg-cont">
                    <img
                        src={jobDetailsBg}
                        alt=""
                        className="job-details-bg-img"
                    />
                    <h4 className="heading-quinary color-blue">
                        Select an Entry to View Details
                    </h4>
                </div>
            );
        }

        if (!selectedJob) {
            // Job not found, display an error message
            return <p>Job not found.</p>;
        }

        // Render job details
        return (
            <>
                <div className="results__response__job-details__header">
                    <div className="job-details__image">
                        <img
                            src={selectedJob.image}
                            alt=""
                            className="results__response__job-details__header__image__avatar"
                        />
                    </div>
                    <div className="results__response__job-details__header__details">
                        <p className="tiny">{selectedJob.company}</p>
                        <h6 className="heading-senary">{selectedJob.title}</h6>
                        <p className="meta gap">
                            {selectedJob.province ? (
                                <span className="location">{`${selectedJob.city}, ${selectedJob.province}`}</span>
                            ) : (
                                <span className="location">{`${selectedJob.city}`}</span>
                            )}

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

                            {/* <button className="read-more heading-sendary">
                                Read More
                            </button> */}
                        </TabPanel>

                        <TabPanel className="tabs-details">
                            <motion.div
                                initial={{ x: "-10vw", opacity: 0 }}
                                animate={{ x: "0", opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="related-jobs"
                            >
                                {relatedJobs.length === 0 && (
                                    <img
                                        src={noResultsBg}
                                        alt=""
                                        className="no-data"
                                    />
                                )}
                                {relatedJobs.map((job) => {
                                    return (
                                        <div
                                            className={`job-posting  ${
                                                job._id === selectedJobId
                                                    ? "active-job-posting"
                                                    : ""
                                            }`}
                                            key={job._id}
                                            onClick={() =>
                                                handleSelectedJob(job._id)
                                            } // pass job id as argument
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

                {selectedJob.applyLink && (
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
                )}
            </>
        );
    };

    // Job Postings
    const jobPostings = displayedJobs.map((job) => {
        return (
            <div
                className={`job-posting  ${
                    job._id === selectedJobId ? "active-job-posting" : ""
                }`}
                key={job._id}
                onClick={() => handleSelectedJob(job._id)} // pass job id as argument
            >
                <div className="job-posting__logo">
                    <img
                        src={job.image}
                        alt=""
                        className="job-posting__logo__image"
                    />
                </div>
                <div className="job-posting__details ">
                    <p className="tiny ">{job.company}</p>
                    <h6 className="heading-senary">{job.title}</h6>
                    <p className="meta gap">
                        <span className="location">{job.city}</span>
                        <span className="dot">•</span>
                        <span className="type">{job.opportunityType}</span>
                    </p>
                </div>
            </div>
        );
    });

    return (
        <>
            {isLoading && (
                <div className="loading">
                    <CustomSpinner />
                </div>
            )}
            {isError && (
                <div className="error">
                    <h1>Something went wrong...</h1>
                </div>
            )}

            {isFullLoader && (
                <div className="full-screen">
                    <CustomSpinner />
                </div>
            )}

            {!isLoading && !isError && (
                <div className="results padding">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="results__search"
                        >
                            <div className="results__search__input-container">
                                <img
                                    src={searchIcon}
                                    alt=""
                                    className="results__search__input-icon"
                                />
                                <input
                                    placeholder="What are you looking for today?"
                                    type="text"
                                    className="results__search__input"
                                    value={searchText}
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                />

                                {/* Location filter popover and icon */}
                                <Popover
                                    placement="bottom-end"
                                    isOpen={locationPopover}
                                >
                                    <PopoverTrigger>
                                        <Tooltip
                                            color="#ee46d3"
                                            arrow={false}
                                            title="Location"
                                        >
                                            <div
                                                className="results__search__icon-location-container"
                                                onClick={handleLocationPopover}
                                            >
                                                <FaLocationDot
                                                    style={{
                                                        color:
                                                            locationPopover ||
                                                            cities.length > 0
                                                                ? "#ee46d3"
                                                                : "#c5c5c5",
                                                    }}
                                                    className="results__search__icon-location"
                                                />
                                            </div>
                                        </Tooltip>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        width={"100%"}
                                        className="location-dropdown-content"
                                    >
                                        <PopoverArrow className="location-dropdown-arrow" />
                                        <PopoverCloseButton
                                            onClick={() =>
                                                setLocationPopover(false)
                                            }
                                            className="location-dropdown-close-btn"
                                        />
                                        <PopoverBody className="location-dropdown-body">
                                            <h6 className="heading-senary">
                                                Select Location
                                            </h6>
                                            <Space
                                                style={{
                                                    width: "60%",
                                                }}
                                                direction="vertical"
                                            >
                                                <Select
                                                    mode="multiple"
                                                    allowClear
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                    placeholder="Select cities to filter jobs"
                                                    onChange={handleChange}
                                                    defaultValue={cities}
                                                    options={options}
                                                />
                                            </Space>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>

                                {/* Tags Filter Popup and icon */}
                                <Popover
                                    placement="bottom-end"
                                    isOpen={filterPopover}
                                >
                                    <PopoverTrigger>
                                        <Tooltip
                                            color="#ee46d3"
                                            arrow={false}
                                            title="Filters"
                                        >
                                            <div
                                                className="results__search__icon-filter-container"
                                                onClick={handleFilterPopover}
                                            >
                                                <VscSettings
                                                    style={{
                                                        color:
                                                            filterPopover ||
                                                            activeTags.length >
                                                                0
                                                                ? "#ee46d3"
                                                                : "#c5c5c5",
                                                    }}
                                                    className="results__search__icon-filter"
                                                />
                                            </div>
                                        </Tooltip>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        width={"100%"}
                                        className="filter-dropdown-content"
                                    >
                                        <PopoverArrow />
                                        <PopoverCloseButton
                                            onClick={() =>
                                                setFilterPopover(false)
                                            }
                                            className="filter-dropdown-close-btn"
                                        />
                                        <PopoverBody className="filter-dropdown-body">
                                            <Box>
                                                <h6 className="heading-senary">
                                                    Active Tags{" "}
                                                    <span className="count">
                                                        ({activeTags.length})
                                                    </span>
                                                </h6>
                                                <Flex flexWrap="wrap">
                                                    {activeTags.length ===
                                                        0 && (
                                                        <p className="meta">
                                                            Select tags below to
                                                            filter
                                                        </p>
                                                    )}
                                                    {activeTags.map(
                                                        (tagObj) => (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: "1vh",
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.4,
                                                                }}
                                                                className="animated-tag"
                                                            >
                                                                <Tag
                                                                    className="meta active-tag"
                                                                    key={
                                                                        tagObj.tag
                                                                    }
                                                                    m={1}
                                                                    size="lg"
                                                                    variant="subtle"
                                                                    color={
                                                                        "#fff"
                                                                    }
                                                                    bg={
                                                                        tagObj.row ===
                                                                        1
                                                                            ? "#EE46D3"
                                                                            : tagObj.row ===
                                                                              2
                                                                            ? "#6846EE"
                                                                            : "#EA4192"
                                                                    }
                                                                    borderRadius="full"
                                                                    opacity={1}
                                                                >
                                                                    {tagObj.tag}
                                                                    <CloseIcon
                                                                        className="active-tag__close-icon"
                                                                        ml={1}
                                                                        onClick={() =>
                                                                            handleRemoveTag(
                                                                                tagObj.tag,
                                                                                tagObj.row
                                                                            )
                                                                        }
                                                                    />
                                                                </Tag>
                                                            </motion.div>
                                                        )
                                                    )}
                                                </Flex>
                                            </Box>
                                            <Box>
                                                <h6 className="heading-senary">
                                                    Opportunity Type
                                                </h6>
                                                <Flex flexWrap="wrap" mt={4}>
                                                    {optionsRow1.map(
                                                        (option) => (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: "-1vh",
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.4,
                                                                }}
                                                                className="animated-tag"
                                                            >
                                                                <Button
                                                                    className="meta custom-tag"
                                                                    key={option}
                                                                    m={1}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    color={
                                                                        "#EE46D3"
                                                                    }
                                                                    opacity={1}
                                                                    onClick={() =>
                                                                        handleAddTag(
                                                                            option,
                                                                            1
                                                                        )
                                                                    }
                                                                >
                                                                    {option}
                                                                </Button>
                                                            </motion.div>
                                                        )
                                                    )}
                                                </Flex>
                                            </Box>
                                            <Box>
                                                <h6 className="heading-senary">
                                                    Attributes
                                                </h6>
                                                <Flex flexWrap="wrap" mt={4}>
                                                    {optionsRow2.map(
                                                        (option) => (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: "-1vh",
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.4,
                                                                }}
                                                                className="animated-tag"
                                                            >
                                                                <Button
                                                                    className="meta custom-tag"
                                                                    key={option}
                                                                    m={1}
                                                                    variant="outline"
                                                                    color={
                                                                        "#6846EE"
                                                                    }
                                                                    size="sm"
                                                                    opacity={1}
                                                                    onClick={() =>
                                                                        handleAddTag(
                                                                            option,
                                                                            2
                                                                        )
                                                                    }
                                                                >
                                                                    {option}
                                                                </Button>
                                                            </motion.div>
                                                        )
                                                    )}
                                                </Flex>
                                            </Box>
                                            <Box>
                                                <h6 className="heading-senary">
                                                    Field
                                                </h6>
                                                <Flex flexWrap="wrap" mt={4}>
                                                    {optionsRow3.map(
                                                        (option) => (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: "-1vh",
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    duration: 0.4,
                                                                }}
                                                                className="animated-tag"
                                                            >
                                                                <Button
                                                                    className="meta custom-tag"
                                                                    key={option}
                                                                    m={1}
                                                                    variant="outline"
                                                                    color={
                                                                        "#EA4192"
                                                                    }
                                                                    size="sm"
                                                                    opacity={1}
                                                                    onClick={() =>
                                                                        handleAddTag(
                                                                            option,
                                                                            3
                                                                        )
                                                                    }
                                                                >
                                                                    {option}
                                                                </Button>
                                                            </motion.div>
                                                        )
                                                    )}
                                                </Flex>
                                            </Box>
                                            <Box>
                                                <Flex
                                                    justifyContent={"flex-end"}
                                                >
                                                    <Button
                                                        colorScheme="red"
                                                        size={"lg"}
                                                        onClick={handleTagClear}
                                                    >
                                                        Clear All
                                                    </Button>
                                                </Flex>
                                            </Box>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="results__response"
                        >
                            {searchLoader && (
                                <div className="loading">
                                    <div
                                        style={{
                                            padding: "3rem",
                                            border: "1px solid rgba(0,0,0,.1)",
                                            borderRadius: "1rem",
                                            backgroundColor: "#ccc",
                                        }}
                                        className="details-loader"
                                    >
                                        <CustomSpinner />
                                    </div>
                                </div>
                            )}
                            {!searchLoader && (
                                <>
                                    <div className="results__response__jobs">
                                        <div className="results__response__jobs__header">
                                            <div className="header-sort">
                                                <img
                                                    src={sortIcon}
                                                    alt=""
                                                    className="header-sort__icon"
                                                />
                                                <h6 className="heading-senary">
                                                    Sort by :
                                                </h6>
                                                <ConfigProvider
                                                    theme={{
                                                        token: {
                                                            /* here is your token definition */
                                                            colorText:
                                                                "#EE46D3",
                                                        },
                                                        components: {
                                                            Select: {
                                                                /* here is your component tokens */
                                                                optionSelectedColor:
                                                                    "#EE46D3",
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <Space wrap>
                                                        <Select
                                                            defaultValue="latest"
                                                            onChange={
                                                                handleSorting
                                                            }
                                                            style={{
                                                                width: 140,
                                                            }}
                                                            bordered={false}
                                                            options={[
                                                                {
                                                                    value: "top-rated",
                                                                    label: "Most Popular",
                                                                },
                                                                {
                                                                    value: "name",
                                                                    label: "Name",
                                                                },
                                                                {
                                                                    value: "latest",
                                                                    label: "Latest",
                                                                },
                                                            ]}
                                                        />
                                                    </Space>
                                                </ConfigProvider>
                                            </div>
                                            <Tooltip
                                                color="#ee46d3"
                                                arrow={false}
                                                title="Refresh"
                                            >
                                                <img
                                                    src={refreshIcon}
                                                    alt=""
                                                    className={`header-refresh-icon `}
                                                    onClick={handleRefresh}
                                                />
                                            </Tooltip>
                                        </div>
                                        <div className="results__response__jobs__body">
                                            {/* loader while refetching data */}
                                            {loader && (
                                                <div className="loading">
                                                    <CustomSpinner />
                                                </div>
                                            )}
                                            {jobPostings.length === 0 &&
                                                !loader && (
                                                    <div className="no-results">
                                                        <img
                                                            src={noResultsBg}
                                                            alt=""
                                                            className="no-results-img"
                                                        />
                                                        <h4 className="heading-senary color-blue">
                                                            No Results Found
                                                        </h4>
                                                    </div>
                                                )}

                                            {!loader && jobPostings}
                                        </div>
                                    </div>
                                    <div className="results__response__job-details">
                                        {renderJobDetails()}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Results;
