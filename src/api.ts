import axios from 'axios';

const tokiumAPI = axios.create({
    baseURL: 'https://c9bqm649d0.execute-api.us-east-2.amazonaws.com/'
});

export default tokiumAPI;