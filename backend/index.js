const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const morgan = require("morgan"); // Import the morgan logger for request logging
const Job = require("./models/job"); // Import the Job schema
const cors = require("cors"); // Import the cors package
const sharp = require("sharp"); // Import the sharp library
const multer = require("multer");
const cron = require("node-cron");

const app = express();

// Connect to your MongoDB database

// try connection to the database using given uri and if display the results of conenction
mongoose
    .connect(
        `mongodb+srv://internflowai:cYqq9hM7rjQhflOl@internflowdb.ay3bskj.mongodb.net/`
    )
    .then(() => {
        console.log("Connected to MongoDB");
    });

app.use(bodyParser.json());

// Set up request logging with morgan
// app.use(morgan("combined"));

// Enable CORS
const allowedOrigins = [
    "http://localhost:5173", // Add your frontend localhost URL
    "https://internflow-demo.netlify.app",
    "https://internflow-ai.netlify.app",
    // "http://localhost:5173", // Add your frontend localhost URL
    "https://internflow.org",
    // Add more allowed origins as needed
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors(corsOptions));

// Schedule a job to run every day at midnight to delete expired jobs
cron.schedule("0 0 * * *", async () => {
    try {
        const currentDate = new Date();
        await Job.deleteMany({ validity: { $exists: true, $lt: currentDate } });
        console.log("Expired jobs with validity date deleted");
    } catch (error) {
        console.error("Error deleting expired jobs:", error);
    }
});

// / Set up multer for handling file uploads
const storage = multer.memoryStorage(); // Store the file in memory as a Buffer
const upload = multer({ storage: storage });

// Your job schema and model remain the same

// Function to process the image using sharp
const processImage = async (buffer) => {
    try {
        console.log("Processing image...");

        const processedImageBuffer = await sharp(buffer)
            .resize(70, 70)
            .webp()
            .toBuffer();

        console.log("Image processed successfully.");

        return processedImageBuffer;
    } catch (error) {
        console.error("Error processing image:", error);
        throw new Error("Error processing image");
    }
};

// Your route to handle job creation
app.post("/jobs", upload.single("image"), async (req, res) => {
    try {
        const jobData = req.body;

        console.log(jobData);

        if (jobData.image === "null") {
            return res.status(400).json({ error: "Image is required" });
        }

        if (jobData.validity === "null") {
            jobData.validity = null;
        }

        // If attributes are sent as a string, split them into an array
        if (typeof jobData.attributes === "string") {
            jobData.attributes = jobData.attributes.split(",");
        }

        if (req.file) {
            console.log("File received");
            const processedImage = await processImage(req.file.buffer);
            const processedImageDataUrl = `data:image/webp;base64,${processedImage.toString(
                "base64"
            )}`;
            jobData.image = processedImageDataUrl;
        }

        const job = new Job(jobData);
        await job.save();

        res.status(201).json({
            message: "Job posting successfully created",
            job: job,
            processedImage: jobData.image,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create job posting" });
    }
});

// Get a list of all job postings (GET request)
app.get("/jobs", async (req, res) => {
    try {
        const currentDate = new Date();
        const jobs = await Job.find({
            $or: [
                { validity: { $exists: false } },
                { validity: { $gte: currentDate } },
                { validity: null },
            ],
        });
        const reversedJobs = jobs.reverse();
        res.json(reversedJobs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch job postings" });
    }
});

app.get("/jobs/:id", async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch job details" });
    }
});

// Add this endpoint to handle the increment of ratings
app.post("/jobs/:id/increment-ratings", async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        // Increment ratings
        job.ratings += 1;

        await job.save();

        res.json({
            message: "Ratings incremented successfully",
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to increment ratings" });
    }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
