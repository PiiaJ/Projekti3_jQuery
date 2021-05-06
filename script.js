$('#allQuotes').click(getCharacter);
//document.getElementById('allQuotes').addEventListener('click', getCharacter);
// to be added later: document.getElementById('randomQuote').addEventListener('click',);


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
    myHeaders.append("Authorization", "Bearer d_FTUjkOHP33DOjjvVtU");
    
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



function printCharacters() {
    var lookedFor = document.getElementById('personsList');
    lookedFor.innerHTML = '';
    for(var i = 0; i < listOfCharacterNames.length; i++) {
        if (listOfCharacterNames.length > 1) {
            $('#explanation').css({'display':'block'});
           var listing = '<li>' + listOfCharacterNames[i] + '</li>'
            lookedFor.innerHTML += listing;
        } else if (listOfCharacterNames.length <= 1) {
            $('#explanation').css({'display':'none'});
        }
        getAllQuotes(i);
    }  
}


function getAllQuotes(person) {
    var personId = listOfCharacterIds[person];
    var url = "https://the-one-api.dev/v2/character/" + personId + "/quote";
    var quoteList = document.getElementById('quotesList');
    console.log(url);

    // lähetetään pyyntö ja bearer token
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer d_FTUjkOHP33DOjjvVtU");
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    // saadaan vastaus JSON muodossa
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        for(var i = 0; i < responseData.docs.length; i++) {
           console.log(responseData.docs[i].dialog);
           var listing = '<li>' + responseData.docs[i].dialog + '</li>'
           quoteList.innerHTML += listing;
        }
      })
      .catch(error => console.log('error', error));
    }

