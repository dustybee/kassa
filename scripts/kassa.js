//Dit is de tweede en nieuwe JS file voor de AH POS.
//Gemaakt door Damian Vera


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
    $('#product-name').html($(this).data('item'));
    $('#product-price').html($(this).data('price'));
    $('#bon_items').append('<span class="aantal">' + "1" + '</span>');
    $('#bon_items').append('<span class="item_naam">' + $(this).data('item') + '</span>');
    $('#bon_items').append('<span class="prijs">' + $(this).data('price') + '</span>');
});

$('.menuoptions').click(function() {
    
})

