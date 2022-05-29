const express = require("express");
const router = express.Router();
const axios = require("axios");
const apicache = require("apicache");

// Env variables
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

// Init cache
let cache = apicache.middleware;

router.get("/", cache("2 minutes"), async (req, res) => {
  try {
    const apiRes = await axios.get(API_BASE_URL, {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY_VALUE,
      },
    });
    res.status(200).json(apiRes.data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
