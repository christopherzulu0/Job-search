const {User,Job} = require('./models/Schemas');
const axios = require("axios");
const countryCode = require("./util/countryCode");
const bcrypt = require("bcrypt");
const qs = require("qs");
const { response } = require('express');
const i18n = require("i18n");

let roles = ""
let selectedJobs = ""
let jobInterest = ""

const menu = {
  MainMenu: (userName,jobAlertsCount,isAdmin) => {
    let response = "";
   if(isAdmin){
     response = `CON Hello ${userName}! Enter 4 to proceed.`;
     return response;
   }else{
    response = `CON Hi <b>${userName}</b>! 
    Welcome to Job Search Portal!
    1. Browse Category
    2. Job Alerts(${jobAlertsCount})
    3. Contact Support
`;

return response;
   }
  },
  unregisteredMenu: () => {
    let response = "";
    response = `CON Welcome to Mobile Job Search Application!
    To help you find your dream job, please create an account to get started:
  1. Register an account
  `;


    return response;
  },
  Register: async (textArray, phoneNumber) => {
    const level = textArray.length;
    let response = "";
    
    switch (level) {
      case 1:
        response = "CON What is your fullname";
        break;
      case 2:
        response = "CON What is your email address";
        break;
      case 3:
        response = "CON What is your date of birth";
        break;
      case 4:
         roles = getRole();
        response = `CON Choose your role:\n`;
        roles.forEach((role, index) => {
          response += `${index + 1}. ${role}\n`;
        });
        break;

      case 5:
        const categories = await getCategoriesFromDB();
        
        if (categories.length > 0) {
            // If categories are found, display them in the USSD response
            response = `CON Choose job category you prefer, to get updates on:\n`;
            categories.forEach((category, index) => {
                response += `${index + 1}. ${category}\n`;
            });
            response += `99. Back`;
            // Store the available categories for later use
            selectedJobs = categories;
            // Return the response
            return response;
        } else {
            // If no categories are found, provide an appropriate message
            response = `END No jobs found.`;
            return response;
        }

      break;
      
      case 6:
          response = "CON Set a login pin(4 Digits)";
          break;
      case 7:
        response = "CON Please confirm your PIN:";
        break;
      case 8:
        const userRoleIndex = parseInt(textArray[4]) - 1;
        const rolesArray = getRole();
        const selectedRole = rolesArray[userRoleIndex];

        const Interest = parseInt(textArray[5]) -1;
        jobInterest = selectedJobs[Interest];

        // Store the selected role in the textArray
        textArray[4] = selectedRole;

        response = `CON Confirm Your Details:
                    Name: ${textArray[1]}
                    Email: ${textArray[2]}
                    DOB: ${textArray[3]}
                    Role: ${selectedRole}
                    Job Interest: ${jobInterest}
                    1. Confirm & continue
                  `;
        break;
      case 9:
        if(textArray[8] === '1'){
        const pin = textArray[6];
        const confirmPin = textArray[7];
        // Check if the name is strictly alphabets via regex
      
        // Check if the pin is 5 characters long and is purely numerical
         if (pin.toString().length != 4 || isNaN(pin)) {
          response = "END Your must be 4 digits.Please try again!";
        }
        // Check if the pin and confirmed pin is the same
        else if (pin != confirmPin) {
          response = "END Your pin does not match. Please try again";
        } else {
          // proceed to register user

          const userRoleIndex = parseInt(textArray[4]) - 1;
          const rolesArray = getRole();
          const selectedRole = rolesArray[userRoleIndex];
  
          // Store the selected role in the textArray
          textArray[4] = selectedRole;
      


          async function createUser() {
            const userData = {
              Name: textArray[1],
              Email: textArray[2],
              DOB: textArray[3],
              phoneNumber: phoneNumber,
              pin: textArray[6],
              Role: selectedRole,
              JobType:jobInterest
              
            };
    
            // hashes the user pin and updates the userData object
            bcrypt.hash(userData.pin, 10, (err, hash) => {
              userData.pin = hash;
            });
    
            // create user and register to DB
            let user = await User.create(userData);

            return user;
          }
    
          // Assigns the created user to a variable for manipulation
          let user = await createUser();
          // If user creation failed
          if (!user) {
            response = "END An unexpected error occurred... Please try again later";
          }
          // if user creation was successful
          else {
            let userName = user.Name;
            let phoneNumber = user.number;
            
    
            response = `END Congratulations ${userName}, You've been successfully registered.`;
          }
        }
        }
        break;
      default:
        break;
    }
    return response;
  }

   
};

//Get user role
function getRole() {
  return ["Job Seeker", "Employeer"];
}

  //get job categories from DB
  async function getCategoriesFromDB() {
    try {
        // Fetch categories from the database
        const categories = await Job.find({}, 'JobCategories'); // Assuming you have a 'Category' field in your Category schema
        return categories.map(category => category.JobCategories); // Extract category names
    } catch (error) {
        console.error(error);
        throw error;
    }
  }


  
module.exports = menu;