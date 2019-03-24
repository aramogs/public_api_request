//////////////////////////////////////////////////////
//Ajax Request: Requesting 12 results in json format from API
/////////////////////////////////////////////////////
$.ajax({
    url: 'https://randomuser.me/api/?results=12',
    dataType: 'json'
}).done(function (user) {
    //Preparing each card with the current information from user.results[i]
    $.each(user.results, function (i) {
        $card = $(`<div class="card">
    <div class="card-img-container">
        <img class="card-img" src="${user.results[i].picture.large}" alt="profile picture">
    </div>
    <div class="card-info-container">
        <h3 id="name" class="card-name cap">${user.results[i].name.first},${user.results[i].name.last}</h3>
        <p class="card-text">${user.results[i].email}</p>
        <p class="card-text cap">${user.results[i].location.city},${user.results[i].location.state}</p>
    </div>
    </div>`);
        $('#gallery').append($card);
    });
//////////////////////////////////////////////////////
//EventListener:When card class is clicked then append modal-container
/////////////////////////////////////////////////////
    $('.card').on('click', function (e) {
        e.preventDefault();
        result = user.results[$(this).index()];
        currentIndex = $(this).index();
        modal(result);
    });
//////////////////////////////////////////////////////
//Function Modal: When called the modal function inserts the modal-container with the respective information
/////////////////////////////////////////////////////    
    function modal(result) {
        //Converting the dob.date to 01/01/1900
        let birthday = new Date(result.dob.date).toLocaleDateString('en-US');
        $modal = $(`<div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${result.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${result.name.first},${result.name.last}</h3>
                        <p class="modal-text">${result.email}</p>
                        <p class="modal-text cap">${result.location.city}</p>
                        <hr>
                        <p class="modal-text">${result.phone}</p>
                        <p class="modal-text">${result.location.street}, ${result.location.state},  ${result.location.postcode}</p>
                        <p class="modal-text">Birthday:${birthday}</p>
                    </div>
                </div> 
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
                </div>`);
        $('.modal-container').remove();
        $('body').append($modal);
        //If prev button is clicked, then change the information displayed,
        //This is done by changing the currentIndex--
        $('#modal-prev').on('click', function () {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = document.querySelectorAll('.card').length - 1;
            }
            result = user.results[currentIndex];
            modal(result)
        });
        //If next button is clicked, then change the information displayed,
        //This is done by changing the currentIndex++
        $('#modal-next').on('click', function () {
            currentIndex++;
            if (currentIndex > document.querySelectorAll('.card').length - 1) {
                currentIndex = 0;
            }
            result = user.results[currentIndex];
            modal(result)
        });
        //If the close button is clicked, the modal-container is removed
        $('#modal-close-btn').on('click', function (e) {
            $('.modal-container').remove();
        });
    }
//////////////////////////////////////////////////////
//Search: Adding the search option dinamically
/////////////////////////////////////////////////////   
    $form = $(`<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>`);
    $('.search-container').append($form);
    //Adding eventlistener to search input
    $('#search-input').keyup(function () {
        //Getting the text from the searched word and converting it to lowercase
        let search = document.querySelector('#search-input').value.toLowerCase();
        //Getting all the classes named card-name
        let names = document.querySelectorAll('.card-name');
        //Looping the names classes
        for (let i = 0; i < names.length; i++) {
            //Getting the textcontent of card-name classes
            let itemName = names[i].textContent;
            //searching the value of the input with the current text of card-name
            let index = itemName.toLowerCase().indexOf(search);
            //If the text matches then change style.display to flex
            if (index != -1) {
                names[i].parentElement.parentElement.style.display = "flex";
            //else change style.display to none
            } else {
                names[i].parentElement.parentElement.style.display = "none";
            }
        }
    });
});