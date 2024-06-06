const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    province: {
        type: String,
    },
    opportunityType: {
        type: String,
        enum: [
            "Internship",
            "Fellowship",
            "Scholarship",
            "Event",
            "Competition",
            "Non-profit",
            "Volunteer",
            "Research",
        ],
        required: true,
    },
    attributes: [
        {
            type: String,
            enum: [
                "Fee Required",
                "Free",
                "Beginner-friendly",
                "Full-time",
                "Pre-requisites",
                "Unpaid",
            ],
        },
    ],
    field: {
        type: String,
        enum: [
            "Tech",
            "Business",
            "Science",
            "Arts",
            "Social",
            "Mathematics",
            "Other",
        ],
        required: true,
    },
    validity: {
        type: Date,
    },
    image: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: true,
    },
    ratings: {
        type: Number, // You can define your own schema for ratings if needed
        default: 0,
    },
    applyLink: {
        type: String,
        required: true,
    },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
