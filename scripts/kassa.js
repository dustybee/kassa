//Dit is de tweede en nieuwe JS file voor de AH POS.
//Gemaakt door Damian Vera

var menu;
var itemProperties = {};
var transaction = [];
var products;

window.addEventListener('load', function(e) {
    $.ajax({
        url: './scripts/menu.json',
        dataType: 'json',
        success: function (result) {
            menu = result;
        }
    });
    $.ajax({
        url: './scripts/products.json',
        dataType: 'json'
    })
    .done(res => {
        products = res;
    })
    .fail(res => {
        this.console.log(res);
    });
});

var menuoptions = new Vue({
    el: '#menuoptions',
    data: {
        buttons: {
            button1: {
                image: 'images/pos/euro.png',
                text: 'Betalen',
                menu: 'betalen',
                action: ''
            },
            button2: {
                image: 'images/pos/bonuskaart_menu.png',
                text: 'Loyalty',
                menu: 'loyalty',
                action: 'nothing()'
            },
            button3: {
                image: 'images/pos/arrow.png',
                text: 'Prijs overig',
                menu: 'prijs-overig',
                action: 'nothing()'
            },
            button4: {
                image: 'images/pos/food-basket.png',
                text: 'PLU lijst',
                menu: 'plu-lijst',
                action: 'showPluList'
            },
            button5: {
                image: 'images/pos/food-basket.png',
                text: 'PLU lijst multi',
                menu: 'plu-lijst',
                action: 'showplulist()'
            },
            button6: {
                image: 'images/pos/eraser.png',
                text: 'Correcties',
                menu: 'correcties',
                action: 'nothing()'
            },
            button7: {
                image: 'images/pos/cog.png',
                text: 'Kassa Functies',
                menu: 'kassa-functies',
                action: 'nothing()'
            },
            button8: {
                action: 'null'
            }
        }
    },
    methods: {
        showPluList: function(e) {
            console.log('hello');
            
            $('.container').hide();
            $('#plu-lijst-screen').css('display', 'grid');
        },
        nothing: function(e) {

        }
    }
});


// de de bliepjes aanmaken
const beepSound = new Audio('sounds/beep.ogg');
const errorSound = new Audio('sounds/boop.ogg');

//de functie om het error geluidje goed af te laten spelen
function errSnd() {
    //stopt get error geluidje
    errorSound.pause();
    //reset het geluidje naar 0
    errorSound.currentTime = 0;
    //speelt het geluidje af met een delay van 0.1 seconden
    setTimeout(function() {errorSound.play(); }, 100);
}

//maakt alles schoon, zou ook de kassa uit een "state" moeten halen
function herstel() {
    $('#dataInputLine1').html("");
    $('#dataInputLine2').html("");
    $('#noteContainerLine1').html("");
    $('#noteContainerLine2').html("");
}

//de functie om errors te laten zien
function kassaError(err) {
    if (err == "0028") {
        herstel();
        $('#noteContainerLine1').html("0028 INGAVE FOUT");
        errSnd();
    }
}

//wordt uitgevoerd wanneer er op een button element geklikt wordt
$('button').click(function(event) {
    beepSound.play();
});

//wordt uitgevoerd wanneer er geklikt wordt in de number_button_container op een knop met de data-number attribute
$('#number_button_container').click(function(event) {
    if (!isNaN(event.target.dataset.number)) { //checkt of data-number een value heeft
        if(itemProperties.firstInputAfterAction) {
            herstel();
        }
        $('#dataInputLine1').append(event.target.dataset.number);
        itemProperties.firstInputAfterAction = false;
    }
});

//wordt uitgevoerd wanneer er op een nummerieke toets geklikt wordt
$('html').keydown(function(event) {
    if(itemProperties.firstInputAfterAction) {
        herstel();
        itemProperties.firstInputAfterAction = false;
    }
    if(!isNaN(event.key)) { //checkt de toets een numerieke toets is
        $('#dataInputLine1').append(event.key);
        beepSound.play();
    }
    if(event.key == '*') {
        aantal();
    }
    if(event.key == 'Enter') {
        plu();
    }

});

//wordt uitgevoerd wanneer er op een functie knop geklikt wordt
$('.function_button').click(function(event) {
    let keyboard = event.target.dataset.keyboard;
    console.log(keyboard);

    if(keyboard == "subtotaal") {
        subtotaal();
    }

    // plu functie. checkt of plu aangeklikt is
    if(keyboard == "plu") {
        plu();
    }

    let input = parseInt($('#dataInputLine1').text());
    let note = $('#noteContainerLine1');

    if(keyboard == "aantal") {
        aantal();
    }

    if(keyboard == "procentKorting") {
        note.text("REGISTREER ARTIKEL");
    }

    if(keyboard == "zegels") {
    }

    if(keyboard == "herstel") { herstel() }
});

$('#bon_items').click(function() {
    printBon();
});

//uitvoeren wanneer er een plu knop wordt ingedrukt. voegt nu alleen het product toe aan de bon
$('.plu-button').click(function() { 
    e = {
        dataset: {
            menu: 'hoofdmenu'

        }
    }
    menuButton(e);

    productInput(undefined, this.dataset.plu, itemProperties.amount, undefined);

    $('.container').show();
    $('#plu-lijst-screen').css('display', 'none');
});

function menuButton(e) {
    if(e.dataset.menu === "plu-lijst") {
        $('.container').hide();
        $('#plu-lijst-screen').css('display', 'grid');
    }
    if(e.dataset.menu === "hoofdmenu") {
        $('.container').show();
        $('#plu-lijst-screen').css('display', 'none');
    }
    try{ 
        for(buttons in menuoptions.buttons) {
            menuoptions.buttons[buttons].image = menu[e.dataset.menu][buttons].image;
            menuoptions.buttons[buttons].text = menu[e.dataset.menu][buttons].text;
            menuoptions.buttons[buttons].menu = menu[e.dataset.menu][buttons].menu;
            menuoptions.buttons[buttons].action = menu[e.dataset.menu][buttons].action;
        }
    }
    catch (e) {
        console.log(e);
    }
};

function productInput(barcode, plu, amount = 1, discount) {
    herstel();
    let product;
    if (plu) {
        for(let prodCat in products) {
            for(let prod in products[prodCat]) {
                if(products[prodCat][prod].plu == plu) {
                    product = products[prodCat][prod];
                }
            }
        }
    } else if (barcode) {
        for(let prodCat in products) {
            for(let prod in products[prodCat]) {
                if(products[prodCat][prod].barcode == plu) {
                    product = products[prodCat][prod];
                }
            }
        }
    }
    let currentItem = product;
    currentItem.amount = amount;
    currentItem.discount = discount;
    currentItem.totalPrice = (currentItem.amount * currentItem.price).toFixed(2);
    $('#dataInputLine1').html(`
        <span>`+ currentItem.name +`</span>
        <span style=\"float: right;\">€ `+currentItem.totalPrice+ `</span>
    `);
    $('#dataInputLine2').html(`
    <span>`+ currentItem.amount +` x €`+currentItem.price+ `</span>
    `);

    transaction.push(currentItem);
    addToReceipt(currentItem);
    itemProperties.firstInputAfterAction = true;
    itemProperties.amount = 1;
}

function addToReceipt(product) {
    $('#bon_items').append('<span class=""></span>');
    $('#bon_items').append('<span class="item_naam">' + product.name + '</span>');
    $('#bon_items').append('<span class="prijs">' + product.totalPrice + '</span>');
    if(product.amount !== 1) {
        $('#bon_items').append('<span class=""></span>');
        $('#bon_items').append('<span class="multipleItems" style="margin-left: 10px;">' + product.amount + ' x EUR '+ product.price+'</span>');
        $('#bon_items').append('<span class=""></span>');
    }
}

function eerdereRegelCorrectie() {

}

function aantal() {
     let amount = parseInt($('#dataInputLine1').text());
    $('#dataInputLine1').text("");
    if(!isNaN(amount)) {
        console.log(amount);
        $('#noteContainerLine1').text("REGISTREER ARTIKEL");
        itemProperties.amount = amount;
    } else {
        kassaError('0028'); 
    }
}

function subtotaal() {
    let total = 0;
    for(items in transaction) {
        total = total + parseFloat(transaction[items].totalPrice);
    }
    transaction.total = total;
    $('#bon_items').append('<span class=""></span>');
    $('#bon_items').append('<span class=""></span>');
    $('#bon_items').append('<span class=""></span>');
    $('#bon_items').append('<span class=""></span>');
    $('#bon_items').append('<span class="subtotaal" style="">SUBTOTAAL</span>');
    $('#bon_items').append('<span class="price">'+total.toFixed(2)+'</span>');
    $('#bon_items').append('<span class=""></span>');
    $('#bon_items').append('<span class=""></span>');
    $('#bon_items').append('<span class=""></span>');
}

function plu() {
    if(!isNaN(parseInt($('#dataInputLine1').text()))) {
        productInput(undefined, parseInt($('#dataInputLine1').text()), itemProperties.amount, undefined);
    }
    else { kassaError('0028'); }
}

function printBon() {
    var WinPrint = window.open('', '', 'left=0,top=0,width=600,height=900,toolbar=0,scrollbars=0,status=0');
    WinPrint.document.write('<html><head>');
    WinPrint.document.write('<link rel=\"stylesheet\" href=\"stylesheets/pos.css\">');
    WinPrint.document.write('<style>span {font-size: 15px !important}</style>');
    WinPrint.document.write('</head><body><span></span><div style="letter-spacing: -1px; text-align: center!important; font-weight: 400 !important; font-size: 12px!important;">Albert Heijn<br>Groenhof 144<br>020-6456002<br><br>AANTAL&nbsp;&nbsp;&nbsp;&nbsp;OMSCHRIJVING&nbsp;&nbsp;&nbsp;&nbsp;PRIJS&nbsp;BEDRAG<br>--------------------------------------</div>');
    WinPrint.document.write('<div id="bon_items" style="letter-spacing: 0px; grid-template-rows: 15px; font-size: 12px !important">');
    for(items in transaction) {
        WinPrint.document.write('<span>&nbsp;&nbsp;'+transaction[items].amount+'</span>'+'<span>'+transaction[items].name+'</span>'+'<span>'+transaction[items].totalPrice+'<br></span>');
    }
    // WinPrint.document.write(prtContent.innerHTML);
    WinPrint.document.write('<div></body></html>');
    WinPrint.focus();
    setInterval(function() {
        WinPrint.print();
        WinPrint.close();
    }, 200);
}