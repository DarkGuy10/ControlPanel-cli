const { default: axios } = require("axios")

class Pterodactyl {
    constructor(host, key) {
        this.host = host
        this.key = key
        this.instance = axios.create({
            baseURL: this.host,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.key}`
            }
        })
    }

    async getAllServers() {
        const servers = []
        const pageCount = (await this.instance.get('/api/application/servers?per_page=1000')).data['meta']['pagination']['total_pages']
        const promises =  [...Array(pageCount + 1).keys()].slice(1).map(async page => {
            const data = (await this.instance.get(`/api/application/servers?page=${page}&&per_page=1000`)).data['data'].map(x => x.attributes)
            return data
        })
        for(const promise of promises)
            servers.pushArray(await promise)
        return servers
    }

    async getServersByEgg(egg_id) {
        const servers = (await this.getAllServers()).filter( server => server.egg == egg_id )
        return servers
    }

    async getServersByNest(nest_id) {
        const servers = (await this.getAllServers()).filter( server => server.nest == nest_id )
        return servers
    }

    async getServersByUser(user_id) {
        const servers = (await this.instance.get(`/api/application/users/${user_id}?include=servers`)).data['attributes']['relationships']['servers']['data'].map(x => x.attributes)
        return servers
    }

    async deleteAllServers() {
        const servers = await this.getAllServers()
        servers.foreach(async server => await this.deleteServer(server))
    }

    async deleteServer(server) {
        return this.instance.delete(`/api/application/servers/${server.id}/force`)
    }

    async deleteServersByEgg(egg_id){
        const servers = await this.getServersByEgg(egg_id)
        servers.foreach(async server => await this.deleteServer(server))
    }

    async deleteServersByNest(nest_id){
        const servers = await this.getServersByNest(nest_id)
        servers.foreach(async server => await this.deleteServer(server))
    }
}

// Utility function
Array.prototype.pushArray = function(arr) {
    this.push.apply(this, arr)
}

module.exports = Pterodactyl