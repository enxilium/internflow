import React, { useState } from "react";
import "./AdminPanel.scss";
import { Form, Input, Select, Button, message, Upload, Image } from "antd";

import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
import domain from "../../utils/api";

const AdminPanel = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form] = Form.useForm();

    const [jobPosting, setJobPosting] = useState({
        title: "",
        company: "",
        city: "",
        tags: [],
        opportunityType: "",
        field: "",
        attributes: [],
        overview: "",
        related: [],
        image: null, // Store the image file here
        favorited: false,
        ratings: 0,
        applyLink: "", // Add the applyLink field
        validity: null, // Initialize validity as null
    });

    // location dropdown options
    const cities = [
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

    // Field dropdown options
    const fieldOptions = [
        "Tech",
        "Business",
        "Science",
        "Arts",
        "Social",
        "Mathematics",
        "Other",
    ];

    const handleFormSubmit = async () => {
        try {
            setIsSubmitting(true);

            const formData = new FormData();
            for (const key in jobPosting) {
                console.log(key, jobPosting[key]);
                // Only append validity if it's not null
                if (key === "validity" && jobPosting[key] !== null) {
                    formData.append(key, jobPosting[key]);
                } else {
                    formData.append(key, jobPosting[key]);
                }
            }

            const response = await fetch(`${domain}/jobs`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to add job posting");
            }

            message.success("Job posting added successfully.");
            form.resetFields();
            setJobPosting({
                title: "",
                company: "",
                city: "",
                tags: [],
                opportunityType: "",
                field: "",
                attributes: [],
                overview: "",
                related: [],
                favorited: false,
                ratings: 0,
                image: null,
                applyLink: "",
                validity: null,
            });
        } catch (error) {
            console.error(error);
            message.error("Error adding job posting.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogoUpload = async (file) => {
        try {
            setJobPosting({ ...jobPosting, image: file });
        } catch (error) {
            console.error("Error processing image:", error);
        }
    };

    const beforeLogoUpload = (file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("You can only upload image files!");
        }
        return isImage;
    };

    return (
        <div className="admin-panel padding">
            <div className="container">
                <h1 className="heading-secondary">Publish a Job Posting</h1>
                <Form
                    className="form"
                    form={form}
                    onFinish={handleFormSubmit}
                    layout="vertical"
                    // labelCol={{ span: 6 }}
                    // wrapperCol={{ span: 14 }}
                >
                    <Form.Item label="Title" name="title">
                        <Input
                            placeholder="Job Title"
                            onChange={(e) =>
                                setJobPosting({
                                    ...jobPosting,
                                    title: e.target.value,
                                })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Company" name="company">
                        <Input
                            placeholder="Company Name"
                            onChange={(e) =>
                                setJobPosting({
                                    ...jobPosting,
                                    company: e.target.value,
                                })
                            }
                        />
                    </Form.Item>
                    <Form.Item className="city-input" label="City" name="city">
                        <Select
                            placeholder="Select City"
                            showSearch
                            filterOption={(input, option) =>
                                option?.data?.province
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0 ||
                                option?.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(value, option) =>
                                setJobPosting({
                                    ...jobPosting,
                                    city: value,
                                    province: option?.data?.province || "", // Extract province from option
                                })
                            }
                        >
                            {cities.map((option) => (
                                <Select.Option
                                    key={option.value}
                                    value={option.value}
                                    data={{ province: option.province }} // Attach province information to the option
                                >
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Field" name="field">
                        <Select
                            placeholder="Select Field"
                            onChange={(value) =>
                                setJobPosting({
                                    ...jobPosting,
                                    field: value,
                                })
                            }
                        >
                            {fieldOptions.map((field) => (
                                <Select.Option key={field} value={field}>
                                    {field}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Opportunity Type" name="opportunityType">
                        <Select
                            placeholder="Select Opportunity Type"
                            onChange={(value) =>
                                setJobPosting({
                                    ...jobPosting,
                                    opportunityType: value,
                                })
                            }
                        >
                            <Option value="Fellowship">Fellowship</Option>
                            <Option value="Internship">Internship</Option>
                            <Option value="Scholarship">Scholarship</Option>
                            <Option value="Event">Event</Option>
                            <Option value="Competition">Competition</Option>
                            <Option value="Non-profit">Non-profit</Option>
                            <Option value="Volunteer">Volunteer</Option>
                            <Option value="Research">Research</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Attributes" name="attributes">
                        <Select
                            mode="multiple"
                            placeholder="Select Attributes"
                            onChange={(values) =>
                                setJobPosting({
                                    ...jobPosting,
                                    attributes: values,
                                })
                            }
                        >
                            <Option value="Fee Required">Fee Required</Option>
                            <Option value="Free">Free</Option>
                            <Option value="Beginner-friendly">
                                Beginner-friendly
                            </Option>
                            <Option value="Full-time">Full-time</Option>
                            <Option value="Pre-requisites">
                                Pre-requisites
                            </Option>
                            <Option value="Unpaid">Unpaid</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Validity Date (Optional)" name="validity">
                        <input
                            type="date"
                            placeholder="Select Validity Date"
                            onChange={(e) =>
                                setJobPosting({
                                    ...jobPosting,
                                    validity: e.target.value,
                                })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Overview" name="overview">
                        <Input.TextArea
                            placeholder="Job Overview"
                            onChange={(e) =>
                                setJobPosting({
                                    ...jobPosting,
                                    overview: e.target.value,
                                })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Apply Link" name="applyLink">
                        <Input
                            placeholder="Job Apply Link"
                            onChange={(e) =>
                                setJobPosting({
                                    ...jobPosting,
                                    applyLink: e.target.value,
                                })
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Company Logo" name="image">
                        <Upload
                            customRequest={({ file, onSuccess }) => {
                                handleLogoUpload(file);
                                onSuccess("OK");
                            }}
                            accept="image/*"
                            showUploadList={false}
                            beforeUpload={beforeLogoUpload}
                        >
                            <Button
                                style={{ marginRight: "2rem" }}
                                icon={<UploadOutlined />}
                            >
                                Upload Logo
                            </Button>
                            {jobPosting.image && (
                                <Image
                                    src={URL.createObjectURL(jobPosting.image)}
                                    alt="Company Logo"
                                    width={100}
                                    height={100}
                                />
                            )}
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            block={true}
                            className="form__button"
                            type="default"
                            htmlType="submit"
                            loading={isSubmitting}
                        >
                            {isSubmitting ? "Adding..." : "Add Job Posting"}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AdminPanel;
