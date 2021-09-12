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
    const VerticalButton = document.querySelector('#warrior_1')
    const HorizontalButton = document.querySelector('#warrior_2')
    const RogueButton = document.querySelector('#rogue')
    const Rogue1Button = document.querySelector('#rogue_1')
    const Rogue2Button = document.querySelector('#rogue_2')
    const ArcherButton = document.querySelector('#archer')
    const turnDisplay = document.querySelector('#whose-go')
    const infoDisplay = document.querySelector('#info')
    const playButton = document.querySelector('#playButton')
    const body = document.body

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

    class Fighter{
        constructor(name, HP, DMG, alive){
            this.name = name
            this.HP = HP
            this.DMG = DMG
            this.alive = alive
        }
    }
    class Warrior extends Fighter
    {


    }
    class Rogue extends Fighter
    {

    }
    class Archer extends Fighter
    {

    }

    let enemyWarrior = new Warrior("warrior", 40, 8, true)
    let enemyRogue = new Rogue("rogue", 10, 20, true)
    let enemyArcher = new Archer("archer", 24, 12, true)
    let myWarrior = new Warrior("warrior", 40, 8, true)
    let myRogue = new Rogue("rogue", 10, 20, true)
    let myArcher = new Archer("archer", 24, 12, true)

    let myWarriorId
    let myRogueId   
    let myArcherId

    const socket = io();

    // Select Player Mode
    playButton.addEventListener('click', startGame(socket))

    //Multiplayer

    function startGame(socket){
        gameMode = 'multiPlayer'

        

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

        // Event listener for attack

        socket.on('attack', yourTurn => {
            checkTurn(yourTurn, myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
        }) 
        
        socket.on('warriorHP', warriorHP => {
            myWarrior.HP = warriorHP
            console.log("My warrior HP:")
            console.log(myWarrior.HP)
            if(myWarrior.HP <= 0){
                myWarrior.alive = false
            }
            gameUpdate(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher) 

        })
        socket.on('rogueHP', rogueHP => {
            myRogue.HP = rogueHP
            console.log("My rogue HP:")
            console.log(myRogue.HP)
            if(myRogue.HP <= 0){
                myRogue.alive = false
            }
            gameUpdate(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher) 

        })
        socket.on('archerHP', archerHP => {
            myArcher.HP = archerHP
            console.log("My archer HP:")
            console.log(myArcher.HP)
            if(myArcher.HP <= 0){
                myArcher.alive = false
            }
            gameUpdate(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher) 
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
                turnDisplay.innerHTML = "Your Turm"
                newTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
            }
            if(currentPlayer === 'enemy'){
                turnDisplay.innerHTML = "Enemy's Turn"
            }
        }
    }

    function playerReady(num){
        let player = `.p${parseInt(num) +1}`
        document.querySelector(`${player} .ready span`).classList.toggle('green')
    }

    //Create Board
    function createBoard(grid, squares, width){
        for (let i = 0; i < width*width; i++){
            const square = document.createElement('div')
            square.dataset.id = i
            grid.appendChild(square)
            squares.push(square)
        }
        console.log(squares)
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
    document.addEventListener('dragover', dragOver)
    document.addEventListener('drop', dragDrop)


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
            }
        }
        if (draggedFighter.className == "fighter rogue"){
            draggedFighterClass="rogue"
            for(let i = 4; i<12; i++){
                userSquares[i].style.backgroundColor = "green"
            }
        }
        if (draggedFighter.className == "fighter archer"){
            draggedFighterClass="archer"
            for(let i = 12; i<16; i++){
                userSquares[i].style.backgroundColor = "green"
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

        for(let i = 0; i<16; i++){
            userSquares[i].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
        }
        
        console.log(draggedFighter)
        console.log(this.dataset.id)
        //console.log(warriorAllowed.includes(this.dataset.id))

        if (draggedFighter.className == "fighter warrior"  && warriorAllowed.includes(this.dataset.id)){
            userSquares[parseInt(this.dataset.id)].classList.add(draggedFighterClass)
            myWarriorId = parseInt(this.dataset.id)
            displayGrid.removeChild(draggedFighter) 
            socket.emit('warrior-position', myWarriorId)
        } 
        else if (draggedFighter.className == "fighter rogue"  && rogueAllowed.includes(this.dataset.id)){
            userSquares[parseInt(this.dataset.id)].classList.add(draggedFighterClass)
            myRogueId = parseInt(this.dataset.id)
            displayGrid.removeChild(draggedFighter) 
            socket.emit('rogue-position', myRogueId)
        }
        else if (draggedFighter.className == "fighter archer"  && archerAllowed.includes(this.dataset.id)){
            userSquares[parseInt(this.dataset.id)].classList.add(draggedFighterClass)
            myArcherId = parseInt(this.dataset.id)
            displayGrid.removeChild(draggedFighter) 
            socket.emit('archer-position', myArcherId)
        }

        // See if all fighters were selected
        if(!displayGrid.querySelector('.fighter')){
            allWarriorsPlaced = true
        }
        //console.log(allWarriorsPlaced)
    }   
    function dragEnd(){
        console.log("dragend")
    }

    // Game start
    
    function newTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher){
        if (isGameOver) return
        if (currentPlayer === "user"){
            turnDisplay.innerHTML = "Your Turn"
            WarriorButton.addEventListener('click', showMoreWarriorButtons)
            RogueButton.addEventListener('click', showMoreRogueButtons)
            ArcherButton.addEventListener('click', archerAttack)
            VerticalButton.addEventListener('click', verticalAttack)
            HorizontalButton.addEventListener('click', horizontalAttack)
            Rogue1Button.addEventListener('click', diagonnalyLeftAttack)
            Rogue2Button.addEventListener('click', diagonnalyRightAttack)
            //disableButtons()
        }
        if (currentPlayer === "enemy"){
            turnDisplay.innerHTML = "Enemy's Turn"
        }
    }

    function changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher){
        // Funkcja GameUpdate
        gameUpdate(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
        turnDisplay.innerHTML = "Enemy's Turn"
        WarriorButton.removeEventListener('click', showMoreWarriorButtons)
        RogueButton.removeEventListener('click', showMoreRogueButtons)
        ArcherButton.removeEventListener('click', archerAttack)
        VerticalButton.removeEventListener('click', verticalAttack)
        HorizontalButton.removeEventListener('click', horizontalAttack)
        Rogue1Button.removeEventListener('click', diagonnalyLeftAttack)
        Rogue2Button.removeEventListener('click', diagonnalyRightAttack)
        currentPlayer = "enemy"
        socket.emit('attack', true)
        socket.emit('warriorHP', enemyWarrior.HP)
        socket.emit('rogueHP', enemyRogue.HP)
        socket.emit('archerHP', enemyArcher.HP)
        newTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
    }

    function checkTurn(yourTurn, myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher) {
        if (yourTurn){
            currentPlayer = "user"
            newTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
        }

    }

    function gameUpdate(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher) 
    {
        if (!myArcher.alive && !myWarrior.alive && !myRogue.alive)
        {
            alert("You lost!")
            document.location.href='http://127.0.0.1'
        }
        else if (!enemyWarrior.alive && !enemyRogue.alive && !enemyArcher.alive)
        {
            alert("You won!")
            document.location.href='http://127.0.0.1'
        }
    }
    

    // Basic game logic

    const firstRaw = ["0","1","2","3"]
    const secondRaw = ["4","5","6","7"]
    const thirdRaw = ["8","9","10","11"]
    const fourthRaw = ["12","13","14","15"]
    const firstColumn = ["0", "4", "8", "12"]
    const secondColumn =["1","5","9","13"]
    const thirdColumn =["2","6", "10","14"]
    const fourthColumn =["3","7","11","15"]

    // Show more buttons

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

    function archerAttack2(){
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
                            changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                            endOfTurn = true
                            archerAttack3()
                            archerAttackHighlight2()
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
                            changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                            endOfTurn = true
                            archerAttack3()
                            archerAttackHighlight2()
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
                            changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                            endOfTurn = true
                            archerAttack3()
                            archerAttackHighlight2()
                            return
                        }
                        else
                        {
                            console.log("missed") 
                            currentPlayer = "enemy"
                            changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                            endOfTurn = true
                            archerAttack3()
                            archerAttackHighlight2()
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
                        changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                        endOfTurn = true
                        archerAttack3()
                        archerAttackHighlight2()

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
                        changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                        endOfTurn = true
                        archerAttack3()
                        archerAttackHighlight2()

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
                        changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                        endOfTurn = true
                        archerAttack3()
                        archerAttackHighlight2()
                        return
                    }
                    else
                    {
                        console.log("missed") 
                        currentPlayer = "enemy"
                        changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                        endOfTurn = true
                        archerAttack3()
                        archerAttackHighlight2()
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
                        changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                        endOfTurn = true
                        archerAttack3()
                        archerAttackHighlight2()

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
                        changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                        endOfTurn = true
                        archerAttack3()
                        archerAttackHighlight2()

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
                        changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                        endOfTurn = true
                        archerAttack3()
                        archerAttackHighlight2()

                        return
                    }
                    else
                    {
                        console.log("missed") 
                        currentPlayer = "enemy"
                        endOfTurn = true
                        changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                        archerAttack3()
                        archerAttackHighlight2()

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
                        changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                        endOfTurn = true
                        archerAttack3()
                        archerAttackHighlight2()

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
                        changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                        endOfTurn = true
                        archerAttack3()
                        archerAttackHighlight2()

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
                        changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                        endOfTurn = true
                        archerAttack3()
                        archerAttackHighlight2()

                        return
                    }
                    else
                    {
                        console.log("missed") 
                        currentPlayer = "enemy"
                        changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                        endOfTurn = true
                        archerAttack3()
                        archerAttackHighlight2()

                    }
                }
            }
        }
    }
    
    function archerAttackHighlight()
    {
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
    }

    function archerAttack3()
    {
        enemySquares.forEach(square => square.removeEventListener('click', archerAttack2))
    }
    
    function archerAttackHighlight2()
    {
        enemySquares.forEach(square => square.removeEventListener('mouseover', archerAttackHighlight))
    }

        
    function archerAttack()
    {           
        enemySquares.forEach(square => square.addEventListener('mouseover', archerAttackHighlight))
        enemySquares.forEach(square => square.addEventListener('mouseout', function(e){
            if (firstRaw.includes(this.dataset.id)){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)+8].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)+12].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
            else if (secondRaw.includes(this.dataset.id)){
                enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)+8].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
            else if (thirdRaw.includes(this.dataset.id)){
                enemySquares[parseInt(this.dataset.id)-8].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
            else if (fourthRaw.includes(this.dataset.id)){
                enemySquares[parseInt(this.dataset.id)-12].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)-8].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
        
        }))
        enemySquares.forEach(square => square.addEventListener('click', archerAttack2))
    }
    
    function horizontalAttack2() 
    {
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
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    horizontalAttack3()
                    horizontalAttackHighlight2()
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
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    horizontalAttack3()
                    horizontalAttackHighlight2()
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
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    horizontalAttack3()
                    horizontalAttackHighlight2()
                }
                else
                {
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    horizontalAttack3()
                    horizontalAttackHighlight2()
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
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    horizontalAttack3()
                    horizontalAttackHighlight2()
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
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    horizontalAttack3()
                    horizontalAttackHighlight2()
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
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    horizontalAttack3()
                    horizontalAttackHighlight2()
                }
                else
                {
                    console.log("missed") 
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    horizontalAttack3()
                    horizontalAttackHighlight2()
                }

            }
        }
    }

    function horizontalAttack3() 
    {
        enemySquares.forEach(square => square.removeEventListener('click', horizontalAttack2))
    }

    function horizontalAttackHighlight() 
    {
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
    }

    function horizontalAttackHighlight2() 
    {
        enemySquares.forEach(square => square.removeEventListener('mouseover', horizontalAttackHighlight))
    }


    function horizontalAttack()
    {
        enemySquares.forEach(square => square.addEventListener('mouseover', horizontalAttackHighlight))
        enemySquares.forEach(square => square.addEventListener('mouseout', function(e){
            if (fourthColumn.includes(this.dataset.id)){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)-1].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
            else{
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)+1].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
        }))
        enemySquares.forEach(square => square.addEventListener('click', horizontalAttack2))
    
    }

    function verticalAttack2() 
    {
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
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    verticalAttack3()
                    verticalAttackHighlight2()
                }
                if(field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 8
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    verticalAttack3()
                    verticalAttackHighlight2()
                }
                else{
                    console.log("missed")
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    verticalAttack3()
                    verticalAttackHighlight2()
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
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    verticalAttack3()
                    verticalAttackHighlight2()
                }
                if (field.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 8
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    verticalAttack3()
                    verticalAttackHighlight2()
                }
                if (field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 8
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    verticalAttack3()
                    verticalAttackHighlight2()
                }
                if(field2.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 8
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    verticalAttack3()
                    verticalAttackHighlight2()
                }
                if(field2.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 8
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    verticalAttack3()
                    verticalAttackHighlight2()
                }
                if(field2.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 8
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    verticalAttack3()
                    verticalAttackHighlight2()
                }
                else{
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    endOfTurn = true
                    verticalAttack3()
                    verticalAttackHighlight2()
                }
            }
        }
    }


    function verticalAttack3() 
    {
        enemySquares.forEach(square => square.removeEventListener('click', verticalAttack2))
    }

    function verticalAttackHighlight() 
    {
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
    }

    function verticalAttackHighlight2() 
    {
        enemySquares.forEach(square => square.removeEventListener('mouseover', verticalAttackHighlight))
    }

    function verticalAttack()
    {
        enemySquares.forEach(square => square.addEventListener('mouseover', verticalAttackHighlight))
        enemySquares.forEach(square => square.addEventListener('mouseout', function(e){
            if (fourthRaw.includes(this.dataset.id)){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
            else{
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
        }))
        enemySquares.forEach(square => square.addEventListener('click', verticalAttack2))
    }

    function diagonnalyLeftAttack2()
    {
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
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }
                if (field.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }
                if (field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }
                if(field2.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 20
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }
                if(field2.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }
                if(field2.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }
                else{
                    console.log("missed")
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }

            }
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
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }
                if (field.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }
                if (field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }
                if(field1.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 20
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }
                if(field1.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }
                if(field1.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }
                else{
                    console.log("missed")
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyLeftAttack3()
                    diagonnalyLeftHighlight2()
                }

            }
        }
    }

    function diagonnalyLeftAttack3()
    {
        enemySquares.forEach(square => square.removeEventListener('click', diagonnalyLeftAttack2))

    }

    function diagonnalyLeftHighlight()
    {
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
    }

    function diagonnalyLeftHighlight2()
    {
        enemySquares.forEach(square => square.removeEventListener('mouseover', diagonnalyLeftHighlight))
    }

    function diagonnalyLeftAttack()
    {

        enemySquares.forEach(square => square.addEventListener('mouseover', diagonnalyLeftHighlight))
        enemySquares.forEach(square => square.addEventListener('mouseout', function(e){
            if (firstRaw.includes(this.dataset.id) && this.dataset.id != 3){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)+5].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
            else if (firstColumn.includes(this.dataset.id) && this.dataset.id != 12){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)+5].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
            else if (this.dataset.id == 12){return}
            else if (this.dataset.id == 3){return}
            else{
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)-5].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
        }))
        enemySquares.forEach(square => square.addEventListener('click', diagonnalyLeftAttack2))
    }

    function diagonnalyRightAttack2()
    {
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
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyRightAttack3()
                    diagonnalyRightHighlight2()
                }
                if (field.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyRightAttack3()
                    diagonnalyRightHighlight2()
                }
                if (field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyRightAttack3()
                    diagonnalyRightHighlight2()
                }
                if(field2.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 20
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyRightAttack3()
                    diagonnalyRightHighlight2()
                }
                if(field2.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyRightAttack3()
                    diagonnalyRightHighlight2()
                }
                if(field2.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyRightAttack3()
                    diagonnalyRightHighlight2()
                }
                else{console.log("missed")
                currentPlayer = "enemy"
                changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                diagonnalyRightAttack3()
                diagonnalyRightHighlight2()
            }
                currentPlayer === "enemy"

            }

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
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyRightAttack3()
                    diagonnalyRightHighlight2()
                }
                if (field.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyRightAttack3()
                    diagonnalyRightHighlight2()
                }
                if (field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyRightAttack3()
                    diagonnalyRightHighlight2()
                }
                if(field1.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 20
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyRightAttack3()
                    diagonnalyRightHighlight2()
                }
                if(field1.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 20
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyRightAttack3()
                    diagonnalyRightHighlight2()
                }
                if(field1.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 20
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyRightAttack3()
                    diagonnalyRightHighlight2()
                }
                else{
                    console.log("missed")
                    currentPlayer = "enemy"
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                    diagonnalyRightAttack3()
                    diagonnalyRightHighlight2()
                }
                currentPlayer === "enemy"

            }
        }
    }


    function diagonnalyRightAttack3()
    {
        enemySquares.forEach(square => square.removeEventListener('click', diagonnalyRightAttack2))   
    }

    function diagonnalyRightHighlight()
    {
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
    }

    function diagonnalyRightHighlight2()
    {
        enemySquares.forEach(square => square.removeEventListener('mouseover', diagonnalyRightHighlight))
    }

    function diagonnalyRightAttack()
    {

        enemySquares.forEach(square => square.addEventListener('mouseover', diagonnalyRightHighlight))
        enemySquares.forEach(square => square.addEventListener('mouseout', function(e){
            if (firstRaw.includes(this.dataset.id) && this.dataset.id != 0){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)+3].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
            else if (fourthColumn.includes(this.dataset.id) && this.dataset.id != 15){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)+3].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
            else if (this.dataset.id == 15){return}
            else if (this.dataset.id == 0){return}
            else{
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
                enemySquares[parseInt(this.dataset.id)-3].style.backgroundColor = "rgba(224, 220, 220, 0.349)"
            }
        }))
        enemySquares.forEach(square => square.addEventListener('click', diagonnalyRightAttack2))
    }

    /*function horizontalAttack()
    {
        enemySquares.forEach(square => square.addEventListener('mouseover', horizontalAttackHighlight))
        enemySquares.forEach(square => square.addEventListener('mouseout', removeHorizontalAttackHighlight))
        enemySquares.forEach(square => square.addEventListener('click', horizontalAttackPerform))
    }
    function horizontalAttackFinished() 
    {
        enemySquares.forEach(square => square.removeEventListener('mouseover', horizontalAttackHighlight))
        enemySquares.forEach(square => square.removeEventListener('mouseout', removeHorizontalAttackHighlight))
        enemySquares.forEach(square => square.removeEventListener('click', horizontalAttackPerform))
    }
    
    function horizontalAttackHighlight() 
    {      
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
    }

    function removeHorizontalAttackHighlight() 
    {
        if (fourthColumn.includes(this.dataset.id)){
            enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
            enemySquares[parseInt(this.dataset.id)-1].style.backgroundColor = "burlywood"
        }
        else{
            enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
            enemySquares[parseInt(this.dataset.id)+1].style.backgroundColor = "burlywood"
        }
        
    }
    function horizontalAttackPerform()
    {
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
                    horizontalAttackFinished() 
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
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
                    horizontalAttackFinished() 
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
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
                    horizontalAttackFinished() 
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                }
                else
                {
                    console.log("miss")
                    currentPlayer = "enemy"
                    horizontalAttackFinished() 
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
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
                    horizontalAttackFinished() 
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
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
                    horizontalAttackFinished() 
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
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
                    horizontalAttackFinished() 
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                }
                else
                {
                    console.log("missed") 
                    currentPlayer = "enemy"
                    horizontalAttackFinished() 
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                }

            }
        }
    }

    function verticalAttack()
    {
        enemySquares.forEach(square => square.addEventListener('mouseover', verticalAttackHighlight))
        enemySquares.forEach(square => square.addEventListener('mouseout', removeVerticalAttackHighlight))
        enemySquares.forEach(square => square.addEventListener('click', verticalAttackPerform))
    }
    function verticalAttackFinished() 
    {
        enemySquares.forEach(square => square.removeEventListener('mouseover', verticalAttackHighlight))
        enemySquares.forEach(square => square.removeEventListener('mouseout', removeVerticalAttackHighlight))
        enemySquares.forEach(square => square.removeEventListener('click', verticalAttackPerform))
    }
    
    function verticalAttackHighlight()
    {
        if (currentPlayer === "user"){
            if (fourthRaw.includes(this.dataset.id)){
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "red"
            }
            else{
                enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "red"
                console.log(this.dataset.id)
                enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "red"
            }
        }
    }

    function removeVerticalAttackHighlight()
    {
        if (fourthRaw.includes(this.dataset.id)){
            enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
            enemySquares[parseInt(this.dataset.id)-4].style.backgroundColor = "burlywood"
        }
        else{
            enemySquares[parseInt(this.dataset.id)].style.backgroundColor = "burlywood"
            enemySquares[parseInt(this.dataset.id)+4].style.backgroundColor = "burlywood"
        }
    }

    function verticalAttackPerform()
    {
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
                    verticalAttackFinished()
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                }
                if(field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 8
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    verticalAttackFinished()
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                }
                else{
                    console.log("missed")
                    currentPlayer = "enemy"
                    verticalAttackFinished()
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
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
                    verticalAttackFinished()
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                }
                if (field.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 8
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    verticalAttackFinished()
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                }
                if (field.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 8
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    verticalAttackFinished()
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                }
                if(field2.className == "warrior" && enemyWarrior.alive == true){
                    enemyWarrior.HP = enemyWarrior.HP - 8
                    console.log(enemyWarrior.HP)
                    if (enemyWarrior.HP <= 0){
                        enemyWarrior.alive = false
                    }
                    currentPlayer = "enemy"
                    verticalAttackFinished()
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                }
                if(field2.className == "rogue" && enemyRogue.alive == true){
                    enemyRogue.HP = enemyRogue.HP - 8
                    console.log(enemyRogue.HP)
                    if (enemyRogue.HP <= 0){
                        enemyRogue.alive = false
                    }
                    currentPlayer = "enemy"
                    verticalAttackFinished()
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                }
                if(field2.className == "archer" && enemyArcher.alive == true){
                    enemyArcher.HP = enemyArcher.HP - 8
                    console.log(enemyArcher.HP)
                    if (enemyArcher.HP <= 0){
                        enemyArcher.alive = false
                    }
                    currentPlayer = "enemy"
                    verticalAttackFinished()
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                }
                else{
                    console.log("missed")
                    currentPlayer = "enemy"
                    verticalAttackFinished()
                    changeTurn(myWarrior, myRogue, myArcher, enemyWarrior, enemyRogue, enemyArcher)
                }
            }
        }
    }    */
})