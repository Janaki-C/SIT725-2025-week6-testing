// ======= jQuery Initializations =======
$(document).ready(function(){
  // Initialize  Materialize components
  $('.modal').modal();
  $('.dropdown-trigger').dropdown();
  $('.carousel').carousel();
  $('.parallax').parallax();
  $('.tap-target').tapTarget();
  $('.collapsible').collapsible();
  $('.fixed-action-btn').floatingActionButton();

  // Color changing buttons
  $('.colorButton').click(function() {
      $(this).css('background-color', 'red');
  });
  
  $('.colorButton1').click(function() {
      $(this).css('background-color', 'pink');
  });

  // Set initial color
  $(".colorButton-1").css("color", "red");
});

// ======= API Handlers =======
// Form submission
document.getElementById('contentForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
      heading: document.getElementById('heading').value,
      description: document.getElementById('description').value,
      picture: document.getElementById('picture').value
  };

  try {
      const response = await fetch('/api/addContent', {  // Updated path
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
      });

      if (!response.ok) {
          throw new Error('Failed to add content');
      }

      const result = await response.json();
      alert(result.message);
      document.getElementById('contentForm').reset();
      await loadContent();
  } catch (error) {
      console.error('Error:', error);
      alert('Error adding content!');
  }
});

// Load content
async function loadContent() {
  try {
      const response = await fetch('/api/getContent');  // Updated path
      if (!response.ok) {
          throw new Error('Failed to fetch content');
      }
      const content = await response.json();

      const contentArea = document.getElementById('contentArea');
      contentArea.innerHTML = content.map(item => `
          <div class="card">
              <div class="card-image">
                  <img src="${item.picture}" alt="${item.heading}">
                  <span class="card-title">${item.heading}</span>
              </div>
              <div class="card-content">
                  <p>${item.description}</p>
              </div>
              <div class="card-action">
                  <button class="btn red" onclick="deleteContent('${item._id}')">
                      <i class="material-icons">delete</i> Delete
                  </button>
              </div>
          </div>
      `).join('');
  } catch (error) {
      console.error('Error loading content:', error);
      alert('Error loading content!');
  }
}

// Delete content
async function deleteContent(id) {
  try {
      const response = await fetch(`/api/deleteContent/${id}`, {  // Updated path
          method: 'DELETE'
      });

      if (!response.ok) {
          throw new Error('Failed to delete content');
      }

      const result = await response.json();
      alert(result.message);
      await loadContent();
  } catch (error) {
      console.error('Error:', error);
      alert('Error deleting content!');
  }
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', loadContent);