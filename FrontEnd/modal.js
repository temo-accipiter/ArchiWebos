//----------------------------------------------------------------
//*************************** Modal ******************************
//----------------------------------------------------------------
   // Toggle the visibility of the modal when one of the element of modalTriggers is clicked
document.querySelectorAll('.modalTrigger').forEach(trigger => trigger.addEventListener('click', () => {   
    document.querySelector('.modalContainer').classList.toggle('active');
  })
);

const modalGallery = document.querySelector('.modalGallery');
const token = localStorage.getItem('token');   // Retrieve the token from localStorage

async function dataFetchedModal(data) {   // Function to display data in the modal gallery
  modalGallery.innerHTML = '';

  for (let index = 0; index < data.length; index++) {
    const item = data[index];    
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');

    figure.classList.add('figure');
    img.src = item.imageUrl;   // Set the image source to the item's imageUrl
    figcaption.textContent = 'éditer';

    const iconTrash = document.createElement('div');   // Create the trash icon element
    iconTrash.innerHTML = '<i class="fa-solid fa-trash-can" aria-hidden="true"></i>';
    iconTrash.classList.add('iconTrash');

    const iconArrow = document.createElement('div');   // Create the arrow icon element
    iconArrow.innerHTML = '<i class="fa-solid fa-arrows-up-down-left-right" aria-hidden="true"></i>';
    iconArrow.classList.add('iconArrow');

    figure.appendChild(iconTrash);
    figure.appendChild(img);
    figure.appendChild(figcaption);

    if (index === 0) {   // If it's the first item in the data array, append the arrow icon to the figure element
      figure.appendChild(iconArrow);
    }

    modalGallery.appendChild(figure);
//----------------------------------------------------------------
//******************** Delete items in the modal *****************
//----------------------------------------------------------------
    iconTrash.addEventListener('click', async () => {
      try {
        const response = await fetch(`http://localhost:5678/api/works/${item.id}`, {   // Make a DELETE request to the Swagger API to delete the item
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,   // Include the token in the Authorization header
          }
        });
        if (response.ok) {   // If the item is successfully deleted, remove it from the data array and the modal gallery
          data.splice(index, 1);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
}

//------------------------------------ 
//******** Modal - 'Ajout photo' *******
//------------------------------------
const modalBtn = document.getElementById('modalBtn');
const modalSupp = document.querySelector('.modalSupp');
const modalTitle = document.querySelector('.modalTitle');
const addItemForm = document.getElementById('addItemForm');
const uploadButton = document.getElementById('uploadButton');

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

//--------------------------------------------
//*** display chosen image in formPhoto *****/
//--------------------------------------------
const photoInput = document.getElementById('photoInput');
const formPhoto = document.querySelector('.formPhoto');

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];

  if (file) {   // Check if a file is selected
    formPhoto.innerHTML = '';   // Clear the content of formPhoto

    const chosenImg = document.createElement('img');
    chosenImg.classList.add('chosenImg');
    chosenImg.src = URL.createObjectURL(file);   // Set the source of the image to a temporary URL for the selected file
    chosenImg.onload = () => URL.revokeObjectURL(chosenImg.src);   // Release the object URL once the image has loaded - 'onload' event handler is triggered when the image has finished loading

    formPhoto.appendChild(chosenImg);
  }
});

//-------------------------------------------------------
//**** Clear the value of the title input field ********
//*** Empty the selected category when page reload *****
//-------------------------------------------------------
const titleInput = document.getElementById('titleInput');
window.addEventListener('load', () => {
  titleInput.value = '';
});

const categorySelect = document.getElementById('categorySelect');
categorySelect.selectedIndex = 0;

//--------------------------------------------------------------------
//*** Modify appearance of modal, when click on arrow back icon *****
//--------------------------------------------------------------------
document.querySelector('.fa-arrow-left').addEventListener('click', () => {
  addItemForm.style.display = 'none';
  modalTitle.textContent = 'Galerie photo';
  modalGallery.classList.remove('hidden');
  modalBtn.style.display = 'block';
  uploadButton.style.display = 'none';
  modalSupp.style.display = 'block';
});

//--------------------------------------------------------------------
//*** Add the item to the Swagger *****/
//--------------------------------------------------------------------
uploadButton.addEventListener('click', async (e) => {
  e.preventDefault();   // Prevent the default form submission

  const formData = new FormData();   // Create a FormData object to store the form data
  formData.append('image', photoInput.files[0]);   // Get the selected file from the file input
  formData.append('title', titleInput.value);
  formData.append('category', categorySelect.value);

  try {
    const response = await fetch('http://localhost:5678/api/works', {   // Make a POST request
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });
  } catch (error) {
    console.error('Error:', error);
  }
});

