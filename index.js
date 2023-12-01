const express = require("express");
const i18n = require("i18n");
const router = express.Router();
const {
    MainMenu,
    Register,
    unregisteredMenu,
  } = require("./menu");
const {User,Job} = require('./models/Schemas');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { ContactSupport } = require("./paths/ContactSupport");
const { JobAlerts } = require("./paths/Alerts");
const { BrowseCategory } = require("./paths/Category");
const { EmployeerData } = require("./Employeer");


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
      let Admins = ""

      if (!user) {
        userRegistered = false;
      } else {
        userRegistered = true;
        userName = user.Name;
      }
   
      
      // Function to get the count of job alerts
// Function to get the count of job alerts
async function getJobAlertsCount(phoneNumber) {
  try {
    // Call the JobAlerts function to get job alerts based on user's job interest
    const jobInterest = await getUserJobInterest(phoneNumber);
    const jobsInInterest = await getJobsInInterest(jobInterest);

    return jobsInInterest.length;
  } catch (error) {
    console.error('Error getting job alerts count:', error);
    return 0;
  }
}

// Function to get the user's job interest
async function getUserJobInterest(phoneNumber) {
  try {
    const user = await User.findOne({ phoneNumber });
    return user ? user.JobType : null;
  } catch (error) {
    console.error('Error getting user job interest:', error);
    throw error;
  }
}

async function getJobsInInterest(jobInterest) {
  try {
    const jobs = await Job.find({ JobCategories: jobInterest }, 'Jobs');
    return jobs.length > 0 ? jobs[0].Jobs : [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const jobAlertsCount = await getJobAlertsCount(phoneNumber);


Admins = await User.findOne({ phoneNumber: phoneNumber });
      checkRole = Admins ? Admins.Role : null;
      
      // Check if the user has the 'Admin' role
      let isAdmin = checkRole === 'Employeer';

      // MAIN LOGIC
      if (text == "" && userRegistered == true) {
        response = MainMenu(userName,jobAlertsCount,isAdmin);
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
          response = await BrowseCategory(textArray, phoneNumber);
            break;
        
          case "2":
          response = await JobAlerts(textArray, phoneNumber);
            break;
            case "3":
          response = await ContactSupport(textArray, phoneNumber);
            break;
          case "4":
          response = await EmployeerData(textArray,phoneNumber);
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