const fs = require("fs");
const path = require("path");
const axios = require("axios");
const inquirer = require("inquirer");



const questions = [
    {
        type: "input",
        message: "What is your github username?",
        name: "username"
    },
    {
        type: "input",
        message: "What is the project title?",
        name: "title"
    },
    {
        type: "input",
        message: "What is the project description?",
        name: "description"
    },
    {
        type: "checkbox",
        message: "What are the contents?",
        name: "table",
        choices: ['Installation', 'Usage', 'License', 'Contributing', 'Tests', 'Questions']
    },
    {
        type: "input",
        message: "what step by steps of installation?",
        name: "installation"
    },
    {
        type: "input",
        message: "what is the usage?",
        name: "usage"
    },
    {
        type: "list",
        message: "what license should the project have?",
        name: "license",
        choices: [
            'MIT',
            'GNU',
            'Apache'
        ]
    },
    {
        type: "input",
        message: "who is contributing? (please list contributors' github usernames separated by commas)",
        name: "contributing"
    },
    {
        type: "input",
        message: "Please write details of the testing procedures",
        name: "tests"
    }
];

function writeToFile(data) {
console.log(data)

let githubCont = data.contributing.split(',')
let githubUser = [];
githubCont.map(user=> githubUser.push(user.trim()))
let githubUserStr = '';
githubUser.map(user=>{
    githubUserStr+= `[${user}]('https://github.com/${user}') \n`
})
console.log(githubCont)

let content = '';

data.table.map(stuff=>{
    content += `* [${stuff}](#${stuff.toLowerCase()}) \n \n`
})

let license = data.license === 'MIT' ? "[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)]" : data.license === 'GNU' ? 
"[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)]" : "[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)]"

let fileTxt = `
# ${data.title}
${license}(${data.html_url})
## Description
​
${data.description}
​
## Table of Contents
${content}
## Installation
​
To install necessary dependencies, run the following command:
​
${data.installation}
​
## Usage
​
${data.usage}
​
## License
​
This project is licensed under the ${data.license} license.
  
## Contributing
​
${githubUserStr}
## Tests
​
To run tests, run the following command:
​
npm test
​
## Questions
​
<img src="${data.avatar_url}" alt="avatar" style="border-radius: 16px" width="30" />
​
If you have any questions about the repo, open an issue or contact [${data.login}](${data.html_url}) directly at ${data.blog}.
`

fs.writeFile(`${data.title}.md`, fileTxt , function(err){
    if(err){
        console.log(err);
        throw err;
    }else{
        console.log('Success!')
    }
})
};


function init() {
    inquirer
        .prompt(questions)
        .then(response => {
            console.log(response)
            axios.get(`https://api.github.com/users/${response.username}`).then(data=>{
                writeToFile({...response, ...data.data})
            }).catch(err=>console.log(err))
        })
        .catch(err => console.log(err))
}

init();