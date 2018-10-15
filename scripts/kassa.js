//Dit is de tweede en nieuwe JS file voor de AH POS.
//Gemaakt door Damian Vera

var menu;

window.addEventListener('load', function(e) {
    $.ajax({
        url: './scripts/menu.json',
        dataType: 'json',
        success: function (result) {
            menu = result;
        }
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
    $('#dataInput').html("");
    $('#note_container').html("");
}

//de functie om errors te laten zien
function kassaError(err) {
    $errorContainer = $('#note_container');
    if (err == "0028") {
        $errorContainer.html("0028 INGAVE FOUT");
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
        $('#dataInput').append(event.target.dataset.number);
    }
});

//wordt uitgevoerd wanneer er op een nummerieke toets geklikt wordt
$('html').keydown(function(event) {
    if(!isNaN(event.key)) { //checkt de toets een numerieke toets is
        $('#dataInput').append(event.key);
        beepSound.play();
    }
});

//wordt uitgevoerd wanneer er op een functie knop geklikt wordt
$('.function_button').click(function(event) {
    $keyboard = event.target.dataset.keyboard;
    console.log($keyboard);

    if($keyboard == "subtotaal") {
    }

    // plu functie. checkt of plu aangeklikt is
    if($keyboard == "plu") {
        $input = parseInt($('#dataInput').text()); //string naar integer
        $note = $('#note_container');
        $('#dataInput').text("");
        if(!isNaN($input)) {
            console.log($input);
        }
        else { kassaError('0028'); }
    }

    $input = parseInt($('#dataInput').text());
    $note = $('#note_container');

    if($keyboard == "aantal") {
        $amount = parseInt($('#dataInput').text());
        $('#dataInput').text("");
        if(!isNaN($input)) {
            console.log($input);
            $note.text("REGISTREER ARTIKEL");
        }
        else { kassaError('0028'); }
    }

    if($keyboard == "procentKorting") {
        $note.text("REGISTREER ARTIKEL");
    }

    if($keyboard == "zegels") {
    }

    if($keyboard == "herstel") { herstel() }
});

//uitvoeren wanneer er een plu knop wordt ingedrukt. voegt nu alleen het product toe aan de bon
$('.plu-button').click(function() { 
    e = {
        dataset: {
            menu: 'hoofdmenu'
        }
    }
    menuButton(e);

    $('#product-name').html($(this).data('item'));
    $('#product-price').html($(this).data('price'));
    $('#bon_items').append('<span class="aantal">' + "1" + '</span>');
    $('#bon_items').append('<span class="item_naam">' + $(this).data('item') + '</span>');
    $('#bon_items').append('<span class="prijs">' + $(this).data('price') + '</span>');
    $('#dataInput').html($(this).data('item') + "<br>€ " + $(this).data('price'));
    $('.container').show();
    $('#plu-lijst-screen').css('display', 'none');
});

function menuButton(e) {
    if(e.dataset.menu === "plu-lijst") {
        $('.container').hide();
        $('#plu-lijst-screen').css('display', 'grid');
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