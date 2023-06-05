let data = []; // Array to store the fetched data

const gallery = document.querySelector('.gallery');
const filters = document.querySelector('.filterButtons');

fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(response => {
    data = response; // Store the fetched data in array
    dataFetched(data); // Display the gallery with all elements
    dataFetchedModal(data);
    buttonTous ();
    filterButtons ();
    /*createFilterButtons();*/
  })
  .catch(error => {
    console.error('Error:', error);
  });

//----------------------------------------------------------------
//******************** Creation filter buttons *******************
//----------------------------------------------------------------
function filterButtons () {
  const categories = new Set();   // Create the Set object to collect unique values (the duplicate category names are not added)
  
  data.forEach(item => {   // Extract unique categories from the data
    categories.add(item.category.name);
  });

  Array.from(categories).forEach((category, index) => {   // Create buttons for each category
    const button = document.createElement('button');
    button.textContent = category;
    button.classList.add('btn');
    button.style.marginLeft = '10px';
    filters.appendChild(button);

    if (index === 0) {   // Set width for each button
      button.style.width = '100px'; 
    } else if (index === 1) {
      button.style.width = '160px'; 
    } else if (index === 2) {
      button.style.width = '190px'; 
    }

    button.addEventListener('click', function () {   // Add click event listener for each category button
      filterData(category);   // Filter and display data based on category
    });
  });
}

//----------------------------------------------------------------
//**************** Creation button 'Tous' ******************
//----------------------------------------------------------------
function buttonTous () {
  const button1 = document.createElement('button');
  button1.textContent = 'Tous';
  button1.classList.add('btn');
  button1.style.width = '100px';
  filters.appendChild(button1);

  button1.addEventListener('click', function () {      
    dataFetched(data);   
  });
}

//----------------------------------------------------------------
//**************** Display all items in gallery ******************
//----------------------------------------------------------------
function dataFetched(data) {   
  gallery.innerHTML = '';   // Clear the gallery
  data.forEach(item => {   // Iterate over each item in the data array
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');

    img.src = item.imageUrl;   // Set the image source to the item's imageUrl
    figcaption.textContent = item.title;   // Set the figcaption text to the item's title

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

//------------------------------------ 
//******** Filter the data *******
//------------------------------------
function filterData(category) {   
  const filteredData = data.filter(item => item.category.name === category);   // Filter the data array, based on the category name
  dataFetched(filteredData);   // Display the filtered data in the gallery
}  
document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('token');   // Remove the token from local storage
  console.log('token removed');
});

//----------------------------------------------------------------
//******** Check if a token is stored in the local storage *******
//----------------------------------------------------------------
if (localStorage.getItem('token')) {
  document.getElementById('login').style.display = 'none';
  document.querySelector('.filterButtons').style.display = 'none';
} else {
  document.querySelector('.headerBar').style.display = 'none';
  document.querySelector('.positionFigcaption').style.display = 'none';
  document.querySelector('.position').style.display = 'none';
  document.getElementById('logout').style.display = 'none';
}

//----------------------------------------------------------------
//*************************** Modal ******************************
//----------------------------------------------------------------
const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");   // Close the modal 
  
modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))   // When one of the element of modalTriggers is clicked, the callback function (toggleModal) will be executed
  
function toggleModal(){
  modalContainer.classList.toggle("active")
}

function dataFetchedModal(data) {
  const modalGallery = document.querySelector('.modalGallery');

  modalGallery.innerHTML = '';

  data.forEach((item, index) => {     // Iterate over each item in the data array
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    
    figure.classList.add('figure');
    img.src = item.imageUrl;   // Set the image source to the item's imageUrl
    figcaption.textContent = 'éditer';  


    const iconTrash = document.createElement('div');   // Creation trash icon
    iconTrash.innerHTML = '<i class="fa-solid fa-trash-can" aria-hidden="true"></i>';
    iconTrash.classList.add('iconTrash');

    const iconArrow = document.createElement('div');   // Creation arrow icon
    iconArrow.innerHTML = '<i class="fa-solid fa-arrows-up-down-left-right" aria-hidden="true"></i>';
    iconArrow.classList.add('iconArrow');

//----------------------------------------------------------------
//******************** Delete items in the modal *****************
//----------------------------------------------------------------
    iconTrash.addEventListener('click', () => {
      const itemId = item.id;   
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      console.log(token);   // Check if the token is retrieved correctly
      const formattedToken = `Bearer ${token}`;   // (Le jeton est formaté en utilisant la syntaxe Bearer ${token} et stocké dans la variable formattedToken. Cette étape prépare le jeton à être inclus dans l'en-tête d'autorisation de la demande HTTP.)
      fetch(`http://localhost:5678/api/works/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': formattedToken,   // Include the token in the Authorization header
        }
      })
      .then(response => {
        if (response.ok) {   // If item successfully deleted from the server
          data.splice(index, 1);
          figure.remove();
          modalGallery.removeChild(figure);
          updateFilterButtons(); // Met à jour les boutons de filtrage après la suppression
        } /*else {
          console.error('Error deleting item from the server');
        }*/
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });

    figure.appendChild(iconTrash);
    figure.appendChild(img);
    figure.appendChild(figcaption);

    if (index === 0) {   // Check if it's the first item in the data array
      figure.appendChild(iconArrow);
    }

    modalGallery.appendChild(figure); // Append the figure to the modal gallery
  });
}


//------------------------------------ 
//******** Modal - Ajout photo *******
//------------------------------------
const modalBtn = document.getElementById('modalBtn');
const modalGallery = document.querySelector('.modalGallery');
const modalSupp = document.querySelector('.modalSupp');
const modalTitle = document.querySelector('.modalTitle');
const addItemForm = document.getElementById("addItemForm");
const uploadButton = document.getElementById("uploadButton");

//--------------------------------------------
//*** display chosen image in formPhoto *****/
//--------------------------------------------
/*const photoInput = document.getElementById('photoInput');
const formPhoto = document.querySelector('.formPhoto');

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0]; // Get the selected file

  const reader = new FileReader();   // Create a FileReader to read the file

  reader.onload = () => {     // Define the event handler for when the FileReader has finished reading the file
    formPhoto.innerHTML = '';   // Hide the content of formPhoto

    const chosenImg = document.createElement('img');    // Create a new image element
    chosenImg.src = reader.result; // Set the source of the image to the data URL
    chosenImg.classList.add('chosenImg');

    formPhoto.appendChild(chosenImg);    // Append the image to formPhoto
  };

  reader.readAsDataURL(file);  // Read the file as a data URL
});*/

const photoInput = document.getElementById('photoInput');
const formPhoto = document.querySelector('.formPhoto');

photoInput.addEventListener('change', () => {         // (Acceder aux fichiers lors d'un evenement 'change' - si on met pas ça, image se chargera automatiquement sans choisir)
  const file = photoInput.files[0]; // Get the selected file      (Method pour acceder au premier fichier selectionné)

  if (file) {   // The code checks if a file is selected
    formPhoto.innerHTML = ''; // Clear the content of formPhoto

    const chosenImg = document.createElement('img');
    chosenImg.classList.add('chosenImg');
    chosenImg.src = URL.createObjectURL(file); // Set the source of the image to a temporary URL for the selected file   (method pour crée une chaîne contenant une URL représentant l’objet passé en paramètre.)
    chosenImg.onload = () => URL.revokeObjectURL(chosenImg.src); // Release the object URL once the image has loaded - 'onload' event handler is triggered when the image has finished loading.     (Pour libérer une URL d’objet, libère les ressources mémoire du navigateur associées à l'image. Cette étape est importante pour éviter les fuites de mémoire.)

    formPhoto.appendChild(chosenImg); // Append the image to formPhoto
  }
});

//-------------------------------------------------------
//*** Empty the selected category when page reload *****/
//**** Clear the value of the title input field ********/
//-------------------------------------------------------
document.getElementById("categorySelect").selectedIndex = 0; 

window.addEventListener('load', () => {
  document.getElementById('titleInput').value = ''; 
});

//-------------------------------------------------------------
//*** Modify appearance of modal, when click on modalBtn *****/
//-------------------------------------------------------------
modalBtn.addEventListener('click', () => {
  addItemForm.style.display = 'block';
  modalTitle.textContent = 'Ajout photo';
  modalGallery.classList.add('hidden');
  modalBtn.style.display = 'none';
  uploadButton.style.display = 'block';
  modalSupp.style.display = 'none';
});

//--------------------------------------------------------------------
//*** Modify appearance of modal, when click on arrow back icon *****/
//--------------------------------------------------------------------
document.querySelector('.fa-arrow-left').addEventListener('click', () => {
  addItemForm.style.display = 'none';
  modalTitle.textContent = 'Galerie photo';
  modalGallery.classList.remove('hidden');
  modalBtn.style.display = 'block';
  uploadButton.style.display = 'none';
  modalSupp.style.display = 'block';
});

/*/-------------------------------------
// Get references to the necessary elements
const photoInput = document.getElementById('photoInput');
const titleInput = document.getElementById('titleInput');
const categorySelect = document.getElementById('categorySelect');

// Event listener for the uploadButton click
uploadButton.addEventListener('click', uploadItem);

// Function to handle the form submission and API request
function uploadItem(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the selected file from the file input
  const file = photoInput.files[0];

  // Create a FormData object to store the form data
  const formData = new FormData();
  formData.append('image', file.name);
  formData.append('title', titleInput.value);
  formData.append('category', categorySelect.value);

// Get the token from localStorage
//const token = localStorage.getItem('token');
const token = localStorage.getItem('token'); // Retrieve the token from localStorage
console.log(token); // Check if the token is retrieved correctly
const formattedToken = `Bearer ${token}`;

  // Make sure the token is present
  if (token) {
  // Make an API request to add the item in Swagger
  fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      'Authorization': formattedToken,
    },
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      // Handle the API response
      console.log(data);
      // Reset the form after successful upload
      photoInput.value = '';
      titleInput.value = '';
      categorySelect.value = '';
    })
    .catch(error => {
      // Handle any errors
      console.error('Error:', error);
    });
  } else {
    console.error('Token not found in localStorage');
  }
}
*/