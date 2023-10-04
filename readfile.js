const fs = require('fs');
const readline = require('readline');
const Table = require('cli-table');


const logFile = 'api-dev-out.log'; 
// Additional log files for testing purposes (available in the drive).
// const logFile = 'api-prod-out.log'; 
// const logFile = 'prod-api-prod-out.log'; 


// Initialize objects for analysis
const endpointCounts = {};
const apiCallsPerMinute = {};
const statusCodeCounts = {};

// Create a readable stream for the log file
const readStream = fs.createReadStream(logFile);

// Create a readline interface to read lines from the log file
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});

// Process each line of the log data

rl.on('line', (line) => {
  // Split the log entry into parts based on spaces
  const parts = line.split(' ');

  if (parts.length >= 4) {
    const timestamp = parts.slice(0, 2).join(' '); // Extract the timestamp
    const logMessage = parts.slice(3).join(' '); // Extract the log message
    
    // process only api ignore other logs 
    if(logMessage.includes('HTTP/1.1')) {
      // Count endpoint calls (assuming log messages contain endpoint information)
      const endpoint = logMessage.split(' ')[6];
      endpointCounts[endpoint] = (endpointCounts[endpoint] || 0) + 1;

      // Extract minute from timestamp and count API calls per minute
      const minute = timestamp.substr(0, 16); // Extract the first 16 characters (YYYY-MM-DD HH:mm)
      apiCallsPerMinute[minute] = (apiCallsPerMinute[minute] || 0) + 1;

      // Count API calls by HTTP status code (assuming log messages contain status codes)
      const statusCode = logMessage.split(' ')[8];
      statusCodeCounts[statusCode] = (statusCodeCounts[statusCode] || 0) + 1;
    }

  }
});
// table for response status
let responseTable = new Table({
  head: ['(index)', 'statusCode', 'count']
});

let endpointTable = new Table({
  head: ['endpoint', 'count']
});

function createTable(statusCodeCounts) {
  for (const statusCode in statusCodeCounts) {

    let statusName 
    if(statusCode >=200 && statusCode <300) {
      if(statusCode ==200) statusName = "OK";
      else if(statusCode ==206) statusName ="Not found"
      else statusName ="successfull response"
    }
    else if(statusCode >=300 && statusCode <400) {
      if(statusCode ==304)  statusName ="Not Modified"
      else statusName = "Redirection messages"
    }
    else if(statusCode >=400 && statusCode <500) {
      if(statusCode == 400) statusName ="Bad request"
      else if(statusCode == 401) statusName ="Unauthorized"
      else if(statusCode == 404) statusName = "Not Found"
      else if(statusCode == 422) statusName = "Unprocessable Content "
      else statusName ="Client error responses"
    }
    else if(statusCode >=500 && statusCode <600) {
      if(statusCode ==500) statusName ="Internal Server Error"
      else statusName = "Server error responses"
  
    }
    if(statusName)
      responseTable.push([statusName, statusCode, statusCodeCounts[statusCode]]);
  }
}

// After reading all lines, print the results
rl.on('close', () => {
  console.log("Endpoint Calls:");
  for (const ele in endpointCounts) {
    endpointTable.push([ele, endpointCounts[ele]]);
  }
  console.log(endpointTable.toString());

  console.log("\nAPI Calls per Minute:");
  console.table(apiCallsPerMinute);

  console.log("\nTotal API Calls by HTTP Status Code:");
  createTable(statusCodeCounts)
  console.log(responseTable.toString());
});
