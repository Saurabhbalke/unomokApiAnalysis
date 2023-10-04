# Api analysis

This project has been created using JavaScript to perform API analysis based on provided log files (dummy log files).

## Installation
### Prerequisites
- Node <br>

Step 1: Clone the git repository <br>
Step 2: Run `npm install cli-table` to install cli-table package. <br>


## Run CLI

Run `node readfile.js` to execute the program.


## Dependencies used

1 NodeJs: Node.js is a server-side JavaScript runtime environment designed for building scalable and high-performance network applications.
- Efficiently handles multiple connections simultaneously.
- Provides a vast ecosystem of reusable code packages.
- Works on Windows, macOS, and Linux.
- Suitable for web apps, APIs, real-time apps, and more.

2 Cli-table: The cli-table package is a JavaScript library that simplifies the creation and formatting of tables in command-line interfaces (CLIs). It is particularly useful for organizing and displaying tabular data in a structured and visually appealing way when working with Node.js applications.

## My Approach to solve the problem

In the supplied log files, various types of logs are present. To differentiate API-related logs, I've identified those containing "HTTP/1.1" in the log message. By parsing the log entries and counting the index positions, I've separated the timestamp, endpoint, and response status, enabling analysis in accordance with the specified criteria.

I've also mapped the API response status codes to their corresponding response messages, and I've utilized the cli-table library to organize and present this information in a tabular format.
