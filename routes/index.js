var express = require('express');
var router = express.Router();
const userModel = require("./users");
const uuid = require("uuid");
const cors = require("cors");

// Apply CORS middleware
router.use(cors());

function generateShortID(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortID = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortID += characters.charAt(randomIndex);
  }
  return shortID;
}

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/url/:url', async function (req, res, next) {
  try {
    const body = req.params.url;
    if (!body) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Changed variable name to avoid confusion
    const url = body;
    
    const shortID = generateShortID(6); // You can adjust the length as needed

    const ans = await userModel.create({
      shortID: shortID,
      redirectURL: url,
    });
    return res.json({ id: shortID });
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

router.get('/url/:shortID', async function (req, res, next) {
  try {
    const shortID = req.params.shortID;

    if (!shortID) {
      return res.status(400).json({ error: 'Short ID is required' });
    }

    console.log(`Received Short ID: ${shortID}`);

    const urlData = await userModel.findOne({ shortID });

    if (!urlData) {
      console.log(`Short URL not found for ID: ${shortID}`);
      return res.status(404).json({ error: 'Short URL not found' });
    }

    console.log(`Redirecting to: ${urlData.redirectURL}`);
    res.redirect(urlData.redirectURL);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
