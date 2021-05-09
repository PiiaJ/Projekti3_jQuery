$('#allQuotes').click(getCharacter);
// to be added later: document.getElementById('randomQuote').addEventListener('', showRandomQuote);
$(function() {
    $('h1').css('color', 'teal');
    $('h1').fadeTo(5000, 0.7);
    $('#oneRing').fadeTo(7000, 0.1);
    $('#ringInscript').slideUp(7000);
});

var listOfCharacterIds = [];
var listOfCharacterNames = [];

// tyhjennetään henkilöiden nimet ja id:t taulukoista ja poistetaan vanhat vuorosanat listalta
function emptyLists() {
    while (listOfCharacterNames.length > 0) {
        listOfCharacterNames.pop();
    }
    while (listOfCharacterIds.length > 0) {
        listOfCharacterIds.pop();
    }
    for (var i = 0; i < $('#quotesList').children().length; i++) {
        $('#quotesList').html('');
    }

}

function getCharacter() {
    // poistetaan vanhat tiedot funktion avulla
    emptyLists();

    // selvitetään kenen henkilön tietoja haetaan
    var lookedForCharacter = $('#who').val();

    // lähetetään pyyntö ja bearer token
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer Ltg9Y-VAzyOlw0YB_MPf");
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    // saadaan vastaus JSON muodossa
    fetch("https://the-one-api.dev/v2/character", requestOptions)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);

        // käydään vastaus läpi ja selvitetään siitä haetun henkilön nimi ja id ja lisätään ne listoihin
        for(var i = 0; i < responseData.docs.length; i++) {
            if((responseData.docs[i].name).includes(lookedForCharacter) && lookedForCharacter != "") {
                var characterName = responseData.docs[i].name;
                var characterId = responseData.docs[i]._id;
                if (listOfCharacterIds.includes(characterId)) {
                    console.log(listOfCharacterNames.length);
                } else {
                    listOfCharacterIds.push(characterId);
                    listOfCharacterNames.push(characterName);
                }
                // tulostetaan henkilölistan hahmot ja heidän vuorosanansa funktioiden avulla
                printCharacters();
            }  
            // jos haettua nimeä ei löydy, pyydetään valitsemaan elokuvissa esiintyvä henkilö tai tarkistamaan kirjoitusasu
            else if (lookedForCharacter == "" && i == responseData.docs.length-1) {
                alert("Choose a personage from LotR films");
            } 
            else if (lookedForCharacter.length > 1 && i == responseData.docs.length-1 && listOfCharacterNames.length == 0) {
                alert("There is nothing to be found with this name. Please check you have written it correctly.")
            }
        }
      })
      .catch(error => console.log('error', error));
}


// funktio tarkistaa onko samannimisiä henkilöitä useampia, jos on, niin kaikkien nimet tulostetaan. 
function printCharacters() {
    // poistetaan vanhat tiedot
    var lookedFor = $('#personsList').html('');
    var listing = [];
    // jos vain yksi haetulla nimellä oleva henkilö, piilotetaan nimilistaan liittyvä info
    for(var i = 0; i < listOfCharacterNames.length; i++) {
        if (listOfCharacterNames.length > 1) {
            $('#explanation').css({'display':'block'});
            listing += '<li>' + listOfCharacterNames[i] + '</li>'
            lookedFor.html(listing);
        } else if (listOfCharacterNames.length <= 1) {
            $('#explanation').css({'display':'none'});
        }
        // haetaan vuorosanat funktion avulla
        getAllQuotes(i);
    }  
}


function getAllQuotes(person) {
    var personId = listOfCharacterIds[person];
    var url = "https://the-one-api.dev/v2/character/" + personId + "/quote";
    var quoteList = $('#quotesList');
    $('#quotes').css({'display':'block'})
    console.log(url);

    // lähetetään pyyntö ja bearer token
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer Ltg9Y-VAzyOlw0YB_MPf");
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    // saadaan vastaus JSON muodossa
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((responseData) => {
        //console.log(responseData);
        var listing = [];
        for(var i = 0; i < responseData.docs.length; i++) {
           console.log(responseData.docs[i].dialog);
           listing += '<li>' + responseData.docs[i].dialog + '</li>'
           quoteList.html(listing);
        }
      })
      .catch(error => console.log('error', error));
    }

