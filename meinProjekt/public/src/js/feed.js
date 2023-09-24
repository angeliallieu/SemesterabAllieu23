let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let sharedMomentsArea = document.querySelector('#shared-moments');
let form = document.querySelector('form');
let sdescrInput = document.querySelector('#sdescr');
let notesInput = document.querySelector('#notes');
let locationInput = document.querySelector('#location');
let videoPlayer = document.querySelector('#player');
let canvasElement = document.querySelector('#canvas');
let captureButton = document.querySelector('#capture-btn');
let imagePicker = document.querySelector('#image-picker');
let imagePickerArea = document.querySelector('#pick-image');
let file = null;
let sdescrValue = '';
let notesValue = '';
let locationValue = '';
let imageURI = '';

function initializeMedia() {
    if(!('mediaDevices' in navigator)) {
        navigator.mediaDevices = {};
    }

    if(!('getUserMedia' in navigator.mediaDevices)) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
            let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            if(!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented'));
            }

            return new Promise( (resolve, reject) => {
                getUserMedia.call(navigator, constraints, resolve, reject);
            })
        }
    }

    navigator.mediaDevices.getUserMedia({video: true})
    .then( stream => {
        videoPlayer.srcObject = stream;
        videoPlayer.style.display = 'block';
    })
    .catch( err => {
        imagePickerArea.style.display = 'block';
    });
}

function openCreatePostModal() {
    setTimeout( () => {
        createPostArea.style.transform = 'translateY(0)';
    }, 1);
    initializeMedia();
}

function closeCreatePostModal() {
    imagePickerArea.style.display = 'none';
    videoPlayer.style.display = 'none';
    canvasElement.style.display = 'none';
    if(videoPlayer.srcObject) {
        videoPlayer.srcObject.getVideoTracks().forEach( track => track.stop());
    }
    setTimeout( () => {
        createPostArea.style.transform = 'translateY(100vH)';
    }, 1);
}


shareImageButton.addEventListener('click', openCreatePostModal);

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
    small.textContent = 'Date of Upload, ' + card.location;
    cardDate.appendChild(small);
    cardBody.appendChild(cardDate);
    cardText.style.textAlign = 'center'; // Ändern Sie den Textausrichtungsstil
    cardWrapper.appendChild(cardBody);
    // componentHandler.upgradeElement(cardWrapper);
    let capturedMomentsArea = document.getElementById('capturedMomentsArea'); // Hier den richtigen Container auswählen
    capturedMomentsArea.appendChild(cardWrapper);
  }

  

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

    closeCreatePostModal();

    sdescrValue = sdescrInput.value;
    notesValue = notesInput.value;
    locationValue = locationInput.value;

    sendDataToBackend();
});


imagePicker.addEventListener('change', event => {
    file = event.target.files[0];
});

captureButton.addEventListener('click', event => {
    event.preventDefault(); // nicht absenden und neu laden
    canvasElement.style.display = 'block';
    videoPlayer.style.display = 'none';
    captureButton.style.display = 'none';
    let context = canvasElement.getContext('2d');
    context.drawImage(videoPlayer, 0, 0, canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width));
    videoPlayer.srcObject.getVideoTracks().forEach( track => {
        track.stop();
    })
    imageURI = canvas.toDataURL("image/jpg");
    // console.log('imageURI', imageURI)       // base64-String des Bildes
    
    fetch(imageURI)
    .then(res => {
        return res.blob()
    })
    .then(blob => {
        file = new File([blob], "myFile.jpg", { type: "image/jpg" })
        console.log('file', file)
    })
});


