const Support = {
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
}

module.exports = Support;