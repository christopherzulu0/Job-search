const {User,Job,Saved,Profile} = require('../models/Schemas');

let selectedCategories = ''
let companyprofile= ''
let email = ''
let name = ''
let jobs =''
let selectedJobs =""

const Employeer ={
    EmployeerData:async(textArray,phoneNumber)=>{
        const level = textArray.length;
        let response = '';

        if(level === 1){
            let  user = ''

            user = await User.findOne({phoneNumber: phoneNumber});
            const name = user.Name;

            response = `CON Welcome <b>${name}</b>!  Manage Your Job listings

                        1. Post a New Job
                        2. Add Job Category
                        3. View Posted Jobs
                        4. Add company details
                        5. Remove Job 
            `;
            return response;
        }
        //Logic for posting new Job
        if(level === 2 && textArray[1]==='1'){
            response = `CON What is the job position?`;
            return response;
        }
        if(level === 3 && textArray[1]==='1'){
            response = `CON What is the job location?`;
            return response;
        }
        if(level === 4 && textArray[1]==='1'){
            response = `CON What is the job requirement?`;
            return response;
        }
        if(level === 5 && textArray[1]==='1'){
            response = `CON What is the job deadline?`;
            return response;
        }
        if(level === 6 && textArray[1]==='1'){
            response = `CON Write a short job summary?`;
            return response;
        }
        if(level === 7 && textArray[1]==='1'){
            //Job categories
            const categories = await getCategoriesFromDB();
        
            if (categories.length > 0) {
                // If categories are found, display them in the USSD response
                response = `CON Choose job category:\n`;
                categories.forEach((category, index) => {
                    response += `${index + 1}. ${category}\n`;
                });
                response += `99. Back`;
                // Store the available categories for later use
                selectedCategories = categories;
                // Return the response
                return response;
            } else {
                // If no categories are found, provide an appropriate message
                response = `END No jobs found.`;
                return response;
            }
        }
        if(level === 8 && textArray[1]==='1'){
            //Also get data from company profile
              companyprofile = await Profile.findOne({EmployeerNumber:phoneNumber});
              email = companyprofile.CompanyEmail;
              name = companyprofile.CompanyName;
           

            response = `CON Verify New Job Details
                         Postion: <b>${textArray[2]}</b>
                         Location: <b>${textArray[3]}</b>
                         Deadline: <b>${textArray[5]}</b>
                         Email: <b>${email}</b>
                         Requirements: <b>${textArray[4]}</b>
                         CompanyName: <b>${name}</b>
                        

                         Job Summary:${textArray[6]}

                         1. Post Job
                         2. Go Home
                       `;
            return response;
        }
        if(level === 9 && textArray[1]==='1' && textArray[8]=== '1'){
            //Save data to the database
            try {
                const selectedCategoryIndex = parseInt(textArray[7]) - 1;
                const selectedCategoryName = selectedCategories[selectedCategoryIndex];
                // Retrieve the selected category from the database based on selectedCategoryName
                const selectedCategory = await Job.findOne({  JobCategories: selectedCategoryName });
        
                // Check if the category exists
                if (selectedCategory) {
        
                    // Push the new course data into the Courses array of the selected category
                    selectedCategory.Jobs.push({
                        Position: textArray[2],
                        Location: textArray[3],
                        DeadLine: textArray[5],
                        Email: email,
                        CompanyName: name,
                        JobSummary:textArray[6],
                        Requirements:textArray[4]
                        // Add other course-related fields if applicable
                       

                    });
        
                    // Save the updated category back to the database
                    await selectedCategory.save();
        
                    // Respond with a success message if needed
                    response = `END ${textArray[2]} has been  added to category "${selectedCategoryName}" successfully.`;
                    return response;
                } else {
                    // Handle the case where the specified category does not exist
                    response = 'END Specified category not found. Unable to add the job.';
                    return response;
                }
            } catch (error) {
                // Handle any errors that occur during database operations
                console.error(error);
                response = 'END An unexpected error occurred while adding the job.';
                return response;
            }
        }

        // Logic for adding new job category
        if(level === 2 && textArray[1]==='2'){
            response = `CON What is the job category name?`;
            return response;
        }
        if(level === 3 && textArray[1]==='2'){
            //Verify Category details
            response = `CON <b>Verify Category details</b>
                        Name : ${textArray[2]}

                        1. Continue
                        99. Go Home
                      `;
            return response;

        }
        if(level === 4 && textArray[1]==='2' && textArray[3] === '1'){
            // Save data to database
            function createCategory() {
                return new Promise(async (resolve, reject) => {
                    const userData = {
                        JobCategories: textArray[2], // Assuming the category name is at index 2 in textArray
                    };

                    try {
                        // create user and register to DB
                        let user = await Job.create(userData);
                        resolve(user);
                    } catch (error) {
                        reject(error);
                    }
                });
            }

            // Call the asynchronous function and handle the response
            let user = await createCategory();
            // If user creation failed
            if (!user) {
                response = "END An unexpected error occurred... Please try again later";
                return response;
            }
            // if user creation was successful
            else {

                response = `CON Category <b>${textArray[2]}</b> was added successfully
                  99. Go Home
                `;
                return response;
            }
        }

        //Logic for viewing added jobs
        if(level === 2 && textArray[1]==='3'){
            //Display the list of jobs categories
            //Job categories
            const categories = await getCategoriesFromDB();
        
            if (categories.length > 0) {
                // If categories are found, display them in the USSD response
                response = `CON Choose job category:\n`;
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
        }
        if(level === 3 && textArray[1]==='3'){
            //Show the list of jobs in the selected category
            try {
                const selectedCategoryIndex = parseInt(textArray[2]) - 1;
                const selectedCategoryName = selectedJobs[selectedCategoryIndex];
                console.log("Afternoon:",selectedCategoryName)
                // Retrieve the selected category from the database based on selectedCategoryName
                const selectedCategory = await Job.findOne({ JobCategories: selectedCategoryName });
            
                // Check if the category exists
                if (selectedCategory) {
                    // Get the list of courses for editing
                     jobs = selectedCategory.Jobs;
            
                    if (jobs.length > 0) {
                        // If jobs are found, display them for editing
                        response = `CON <b>Jobs in ${selectedCategoryName}:</b>\n`;
                       jobs.forEach((job, index) => {
                            response += `${index + 1}. <b>${job.Position}</b>\n`;
                            return response;
                        });
                        response += `99. Back\n`;
                         return response;
                    } else {
                        // If no courses are found, provide a message
                        response = `END No jobs in this category found.\n`;
                        return response;
                    }
                } else {
                    // Handle the case where the specified category does not exist
                    response = 'END Specified jobs not found. Unable to view jobs.';
                    return response;
                }
            } catch (error) {
                // Handle any errors that occur during database operations
                console.error(error);
                response = 'END An unexpected error occurred while retrieving jobs .';
                return response;
            }

        }
     


        //Logic for adding company details
         if(level === 2 && textArray[1]==='4'){
            response = `CON What is the name of your company?`;
            return response;
        }
        if(level === 3 && textArray[1]==='4'){
            response = `CON What is the email of your company?`;
            return response;
        }
        if(level === 4 && textArray[1]==='4'){
            response = `CON Write your company address`;
            return response;
        }
        if(level === 5 && textArray[1]==='4'){
            response = getCompanyType();
            return response;
        }
        if(level === 6 && textArray[1]==='4'){
            const companytype = textArray[5];
            const type = getCompanyTypeText(companytype);

            response = `CON <b>Verify Information</b>
                        CompanyName:${textArray[2]}
                        Email:${textArray[3]}
                        Address:${textArray[4]}
                        CompanyType:${type}

                        1. Continue & Save
                        99. Go Home
                        `;
           return response;
        }
        if(level === 7 && textArray[1]==='4' && textArray[6]==='1'){
          //Save data to the database
          function createProfile() {

            return new Promise(async (resolve, reject) => {
                const companytype = textArray[5];
            const type = getCompanyTypeText(companytype);

                const userData = {
                    CompanyName: textArray[2],
                    CompanyEmail: textArray[3],
                    CompanyAddress: textArray[4],
                    Companytype: type,
                    EmployeerNumber: phoneNumber,
                };

                try {
                    // create user and register to DB
                    let user = await Profile.create(userData);
                    resolve(user);
                } catch (error) {
                    reject(error);
                }
            });
        }

        // Call the asynchronous function and handle the response
        let user = await createProfile();
        // If user creation failed
        if (!user) {
            response = "END An unexpected error occurred... Please try again later";
            return response;
        }
        // if user creation was successful
        else {

            response = `CON Profile was added successfully!
              99. Go Home
            `;
            return response;
        }
        }

        //Logic for removing a  job
        if(level === 2 && textArray[1]==='5'){
            //Display the categories of jobs
            const categories = await getCategoriesFromDB();
        
            if (categories.length > 0) {
                // If categories are found, display them in the USSD response
                response = `CON Choose job category:\n`;
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
        }
        if(level === 3 && textArray[1]==='5'){
            //Display the  jobs in the selected categories
            try {
                const selectedCategoryIndex = parseInt(textArray[2]) - 1;
                const selectedCategoryName = selectedJobs[selectedCategoryIndex];
                
                // Retrieve the selected category from the database based on selectedCategoryName
                const selectedCategory = await Job.findOne({ JobCategories: selectedCategoryName });
            
                // Check if the category exists
                if (selectedCategory) {
                    // Get the list of courses for editing
                     jobs = selectedCategory.Jobs;
            
                    if (jobs.length > 0) {
                        // If jobs are found, display them for editing
                        response = `CON <b>Jobs in ${selectedCategoryName} to delete:</b>\n`;
                       jobs.forEach((job, index) => {
                            response += `${index + 1}. <b>${job.Position}</b>\n`;
                            return response;
                        });
                        response += `99. Back\n`;
                         return response;
                    } else {
                        // If no courses are found, provide a message
                        response = `END No jobs in this category found.\n`;
                        return response;
                    }
                } else {
                    // Handle the case where the specified category does not exist
                    response = 'END Specified jobs not found. Unable to view jobs.';
                    return response;
                }
            } catch (error) {
                // Handle any errors that occur during database operations
                console.error(error);
                response = 'END An unexpected error occurred while retrieving jobs .';
                return response;
            }

        }
        if(level === 4 && textArray[1]==='5'){
            //Logic for deleting a job
            try {
                const selectedCategoryIndex = parseInt(textArray[2]) - 1;
                const selectedJobIndex = parseInt(textArray[2]) - 1;
        
                const selectedCategoryName = selectedJobs[selectedCategoryIndex];
                const selectedCategory = await Job.findOne({  JobCategories: selectedCategoryName });
        
                if (selectedCategory) {
                    const jobs = selectedCategory.Jobs;
        
                    if (jobs.length > 0 && jobs[selectedJobIndex]) {
                        const jobToDelete = jobs[selectedJobIndex];
                        // Perform the deletion operation here
                        // For example, remove the course from the array and save the updated category
                        jobs.splice(selectedJobIndex, 1);
        
                        // Save the updated category back to the database
                        await selectedCategory.save();
        
                        response = 'END Job deleted successfully!';
                        return response;
                    } else {
                        response = 'END Invalid Job selection. Please try again.';
                        return response;
                    }
                } else {
                    response = 'END Specified category not found. Unable to delete Job.';
                    return response;
                }
            } catch (error) {
                console.error(error);
                response = 'END An unexpected error occurred while deleting the Job';
                return response;
            }
        }
    }
}

function getCompanyType(){
    let response = `CON Select your company type\n`;
    response += "1. Sole Proprietorship\n";
    response += "2. Partnership\n";
    response += "3. Corporation\n";
    response += "4. Non-profit Organization\n";
    response += "5. Cooperative\n";
    response += "6. Start-up";

    return response;

}

function getCompanyTypeText(selectedOption) {
    switch (selectedOption) {
        case '1':
            return 'Sole Proprietorship';
        case '2':
            return 'Partnership';
        case '3':
            return 'Corporation';
        case '4':
            return 'Non-profit Organizationg';
        case '5':
            return 'Cooperative';
        case '6':
            return 'Start-up';
        default:
            return 'Unknown Company Type';
    }
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
module.exports = Employeer;