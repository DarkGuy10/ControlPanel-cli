const chalk = require("chalk")
const inquirer = require("inquirer")

module.exports = {
    error(msg){
        console.log(chalk.redBright(msg))
    },
    success(msg){
        console.log(chalk.greenBright(msg))
    },
    print(msg){
        console.log(chalk.cyanBright(msg))
    },
    tree(iterable){
        for (let i = 0; i < iterable.length - 1; i++)
            console.log(`  ├── ${iterable[i]}`)
        console.log(`  └── ${iterable[iterable.length - 1]}`)
    },
    banner(){
        console.log(chalk.yellowBright("┌───────────────────────────────┐"));
        console.log(chalk.yellowBright("-        ControlPanel-cli       - "));
        console.log(chalk.yellowBright("└───────────────────────────────┘")); 
    },
    async askProfileData(){
        const questions = [
            {
                name: 'controlpanel_host',
                type: 'input',
                message: 'Enter URL to your ControlPanel dashboard:',
                validate: value => {
                    if (value.length && /^(https?):\/\/?(www.)?/.test(value)) 
                        return true
                    else
                        return 'Please enter a valid URL'
                }
            },
            {
                name: 'controlpanel_key',
                type: 'input',
                message: 'Enter the admin apikey for your ControlPanel dashboard:',
                validate: value => {
                    if (value.length) 
                        return true
                    else 
                        return 'Please enter your apikey'
                }
            },            {
                name: 'pterodactyl_host',
                type: 'input',
                message: 'Enter URL to your Pterodactyl panel:',
                validate: value => {
                    if (value.length && /^(https?):\/\/?(www.)?/.test(value))  
                        return true
                    else
                        return 'Please enter a valid URL'
                }
            },
            {
                name: 'pterodactyl_key',
                type: 'input',
                message: 'Enter the admin apikey for your Pterodactyl panel:',
                validate: value => {
                    if (value.length) 
                        return true
                    else 
                        return 'Please enter your apikey'
                }
            }
        ]
        return inquirer.prompt(questions)
    }
}