let createMomentButton = document.querySelector('#create-moment-button');
//let captureArea = document.querySelector('#create-post');
// let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let capturedMomentsArea = document.querySelector('#captured-moments');

function openCapturePostModal() {
  captureArea.style.display = 'block';
}

// function closeCreatePostModal() {
//   createPostArea.style.display = 'none';
// }

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

function createCard() {
    let cardWrapper = document.createElement('div');
    cardWrapper.className = 'card mb-3'; // Bootstrap-Klasse für Karten mit Abstand
    let cardImage = document.createElement('img');
    cardImage.className = 'card-img-top'; // Bootstrap-Klasse für das Bild oben auf der Karte
    cardImage.src = '/src/images/mountains.jpeg'; // Pfad zum Bild
    cardImage.alt = 'Impression Image'; // Alt-Text für das Bild
    cardWrapper.appendChild(cardImage);
    let cardBody = document.createElement('div');
    cardBody.className = 'card-body'; // Bootstrap-Klasse für den Kartenkörper
    let cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title'; // Bootstrap-Klasse für den Kartentitel
    cardTitle.textContent = 'Short description of image';
    cardBody.appendChild(cardTitle);
    let cardText = document.createElement('p');
    cardText.className = 'card-text'; // Bootstrap-Klasse für den Kartentext
    cardText.textContent = 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer';
    cardBody.appendChild(cardText);
    let cardDate = document.createElement('p');
    cardDate.className = 'card-text';
    let small = document.createElement('small');
    small.className = 'text-muted';
    small.textContent = 'Date of Upload';
    cardDate.appendChild(small);
    cardBody.appendChild(cardDate);
    cardText.style.textAlign = 'center'; // Ändern Sie den Textausrichtungsstil
    cardWrapper.appendChild(cardBody);
    // componentHandler.upgradeElement(cardWrapper);
    let capturedMomentsArea = document.getElementById('capturedMomentsArea'); // Hier den richtigen Container auswählen
    capturedMomentsArea.appendChild(cardWrapper);
  }
  
  fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      createCard();
    });
  