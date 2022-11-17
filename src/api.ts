import axios from 'axios';

const tokiumAPI = axios.create({
    baseURL: 'https://api.tokium.co/'
});

export default tokiumAPI;