const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

setInterval(() => {
    fetch("https://adrads.onrender.com/").then(res => {
        if (res.ok) {
            console.log("Self-ping succeed");
        }
    }).catch(err => console.log("Self-ping failed: ", err.message));
}, 10 * 60 * 1000);

const myAds = [
    {
        ad_id: "adrendev_dark",
        image_url: "https://adrads.adrendev.com/assets/images/adrendev_ad_dark.webp",
        target_url: "https://adrendev.com",
        style: {
            theme: "dark"
        }
    },
    {
        ad_id: "adrednev_light",
        image_url: "https://adrads.adrendev.com/assets/images/adrendev_ad_light.webp",
        target_url: "https://adrendev.com",
        style: {
            theme: "light"
        }
    },
];

app.get("/", (req, res) => {
    res.status(200).send("Hey!");
})

app.get('/api/v1/ads/random', (req, res) => {

    const requestedTheme = req.query.theme;

    let filteredAds = myAds;
    if (requestedTheme) {
        filteredAds = myAds.filter(ad => ad.style.theme === requestedTheme);
    }

    if (filteredAds.length === 0) {
        filteredAds = myAds;
    }

    if (filteredAds.length === 0) {
        return res.status(404).json({ message: "No active ad found." });
    }

    const randomIndex = Math.floor(Math.random() * filteredAds.length);
    const selectedAd = filteredAds[randomIndex];

    res.json(selectedAd);
});

app.use("/assets/images", express.static(path.join(__dirname, "public/assets/images")));

app.listen(PORT, () => {
    console.log(`adrads started on PORT ${PORT}.`);
});