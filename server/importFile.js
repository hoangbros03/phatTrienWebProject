const fs = require('fs-extra');
const fetch = require("node-fetch");
fs.readFile('../generate_data/cars_test1.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const obj = JSON.parse(data);

  // console.log(obj.centers[0]);
//   const url = 'http://localhost:3500/trungTamDangKiem/admin/databaseManagement/import';
    const url = 'http://localhost:3500/trungTamDangKiem/admin/databaseManagement/import';
   
    
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body:JSON.stringify(obj),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}, Text: ${response.statusText}`);
    }
    return response.json();
  })
  .then(responseData => {
    // Process the response data
    console.log(responseData);
  })
  .catch(error => {
    // Handle any errors that occurred during the request
    console.error('Error:', error);
  });}

  // for(var i=0;i<100;i++)
  // {
  //   console.log(data[i]);
  // }
  // // You can now work with the file contents
  // For example, you can parse it as JSON, process it, etc.
// }
);