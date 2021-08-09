const io = require('../io')
const config = new (require('conf'))()
const fs = require('fs')
const {Client} = require('controlpanelapi.js')
const path = require('path')

module.exports = {
    async fetch(argv){
        if(!config.has('currentProfile'))
            throw new Error('You have set no profile yet')

        const {host, key} = config.get('currentProfile.controlpanel')
        const client = new Client(host, key)
        let vouchers = await client.vouchers.fetchAll()
        if(argv.valid)
            vouchers = vouchers.filter(voucher => voucher.status === 'VALID')
        else if(argv.invalid)
            vouchers = vouchers.filter(voucher => voucher.status != 'VALID')

        io.success(`[ + ] Fetched a total of ${vouchers.length} vouchers`)
        const fileName = argv['output'] || 'vouchers.json'
        fs.writeFileSync(path.join(process.cwd(), fileName), JSON.stringify(vouchers, null, 4))
        io.success(`[ + ] Data written to ${fileName}`)
    },
    async delete(argv){
        if(!config.has('currentProfile'))
            throw new Error('You have set no profile yet')

        const {host, key} = config.get('currentProfile.controlpanel')
        const client = new Client(host, key)

        let vouchers
        if(argv.invalid)
            vouchers = (await client.vouchers.fetchAll()).filter(voucher => voucher.status != 'VALID' )
        else if(argv.valid)
            vouchers = (await client.vouchers.fetchAll()).filter(voucher => voucher.status === 'VALID' )
        else if(argv.all)
            vouchers = await client.vouchers.fetchAll()
        else
            throw new Error('You didnt use any flags.\nAvailable flags: --invalid, --valid, --all')

        if(!vouchers)
            throw new Error(`Found 0 vouchers matching given conditions`)
        
        io.print(`[ > ] Deleting ${vouchers.length} vouchers`)
        const progressBar = new Progress(40)
        let i = 0
        let promises
        promises = vouchers.map(async voucher => {
            const promise = voucher.delete()
            i++
            console.log(progressBar.update(i, vouchers.length))
            return promise
        })
        await Promise.all(promises)
        io.success(`[ - ] Successfully deleted ${vouchers.length} vouchers`)
    }
}