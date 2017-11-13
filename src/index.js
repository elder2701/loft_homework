import './main.css';

let myMap;
let clusterer;

let address = document.querySelector('#address'); 
let cancelBtn = document.querySelector('#cancel');
let modal = document.querySelector('#modal');
let addBtn = document.querySelector('#save');
let person = document.querySelector('#name');
let placeName = document.querySelector('#place');
let review = document.querySelector('#review');
let ardressString;
let formReviews = document.querySelector('#reviews-block');
let listPlaces = [];
let clickCoords;

function contentBuilder(name, location, comment, date) {
    return `<p class='formCont'>
                <b class='nameColor'>${name}</b> 
                ${location} 
                ${date} 
            </p><p class='formCont'>${comment}</p>`;
}

function defineAdress(coord) {

    ymaps.geocode(coord).then(function(res) {
        let nearest = res.geoObjects.get(0);
        let placeName = nearest.properties.get('name');
        
        address.innerHTML = placeName;
        ardressString = placeName;
        
    }, 
        function (err) {
            alert('Ошибка');
        }) 
}

function initForm(x, y) {
    modal.style.top = x;
    modal.style.left = y;
    //modal.style.top = e.get('pagePixels')[1] + 'px';
    //modal.style.left = e.get('pagePixels')[0] + 'px';

    modal.style.display = 'block';
    person.value = '';
    placeName.value = '';
    review.value = '';
    formReviews.innerHTML = '';
}

function getDate() { 
    let date = new Date();
    let options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    return date.toLocaleString('en-US', options);
}

new Promise(resolve => ymaps.ready(resolve))
    .then(() => {
        myMap = new ymaps.Map('map', {
            center: [55.76, 37.64], // Москва
            zoom: 5
        }, {
            searchControlProvider: 'yandex#search'
        });

        var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            // без экранирования html.
            '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
            '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
            '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
        );
        
        clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedRedClusterIcons',
            clusterDisableClickZoom: true,
            openBalloonOnClick: true,
            gridSize: 80,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: customItemContentLayout
        });

        myMap.geoObjects.add(clusterer);

        myMap.events.add('click', (evt) => {
            let top = evt.get('pagePixels')[1] + 'px';
            let left = evt.get('pagePixels')[0] + 'px';

            clickCoords = evt.get('coords');
            defineAdress(clickCoords);
            initForm(top, left);
        });

        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        addBtn.addEventListener('click', () => {

            let myPlacemark = new ymaps.Placemark(clickCoords, {}, {
                preset: 'islands#violetIcon'
            });
            
            myPlacemark.properties.set({
                balloonContentHeader: placeName.value,
                balloonContentBody: `<p data-coords='${clickCoords}' id='placemarkCoords'>
                                     <span id='link'>${ardressString}</span> </p>
                                     <p> ${review.value}`,
                balloonContentFooter: getDate()
            }); 

            listPlaces.push({
                name: person.value,
                location: placeName.value,
                comment: review.value,
                addres: ardressString,
                coord: clickCoords,
                date: getDate()
            });
            formReviews.innerHTML += contentBuilder(person.value,
                                                     placeName.value,
                                                     review.value,
                                                     getDate()
                                                    );
            myMap.geoObjects.add(myPlacemark);
            clusterer.add(myPlacemark);
            
            myPlacemark.events.add('click', (evt) => {
                evt.preventDefault();
                let thisPlacemark = evt.get('target');
                let top = evt.get('pagePixels')[1] + 'px';
                let left = evt.get('pagePixels')[0] + 'px';

                clickCoords = thisPlacemark.geometry.getCoordinates();

                defineAdress(clickCoords);
                initForm(top, left)

                for (var i = 0; i < listPlaces.length; i++) {
                    if (clickCoords == listPlaces[i].coord) {
                        formReviews.innerHTML += contentBuilder(listPlaces[i].name, 
                                                                listPlaces[i].location, 
                                                                listPlaces[i].comment, 
                                                                listPlaces[i].date);
                    }
                }

            });
            
        });
    })
    .catch(e => alert('Ошибка: ' + e.message));

document.addEventListener('click', (evt) => {
    if (evt.target.id == 'link') {
        let coords = evt.target.parentNode.dataset.coords;
        let backCoords = coords.split(',');
        
        myMap.balloon.close();
        initForm(evt.pageX, evt.pageY);
        
        clickCoords = backCoords.map((coord) => {
            return +coord;
        });

        defineAdress(clickCoords);

        for (var i = 0; i < listPlaces.length; i++) {
   
            if (coords == listPlaces[i].coord.join(',') ) {
                formReviews.innerHTML += contentBuilder(listPlaces[i].name, 
                                                        listPlaces[i].location, 
                                                        listPlaces[i].comment, 
                                                        listPlaces[i].date );
            }
        }
    } 
});