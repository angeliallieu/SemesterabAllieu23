let createMomentButton = document.querySelector('#create-moment-button');
//let captureArea = document.querySelector('#create-post');
// let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let capturedMomentsArea = document.querySelector('#captured-moments');
let form = document.querySelector('form');
let sdescrInput = document.querySelector('#sdescr');
let notesInput = document.querySelector('#notes');
let locationInput = document.querySelector('#location');
let file = null;
let titleValue = '';
let locationValue = '';
let imageURI = '';


function openCapturePostModal() {
  captureArea.style.display = 'block';
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

createMomentButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

function createCard(card) {
    let cardWrapper = document.createElement('div');
    cardWrapper.className = 'card mb-3'; // Bootstrap-Klasse für Karten mit Abstand
    let cardImage = document.createElement('img');
    cardImage.className = 'card-img-top'; // Bootstrap-Klasse für das Bild oben auf der Karte
    cardImage.src = card.image_id; // Pfad zum Bild
    cardImage.alt = 'Impression Image'; // Alt-Text für das Bild
    cardWrapper.appendChild(cardImage);
    let cardBody = document.createElement('div');
    cardBody.className = 'card-body'; // Bootstrap-Klasse für den Kartenkörper
    let cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title'; // Bootstrap-Klasse für den Kartentitel
    cardTitle.textContent = card.sdescr;
    cardBody.appendChild(cardTitle);
    let cardText = document.createElement('p');
    cardText.className = 'card-text'; // Bootstrap-Klasse für den Kartentext
    cardText.textContent = card.notes;
    cardBody.appendChild(cardText);
    let cardDate = document.createElement('p');
    cardDate.className = 'card-text';
    let small = document.createElement('small');
    small.className = 'text-muted';
    small.textContent = 'Date of Upload' + card.location;
    cardDate.appendChild(small);
    cardBody.appendChild(cardDate);
    cardText.style.textAlign = 'center'; // Ändern Sie den Textausrichtungsstil
    cardWrapper.appendChild(cardBody);
    // componentHandler.upgradeElement(cardWrapper);
    let capturedMomentsArea = document.getElementById('capturedMomentsArea'); // Hier den richtigen Container auswählen
    capturedMomentsArea.appendChild(cardWrapper);
  }

  
let networkDataReceived = false;

fetch('http://localhost:4000/posts')
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        networkDataReceived = true;
        console.log('From backend ...', data);
        updateUI(data);
    });

if('indexedDB' in window) {
    readAllData('posts')
        .then( data => {
            if(!networkDataReceived) {
                console.log('From cache ...', data);
                updateUI(data);
            }
        })
}

function updateUI(data) {
    for(let card of data)
    {
       createCard(card);
    }
}

function sendDataToBackend() {
    const formData = new FormData();
    formData.append('sdescr', sdescrInput);
    formData.append('notes', notesInput);
    formData.append('location', locationValue);
    formData.append('file', file);

    console.log('formData', formData)

    fetch('http://localhost:4000/posts', {
        method: 'POST',
        body: formData
    })
    .then( response => {
        console.log('Data sent to backend ...', response);
        return response.json();
    })
    .then( data => {
        console.log('data ...', data);
        const newPost = {
            sdescr: data.sdescr,
            notes: data.notes,
            location: data.location,
            image_id: imageURI
        }
        updateUI([newPost]);
    });
}

form.addEventListener('submit', event => {
    event.preventDefault(); // nicht absenden und neu laden

    if (file == null) {
        alert('Take a picture!')
        return;
    }
    if (sdescrInput.value.trim() === '' || locationInput.value.trim() === '') {
        alert('Please enter a short description and a location!')
        return;
    }

    // closeCreatePostModal();

    sdescrValue = sdescrInput.value;
    notesValue = notesInput.value;
    locationValue = locationInput.value;

    sendDataToBackend();
});

