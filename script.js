const cardContainer = document.getElementById('card-container');
const points = document.getElementById('userPoints');
const remainingPairs = document.getElementById('remainingPairs');
const resetButton = document.getElementById('resetButton');
const startButton = document.getElementById('startButton');
const username = document.getElementById('username');
const homepage = document.getElementById('homepage');
const leaderbord = document.getElementById('leaderbord');
const difficultyForm = document.getElementById('difficulty');

let difficulty = 1;
let players = {};

class Game{
    
    static finishedPlayers = 0;
    static players = 0;
    static leaderbord = {};
    static cardsChecked = 0;
    userInfo;
    gameInfo;
    cardInfo;
    gameRunning;
    cardButtons;

    constructor(name = 'admin', difficulty = 0){

        if(name != 'admin'){
            this.userInfo = {
                name : name,
                points : 0,
                numberOfTries : 0,
                foundPair : false,
                firstCheckedCard : null,
                secondCheckedCard : null,
            }
    
            this.gameInfo = createGameStructure(difficulty);
            this.cardInfo = createPlayableCards(this.gameInfo['allCards']);
            this.createCardContainer();
            points.innerText = "Points: " + this.userInfo['points'];
            const cardButtons = document.querySelectorAll('.card-btn');
            cardButtonListener(cardButtons, this);
            this.gameRunning = true;
            Game.players++;
        }
    }

    uncheckCards(){
        this.userInfo['firstCheckedCard'] = null;
        this.userInfo['secondCheckedCard'] = null;
    }

    checkCard(card){

        if(this.userInfo['firstCheckedCard'] == null){
            this.userInfo['firstCheckedCard'] = card;
        }
        else{
            this.userInfo['secondCheckedCard'] = card;
            return this.checkIfPairFound();
        }
    }

    checkIfPairFound(){

        if(this.userInfo['firstCheckedCard'].innerText == this.userInfo['secondCheckedCard'].innerText){
            this.userInfo['foundPair'] = true;
            this.userInfo['points'] += countPoints(this.userInfo['numberOfTries']);
            points.innerText = "Points: " + this.userInfo['points'];
            this.updateCardInfo();
            if(this.checkGameEnd()){
                this.gameRunning = false;
            }
            else{
                this.restartInfo();
            }
            return true;
        }
        else{
            this.userInfo['numberOfTries'] += 1;
            this.userInfo['firstCheckedCard'] = null;
            this.userInfo['secondCheckedCard'] = null;
            return false;
        }
    }

    restartInfo(){
        this.userInfo['numberOfTries'] = 0;
        this.userInfo['foundPair'] = false;
        this.userInfo['firstCheckedCard'] = null;
        this.userInfo['secondCheckedCard'] = null;
    }

    checkGameEnd(){
        if(this.gameInfo['remainingPairs'] == 0){
            Game.leaderbord[Game.finishedPlayers] = this; 
            Game.finishedPlayers++;
            resetButton.style.display = 'none';
            let endingText = document.createElement('h2');
            endingText.id = "endingText";
            endingText.textContent = "YOU FINISHED THIS GAME";
            cardContainer.appendChild(endingText);
            console.log(Game.leaderbord);
            Game.arrangeLeaderbord();
            return true;
        }
        else{
            return false;
        }
    }

    static arrangeLeaderbord(){

        let finalLeaderbord = {};
        let finalLeaderbordArray = [];

        if(document.querySelector('.leaderbord-div')){
            let rows = document.querySelectorAll('.leaderbord-div');
            for(let i = 0; i < rows.length; i++){
                rows[i].remove();
            }
        }
        if(document.querySelector('span')){
            let spans = document.querySelectorAll('span');
            for(let z = 0; z < spans.length; z++){
                spans[z].remove();
            }
        }

        console.log(Game.leaderbord[0]);
        for(let j = 0; j < Object.keys(Game.leaderbord).length; j++){
            finalLeaderbord[Game.leaderbord[j].userInfo['name']] = Game.leaderbord[j].userInfo['points'];
        }
        for(let name in finalLeaderbord){
            finalLeaderbordArray.push([name, finalLeaderbord[name]]);
        }
        finalLeaderbordArray.sort(function(a,b){
            return b[1] - a[1];
        })

        for(let x = 0; x < finalLeaderbordArray.length; x++){
            sessionStorage.setItem(finalLeaderbordArray[x][0], finalLeaderbordArray[x][1]);
        }
        console.log(sessionStorage);

        console.log(finalLeaderbordArray);

        Game.createLeaderbordTable();

    }
    static createLeaderbordTable(){

        let sessionStorageArray = [];

        for(let player in sessionStorage){
            if(sessionStorage.hasOwnProperty(player)){
                sessionStorageArray.push([player, sessionStorage.getItem(player)]);
            }
        }
        sessionStorageArray.sort(function(a,b){
            return b[1] - a[1];
        })

        console.log(sessionStorage);
        console.log(sessionStorageArray);
        
        for(let k = 0; k < sessionStorageArray.length; k++){

            let row = document.createElement('div');
            row.classList.add('leaderbord-div');
            row.textContent = (k+1) + "#\xa0\xa0\xa0\xa0\xa0";

            let nameColumn = document.createElement('span');
            nameColumn.classList.add('nameColumn');
            nameColumn.textContent = sessionStorageArray[k][0];

            let pointColumn = document.createElement('span');
            pointColumn.classList.add('pointsColumn');
            pointColumn.textContent = sessionStorageArray[k][1];

            row.appendChild(nameColumn);
            row.appendChild(pointColumn);
            leaderbord.appendChild(row);
        }
    }
    
    updateCardInfo(){
            this.cardInfo = this.cardInfo.filter(this.checkCardValue);
            this.gameInfo['remainingCards'] -= 2;
            this.gameInfo['remainingPairs'] -= 1;
            remainingPairs.innerText = "Remaining pairs: " + this.gameInfo['remainingPairs'];
    }

    checkCardValue = (card) =>{

        return (card.value != parseInt(this.userInfo['firstCheckedCard'].innerText));
    }

    createCardContainer(){
        let row;
        let button;
        let elementInRow = 0;

        for(let i = 0; i < this.cardInfo.length; i++){

            if(elementInRow == 0){
                row = document.createElement('div');
                row.id = "container-div";
            }
            button = document.createElement('button');
            button.classList.add('card-btn');
            button.classList.add('not-checked');
            button.textContent = this.cardInfo[i].value;
            row.appendChild(button);
            elementInRow++;

            if(elementInRow == 5){
                elementInRow = 0;
                cardContainer.appendChild(row);
            }
        }
    }

    static removeCardContainer(){
        const div = document.querySelectorAll('#container-div');
        const button = document.querySelectorAll('.card-btn');
        console.log("veikia");
        for(let i = 0; i < button.length; i++){
            button[i].remove();
            console.log("irgi");
        }
        for(let j = 0; j < div.length; j++){
            div[j].remove();
            console.log("divai irgi");
        }
    }
}
let game = new Game;
Game.createLeaderbordTable();

function cardButtonListener(nodeList, game){

    console.log(nodeList);
    let selectedNumber;
    let indexOfFirstNumber = null;
    let indexOfSecondNumber = null;

    for(let i = 0; i < nodeList.length; i++){
        nodeList[i].addEventListener('click', function(event){
            if(Game.cardsChecked == 2){
                indexOfFirstNumber = null;
                indexOfSecondNumber = null;
                Game.cardsChecked = 0;
                game.uncheckCards();
                for(let j = 0; j < nodeList.length; j++){
                    nodeList[j].classList.add('not-checked');
                    nodeList[j].disabled = false;
                }
            }
            selectedNumber = nodeList[i].textContent;
            selectedNumber = parseInt(selectedNumber);
            nodeList[i].classList.remove('not-checked');
            nodeList[i].disabled = true;
            Game.cardsChecked++;

            if(indexOfFirstNumber == null){
                indexOfFirstNumber = i;
            }
            else{
                indexOfSecondNumber = i;
            }

            if(game.checkCard(nodeList[i])){
                nodeList[indexOfFirstNumber].classList.add('hidden-div');
                nodeList[indexOfSecondNumber].classList.add('hidden-div');
            }
        })
    }
}

function createGameStructure(difficulty){

    let gameInfo = new Object();

    switch(difficulty){
        case 1: gameInfo.allCards = 20;
            break;
        case 2: gameInfo.allCards = 30;
            break;
        case 3: gameInfo.allCards = 40;
            break;
    }

    gameInfo.remainingCards = gameInfo['allCards'];
    gameInfo.allPairs = gameInfo['allCards'] / 2;
    gameInfo.remainingPairs = gameInfo['allPairs'];
    remainingPairs.innerText = "Remaining pairs: " + gameInfo['remainingPairs'];

    return gameInfo;
}

function countPoints(numberOfTries){
    if(numberOfTries >= 10){
        return 0;
    }
    else{
        return 10 - numberOfTries;
    }
}

function createPlayableCards(numberOfCards){

    let playableCards = new Array();

    for(let i = 0; i < (numberOfCards/2) ; i++){

        let card = {
            value : i+1,
            founded : false,
        }

        playableCards.push(card);
        playableCards.push(card);

    }
    playableCards = shuffleArray(playableCards);
    return playableCards;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) { 
   
        var j = Math.floor(Math.random() * (i + 1));
                   
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
       
    return array;
}

function startNewGame(){
    let playerNumber = 'player' + Game.players;
    players[playerNumber] = new Game(username.value, difficulty);
    console.log(players);
}

startButton.addEventListener('click', () => {
    startNewGame();
    startButton.style.display = 'none';
    username.style.display = 'none';
    leaderbord.style.display = 'none';
    resetButton.style.display = 'block';
    remainingPairs.style.display = 'block';
    homepage.style.display = 'block';
    points.style.display = 'block';
    difficultyForm.style.display = 'none';
 });
resetButton.addEventListener('click', () => {
    Game.removeCardContainer();
    startNewGame();
 });

homepage.addEventListener('click', () => {
    Game.removeCardContainer();
    homepage.style.display = 'none';
    remainingPairs.style.display = 'none';
    points.style.display = 'none';
    startButton.style.display = 'block';
    username.style.display = 'block';
    leaderbord.style.display = 'block';
    resetButton.style.display = 'none';
    difficultyForm.style.display = 'block';
    if(document.getElementById('endingText')){
        let endingText = document.getElementById('endingText');
        endingText.remove();
    }
 });

difficultyForm.addEventListener('change', () => {

    let selectedDifficulty = document.querySelector('input[name="difficulty"]:checked');

    if (selectedDifficulty) {
        difficulty = Number(selectedDifficulty.value);
        console.log(typeof(difficulty));
        console.log(difficulty);
    }
})