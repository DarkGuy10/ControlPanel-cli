const chalk = require('chalk')
const io = require('../io')
const config = new (require('conf'))()
const fs = require('fs')
const {Client} = require('controlpanelapi.js')
const path = require('path')

module.exports = {
    async fetch(argv){
        const host = "https://dev-dash.sneakyhub.com/"
        const key = "VHzM4CP-9aN3Zl3WTED_GjPC3Hg6upHx6anzQzDTL4gDqp7-"
        const client = new Client(host, key)
        const users = await client.users.fetchAll()
        io.success(`[ + ] Fetched a total of ${users.length} users`)
        const fileName = argv['output'] || 'users.json'
        fs.writeFileSync(path.join(process.cwd(), fileName), JSON.stringify(users, null, 4))
        io.success(`[ + ] Data written to ${fileName}`)
    }
}