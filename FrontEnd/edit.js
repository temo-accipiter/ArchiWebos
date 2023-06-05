//-------------------------------------*/
// code pour ajout photo 
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
