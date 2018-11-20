function createDeck(numberOfDecks) {
	let deck = [];
	for (let i = 0; i < numberOfDecks; i++) {
		for (let suitsIdx = 0; suitsIdx < suits.length; suitsIdx++) {
			for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
				//creating tuples of numbers to use less space
				let card = [valueIdx, suitsIdx, true]; 
							//vrednost, barva, skrita		
				deck.push(card);
			}
		}
	}
	return deck;
}

function shuffleDeck(deck) {
	for (let i = deck.length-1; i >=0 ; i--) {

		let swapIdx = Math.trunc(Math.random() * i);

		let tmp = deck[swapIdx];
		deck[swapIdx] = deck[i];
		deck[i] = tmp;
	}
}

function getCardString(card) {
	let ret = ""
	//king, ace, queen, jack
	if([0,10,11,12].includes(card[0])){ 
		ret+=values[card[0]].charAt(0);
	}else{
		ret+=""+(card[0]+1)
	}
	return ret+ " "+ suits[card[1]]
}

function getCards(num){
	ret = [];
	for (let i = 0; i < num; i++) {
		ret.push(deck.pop())
	}
	return ret;
}

function checkForEndOfGame() {

    if(playerStay){
        while(dealerHand.scores[0] <= 17){
            dealerHand.add(1);
      		setTimeout(render(), 2000);
        }

        if(dealerHand.scores[0] > 21){
	    	playerWon();
	    	return true;
	    }else{
	    	for (let pack = 0; pack < playerHand.cards.length; pack++) {
	    		if(playerHand.scores[pack] >= dealerHand.scores[0]){
	    			playerWon();
	    			return true;
	    		}
		    	if(playerHand.scores[pack] > 21){ //nisem zihr ce sm lahko sploh pride
		    		dealerWon();
		    		return true;
		    	}
			}
	    }
	    dealerWon();
	    return true;
    }

    for (let pack = 0; pack < playerHand.cards.length; pack++) {
    	if(playerHand.scores[pack] > 21){
    		dealerWon();
    		return true;
    	}
	}

	if(dealerHand.scores[0] > 21){
    	playerWon();
    	return true;
    }	
}

function getCardValue(card) {
	if(card[0] >= 9){
		return 10;
	}else{
		return (card[0]+1);
	}
}

function Hand(){
	this.cards = [[]];
	this.scores = [0];
    this.guiScore = "";

	this.add = function(numOfCardsToAdd){
		for(let i = 0; i < this.cards.length;i++){
			this.cards[i] = this.cards[i].concat(getCards(numOfCardsToAdd));
		}
		this.evaluate();
	}

	this.evaluate = function(){
		this.guiScore = "";
		let logAll = true;
		for (let pack = 0; pack < this.cards.length; pack++) {
			let sumForGUI = 0;
			let hasAce = false;
			this.scores[pack] = 0;
			for (let card of this.cards[pack]){
				this.scores[pack]+=getCardValue(card);
				if(card[0] == 0){
					hasAce = true;
				}
				if(!card[2]){ //ce ni vidna doda vprasaj
					logAll = false;
					//odsteje skrito karto, ker se potem pristeje ves sum
					sumForGUI -= getCardValue(card);
				}
			}

			sumForGUI+=this.scores[pack];
			sumForGUI = "(score: " + sumForGUI;

			if(!logAll)
				sumForGUI+="+?";

			this.guiScore+=sumForGUI +") ";
			if (hasAce && (this.scores[pack] + 10 <= 21)){
				this.scores[pack] += 10;
			}
		}
	}

	/*this.log = function(){
		let ret;
		for (let pack = 0; pack < this.cards.length; pack++) {
			if(this.cards.length == 1){ //samo en kupcek kart
				ret = "";
			}else{
				ret = (pack+1) + ". Hand\n"
			}

			for (let i = 0; i < this.cards[pack].length; i++) {
				ret += getCardString(this.cards[pack][i]);
			}

			ret += "\n";
			ret += '(score: ' + this.scores[pack] + ')\n\n';
		}
		return ret;
	}*/

    this.canSplit = function(){
        if(this.cards.length == 1 && this.cards[0][0][0] == this.cards[0][1][0]){ //prvi kupcek, prva karta, vrednost
            return true;
        }
        return false;
    }

    this.split = function(){
        this.cards.push([this.cards[0].pop()]);
        this.scores.push(0);
        this.evaluate();
    }

    this.switchVisibility = function(pack, card){
    	let vis = this.cards[pack][card][2];
    	this.cards[pack][card][2] = !vis;
    	this.evaluate();
    }
}

function playerWon(){
	render();
	drawWinner("Player won!");
	console.log("Player won!");
}

function dealerWon(){
	render();
	drawWinner("Dealer won!");
	console.log("Dealer won!");
}