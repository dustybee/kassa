//Dit is de eerste JS file voor de AH POS. ONE BIG MESS DUS...
//Gemaakt door Damian Vera
var caissiereNummer = 66;
var kassaNummer = 1;
var gescandeProducten = [];

const beepSound = new Audio('/sounds/beep.ogg');
const errorSound = new Audio('/sounds/boop.ogg');

$(document).ready(function() {
    setInterval(getTime, 1000);
});

function getTime() {
    document.getElementById("time").innerHTML = moment().format('DD/MM/YYYY HH:mm:ss');
}

function playErrorSound() {
    errorSound.pause();
    errorSound.currentTime = 0;
    setTimeout(function() {errorSound.play(); }, 100);
}

function errorState() {
    if(!$('button').click()) {
        playErrorSound();
    }
}

function registerNewProduct(element) {
    var pluCode = $(this).data('plu');
    var itemName = $(this).data('item');
    var price = $(this).data('price');

}

function login() {
    $('#kassaNumber').html(kassaNummer);
    $('#employeeNumber').html(caissiereNummer);
}

function registerAmount() {
    if(isNaN($('product-name').html())) {
        amount = $('product-name').html();
        console.log(amount);
    } else {
        errorState();
    }
}

//wordt uitgevoerd wanneer er op een knop geklikt wordt
$('button').click(function(event) {
    showMenu($(this).data('button'));
    if ($(this).data('item')) {
        $('#product-name').html($(this).data('item'));
        $('#product-price').html($(this).data('price'));
        $('#bon_items').append('<span class="aantal">' + "1" + '</span>');
        $('#bon_items').append('<span class="item_naam">' + $(this).data('item') + '</span>');
        $('#bon_items').append('<span class="prijs">' + $(this).data('price') + '</span>');
    }
    if($(this).hasClass('number_button')) {
        $('#product-name').append($(this).data('number')); 
    }
    if($(this).hasClass('herstel')) {
        $('#product-name').html('');
        $('#product-price').html('');
        $('#message').html('');
        $(this).css('background-color', '#0445A3');
    }

    if($(this).attr('id') == "button-c") {
        $('#product-name').html('');
    }
    if($(this).attr('id')=='button-subtotaal') {
        $('#message').html('0028 INGAVE FOUT');
        playErrorSound();
        $('#button-herstel').css('background-color', 'rgb(218, 71, 71)');
    }
});

$('.plu-button').click(function(event) {
    $('.container').hide();
    $('.menuoptions').hide();
    $('#main-screen').css('display', 'flex');
    $('#terug').css('display', 'flex');
});

$('[data-button="plu-lijst"]').click(function(event) {
    $('.container').hide();
    $('#plu-lijst-screen').css('display', 'grid');
});

$('[data-button="terug"]').click(function(event) {
    $('.container').hide();
    $('#main-screen').css('display', 'flex');
});

$('#button-aantal').click(registerAmount());

//laat een nieuw menu zien
function showMenu(menuData) { 
    var menuId = '#'+menuData; 
    if($(menuId).hasClass('menuoptions')) {
        $('.menuoptions').hide();
        $(menuId).css('display', 'flex');
    }
}

$('button').click(function() {
    errorSound.pause();
    errorSound.currentTime = 0;
    beepSound.pause();
    beepSound.currentTime = 0;
    beepSound.play();
});

login();