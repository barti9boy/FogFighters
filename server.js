const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 4000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// Handle a socket connection request from web client
const connections = [null,null]
io.on('connection', socket => {
    //console.log('New WS Connection')

    //Find an available player number
    let playerIndex = - 1
    for (const i in connections){
        if(connections[i] === null){
            playerIndex = i
            break
        }
    }


    // Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex)

    console.log(`Player ${playerIndex} has connected`)

    //Ignore player 3
    if (playerIndex == -1) return

    connections[playerIndex] = false

    // Tell everyone what player number just connected
    socket.broadcast.emit('player-connection', playerIndex)
    
    // Handle Disconnect
    socket.on('disconnect', () => {
        console.log(`Player ${playerIndex} disconnected`)
        connections[playerIndex] = null
        // Tell everyone what player number just disconnected
        socket.broadcast.emit('player-connection', playerIndex)

    })

    // On Ready
    socket.on('player-ready', () => {
        socket.broadcast.emit('enemy-ready', playerIndex)
        connections[playerIndex] = true
    })

    // Check player connections
    socket.on('check-players', () =>{
        const players = []
        for (const i in connections){
            connections[i] === null ? players.push({connected: false, ready: false}) :
            players.push({connected: true, ready: connections[i]})
        }
        socket.emit('check-players', players)
    })
    
    // On Warrior Placed
    socket.on('warrior-position', id => {
        console.log(`${playerIndex} warrior placed in`, id)

        // Forward Warrior to other player
        socket.broadcast.emit('warrior-position', id)
    })
    
    // On Rogue Placed
    socket.on('rogue-position', id => {
        console.log(`${playerIndex} rogue placed in`, id)

        // Forward Warrior to other player
        socket.broadcast.emit('rogue-position', id)
    })

    // On Archer Placed
    socket.on('archer-position', id => {
        console.log(`${playerIndex} archer placed in`, id)

        // Forward Warrior to other player
        socket.broadcast.emit('archer-position', id)
    })

    // Change turns
    socket.on('attack', yourTurn => {
        console.log(`${playerIndex} finished turn `)
        socket.broadcast.emit('attack', yourTurn)
    })

    // WarriorHP
    socket.on('warriorHP', warriorHP => {
        console.log(`warrior has ${warriorHP} HP `)
        socket.broadcast.emit('warriorHP', warriorHP)
    })

    // RogueHP
    socket.on('rogueHP', rogueHP => {
        console.log(`rogue has ${rogueHP} HP `)
        socket.broadcast.emit('rogueHP', rogueHP)
    })

    // ArcherHP
    socket.on('archerHP', archerHP => {
        console.log(`archer has ${archerHP} HP `)
        socket.broadcast.emit('archerHP', archerHP)
    })    

})