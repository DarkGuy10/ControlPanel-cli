#! /usr/bin/env node

// Import required modules
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const io = require('./lib/io')
io.banner()

const modules = new Map()
for(const each of fs.readdirSync(path.join(__dirname, '/lib/modules'))){
    const mod = require(`./lib/modules/${each}`)
    modules.set(each.replace('.js', ''), mod)
}

let argv = require('minimist')(process.argv.slice(2))

if(!argv._.length){
    io.print(`[ > ] Available modules:`)
    io.tree(Array.from(modules.keys()))
    return
}
const moduleName = argv._.shift().toLowerCase()
const mod = modules.get(moduleName)
if(!mod){
    io.error(`Error: No module named "${moduleName}" found`)
    io.print(`[ > ] Available modules:`)
    io.tree(Array.from(modules.keys()))
    return
}

if(!argv._.length){
    io.print(`[ > ] Available commands for module: ${moduleName}`)
    io.tree(Object.keys(mod))
    return
}
const commandName = argv._.shift().toLowerCase()
if(!mod.hasOwnProperty(commandName)) {
    io.error(`Error: Module "${moduleName}" has no command "${commandName}"`)
    io.print(`[ > ] Available commands for module: ${moduleName}`)
    io.tree(Object.keys(mod))
    return
}
const command = mod[commandName]

command(argv)
    .catch(err => {
        io.error(err)
    })