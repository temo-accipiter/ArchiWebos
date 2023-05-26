const gallery = document.querySelector('.gallery'); 

function dataFetched (data) {
  data.forEach(item => {              //creat elements for gallery
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    
    img.src = item.imageUrl;
    figcaption.textContent = item.title;
    
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}
//---------------------------------------------------
             /* gallery creation */
//---------------------------------------------------
fetch('http://localhost:5678/api/works')  //get data from swagger 
  .then(response => response.json())      //put data in json
  .then(dataFetched)
  .catch(error => {
    console.error('Error:', error);
  });
// --------------------------------------------
                    /* buttons */
//---------------------------------------------
  /*** creation button 'Tous' ***/
const button1 = document.createElement('button');
button1.textContent = 'Tous'; 
const filters = document.querySelector('.filterButtons');
filters.appendChild(button1);
button1.style.width = '100px';
button1.classList.add('btn');
button1.addEventListener("click", function() {
  gallery.innerHTML = "";
  fetch('http://localhost:5678/api/works')  //get data from swagger 
    .then(response => response.json())      //put data in json
    .then(dataFetched)
    .catch(error => {
      console.error('Error:', error);
    });
})

//---------------------------------------------------
const categories = new Set();  // Create a Set object to store unique categories

fetch('http://localhost:5678/api/works')   // Fetch the data and populate the categories Set
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      categories.add(item.category.name);
    })
    const categoryArray = Array.from(categories);  //
    categoryArray.forEach(category => {

      const button = document.createElement('button');
      button.textContent = category;
      button.classList.add('btn');
      filters.appendChild(button);

      button.addEventListener("click", function () {
        const filteredData = data.filter(item => item.category.name === category); //creation new array(filteredData) from data: for every item of data array, compare the name of category of each item to a category, and if true => save in variable
        gallery.innerHTML = "";
        dataFetched (filteredData);
      })
    })
  })
  .catch(error => {
    console.error('Error:', error);
  });