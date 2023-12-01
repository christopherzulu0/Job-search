const {User,Job,Saved,Profile} = require('../models/Schemas');
let jobInterest = ""
let selectedJobs = ""
const Alerts ={
    JobAlerts: async (textArray, phoneNumber) => {

      const users = await User.findOne({phoneNumber: phoneNumber})
       jobInterest = users.JobType;

        const level = textArray.length;
        let response = "";
      
        if (level === 1) {
          try {
            // Fetch job categories from the database
            const categories = await getCategoriesFromDB();
    
            if (categories.length > 0) {
              // Filter jobs based on user's job interest
              const jobsInInterest = await getJobsInInterest(jobInterest);
    
              if (jobsInInterest.length > 0) {
                response = `CON List of Jobs in your job interests:\n`;
                jobsInInterest.forEach((job, index) => {
                  response += `${index + 1}. ${job.Position}(${job.CompanyName})\n`;
                });
                response += `99. Back`;
                selectedJobs = jobsInInterest;
                return response;
              } else {
                response = `END No jobs found in your job interest.`;
                return response;
              }
            } else {
              response = `END No job categories found.`;
              return response;
            }
          } catch (error) {
            console.error(error);
            response = `END An unexpected error occurred. Please try again later.`;
            return response;
          }
        }

        //Get job details
        if(level === 2){
         // Assuming you have a jobs array with details of each job
         const selectedJobIndex = parseInt(textArray[1]) - 1;
        
         // Check if the selectedJobIndex is valid
         if (selectedJobIndex >= 0 && selectedJobIndex < selectedJobs.length) {
           const selected = selectedJobs[selectedJobIndex];
       
           // Display job details
           response = `CON  <b>${selected.Position}</b> Details:
           
             Location: <b>${selected.Location}</b>
             Company: <b>${selected.CompanyName}</b>
             Deadline: <b>${selected.DeadLine}</b>
             Job Summary:
             <b>${selected.JobSummary}</b>
             

             99. Go Home
           `;
           return response;
         
       }
        }
    }
}

// Function to get job categories from DB
async function getCategoriesFromDB() {
  try {
    const categories = await Job.find({}, 'JobCategories');
    return categories.map(category => category.JobCategories);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to get jobs based on user's job interest
async function getJobsInInterest(jobInterest) {
  try {
    const jobs = await Job.find({ JobCategories: jobInterest }, 'Jobs');
    return jobs.length > 0 ? jobs[0].Jobs : [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = Alerts;