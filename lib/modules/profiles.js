const chalk = require('chalk')
const io = require('../io')
const config = new (require('conf'))()

module.exports = {
    async create(argv) {
        const profileName = argv._.shift()
        if(!profileName)
            throw new Error('Missing arguement: PROFILE \nUsage: cpcli profiles create PROFILE')

        if(config.has(`profiles.${profileName}`))
            throw new Error(`A profile named "${profileName}" already exists`)

        io.print(`[ > ] Profile creation wizard: ${chalk.bold(profileName)}`)
        const data = await io.askProfileData()
        const profile = {
            name: profileName,
            controlpanel: {
                host: data.controlpanel_host,
                key: data.controlpanel_key
            },
            pterodactyl: {
                host: data.pterodactyl_host,
                key: data.pterodactyl_key
            }
        }
        config.set(`profiles.${profile.name}`, profile)
        io.success(`[ + ] Profile "${profile.name}" successfully created`)
        config.set(`currentProfile`, profile)
        io.success(`[ + ] Switched to profile "${profile.name}"`)
    },

    async list(argv){
        const profiles = config.get('profiles')        
        if(!profiles || !Object.entries(profiles).length)
            throw new Error('No profile found!')

        const profileName = argv._.shift()
        if(profileName){
            const profile = profiles[profileName]
            if(!profile)
                throw new Error(`No such profile "${profileName}" found`)
            
            io.print(`[ > ] Profile: ${profile.name}`)
            console.log(profile)
            return
        }

        io.print(`[ > ] Available profiles: ${Object.entries(profiles).length}`)
        io.tree(Object.keys(profiles).map(key => (config.has('currentProfile') && config.get('currentProfile').name === key) ? `${key} (current)` : key))        
    },

    async delete(argv){
        const profileName = argv._.shift()
        if(!profileName)
            throw new Error('Missing arguement: PROFILE \nUsage: cpcli profiles delete PROFILE')

        const profiles = config.get('profiles')        
        if(!profiles || !profiles[profileName])
            throw new Error(`No such profile "${profileName}" found`)

        const profile = profiles[profileName]

        if(config.has('currentProfile') && config.get('currentProfile').name === profile.name)
            throw new Error(`Profile "${profile.name}" is currently in use. \nSwitch to a different profile first.`)

        config.delete(`profiles.${profile.name}`)
        io.success(`[ - ] Profile "${profile.name}" successfully deleted`)

    },
    
    async use(argv){
        const profileName = argv._.shift()
        if(!profileName)
            throw new Error('Missing arguement: PROFILE \nUsage: cpcli profiles use PROFILE')

        const profiles = config.get('profiles')        
        if(!profiles || !profiles[profileName])
            throw new Error(`No such profile "${profileName}" found`)

        const profile = profiles[profileName]
        config.set(`currentProfile`, profile)
        io.success(`[ + ] Switched to profile "${profile.name}"`)
    }
    
}