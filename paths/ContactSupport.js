const Support = {
    ContactSupport: async (textArray, phoneNumber) => {
        const level = textArray.length;
        let response = "";
      
        if (level === 1) {
          response = `CON <b>Contact Support:</b>
                      1. <b>Manager</b>
                         Call: 0979159499
                      2. <b>Assistant Manager</b>
                         Call: 0979952679
                     
                     
                      `;
        }
      
        return response;
      }
}

module.exports = Support;