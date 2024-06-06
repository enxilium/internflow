import axios from "axios";

// Define the base URL for your backend API
const API_BASE_URL = "https://internflow-02c4554ce76b.herokuapp.com"; // Change this to your actual backend URL
// const API_BASE_URL = "http://localhost:3002"; // Change this to your actual backend URL

const domain = "https://internflow-02c4554ce76b.herokuapp.com";
// const domain = "http://localhost:3002";

// Define your API functions
export async function fetchJobs() {
    try {
        const response = await axios.get(`${API_BASE_URL}/jobs`);
        if (response.data) {
        }
        return response.data;
    } catch (error) {
        throw error; // You can handle errors as needed in your application
    }
}

export async function fetchJobById(jobId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
        return response.data;
    } catch (error) {
        throw error; // You can handle errors as needed in your application
    }
}

export default domain;
