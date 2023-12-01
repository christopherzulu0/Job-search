const {User,Job, resume} = require('../models/Schemas');
const shortid = require('shortid');

let selectedJobs = ""
let jobs =""
let  selectedCategory =""
let chosenCategory= ""
let application = ""

const Category = {
    BrowseCategory: async (textArray, phoneNumber) => {
        const level = textArray.length;
        let response = "";
      
        switch (level) {
          case 1:
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
        if(level === 2 && textArray[1] === '1'){
           //Display the  jobs in the selected categories
           try {
            const selectedCategoryIndex = parseInt(textArray[1]) - 1;
            const selectedCategoryName = selectedJobs[selectedCategoryIndex];
            
            // Retrieve the selected category from the database based on selectedCategoryName
            selectedCategory = await Job.findOne({ JobCategories: selectedCategoryName });
        
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

         if (level === 3 && textArray[1] === '1') {
          // Assuming you have a jobs array with details of each job
          const selectedJobIndex = parseInt(textArray[2]) - 1;
        
          // Check if the selectedJobIndex is valid
          if (selectedJobIndex >= 0 && selectedJobIndex < jobs.length) {
            const selectedJob = jobs[selectedJobIndex];
        
            // Display job details
            response = `CON 
              Position: <b>${selectedJob.Position}</b>
              Location: <b>${selectedJob.Location}</b>
              Company: <b>${selectedJob.CompanyName}</b>
              Deadline: <b>${selectedJob.DeadLine}</b>
              Job Summary:
              <b>${selectedJob.JobSummary}</b>
              
              <b>To Apply:</b>
                
              1. Apply for Job
              99. Go Home
            `;
            return response;
          }
        }
          //logic for applying for a job
          if (level === 4 && textArray[1] === '1' && textArray[3] === '1') {
            const selectedJobIndex = parseInt(textArray[2]) - 1;
            const id = shortid.generate();
          
            const resumes = await resume.findOne({ phoneNumber: phoneNumber });
            const EducationLevel = resumes.Education;
            const Years = resumes.Experience;
            const PortLink = resumes.PortfolioLink;
            const courses = resumes.Course;
            const names = resumes.Name;
            const emails = resumes.Email;
          
            if (selectedJobIndex >= 0 && selectedJobIndex < jobs.length) {
              const selectedJob = jobs[selectedJobIndex];
          
               application = {
                Name: names,
                Email: emails,
                phoneNumber: phoneNumber,
                Education: EducationLevel,
                Experience: Years,
                PortfolioLink: PortLink,
                Course: courses,
                Status: 'Pending',
                ApplicationID: id
              };
          
              // Log the dynamic values for troubleshooting
              chosenCategory = selectedCategory.JobCategories;
              console.log("Selected Category:", chosenCategory);
              console.log("Update Operation Data:", application);

             

              function submitApplication() {
                return new Promise(async (resolve, reject) => {
                  try {
                    // Update the Jobs document with the new application
                    const result = await Job.updateOne(
                      {JobCategories: chosenCategory },
                      { $push: { Applications: application } }
                    );
                   console.log("Result:",result)
                    resolve(result);
                  } catch (error) {
                    reject(error);
                  }
                });
              }
              
          
              
              let submitted = await submitApplication();

              if (submitted) {
                response = `END Application submitted successfully. Thank you!`;
                return response;
              } else if(!submitted){
                response = `END Error submitting the application. Please try again later.`;
                return response;
              }
            }
          }
          

          
       return response   
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

  

module.exports = Category;