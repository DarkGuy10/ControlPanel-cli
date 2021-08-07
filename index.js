#! /usr/bin/env node

// Import required modules
const chalk = require('chalk')
const fs = require('fs')
const io = require('./lib/io')
io.banner()

const modules = new Map()
for(const each of fs.readdirSync('./lib/modules/')){
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
if(!mod) return

if(!argv._.length){
    io.print(`[ > ] Available commands for module: ${moduleName}`)
    io.tree(Object.keys(mod))
    return
}
const commandName = argv._.shift().toLowerCase()
if(!mod.hasOwnProperty(commandName)) return
const command = mod[commandName]

command(argv)
    .catch(err => {
        io.error(err)
    })