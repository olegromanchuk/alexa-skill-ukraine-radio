const { default: axios } = require("axios");

module.exports.getUkraineNews = async function(username = "") {
    try {
        const audioUrl = 'https://radio.nrcu.gov.ua/ur1-od-aacplus.m3u'
        console.log("news url: ", audioUrl);
        return audioUrl;
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
};