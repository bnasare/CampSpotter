const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const loremIpsum = (length) => {
  const words = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipisicing",
    "elit",
  ];
  let text = "";
  for (let i = 0; i < length; i++) {
    text += `${words[Math.floor(Math.random() * words.length)]} `;
  }
  return text.trim();
};

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "6717022f500c4a6be84cd71c",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      price: price,
      description: loremIpsum(20),
      images: [
        {
          url: "https://www.nps.gov/grte/planyourvisit/images/JLCG_tents_Teewinot_2008_mattson_1.JPG?maxwidth=1300&maxheight=1300&autorotate=false",
          filename: "image1",
        },
        {
          url: "https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/visitflorida/PHOTO_20ICON_20CAMPING_20FISHEATING_20CREEK_20_28Peter_20W_20Cross_20and_20Patrick_20Farrell_29_7da735c6-5d2b-4d1d-934d-fd7ab901cbc9.jpg",
          filename: "image2",
        },
      ],
    });
    await camp.save();
  }
};
seedDB().then(() => mongoose.connection.close());
