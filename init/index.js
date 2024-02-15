const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
const categories = [
  "Room",
  "Iconic Cities",
  "Mountains",
  "Castles",
  "Farms",
  "Camping",
  "Arctic",
  "Domes",
];


const initDB = async () => {
  await Listing.deleteMany({});

  
  initData.data = initData.data.map((obj) => {
 const randomIndex = Math.floor(Math.random() * categories.length);
    return ({
      ...obj,
      owner: "65a26a3dab63318caf911590",
      category: categories[randomIndex],
    });
  });

  console.log(initData.data);


  
  
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();

  


