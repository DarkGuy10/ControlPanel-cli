const io = require('../io')
const config = new (require('conf'))()
const fs = require('fs')
const path = require('path')
const Pterodactyl = require('../Pterodactyl')
const {Client} = require('controlpanelapi.js')
const { Progress } = require('clui')

module.exports = {
    async fetch(argv){
        if(!config.has('currentProfile'))
            throw new Error('You have not set a profile yet')

        const pterodactyl = config.get('currentProfile.pterodactyl')
        const controlpanel = config.get('currentProfile.controlpanel')
        const panel = new Pterodactyl(pterodactyl.host, pterodactyl.key)
        const dash = new Client(controlpanel.host, controlpanel.key)

        let servers
        if(argv.egg)
            servers = await panel.getServersByEgg(argv.egg)
        else if(argv.nest)
            servers = await panel.getServersByNest(argv.nest)
        else if(argv.suspended)
            servers = (await dash.servers.fetchAll()).filter(server => server.suspended)
        else 
            servers = await dash.servers.fetchAll()
        
        if(!servers)
            throw new Error(`Found 0 servers matching given conditions`)

        io.success(`[ + ] Fetched a total of ${servers.length} servers`)
        const fileName = argv['output'] || 'servers.json'
        fs.writeFileSync(path.join(process.cwd(), fileName), JSON.stringify(servers, null, 4))
        io.success(`[ + ] Data written to ${fileName}`)     
    },

    async delete(argv) {
        if(!config.has('currentProfile'))
            throw new Error('You have not set a profile yet')

        const pterodactyl = config.get('currentProfile.pterodactyl')
        const controlpanel = config.get('currentProfile.controlpanel')
        const panel = new Pterodactyl(pterodactyl.host, pterodactyl.key)
        const dash = new Client(controlpanel.host, controlpanel.key)

        let servers
        if(argv.egg)
            servers = await panel.getServersByEgg(argv.egg)
        else if(argv.nest)
            servers = await panel.getServersByNest(argv.nest)
        else if(argv.suspended)
            servers = (await dash.servers.fetchAll()).filter(server => server.suspended)
        else if(argv.all)
            servers = await panel.getAllServers()
        else   
            throw new Error('You didnt use any flags.\nAvailable flags: --egg=EGG, --nest=NEST, --suspended, --all')
     
        if(!servers)
            throw new Error(`Found 0 servers matching given conditions`)

        if(!(await io.confirm(`Are you sure you want to delete ${servers.length} servers?`, false)).confirm )
            return

        io.print(`[ > ] Deleting ${servers.length} servers`)
        const progressBar = new Progress(40)
        let i = 0
        let promises
        
        if(!argv.suspended)
            promises = servers.map(async server => {
                const promise = pterodactyl.deleteServer(server)
                i++
                console.log(progressBar.update(i, servers.length))
                return promise
            })
        else // Uses dash API here
            promises = servers.map(async server => {
                const promise = server.delete()
                i++
                console.log(progressBar.update(i, servers.length))
                return promise
            })

        await Promise.all(promises)
        io.success(`[ - ] Successfully deleted ${servers.length} servers`)
    }
}