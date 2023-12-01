const Alerts ={
    JobAlerts: async (textArray, phoneNumber) => {
        const level = textArray.length;
        let response = "";
      
        if (level === 1) {
          response = `CON <b>You Got New Notifications</b>
                      1. IT Assistance(Zanaco)
                      2. ICT Manager(Zesco)
                      3. Librarian(Mulungushi University)
                     
                      `;
                      return response;
        }
        if(level === 2 && textArray[1]){
          //Get job details and  show an option for  applying for a job
        }
        if(level === 3 &&  textArray[1] === '1'){
          //accept the job
        }
        
      }
}

module.exports = Alerts;