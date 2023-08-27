const express = require("express");
const i18n = require("i18n");
const router = express.Router();
const {
    MainMenu,
    Register,
    unregisteredMenu,
    Jobs,
    BrowseCategory,
    UploadResume,
    SavedJobs,
    ApplicationHistory,
    AccountSettings,
    ContactSupport,
    JobAlerts
  } = require("./menu");
  
  const {Transaction, Wallet, User,Savings} = require('./models/Schemas');
  const mongoose = require("mongoose");
  const dotenv = require("dotenv");
  const cors = require("cors");
  const app = express();


  //Configuring Express
  dotenv.config();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  mongoose.set('strictQuery', true);
  const connectionString = process.env.DB_URI;
  
  //Configure MongoDB Database
  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log("MongoDB Running Successfully");
    })
    .catch((err) => {
      console.log({ err });
      console.log("MongoDB not Connected ");
    });



router.post("/", (req, res) => {
  

  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  console.log('#', req.body);
  
  
  
  User.findOne({phoneNumber: phoneNumber })
    .then( async (user) => {
      // AUTHENTICATION PARAMETERS
      let userName;
      let userRegistered;
      let response = "";

      if (!user) {
        userRegistered = false;
      } else {
        userRegistered = true;
        userName = user.Name;
      }

      
      

      // MAIN LOGIC
      if (text == "" && userRegistered == true) {
        response = MainMenu(userName);
      } else if (text == "" && userRegistered == false) {
        response = unregisteredMenu();
      } else if (text != "" && userRegistered == false) {
        const textArray = text.split("*");
        switch (textArray[0]) {
          case "1":
            response = await Register(textArray, phoneNumber);
            break;
          default:
            response = "END Invalid choice. Please try again";
        }
      } else {
        const textArray = text.split("*");

        switch (textArray[0]) {
          case "1":
            response = await Jobs(textArray, phoneNumber);
            break;
          case "2": 
          response = await BrowseCategory(textArray, phoneNumber);
            break;
          case "3":
          response = await SavedJobs(textArray,phoneNumber);
            break;
          case "4":
            response = await ApplicationHistory(textArray, phoneNumber);
              break;
          case "5":
          response = await AccountSettings(textArray, phoneNumber);
            break;
          case "6":
          response = await JobAlerts(textArray, phoneNumber);
            break;
            case "7":
          response = await ContactSupport(textArray, phoneNumber);
            break;
          default:
              response = "END Invalid choice. Please try again";
        }

      }
  
  // Print the response onto the page so that our SDK can read it
  res.set("Content-Type: text/plain");
  res.send(response);
  // DONE!!!
})





.catch((err) => {
    console.log({ err });
  });
});

module.exports = router;