const Http = require('@status/codes');
// const apiConfig = require('../config/tdEnvironmentVar');
const process = require('process');
const axios = require('axios');

module.exports = {
  getGoogleMapsApiKey(request, response) {
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!googleMapsApiKey) {
      response.status(500).send('Google Maps API key is not configured');
      return;
    };
    response.send(googleMapsApiKey);
  },
  async getGoogleMapsApiKeyTwo(request, response) {
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!googleMapsApiKey) {
      response.status(500).send('Google Maps API key is not configured');
      return;
    };
    const res = await axios.get(`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap&libraries=places&v=weekly`, {
      params: {
        ...request.query,
      },
    });
    // console.log(res);
    response.send(res.data);
  },
};
