// UI Controller
const UICtrl = (() => {
  // private
  // centralize selectors 
  const UISelectors = {
    searchContainer:   '.search-container',
    searchInput:       '#search-input',
    serachSubmit:      '#serach-submit',
    header:            'header',
    gallery:           '#gallery',
    cardInfoContianer: '.card-info-container',
    card:              '.card',
    cardName:          '.card-name',
    name:              '#id',
    modalContainer:    '.modal-container',
    modal:             '.modal',
    modalNext:         '#modal-next',
    modalPrev:         '#modal-prev',
    modalClose:        '#modal-close-btn',
  }

  // public
  return {
    
    card: (data) => {
      // define vars and map to each data result
      for(let user of data.results){
        let firstName = user.name.first;
        let lastName = user.name.last;
        let image = user.picture.large;
        let email = user.email;
        let city = user.location.city;
        // define the output for each card
        let employee = `
          <div class="card-img-container">
            <img class="card-img" src="${image}" alt="${firstName} ${lastName}'s profile picture">
          </div>
          <div class="card-info-container">
            <h3 id="name" class="card-name cap">${firstName} ${lastName}</h3>
            <p class="card-text">${email}</p>
            <p class="card-text cap">${city}</p>
          </div>
        `;
        // create outer div of the cards 
        let output = document.createElement('div');
        output.className = 'card';
        // Set inner html to the outer div
        output.innerHTML = employee;
        // append to page
        document.querySelector(UISelectors.gallery).appendChild(output);
      }
      // Add eventListener to each card
      let details = document.querySelectorAll(UISelectors.card);
      details.forEach( (card, index) => {
        card.addEventListener('click', event => {
          event.preventDefault();
          UICtrl.modal(data, index);
          console.log(data,index)
        });
      });
    },

    modal: (data, index) => {
      let user = data.results[index];
      let firstName = user.name.first;
      let lastName = user.name.last;
      let image = user.picture.large;
      let email = user.email;
      let birthday = new Date(user.dob.date).toLocaleDateString('en-US');
      let city = user.location.city;
      let street = user.location.street;
      let state = user.location.state;
      let zip = user.location.postcode;
      let phone = user.phone;

      // Modal output
      const container = document.createElement('div');
      const contents = document.createElement('div');
      container.className = 'modal-container';
      contents.className = UISelectors.modal;
      container.innerHTML = `
        <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
            <img class="modal-img" src="${image}" alt="${firstName} ${lastName}'s profile picture">
            <h3 id="name" class="modal-name cap">${firstName} ${lastName}</h3>
            <p class="modal-text">${email}</p>
            <p class="modal-text cap">${city}</p>
            <hr>
            <p class="modal-text">${phone.replace('-', ' ')}</p>
            <p class="modal-text">${street}., ${city}, ${zip}</p>
            <p class="modal-text">Birthday: ${birthday}</p>
          </div>
          <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
          </div>
      `;

      // if overlay is active remove
      if(document.querySelector(UISelectors.modalContainer)){
        document.querySelector(UISelectors.modalContainer).remove();
      }
      // append overlay
      document.querySelector('body').appendChild(container);

      // Modal next button
      document.querySelector(UISelectors.modalNext).addEventListener('click', event => {
        event.preventDefault();
        UICtrl.modalNext(data, index);
      });
      
      // Modal previous button
      document.querySelector(UISelectors.modalPrev).addEventListener('click', event => {
        event.preventDefault();
        UICtrl.modalPrev(data, index);
      });

      // Modal close button
      document.querySelector(UISelectors.modalClose).addEventListener('click', event => {
        event.preventDefault();
        document.querySelector(UISelectors.modalContainer).remove();
      });

      // Modal next button (keypress) to revisit down the road - current issue is the event doubles on each click
      // document.querySelector('body').addEventListener('keyup', event => {
      //   event.preventDefault();
      //   console.log(event);
      //   if(event.key === 'ArrowRight'){
      //     UICtrl.modalNext(data, index); 
      //   }
      //   if(event.key === 'ArrowLeft'){
      //     UICtrl.modalPrev(data, index); 
      //   }
      //   if(event.key === 'Escape' || event.key === 'Enter' ){
      //     if(document.querySelector(UISelectors.modalContainer)){
      //       document.querySelector(UISelectors.modalContainer).remove();
      //     }
      //   }
      // });
      
    },

    // Next user record (loops back to begining)
    modalNext: (data, index) =>{
      index++;
      if(index > document.querySelectorAll(UISelectors.card).length - 1){
        index = 0;
      }
      UICtrl.modal(data, index);
    },

    // Previous user record  (loops back to last record)
    modalPrev: (data, index) =>{
      index--;
      if(index < 0){
        index = document.querySelectorAll(UISelectors.card).length -1;
      }
      UICtrl.modal(data, index);
    },

    search: () =>{
      let output = `
      <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
      </form>
      `;
      // live filter on key up
      let container = document.querySelector(UISelectors.searchContainer);
      container.innerHTML = output;
      document.querySelector(UISelectors.searchInput).addEventListener('keyup', event => {
        event.preventDefault();
        console.log(event);
        UICtrl.searchFilter();
      });
      // triggers the search as the paste option on context is way below header
      document.querySelector(UISelectors.header).addEventListener('mouseout', event => {
        event.preventDefault();
        UICtrl.searchFilter();
      });
      // likely will never click as the 1 of the previous 2 events should trigger before the need to click 
      document.querySelector(UISelectors.serachSubmit).addEventListener('click', event => {
        event.preventDefault();
        UICtrl.searchFilter();
      });
    },

    searchFilter: () =>{
      let cards = document.querySelectorAll(UISelectors.card);
      let input = document.querySelector(UISelectors.searchInput);
      let noResults = document.createElement('h1');
      noResults.innerHTML = 'Sorry, No Results found';
      for(card of cards){
        let name = card.children[1].children[0];
        name.textContent.indexOf(input.value.toLowerCase()) > -1 ? 
          card.style.display = '' :
          card.style.display = 'none';
      }
      // on blur clear the input and display all records
      input.addEventListener('blur', event => {
        event.preventDefault();
        input.value = '';
        if (!input.value) {
          setTimeout(() => { // delay to allow selection
            for(card of cards){
              card.style.display = '';
            }
          },500); 
        }
      });
    },
    getSelectors: () => UISelectors
  }
})();



// Data Controller
const DataCtrl = (() => {
  // Data Fetch API
  function fetchUserJSON(url, numberOfUsers) {
    fetch(`${url}?nat=us&results=${parseInt(numberOfUsers)}`)
      .then( response => response.json() )
      .then( data => UICtrl.card(data) )
      .catch( error => console.log(error) );
  }
  
  // Public
  return {
    getRandomUser: () => fetchUserJSON('https://randomuser.me/api/', 12)
  }
})();



// App Controller
const App = ((UICtrl, DataCtrl) => {

  // Public
  return {
    init: () => {
      console.log('Initializing App ...');
      DataCtrl.getRandomUser();
      UICtrl.search();
    }
  }
})(UICtrl, DataCtrl);



// Initialize App
App.init()