fetch('recettes.json')
  .then(response => response.json())
  .then(recettes => {
    const container = document.getElementById('recipes-container');

    recettes.forEach((recette, index) => {
      const article = document.createElement('article');
      article.classList.add('recipe');
      article.setAttribute('data-category', recette.categorie);
      article.innerHTML = `
        <h4>${recette.date}</h4>
        <article href="#" class="imgBx" data-modal="modal${index}">
          <img src="${recette.image}" alt="">
          <h3>${recette.titre}</h3>
          <p>${recette.description}</p>
        </article>
        <article id="modal${index}" class="modal">
          <article class="recipeBx">
            <span class="closeModal">&times;</span>
            <article class="recipe_img">
              <img src="${recette.modal_image}" alt="">
              <article class="recipe_txt">
                <article class="txt_side">
                  <span><i class="fa-regular fa-clock"></i> ${recette.temps_preparation}</span>
                  <span><i class="fa-solid fa-mitten"></i> ${recette.temps_cuisson}</span>
                </article>
                <h5>${recette.titre}</h5>
                <article class="txt_side">
                  <span>${recette.calories}</span>
                  <span class="gramme">${recette.quantite}</span>
                </article>
              </article>
            </article>
            <article class="recipe_desc">
              <article class="recipe_list">
                <article class="ingredients">
                  <h3>Ingrédients</h3>
                  ${recette.ingredients.map(ing => `<li><img src="${ing.image}" alt=""> ${ing.nom}</li>`).join('')}
                </article>
                <article class="materiel">
                  <h3>Matériel</h3>
                  ${recette.materiel.map(mat => `<li><img src="${mat.image}" alt=""> ${mat.nom}</li>`).join('')}
                </article>
              </article>
              <article class="middle_bar"></article>
              <article class="steps">
                <h3>Préparation</h3>
                ${recette.etapes.map((etape, i) => `
                  <li class="step">
                    <span>${i + 1}</span>
                    <article>
                      ${etape.map(step => `<li>${step}</li>`).join('')}
                    </article>
                  </li>
                `).join('')}
              </article>
            </article>
          </article>
        </article>
      `;
      container.appendChild(article);
    });

    // On attache les événements MODAL après l'ajout des recettes
    attachModalEvents();

  })
  .catch(error => console.error("Erreur lors du chargement des recettes :", error));


// Fonction pour attacher les événements des modals
function attachModalEvents() {
    // Fonction pour ouvrir le modal
    const openModal = (modal) => {
        modal.style.display = "block";
        setTimeout(() => { modal.classList.add('show'); }, 10);
    };

    // Fonction pour fermer le modal
    const closeModal = (modal) => {
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = "none"; }, 300);
    };

    // Ajouter les écouteurs pour OUVRIR le modal
    document.querySelectorAll('.imgBx').forEach(item => {
        item.addEventListener('click', event => {
            event.preventDefault();
            let modalId = item.getAttribute('data-modal');
            let modal = document.getElementById(modalId);
            if (modal) openModal(modal);
        });
    });

    // Ajouter les écouteurs pour FERMER le modal
    document.querySelectorAll('.closeModal').forEach(item => {
        item.addEventListener('click', event => {
            let modal = item.closest('.modal');
            if (modal) closeModal(modal);
        });
    });

    // Fermer le modal quand on clique à l'extérieur
    window.addEventListener('click', event => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    // Fermer le modal avec la touche Échap
    window.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                closeModal(modal);
            });
        }
    });
}
// scripts.js
document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('search-input');

  filterButtons.forEach(button => {
      button.addEventListener('click', () => {
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          const filter = button.getAttribute('data-filter');
          filterRecipes(filter, searchInput.value);
      });
  });

  searchInput.addEventListener('input', () => {
      const filter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
      filterRecipes(filter, searchInput.value);
  });

  function filterRecipes(filter, searchText) {
      const recipeCards = document.querySelectorAll('.recipe'); // 🔥 On récupère les recettes à chaque appel

      recipeCards.forEach(card => {
          const title = card.querySelector('h3').textContent.toLowerCase();
          const matchesFilter = filter === 'all' || card.getAttribute('data-category') === filter;
          const matchesSearch = title.includes(searchText.toLowerCase());

          if (matchesFilter && matchesSearch) {
              card.style.display = 'flex';
              setTimeout(() => {
                  card.classList.remove('hidden');
              }, 300);
          } else {
              card.classList.add('hidden');
              setTimeout(() => {
                  card.style.display = 'none';
              }, 300);
          }
      });
  }

  // Attendre que les recettes soient chargées avant d'initialiser le filtre
  fetch('recettes.json')
      .then(response => response.json())
      .then(() => {
          filterRecipes('all', ''); // 🔥 Initialiser après le chargement des recettes
      })
      .catch(error => console.error("Erreur lors du chargement des recettes :", error));
});
