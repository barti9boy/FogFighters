//Check if everything is loaded
document.addEventListener('DOMContentLoaded', () => {
    const userGrid = document.querySelector('.grid-user')
    const enemyGrid = document.querySelector('.grid-enemy')
    const displayGrid = document.querySelector('.grid-display')
    const fighters = document.querySelectorAll('.fighter')
    const warrior = document.querySelector('.warrior')
    const rouge = document.querySelector('.rouge')
    const archer = document.querySelector('.archer')
    const readyButton = document.querySelector('#ready')
    const WarriorButton = document.querySelector('#warrior')
    const Warrior1Button = document.querySelector('#warrior_1')
    const Warrior2Button = document.querySelector('#warrior_2')
    const RogueButton = document.querySelector('#rogue')
    const Rogue1Button = document.querySelector('#rogue_1')
    const Rogue2Button = document.querySelector('#rogue_2')
    const ArcherButton = document.querySelector('#archer')
    const turnDisplay = document.querySelector('#whose-go')
    const infoDisplay = document.querySelector('#info')
    const playButton = document.querySelector('#playButton')

    let endOfTurn = false
    let isGameOver = false
    let currentPlayer = "user"

    const userSquares = []
    const enemySquares = []
    const width = 4

    //Multiplayer connection
    let gameMode = ""
    let playerNum = 0
    let ready = false
    let enemyReady = false
    let allWarriorsPlaced = false
    let enemyWarriorId
    let enemyRogueId
    let enemyArcherId

    let myWarrior
    let myRogue
    let myArcher
    let myWarriorId
    let myRogueId
    let myArcherId

    class Fighter{
        constructor(name, HP, DMG, alive){
            this.name = name
            this.HP = HP
            this.DMG = DMG
            this.alive = alive
        }
    }

    let enemyWarrior = new Fighter("warrior", 40, 8, true)
    let enemyRogue = new Fighter("rogue", 10, 20, true)
    let enemyArcher = new Fighter("archer", 24, 12, true)

    // Select Player Mode
    playButton.addEventListener('click', startGame)



    //Multiplayer

    function startGame(){
        gameMode = 'multiPlayer'

        const socket = io();

        //Get your player number
        socket.on('player-number', num => {
            if (num === -1){
                infoDisplay.innerHTML = "Sorry, the server is full"
            }
            else {
                playerNum = parseInt(num)
                if (playerNum === 1){
                    currentPlayer = "enemy"
                }
                console.log(playerNum)

                // Get other player status
                socket.emit('check-players')
            }
        })
            // Another player has connected or disconnected
        socket.on('player-connection', num => {
        console.log(`Player number ${num} has connected or disconnected`)
        playerConnectedOrDisconnected(num)
        })  
        
        function playerConnectedOrDisconnected(num){
            let player = `.p${parseInt(num) + 1}`
            document.querySelector(`${player} .connected span`).classList.toggle('green')
            if(parseInt(num) === playerNum){
                document.querySelector(player).style.
                fontWeight = 'bold'
            }
        }
        
        // Ready button click
        readyButton.addEventListener('click', () => {
            if(allWarriorsPlaced){
                 playGameMulti(socket)
            }
            else{
                alert("Please place all warriors")
            }
        })

        // On enemy ready
        socket.on('enemy-ready', num => {
            enemyReady = true
            playerReady(num)
            if(ready){
                playGameMulti(socket)
            }
        })

        // Check player status
        socket.on('check-players', players => {
            players.forEach((p, i) => {
                if(p.connected) {
                    playerConnectedOrDisconnected(i)
                }
                if(p.ready){
                    playerReady(i)
                    if(i !== playerNum){
                        enemyReady = true
                    }
                }
            }
        )})

        // Setup event listener for warriors position
        readyButton.addEventListener('click', () => {
            if(ready && enemyReady){
                socket.emit('warrior-position', myWarriorId)
                socket.emit('rogue-position', myRogueId)
                socket.emit('archer-position', myArcherId)

                console.log("both ready")
                
                // On Warrior Position Recieved
                socket.on('warrior-position', id => {
                    enemyWarriorId = id
                    enemySquares[id].classList.add("warrior")
                })
                // On Rogue Position Recieved
                socket.on('rogue-position', id => {
                    enemyRogueId = id
                    enemySquares[id].classList.add("rogue")
                })
                // On Archer Position Recieved
                socket.on('archer-position', id => {
                    enemyArcherId = id
                    enemySquares[id].classList.add("archer")
                })
            }
        })
        // Event listener for attack
        enemySquares.forEach(square => {
            square.addEventListener('click', () => {
                if(ArcherB == true){
                    socket.emit('attack', true)
                    socket.emit('warriorHP', enemyWarrior.HP)
                    socket.emit('rogueHP', enemyRogue.HP)
                    socket.emit('archerHP', enemyArcher.HP)
                }
                if(Warrior1B == true){
                    socket.emit('attack', true)
                    socket.emit('warriorHP', enemyWarrior.HP)
                    socket.emit('rogueHP', enemyRogue.HP)
                    socket.emit('archerHP', enemyArcher.HP)
                }
                if(Warrior2B == true){
                    socket.emit('attack', true)
                    socket.emit('warriorHP', enemyWarrior.HP)
                    socket.emit('rogueHP', enemyRogue.HP)
                    socket.emit('archerHP', enemyArcher.HP)
                }
                if(Rogue1B == true){
                    socket.emit('attack', true)
                    socket.emit('warriorHP', enemyWarrior.HP)
                    socket.emit('rogueHP', enemyRogue.HP)
                    socket.emit('archerHP', enemyArcher.HP)
                }
                if(Rogue2B == true){
                    socket.emit('attack', true)
                    socket.emit('warriorHP', enemyWarrior.HP)
                    socket.emit('rogueHP', enemyRogue.HP)
                    socket.emit('archerHP', enemyArcher.HP)
                }
            })
        })
        socket.on('attack', yourTurn => {
            changeTurn(socket, yourTurn)
            playGame()
        })
        socket.on('warriorHP', warriorHP => {
            myWarrior.HP = warriorHP
            console.log(myWarrior.HP)
            if(myWarrior.HP <= 0){
                myWarrior.alive = false
            }
            GameOver()
        })
        socket.on('rogueHP', rogueHP => {
            myRogue.HP = rogueHP
            console.log(myRogue.HP)
            if(myRogue.HP <= 0){
                myRogue.alive = false
            }
            GameOver()
        })
        socket.on('archerHP', archerHP => {
            myArcher.HP = archerHP
            console.log(myArcher.HP)
            if(myArcher.HP <= 0){
                myArcher.alive = false
            }
            GameOver()
        })

    }

    // Game logic for MultiPlayer
    function playGameMulti(socket){
        if(isGameOver) return
        if(!ready){
            socket.emit('player-ready')
            ready = true
            playerReady(playerNum)
        }

        if(enemyReady){
            if(currentPlayer === 'user'){
                turnDisplay.innerHTML = "Your Go"
            }
            if(currentPlayer === 'enemy'){
                turnDisplay.innerHTML = "Enemy's Go"
            }
        }
    }

    function playerReady(num){
        let player = `.p${parseInt(num) +1}`
        document.querySelector(`${player} .ready span`).classList.toggle('green')
    }

    function disableButtons(){
        if (currentPlayer === 'enemy'){
            Warrior1Button.disabled = true
            Warrior2Button.disabled = true
            Rogue1Button.disabled = true
            Rogue2Button.disabled = true
            ArcherButton.disabled = true 
            WarriorButton.disabled = true
            RogueButton.disabled = true
        }
        if (currentPlayer === 'user'){
            Warrior1Button.disabled = false
            Warrior2Button.disabled = false
            Rogue1Button.disabled = false
            Rogue2Button.disabled = false
            ArcherButton.disabled = false 
            WarriorButton.disabled = false
            RogueButton.disabled = false
        }
    }

    /*function turnListenersOff(){
        enemySquares.forEach(square => square.addEventListener('mouseover', function(e){}))
        enemySquares.forEach(square => square.addEventListener('mouseout', function(e){}))
        enemySquares.forEach(square => square.addEventListener('click', function(e){}))
    }*/

    function changeTurn(socket, yourTurn){
        if(isGameOver) return
        if(currentPlayer = "user" && yourTurn == true && endOfTurn == true)
        {
            currentPlayer = "enemy"
            endOfTurn = false
        }
        if(currentPlayer = "enemy" && yourTurn == true )
        {
            currentPlayer = "user"
            endOfTurn = false
        }
    }



    //Create Board
    function createBoard(grid, squares, width){
        for (let i = 0; i < width*width; i++){
            const square = document.createElement('div')
            square.dataset.id = i
            grid.appendChild(square)
            squares.push(square)
        }
    }

    createBoard(userGrid, userSquares,width)
    createBoard(enemyGrid, enemySquares,width)
    console.log(fighters)


    //Drag'n'Drop
    fighters.forEach(fighter => fighter.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragover', dragOver))
    userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
    userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
    userSquares.forEach(square => square.addEventListener('drop', dragDrop))
    userSquares.forEach(square => square.addEventListener('dropend', dragEnd))


    let draggedFighter
    let draggedFighterClass 



    fighters.forEach(fighter => fighter.addEventListener('mousedown', (e) => {
    }))

    function dragStart(e){
        draggedFighter = this
        console.log(draggedFighter)
        console.log(draggedFighterClass)

        if (draggedFighter.className == "fighter warrior"){
            draggedFighterClass="warrior"
            for(let i = 0; i<4; i++){
                userSquares[i].style.backgroundColor = "green"
                myWarrior = new Fighter("warrior", 40, 8, true)
            }
        }
        if (draggedFighter.className == "fighter rogue"){
            draggedFighterClass="rogue"
            for(let i = 4; i<12; i++){
                userSquares[i].style.backgroundColor = "green"
                myRogue = new Fighter("rogue", 10, 20, true)
            }
        }
        if (draggedFighter.className == "fighter archer"){
            draggedFighterClass="archer"
            for(let i = 12; i<16; i++){
                userSquares[i].style.backgroundColor = "green"
                myArcher = new Fighter("archer", 10, 24, true)
            }
        }
    }
    function dragOver(e){
        e.preventDefault()
    }
    function dragEnter(e){
        e.preventDefault()
    }
    function dragLeave(){
        console.log("drag leave")
    }
    function dragDrop(){
        const warriorAllowed = ["0","1","2","3"]
        const rogueAllowed = ["4","5","6","7","8","9","10","11"]
        const archerAllowed = ["12","13","14","15"]
        
        console.log(draggedFighter)
        //draggedFighter.
        console.log(this.dataset.id)
        console.log(warriorAllowed.includes(this.dataset.id))

        if (draggedFighter.className == "fighter warrior"  && warriorAllowed.includes(this.dataset.id)){
            userSquares[parseInt(this.dataset.id)].classList.add(draggedFighterClass)
            myWarriorId = parseInt(this.dataset.id)
            //draggedFighter.draggable = "false"
            //userSquares[parseInt(this.dataset.id)].classList.add(warrior)
 
            displayGrid.removeChild(draggedFighter) 
        } 
        else if (draggedFighter.className == "fighter rogue"  && rogueAllowed.includes(this.dataset.id)){
            userSquares[parseInt(this.dataset.id)].classList.add(draggedFighterClass)
            myRogueId = parseInt(this.dataset.id)
            //draggedFighter.draggable = "false"
            //userSquares[parseInt(this.dataset.id)].classList.add(warrior)

            displayGrid.removeChild(draggedFighter) 
        }
        else if (draggedFighter.className == "fighter archer"  && archerAllowed.includes(this.dataset.id)){
            userSquares[parseInt(this.dataset.id)].classList.add(draggedFighterClass)
            myArcherId = parseInt(this.dataset.id)
            //draggedFighter.draggable = "false"
            //userSquares[parseInt(this.dataset.id)].classList.add(warrior)

            displayGrid.removeChild(draggedFighter) 
        }
        for(let i = 0; i<16; i++){
            userSquares[i].style.backgroundColor = "burlywood"
        }
                // See if all fighters were selected
        if(!displayGrid.querySelector('.fighter')){
            allWarriorsPlaced = true
        }
        console.log(allWarriorsPlaced)
    }   
    function dragEnd(){
        console.log("dragend")
    }
    





    // Game start
    
    function playGame(){
        if (isGameOver) return
        if (currentPlayer === "user"){
            turnDisplay.innerHTML = "Your Turn"
            WarriorButton.addEventListener('click', showMoreWarriorButtons)
            RogueButton.addEventListener('click', showMoreRogueButtons)
            ArcherButton.addEventListener('click', archerAttack)
            Warrior1Button.addEventListener('click', verticalAttack)
            Warrior2Button.addEventListener('click', horisontalAttack)
            Rogue1Button.addEventListener('click', diagonnalyLeftAttack)
            Rogue2Button.addEventListener('click', diagonnalyRightAttack)
            disableButtons()
        }
        if (currentPlayer === "enemy"){
            turnDisplay.innerHTML = "Enemy's Turn"
            WarriorButton.removeEventListener('click', showMoreWarriorButtons)
            RogueButton.removeEventListener('click', showMoreRogueButtons)
            ArcherButton.removeEventListener('click', archerAttack)
            Warrior1Button.removeEventListener('click', verticalAttack)
            Warrior2Button.removeEventListener('click', horisontalAttack)
            Rogue1Button.removeEventListener('click', diagonnalyLeftAttack)
            Rogue2Button.removeEventListener('click', diagonnalyRightAttack)
            //enemySquares.forEach(square => removeEventListener())
            //disableButtons()
            //turnListenersOff()
        }
    }
    playGame()

    
    // Basic game logic

    const firstRaw = ["0","1","2","3"]
    const secondRaw = ["4","5","6","7"]
    const thirdRaw = ["8","9","10","11"]
    const fourthRaw = ["12","13","14","15"]
    const firstColumn = ["0", "4", "8", "12"]
    const secondColumn =["1","5","9","13"]
    const thirdColumn =["2","6", "10","14"]
    const fourthColumn =["3","7","11","15"]
    let ArcherB = false
    let Warrior1B= false
    let Warrior2B= false
    let Rogue1B= false
    let Rogue2B= false

    //readyButton.addEventListener('click', function(e){alert("you're ready")})

    function showMoreWarriorButtons(){
        if (Warrior1Button.style.display =="none" && Warrior2Button.style.display == "none") {
            Warrior1Button.style.display = "flex";
            Warrior2Button.style.display = "flex";

        } 
        else{
            Warrior1Button.style.display = "none"
            Warrior2Button.style.display = "none"
        }
    }
    function showMoreRogueButtons(){
        if (Rogue1Button.style.display =="none" && Rogue2Button.style.display == "none") {
            Rogue1Button.style.display = "flex";
            Rogue2Button.style.display = "flex";
        } 
        else{
            Rogue1Button.style.display = "none"
            Rogue2Button.style.display = "none"
        }
    }
    
//    WarriorButton.addEventListener('click', showMoreWarriorButtons)
//    RogueButton.addEventListener('click', showMoreRogueButtons)

    /*function changeColumnColor(column){
        column.forEach(square => square.style.backgroundColor = "red")
    }*/

    function archerAttack()
    {
        //console.log(warrior1B)
        ArcherB = true
        Warrior1B == false
        Warrior2B == false
        Rogue1B == false
        Rogue2B == false 
        if(ArcherB == true){
            Warrior1Button.disabled = true
            Warrior2Button.disabled = true
            Rogue1Button.disabled = true
            Rogue2Button.disabled = true
            ArcherButton.disabled = true 
/*            if (Warrior1B == true || Warrior2B == true || Rogue1B == true || Rogue2B == true){
                Warrior1B == false
                Warrior2B == false
                Rogue1B == false
                Rogue2B == false 
            }*/
            
            enemySquares.forEach(square => square.addEventListener('mouseover', function(){
                if (currentPlayer === "user"){
                    if (firstRaw.includes(this.dataset.id)){
                        enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                        enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "red"
                        enemySquares[parseInt(this.dataset.id)+8].style.backgroundColor = "red"
                        enemySquares[parseInt(this.dataset.id)+12].style.backgroundColor = "red"
                    }
                    else if (secondRaw.includes(this.dataset.id)){
                        enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "red"
                        enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                        enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "red"
                        enemySquares[parseInt(this.dataset.id)+8].style.backgroundColor = "red"
                    }
                    else if (thirdRaw.includes(this.dataset.id)){
                        enemySquares[parseInt(this.dataset.id)-8].style.backgroundColor = "red"
                        enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "red"
                        enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                        enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "red"
                    }
                    else if (fourthRaw.includes(this.dataset.id)){
                        enemySquares[parseInt(this.dataset.id)-12].style.backgroundColor = "red"
                        enemySquares[parseInt(this.dataset.id)-8].style.backgroundColor = "red"
                        enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "red"
                        enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                    }
                }
               // enemySquares.forEach(square => square.removeEventListener('mouseover', arguments.callee))
            }))
            enemySquares.forEach(square => square.addEventListener('mouseout', function(e){
                if (firstRaw.includes(this.dataset.id)){
                    enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                    enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "burlywood"
                    enemySquares[parseInt(this.dataset.id)+8].style.backgroundColor = "burlywood"
                    enemySquares[parseInt(this.dataset.id)+12].style.backgroundColor = "burlywood"
                }
                else if (secondRaw.includes(this.dataset.id)){
                    enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "burlywood"
                    enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                    enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "burlywood"
                    enemySquares[parseInt(this.dataset.id)+8].style.backgroundColor = "burlywood"
                }
                else if (thirdRaw.includes(this.dataset.id)){
                    enemySquares[parseInt(this.dataset.id)-8].style.backgroundColor = "burlywood"
                    enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "burlywood"
                    enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                    enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "burlywood"
                }
                else if (fourthRaw.includes(this.dataset.id)){
                    enemySquares[parseInt(this.dataset.id)-12].style.backgroundColor = "burlywood"
                    enemySquares[parseInt(this.dataset.id)-8].style.backgroundColor = "burlywood"
                    enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "burlywood"
                    enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                }
            
            }))
            enemySquares.forEach(square => square.addEventListener('click', function(){
            if (currentPlayer === "user"){
                if(firstColumn.includes(this.dataset.id)){
                        for (i=0; i<15; i=i+4){
                            let field = enemySquares[i]
                            if (field.className == "warrior" && enemyWarrior.alive == true)
                            {
                                enemyWarrior.HP = enemyWarrior.HP-12
                                console.log(enemyWarrior.HP)
                                if(enemyWarrior.HP <= 0)
                                {
                                    enemyWarrior.alive = false
                                }
                                currentPlayer = "enemy"
                                ArcherB == false
                                enemySquares.forEach(square => square.removeEventListener('click', arguments.callee));
                                playGame()
                                endOfTurn = true
                                return
                            }
                            else if (field.className == "rogue" && enemyRogue.alive == true)
                            {
                                enemyRogue.HP = enemyRogue.HP-12
                                console.log(enemyRogue.HP)
                                if(enemyRogue.HP <= 0)
                                {
                                    enemyRogue.alive = false
                                }
                                currentPlayer = "enemy"
                                ArcherB == false
                                enemySquares.forEach(square => square.removeEventListener('click', arguments.callee));
                                playGame()
                                endOfTurn = true

                                return
                            }
                            else if (field.className == "archer" && enemyArcher.alive == true)
                            {
                                enemyArcher.HP = enemyArcher.HP-12
                                console.log(enemyArcher.HP)
                                if(enemyArcher.HP <= 0)
                                {
                                    enemyArcher.alive = false
                                }
                                currentPlayer = "enemy"
                                ArcherB == false
                                enemySquares.forEach(square => square.removeEventListener('click', arguments.callee));
                                playGame()
                                endOfTurn = true
                                return
                            }
                            else
                            {
                                console.log("missed") 
                                currentPlayer = "enemy"
                                ArcherB == false
                                enemySquares.forEach(square => square.removeEventListener('click', arguments.callee));
                                playGame()
                                endOfTurn = true
                                return
                            }
                        }
                    }
                else if(secondColumn.includes(this.dataset.id)){
                    for (i=1; i<15; i=i+4){
                        let field = enemySquares[i]
                        if (field.className == "warrior" && enemyWarrior.alive == true)
                        {
                            enemyWarrior.HP = enemyWarrior.HP-12
                            console.log(enemyWarrior.HP)
                            if(enemyWarrior.HP <= 0)
                            {
                                enemyWarrior.alive = false
                            }
                            currentPlayer = "enemy"
                            ArcherB == false
                            playGame()
                            endOfTurn = true
                            return
                        }
                        else if (field.className == "rogue" && enemyRogue.alive == true)
                        {
                            enemyRogue.HP = enemyRogue.HP-12
                            console.log(enemyRogue.HP)
                            if(enemyRogue.HP <= 0)
                            {
                                enemyRogue.alive = false
                            }
                            currentPlayer = "enemy"
                            ArcherB == false
                            playGame()
                            endOfTurn = true
                            return
                        }
                        else if (field.className == "archer" && enemyArcher.alive == true)
                        {
                            enemyArcher.HP = enemyArcher.HP-12
                            console.log(enemyArcher.HP)
                            if(enemyArcher.HP <= 0)
                            {
                                enemyArcher.alive = false
                            }
                            currentPlayer = "enemy"
                            ArcherB == false
                            playGame()
                            endOfTurn = true
                            return
                        }
                        else
                        {
                            console.log("missed") 
                            currentPlayer = "enemy"
                            ArcherB == false
                            playGame()
                            endOfTurn = true
                            return
                        }

                    }
                }
                
                else if(thirdColumn.includes(this.dataset.id)){
                    for (i=2; i<15; i=i+4){
                        let field = enemySquares[i]
                        if (field.className == "warrior" && enemyWarrior.alive == true)
                        {
                            enemyWarrior.HP = enemyWarrior.HP-12
                            console.log(enemyWarrior.HP)
                            if(enemyWarrior.HP <= 0)
                            {
                                enemyWarrior.alive = false
                            }
                            currentPlayer = "enemy"
                            ArcherB == false
                            playGame()
                            endOfTurn = true
                            return
                        }
                        else if (field.className == "rogue" && enemyRogue.alive == true)
                        {
                            enemyRogue.HP = enemyRogue.HP-12
                            console.log(enemyRogue.HP)
                            if(enemyRogue.HP <= 0)
                            {
                                enemyRogue.alive = false
                            }
                            currentPlayer = "enemy"
                            ArcherB == false
                            playGame()
                            endOfTurn = true
                            return
                        }
                        else if (field.className == "archer" && enemyArcher.alive == true)
                        {
                            enemyArcher.HP = enemyArcher.HP-12
                            console.log(enemyArcher.HP)
                            if(enemyArcher.HP <= 0)
                            {
                                enemyArcher.alive = false
                            }
                            currentPlayer = "enemy"
                            ArcherB == false
                            playGame()
                            endOfTurn = true
                            return
                        }
                        else
                        {
                            console.log("missed") 
                            currentPlayer = "enemy"
                            ArcherB == false
                            endOfTurn = true
                            playGame()
                            return
                        }

                    }
                }
                else if(fourthColumn.includes(this.dataset.id)){
                    for (i=3; i<=16; i=i+4){
                        let field = enemySquares[i]
                        if (field.className == "warrior" && enemyWarrior.alive == true)
                        {
                            enemyWarrior.HP = enemyWarrior.HP-12
                            console.log(enemyWarrior.HP)
                            if(enemyWarrior.HP <= 0)
                            {
                                enemyWarrior.alive = false
                            }
                            currentPlayer = "enemy"
                            ArcherB == false
                            playGame()
                            endOfTurn = true
                            field.removeEventListener('click', arguments.callee)
                            return
                        }
                        else if (field.className == "rogue" && enemyRogue.alive == true)
                        {
                            enemyRogue.HP = enemyRogue.HP-12
                            console.log(enemyRogue.HP)
                            if(enemyRogue.HP <= 0)
                            {
                                enemyRogue.alive = false
                            }
                            currentPlayer = "enemy"
                            ArcherB == false
                            playGame()
                            endOfTurn = true
                            field.removeEventListener('click', arguments.callee)
                            return
                        }
                        else if (field.className == "archer" && enemyArcher.alive == true)
                        {
                            enemyArcher.HP = enemyArcher.HP-12
                            console.log(enemyArcher.HP)
                            if(enemyArcher.HP <= 0)
                            {
                                enemyArcher.alive = false
                            }
                            currentPlayer = "enemy"
                            ArcherB == false
                            playGame()
                            endOfTurn = true
                            field.removeEventListener('click', arguments.callee)
                            return
                        }
                        else
                        {
                            console.log("missed") 
                            currentPlayer = "enemy"
                            ArcherB == false
                            playGame()
                            endOfTurn = true
                            field.removeEventListener('click', arguments.callee)
                            return
                        }
                    }
                }
               // for (let i; i<16; i++){
                //    enemySquares[i].removeEventListener(arguments.callee)
               // }
            }

            
            enemySquares.forEach(square => square.removeEventListener('click', arguments.callee));
            GameOver()

        }, { once: true }));
        }
    }
    
//    ArcherButton.addEventListener('click', archerAttack)

    function horisontalAttack()
    {
        Warrior2B = true
        if(Warrior2B == true){
           /* if (Warrior1B == true || ArcherB == true || Rogue1B == true || Rogue2B == true){
                Warrior1B == false
                ArcherB == false
                Rogue1B == false
                Rogue2B == false
            } */
            Warrior1Button.disabled = true
            Warrior2Button.disabled = true
            ArcherButton.disabled = true
            Rogue1Button.disabled = true
            Rogue2Button.disabled = true
        enemySquares.forEach(square => square.addEventListener('mouseover', function(e){
        if (currentPlayer === "user"){
            if (fourthColumn.includes(this.dataset.id)){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                enemySquares[parseInt(this.dataset.id)-1].style.backgroundColor = "red"
            }
            else{
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                enemySquares[parseInt(this.dataset.id)+1].style.backgroundColor = "red"
            }
        }
        }))
        enemySquares.forEach(square => square.addEventListener('mouseout', function(e){
            if (fourthColumn.includes(this.dataset.id)){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                enemySquares[parseInt(this.dataset.id)-1].style.backgroundColor = "burlywood"
            }
            else{
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                enemySquares[parseInt(this.dataset.id)+1].style.backgroundColor = "burlywood"
            }
        }))
        enemySquares.forEach(square => square.addEventListener('click', function(e){
        if (currentPlayer === "user"){
            let fieldNum = parseInt(this.dataset.id)
            let field = enemySquares[fieldNum]
            let field1 = enemySquares[fieldNum-1]
            let field2 = enemySquares[fieldNum+1]
            if (fourthColumn.includes(this.dataset.id)){

                if ((field.className == "warrior" || field1.className == "warrior")  && enemyWarrior.alive == true)
                {
                    enemyWarrior.HP = enemyWarrior.HP-8
                    console.log(enemyWarrior.HP)
                    if(enemyWarrior.HP <= 0)
                    {
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    Warrior2B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                   // break
                }
                else if ((field.className == "rogue" || field1.className == "rogue") && enemyRogue.alive == true)
                {
                    enemyRogue.HP = enemyRogue.HP-8
                    console.log(enemyRogue.HP)
                    if(enemyRogue.HP <= 0)
                    {
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    Warrior2B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                   // break
                }
                else if ((field.className == "archer" || field1.className == "archer") && enemyArcher.alive == true)
                {
                    enemyArcher.HP = enemyArcher.HP-8
                    console.log(enemyArcher.HP)
                    if(enemyArcher.HP <= 0)
                    {
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    Warrior2B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                   // break
                }
                else
                {
                    currentPlayer = "enemy"
                    Warrior2B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                }
            }
            else{
                if ((field.className == "warrior" || field2.className == "warrior")  && enemyWarrior.alive == true)
                {
                    enemyWarrior.HP = enemyWarrior.HP-8
                    console.log(enemyWarrior.HP)
                    if(enemyWarrior.HP <= 0)
                    {
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    Warrior2B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                   // break
                }
                else if ((field.className == "rogue" || field2.className == "rogue") && enemyRogue.alive == true)
                {
                    enemyRogue.HP = enemyRogue.HP-8
                    console.log(enemyRogue.HP)
                    if(enemyRogue.HP <= 0)
                    {
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    Warrior2B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                   // break
                }
                else if ((field.className == "archer" || field2.className == "archer") && enemyArcher.alive == true)
                {
                    enemyArcher.HP = enemyArcher.HP-8
                    console.log(enemyArcher.HP)
                    if(enemyArcher.HP <= 0)
                    {
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    Warrior2B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                   // break
                }
                else
                {
                    console.log("missed") 
                    currentPlayer = "enemy"
                    Warrior2B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                }

            }
            GameOver()
        }
        }))
    }
    }
//    Warrior2Button.addEventListener('click', horisontalAttack)

    function verticalAttack()
    {
        Warrior1B = true
        if(Warrior1B == true){
        /*    if (Warrior2B == true || ArcherB == true || Rogue1B == true || Rogue2B == true){
                Warrior2B == false
                ArcherB == false
                Rogue1B == false
                Rogue2B == false
            }*/
            Warrior1Button.disabled = true
            Warrior2Button.disabled = true
            ArcherButton.disabled = true
            Rogue1Button.disabled = true
            Rogue2Button.disabled = true
        enemySquares.forEach(square => square.addEventListener('mouseover', function(e){
        if (currentPlayer === "user"){
            if (fourthRaw.includes(this.dataset.id)){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "red"
            }
            else{
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "red"
            }
        }
        }))
        enemySquares.forEach(square => square.addEventListener('mouseout', function(e){
            if (fourthRaw.includes(this.dataset.id)){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "burlywood"
            }
            else{
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "burlywood"
            }
        }))
        enemySquares.forEach(square => square.addEventListener('click', function(e){
        if (currentPlayer === "user"){
            let fieldNum = parseInt(this.dataset.id)
            let field = enemySquares[fieldNum]
            let field1 = enemySquares[fieldNum-4]
            let field2 = enemySquares[fieldNum+4]
            if (fourthRaw.includes(this.dataset.id)){
                if (field1.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 8
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    Warrior1B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                }
                if(field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 8
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    Warrior1B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                }
                else{
                    console.log("missed")
                    currentPlayer = "enemy"
                    Warrior1B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                }
            }
            else
            {
                if (field.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 8
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    Warrior1B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                }
                if (field.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 8
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    Warrior1B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                }
                if (field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 8
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    Warrior1B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                }
                if(field2.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 8
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    Warrior1B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                }
                if(field2.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 8
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    Warrior1B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                }
                if(field2.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 8
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                    endOfTurn = true
                }
                else{
                    currentPlayer = "enemy"
                    Warrior1B == false
                    playGame()
                    endOfTurn = true
                    field.removeEventListener('click', arguments.callee)
                }
            }
            GameOver()
        }
        }))

    }
    }
//    Warrior1Button.addEventListener('click', verticalAttack)

    function diagonnalyLeftAttack()
    {
        Rogue1B = true
        if(Rogue1B == true){
            /*if (Warrior1B == true || ArcherB == true || Warrior2B == true || Rogue2B == true){
                Warrior1B == false
                ArcherB == false
                Warrior2B == false
                Rogue2B == false
            }*/
            Warrior1Button.disabled = true
            Warrior2Button.disabled = true
            ArcherButton.disabled = true
            Rogue1Button.disabled = true
            Rogue2Button.disabled = true
        enemySquares.forEach(square => square.addEventListener('mouseover', function(e){
        if (currentPlayer === "user"){
            if (firstRaw.includes(this.dataset.id) && this.dataset.id != 3){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                enemySquares[parseInt(this.dataset.id)+5].style.backgroundColor = "red"
            }
            else if (firstColumn.includes(this.dataset.id) && this.dataset.id != 12){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                enemySquares[parseInt(this.dataset.id)+5].style.backgroundColor = "red"
            }
            else if (this.dataset.id == 12){return}
            else if (this.dataset.id == 3){return}
            else{
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                enemySquares[parseInt(this.dataset.id)-5].style.backgroundColor = "red"
            }
        }
        }))
        enemySquares.forEach(square => square.addEventListener('mouseout', function(e){
            if (firstRaw.includes(this.dataset.id) && this.dataset.id != 3){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                enemySquares[parseInt(this.dataset.id)+5].style.backgroundColor = "burlywood"
            }
            else if (firstColumn.includes(this.dataset.id) && this.dataset.id != 12){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                enemySquares[parseInt(this.dataset.id)+5].style.backgroundColor = "burlywood"
            }
            else if (this.dataset.id == 12){return}
            else if (this.dataset.id == 3){return}
            else{
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                enemySquares[parseInt(this.dataset.id)-5].style.backgroundColor = "burlywood"
            }
        }))
        enemySquares.forEach(square => square.addEventListener('click', function(e){
        if (currentPlayer === "user"){
            let fieldNum = parseInt(this.dataset.id)
            let field = enemySquares[fieldNum]
            let field1 = enemySquares[fieldNum-5]
            let field2 = enemySquares[fieldNum+5]
            if ((firstRaw.includes(this.dataset.id) && this.dataset.id != 3) || (firstColumn.includes(this.dataset.id) && this.dataset.id != 12)){
                if (field.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 20
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if (field.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if (field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if(field2.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 20
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if(field2.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if(field2.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                else{
                    console.log("missed")
                    currentPlayer = "enemy"
                    playGame()
                }

            }
          /*  else if (firstColumn.includes(this.dataset.id) && this.dataset.id != 12){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                enemySquares[parseInt(this.dataset.id)+5].style.backgroundColor = "red"
            } */
            else if (this.dataset.id == 12){return} 
            
            else if (this.dataset.id == 3){return}
            else{
                if (field.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 20
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if (field.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if (field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if(field1.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 20
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if(field1.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if(field1.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                else{
                    console.log("missed")
                    currentPlayer = "enemy"
                    playGame()
                }

            }
            GameOver()
        }
        }))
    }
    }
//    Rogue1Button.addEventListener('click', diagonnalyLeftAttack)

    function diagonnalyRightAttack()
    {
        Warrior1Button.disabled = true
        Warrior2Button.disabled = true
        ArcherButton.disabled = true
        Rogue1Button.disabled = true
        Rogue2Button.disabled = true 
        Rogue2B = true
        if(Rogue2B == true){
         /*   if (Warrior1B == true || ArcherB == true || Warrior2B == true || Rogue1B == true){
                Warrior1B == false
                ArcherB == false
                Warrior2B == false
                Rogue1B == false
            }*/
        enemySquares.forEach(square => square.addEventListener('mouseover', function(e){
        if (currentPlayer === "user"){
            if (firstRaw.includes(this.dataset.id) && this.dataset.id != 0){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                enemySquares[parseInt(this.dataset.id)+3].style.backgroundColor = "red"
            }
            else if (fourthColumn.includes(this.dataset.id) && this.dataset.id != 15){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                enemySquares[parseInt(this.dataset.id)+3].style.backgroundColor = "red"
            }
            else if (this.dataset.id == 15){return}
            else if (this.dataset.id == 0){return}
            else{
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                enemySquares[parseInt(this.dataset.id)-3].style.backgroundColor = "red"
            }
        }
        }))
        enemySquares.forEach(square => square.addEventListener('mouseout', function(e){
            if (firstRaw.includes(this.dataset.id) && this.dataset.id != 0){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                enemySquares[parseInt(this.dataset.id)+3].style.backgroundColor = "burlywood"
            }
            else if (fourthColumn.includes(this.dataset.id) && this.dataset.id != 15){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                enemySquares[parseInt(this.dataset.id)+3].style.backgroundColor = "burlywood"
            }
            else if (this.dataset.id == 15){return}
            else if (this.dataset.id == 0){return}
            else{
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
                enemySquares[parseInt(this.dataset.id)-3].style.backgroundColor = "burlywood"
            }
        }))
        enemySquares.forEach(square => square.addEventListener('click', function(e){
        if (currentPlayer === "user"){
            let fieldNum = parseInt(this.dataset.id)
            let field = enemySquares[fieldNum]
            let field1 = enemySquares[fieldNum-3]
            let field2 = enemySquares[fieldNum+3]
            if ((firstRaw.includes(this.dataset.id) && this.dataset.id != 0) || (fourthColumn.includes(this.dataset.id) && this.dataset.id != 15)){
                if (field.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 20
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if (field.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if (field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if(field2.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 20
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if(field2.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if(field2.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                else{console.log("missed")
                currentPlayer = "enemy"
                playGame()
            }
                currentPlayer === "enemy"

            }
          /*  else if (firstColumn.includes(this.dataset.id) && this.dataset.id != 12){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                enemySquares[parseInt(this.dataset.id)+5].style.backgroundColor = "red"
            } */
            else if (this.dataset.id == 15){return}
            else if (this.dataset.id == 0){return}
            else{
                if (field.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 20
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if (field.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if (field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if(field1.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 20
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if(field1.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                if(field1.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    playGame()
                }
                else{
                    console.log("missed")
                    currentPlayer = "enemy"
                    playGame()
                }
                currentPlayer === "enemy"

            }
            GameOver()
        }
        }))
    }
    }
 //   Rogue2Button.addEventListener('click', diagonnalyRightAttack)
    
    function GameOver(){
        if(!enemyWarrior.alive && !enemyRogue.alive && !enemyArcher.alive)
        {
            isGameOver = true
            alert("YOU WON")
        }
        if(!myWarrior.alive && !myRogue.alive && !myArcher.alive)
        {
            isGameOver = true
            alert("YOU LOST")
        }
    }

})
       // Warrior2Button.disabled = true
