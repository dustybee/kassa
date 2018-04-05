//Dit is de tweede JS file voor de AH POS.
//Gemaakt door Damian Vera


const beepSound = new Audio('/sounds/beep.ogg');
const errorSound = new Audio('/sounds/boop.ogg');


//de functie om het error geluidje goed af te laten spelen
function errSnd() {
    errorSound.pause();
    errorSound.currentTime = 0;
    setTimeout(function() {errorSound.play(); }, 100);
}

//maakt alles schoon, zou ook de kassa uit een "state" moeten halen
function herstel() {
    $('#dataInput').html("");
    $('#note_container').html("");
}

//
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
    if (!isNaN(event.target.dataset.number)) {
        $('#dataInput').append(event.target.dataset.number);
    }
});

//wordt uitgevoerd wanneer er op een nummerieke toets gedrukt wordt
$('html').keydown(function(event) {
    if(!isNaN(event.key)) {
        $('#dataInput').append(event.key);
        beepSound.play();
    }
});

//wordt uitgevoerd wanneer er opeen functie knop geklikt wordt
$('.function_button').click(function(event) {
    $keyboard = event.target.dataset.keyboard;
    console.log($keyboard);

    if($keyboard == "subtotaal") {
    }

    if($keyboard == "plu") {
        $input = parseInt($('#dataInput').text());
        $note = $('#note_container');
        $('#dataInput').text("");
        if(!isNaN($input)) {
            console.log($input);
        }
        else { kassaError('0028'); }
    }

    if($keyboard == "aantal") {
        $input = parseInt($('#dataInput').text());
        $note = $('#note_container');
        $('#dataInput').text("");
        if(!isNaN($input)) {
            console.log($input);
            $note.text("REGISTREER ARTIKEL");
        }
        else { kassaError('0028'); }
    }

    if($keyboard == "procentKorting") {
    }

    if($keyboard == "zegels") {
    }

    if($keyboard == "herstel") { herstel() }
});