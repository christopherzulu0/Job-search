const { User,Item} = require('./models/Schemas');
const axios = require("axios");
const countryCode = require("./util/countryCode");
const bcrypt = require("bcrypt");
const qs = require("qs");
const { response } = require('express');
const i18n = require("i18n");







const menu = {
  MainMenu: (userName) => {
    let response = "";
     response = `CON Hi <b>${userName}</b>! 
                Welcome to Job Search Portal!
                1. Search Jobs
                2. Browse Category
                3. Saved Jobs
                4. Application History
                5. Account Settings
                6. Job Alerts(5)
                7. Contact Support
            `;

    return response;
  },
  unregisteredMenu: () => {
    let response = "";
    response = `CON Welcome to <b>ZUCT Eats!</b> 
              To get started, please provide us with a few details so we can enhance your dining journey with us.
            1. Register an account
            `;

    return response;
  },
  Register: async (textArray, phoneNumber) => {
    const level = textArray.length;
    let response = "";
    
    switch (level) {
      case 1:
        response = "CON What is your name";
        break;
      case 2:
        response = "CON What is your email address";
        break;
      case 3:
        response = "CON What is your date of birth";
        break;
      case 4:
          response = "CON Set a login pin(4 Digits)";
          break;
      case 5:
        response = "CON Please confirm your PIN:";
        break;
      case 6:
        response = `CON Confirm Your Details:
                    Name: ${textArray[1]}
                    Email: ${textArray[2]}
                    DOB: ${textArray[3]}

                    1. Confirm & continue
                   `;
        break;
      case 7:
        if(textArray[6] === '1'){
        const pin = textArray[4];
        const confirmPin = textArray[5];
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
          async function createUser() {
            const userData = {
              Name: textArray[1],
              Email: textArray[2],
              DOB: textArray[3],
              phoneNumber: phoneNumber,
              pin: textArray[5],
              
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
  ,
  

  Jobs: async (textArray, phoneNumber) => {
    const level = textArray.length;
    let response = "";
  
    if (level === 1) {
      // User is at the first level of the Jobs menu
      response = `CON Enter the name of the category of the job you want to search:`;
    } else if (level === 2) {
      // User has entered the job category name
      const jobCategory = textArray[1]; // Assuming the category name is in textArray[1]
      
      // Static job listings for demonstration
      const staticJobListings = {
        "Health": [
          "Nurse",
          "Surgeon",
          "Clinical Officer"
        ],
        // Add more categories and job listings here
      };
      
      const jobListings = staticJobListings[jobCategory];
  
      if (jobListings) {
        response = `CON <b>List of ${jobCategory} Jobs:</b>\n`;
        jobListings.forEach((job, index) => {
          response += `${index + 1}. ${job}\n`;
        });
        response += `99. Go back`;
      } else {
        response = `END No jobs found in the ${jobCategory} category.`;
      }
    }
  
    return response;
  },  

  BrowseCategory: async (textArray, phoneNumber) => {
    const level = textArray.length;
    let response = "";
  
    switch (level) {
      case 1:
        response = `CON <b>Choose the category to proceed:</b>
        1. Information Technology
        2. Healthcare
        3. Finance
        4. Engineering
        5. Sales & Marketing
        6. Education
        7. Hospitality
        8. Administration
        9. Creative Arts
        0. Back to Main Menu
                   `;
        break;
      case 2:
        if (textArray[1] == 1) {
          response = `CON 
          <b>Available IT Jobs</b>
          1. Software Development
          2. IT support
          3. IT Technician
          4. Project Manager
          5. System Administrator
          6. Software Analyst
          7. Network Engineer
              `;
        } else if (textArray[1] == 2) {
          response = `CON Enter amount to withdraw:`;
        } else {
          response = "END Invalid entry.";
        }
        break;
      case 3: 
       if(textArray[2] == 2){
        response = `CON 
        Position: <b>IT Support Specialist</b>
        Location: <b>Ndola</b>
        Company: <b>Tazama Pipelines</b>
        Application Deadline: <b>20 August,2023</b>

        <b>Job Summary:</b>
        We are seeking a skilled IT Support Specialist to join our team. In this role,
        you will provide technical assistance and support to our employees and clients. 
        
        <b>To Apply:</b>
        Email: it@gmail.com
        Phone: 09733883388
        `;
       }
       else {
        response = "END Invalid entry.";
      }
      }

      return response;
},  


SavedJobs: async (textArray, phoneNumber) => {
  const level = textArray.length;
  let response = "";
   
  switch (level) {
    case 1:
      response = `CON <b>Saved Jobs List:</b>
      1. Plumber
      2. Electrician
      3. Bricklayer
      4. Nurse
                 `;
      break;
    }
    return response;
},

ApplicationHistory: async (textArray, phoneNumber) => {
  const level = textArray.length;
  let response = "";

  if (level === 1) {
    response = `CON <b>Application History:</b>
                1. View All Applications
                2. View Details of an Application
                99. Back to Main Menu
`;
  } else if (level === 2) {
    const choice = parseInt(textArray[1]);

    switch (choice) {
      case 1:
        // Logic to retrieve and display all applications
        response = `CON <b>List of All Applications:</b>
                    1. Application ID: 12345
                    2. Application ID: 67890
                    3. Application ID: 54321
                    99. Go back
                    `;
        break;
      case 2:
        // Logic to retrieve and display details of a specific application
        response = `CON <b>Application Details:</b>
                    Application ID: 12345
                    Position: IT Support Specialist
                    Company: ABC Company
                    Status: In Review
                
                    99. Go Back`;
        break;

      default:
        response = "END Invalid choice.";
        break;
    }
  }

  return response;
},
AccountSettings: async (textArray, phoneNumber) => {
  const level = textArray.length;
  let response = "";

  if (level === 1) {
    response = `CON <b>Account Settings:</b>
                1. Update Profile
                2. Change Password
                99. Back to Main Menu

                 `;
  }

  return response;
},

JobAlerts: async (textArray, phoneNumber) => {
  const level = textArray.length;
  let response = "";

  if (level === 1) {
    response = `CON <b>You Got New Notifications</b>
                1. IT Assistance(Zanaco)
                2. ICT Manager(Zesco)
                3. Librarian(Mulungushi University)
               
                `;
  }

  return response;
},

ContactSupport: async (textArray, phoneNumber) => {
  const level = textArray.length;
  let response = "";

  if (level === 1) {
    response = `CON <b>Contact Support:</b>
                1. <b>Manager</b>
                   Call: 0986-33-1133
                2. <b>Receptionist</b>
                   Call: 0973-77-0099
                3. <b>Agent</b>
                   Call: 0954-33-2222
               
                `;
  }

  return response;
}

   
};

module.exports = menu;
