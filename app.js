const cardArry=[
{
    name : 'fries',
    img  : 'images/fries.png',
},

{

    name : 'cheeseburger',
    img  : 'images/cheeseburger.png',
},

{
    name : 'hotdog',
    img  : 'images/hotdog.png',
},

{
    name : 'ice-cream',
    img  : 'images/ice-cream.png',
},

{

    name : 'milkshake',
    img  : 'images/milkshake.png',
},

{

    name : 'pizza',
    img  : 'images/pizza.png',
},

{
    name : 'fries',
    img  : 'images/fries.png',
},

{

    name : 'cheeseburger',
    img  : 'images/cheeseburger.png',
},

{
    name : 'hotdog',
    img  : 'images/hotdog.png',
},

{
    name : 'ice-cream',
    img  : 'images/ice-cream.png',
},

{

    name : 'milkshake',
    img  : 'images/milkshake.png',
},

{

    name : 'pizza',
    img  : 'images/pizza.png',
}


];
const cardsWon =[];
let cardsChosen = [] ;
let cardsChosenId = [];
cardArry.sort(() => 0.5- Math.random());

const gridDisplay = document.querySelector('#grid');
const resultDisplay = document.querySelector('#result');


function createBoard () 
{
for (let i =0; i < cardArry.length ; i++)


{    
     const card =document.createElement('img');
     card.setAttribute('src','images/blank.png')
     card.setAttribute('data-id',i);
     card.addEventListener('click',flipCard);

     gridDisplay.append(card);


    }
}

console.log(cardArry);
createBoard();

function checkMatch ()
{

const cards = document.querySelectorAll('img');


if (cardsChosen[0] == cardsChosen[1])
{ 


alert('You found a match!!');
cards[cardsChosenId[0]].setAttribute('src','images/white.png');
cards[cardsChosenId[1]].setAttribute('src','images/white.png');
cards[cardsChosenId[0]].removeEventListener('click',flipCard);
cards[cardsChosenId[1]].removeEventListener('click',flipCard);

cardsWon.push(cardsChosen)

}else
{

    cards[cardsChosenId[0]].setAttribute('src','images/blank.png');
    cards[cardsChosenId[1]].setAttribute('src','images/blank.png');

}

cardsChosen = [];
cardsChosenId = [];
if(cardsWon == cardArry.length/2 )
{

resultDisplay.innerHTML='Congratulations you found theme all';
 
}

}


function flipCard()
{
    
     const cardId = this.getAttribute('data-id');
     cardsChosen.push(cardArry[cardId].name);
     cardsChosenId.push(cardId);
     this.setAttribute('src',cardArry[cardId].img);
     
     
     if(cardsChosen.length === 2)
    {    
        setTimeout(checkMatch,500);

    }


    }




