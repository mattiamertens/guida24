var geoJ = 'assets/features.geojson';
let savedEventsArray = JSON.parse(localStorage.getItem('savedEvents')) || [];

fetch(geoJ).then(response => response.json())
.then(data => {

    // ASSING ID TO EACH FEATURE
    const places = data.features;
    places.forEach((place, i) => {
        place.properties.id = i + 1;

        if(place.properties.type == "Scrocco"){
            place.properties.color = 'var(--event_orange)';
        }
        else if(place.properties.type == "Design"){
            place.properties.color = 'var(--event_blue)';
        }
        else if(place.properties.type == "Serata"){
            place.properties.color = 'var(--event_green)';
        }
    });





    map.on('load', () => {
        map.loadImage('assets/icons/pinD.png', 
        (error, image) => {
            if (error) throw error;
            map.addImage('pinD', image);
        });
        map.loadImage('assets/icons/pinSc.png', 
        (error, image) => {
            if (error) throw error;
            map.addImage('pinSc', image);
        });
        map.loadImage('assets/icons/pinSe.png', 
        (error, image) => {
            if (error) throw error;
            map.addImage('pinSe', image);
        });
        map.loadImage('assets/mapbox-icon.png', 
        (error, image) => {
            if (error) throw error;
            map.addImage('random', image);
        });

            
        map.addSource('events', {
            type: 'geojson',
            data: data,
            cluster: true,
            clusterRadius: 8,
            clusterMaxZoom: 20
        });
            
        // CLUSTER LAYER
        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'events',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': 'white',
                'circle-stroke-color': '#C9CFEC',
                'circle-stroke-width': 1,
                'circle-radius': 14
            }
        });

        // CLUSTER COUNT
        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'events',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['Arial Unicode MS Bold', 'DIN Offc Pro Medium'],
                'text-size': 12,

            },
            paint: {
                "text-color": "black"
            }
        })

        // LIVELLO UNICO - UNCLUSTERED EVENTS
        map.addLayer({
            id: 'eventini',
            type: 'symbol',
            source: 'events',
            filter: ['!', ['has', 'point_count']],
            'layout': {
                'icon-image': 'pin',
                'icon-image': [
                    'match',
                    ['get', 'type'],
                    'Scrocco', 'pinSc',
                    'Design', 'pinD',
                    'Serata', 'pinSe',
                    'random'
                ],
                'icon-size': 0.4,
                'icon-allow-overlap': true
            }
        });

    });
});


// inspect a cluster on click
map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
    });

    const clusterId = features[0].properties.cluster_id;
    var clusterSource = map.getSource('events');
    map.getSource('events').getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
            if (err) return;

            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
            });
        }
    );

    clusterSource.getClusterChildren(clusterId, (err, features) => {
        if (err) return;
        console.log(features);
    });
    clusterSource.getClusterLeaves(clusterId, 10, 0, (err, features) => {
        if (err) return;
        console.log(features);
    });

    console.log('click cluster');
});


// POPUP 
map.on('click', 'eventini', function poppinUp(e){
  const coordinates = e.features[0].geometry.coordinates.slice();
  const type = e.features[0].properties.type;
  const event = e.features[0].properties.event;
  const description = e.features[0].properties.description;
  const startDate = e.features[0].properties.startDate;
  const endDate = e.features[0].properties.endDate;
  const gMapsLink = e.features[0].properties.gMapsLink;
  const regLink = e.features[0].properties.regLink;
  const dataId = e.features[0].properties.id;
  const color = e.features[0].properties.color;

  console.log('click eventini');
  

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
  let popup = new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(`<div class="popUp flex column g-m" data-id="${dataId}">
        <div class="popUp-header flex-display-center-sb">
            <div class="event-type">${type}</div>
            <div class="popUp-icons flex-display-center-center g-xs">
                <div class="icon icon-m" alt="favorites" id="bookmark" style="mask-image: var(--icon-favorites);"></div>
                <button class="remove-popup"><div class="icon icon-m" alt="day-type" style="mask-image: var(--icon-close);"></div></button>
            </div>
        </div>
        
        <div class="event-title bold"> ${event} </div>

        <div class="popUp-time flex column g-xs">
            <div class="day-type flex v-center g-xs muted-text"> 
                <div class="mask-image icon icon-s muted-icon" alt="day-type" style="mask-image: var(--icon-dayType);"></div> 
                This is a one-day event
            </div>

            <div class="event-dates flex v-center g-s">
                <div class="flex v-center g-xs"><div class="mask-image icon-s muted-icon" alt="day-type" style="mask-image: var(--icon-date);"></div><span class="bold"> ${startDate} </span></div> 
                <div class="divider"></div>
                <div class="flex v-center g-xs"><div class="mask-image icon-s muted-icon" alt="day-type" style="mask-image: var(--icon-time);"></div> <span>${endDate}</span></div>
            </div>
        </div>

        <div class="popUp-footer flex-display-center-sb">
            <button class="primary-btn"><a href="${gMapsLink}" class="btn-text">Google maps</a></button>
            
            <button class="secondary-btn no-link">
                <a href="${regLink}" class="btn-text flex v-center underlined">
                    RSVP
                    <div class="mask-image icon-s icon" alt="day-type" style="mask-image: var(--icon-extLink);"></div>
                </a>
            </button>
        </div>
    </div>`
      ).setMaxWidth("80%").addTo(map);

    map.flyTo({
        center: e.features[0].geometry.coordinates
    });
    

    // LINK HIDDEN IF VALUE NOT PRESENT
    if(!regLink){
        $(".no-link").hide();
    }
    
    // CHANGE COLOR OF PILL BASED ON TYPE
    var eventPill = document.querySelector('.mapboxgl-popup-content .event-type');
    if(type == "Scrocco"){
        console.log("Scrocco");
        $(eventPill).css('background-color', color);
    }
    else if(type == "Design"){
        console.log("Design");
        $(eventPill).css('background-color', color);
    }
    else if(type == "Serata"){
        console.log("Serata");
        $(eventPill).css('background-color', color);  
    }

    //REMOVE POPUP
    $('.remove-popup').on('click', function(){
        popup.remove();
    });

    // CHECK IF EVENT IS ALREADY SAVED
    if(savedEventsArray.some(e => e.id === dataId)){
        console.log('Event is already saved');
        $('#bookmark').css('mask-image', 'var(--icon-favorites-filled)');  
    };


    // ADD EVENT TO FAVORITES
    $('#bookmark').on('click', function(){
        let eventData = {id: dataId, type: type, title: event, startDate: startDate, endDate: endDate, gMapsLink: gMapsLink, rsvp: regLink, color: color};

       saveEvents(eventData);
    });
});


function saveEvents(event){
    // let savedEventsArray = JSON.parse(localStorage.getItem('savedEvents')) || [];
    // console.log(savedEventsArray);

    // CEHCK IF SAVED IN CASE: DON'T SAVE IF ALREADY PRESENT ---- first e.id is the one in the array, second is the one we are trying to save
    if(!savedEventsArray.some(e => e.id === event.id)){
        $('#bookmark').css('mask-image', 'var(--icon-favorites-filled)');

        // PUSH TO ARRAY
        savedEventsArray.unshift(event);
        localStorage.setItem('savedEvents', JSON.stringify(savedEventsArray));

        document.querySelector('.nr-fav-events').innerHTML = savedEventsArray.length + ' events';
        renderSavedEvents(event);

        // MAKE LITTLE ANIMATION FEEDBACK FOR SAVED EVENT

    }
    else{
        $('#bookmark').css('mask-image', 'var(--icon-favorites)');

        // REMOVE FROM ARRAY
        savedEventsArray = savedEventsArray.filter(e => e.id !== event.id);
        localStorage.setItem('savedEvents', JSON.stringify(savedEventsArray));

        removeSavedEvent(event);
    }
};

function renderSavedEvents(event){
    console.log(savedEventsArray);

    let favContainer = $('.favorites-events-content');
    $('.placebo').hide();
    $(favContainer).addClass('flex-display-start-center h-100');

    $(favContainer).prepend(
        `<div class="fav-popUp w-100 flex column g-m" data-id="${event.id}">
            <div class="popUp-header flex-display-center-sb">
                <div class="event-type" style="background-color: ${event.color}" >${event.type}</div>
                <div class="popUp-icons flex-display-center-center g-xs">
                    <button class="icon icon-m fav-bookmark" id='silly' alt="favorites" style="mask-image: var(--icon-favorites-filled);"></button>
                </div>
            </div>
        
            <div class="event-title bold"> ${event.title} </div>

            <div class="popUp-time flex column g-xs">
                <div class="day-type flex v-center g-xs muted-text"> 
                    <div class="mask-image icon icon-s muted-icon" alt="day-type" style="mask-image: var(--icon-dayType);"></div> 
                    This is a one-day event
                </div>

                <div class="event-dates flex v-center g-s">
                    <div class="flex v-center g-xs"><div class="mask-image icon-s muted-icon" alt="day-type" style="mask-image: var(--icon-date);"></div><span class="bold"> ${event.startDate} </span></div> 
                    <div class="divider"></div>
                    <div class="flex v-center g-xs"><div class="mask-image icon-s muted-icon" alt="day-type" style="mask-image: var(--icon-time);"></div> <span>${event.endDate}</span></div>
                </div>
            </div>

            <div class="popUp-footer flex-display-center-sb">
                <button class="primary-btn"><a href="${event.gMapsLink}" class="btn-text">Google maps</a></button>
                
                <button class="secondary-btn">
                    <a href="${event.rsvp}" class="btn-text flex v-center underlined">
                        RSVP
                        <div class="mask-image icon-s icon" alt="day-type" style="mask-image: var(--icon-extLink);"></div>
                    </a>
                </button>
            </div>
        </div>`
    );

};

function loadSavedEvents(){ 
    savedEventsArray.reverse().forEach(renderSavedEvents);

    document.querySelector('.nr-fav-events').innerHTML = savedEventsArray.length + ' events';
}

function removeSavedEvent(event){
    $(`.fav-popUp[data-id="${event.id}"]`).remove();
    document.querySelector('.nr-fav-events').innerHTML = savedEventsArray.length + ' events';

    if (savedEventsArray.length == 0){
        $('.placebo').show();
    }
};

$(document).ready(function(){
    console.log('Document ready');
    loadSavedEvents();


    var deleteFav = document.querySelectorAll('.fav-bookmark');
    for (let i = 0; i < deleteFav.length; i++) {
        deleteFav[i].addEventListener('click', function(){
            $(this).closest('.fav-popUp').remove();

            let removingId = $(this).closest('.fav-popUp').attr('data-id');
            savedEventsArray = savedEventsArray.filter(e => e.id !== Number(removingId));
            
            console.log(savedEventsArray);
            localStorage.setItem('savedEvents', JSON.stringify(savedEventsArray));
            if (savedEventsArray.length == 0){
                $('.placebo').show();
            }

            document.querySelector('.nr-fav-events').innerHTML = savedEventsArray.length + ' events';
        });
    }

});


// NON TOCCARE è OLD
// map.on('click', 'Scrocco', (e) => {
//     const coordinates = e.features[0].geometry.coordinates.slice();
//     const type = e.features[0].properties.type;
//     const event = e.features[0].properties.event;
//     const description = e.features[0].properties.description;
//     const startDate = e.features[0].properties.startDate;
//     const endDate = e.features[0].properties.endDate;
//     const gMapsLink = e.features[0].properties.gMapsLink;
//     const regLink = e.features[0].properties.regLink;


//     // Ensure that if the map is zoomed out such that
//     // multiple copies of the feature are visible, the
//     // popup appears over the copy being pointed to.
//     while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//         coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//     }

//     let popup = new mapboxgl.Popup()
//         .setLngLat(coordinates)
//         .setHTML(` <div class="popUp">
//             <div class="popUp-title">${type}</div>
//                 <div class="waiting-time-big sans-bold">
//                         ${event}
//                         <div>
//                         ${description}
//                         </div>
//                     <div class="next-spot sans-regular"> Inizio <span class="sans-bold"> ${startDate} </span></div>
//                     <div class="next-spot sans-regular"> Fine <span class="sans-bold"> ${endDate} </span></div>
//                     <div class="comparison-data">
                        
//                     </div>
//                 </div>

//                 <div class="popUp-footer flex-display-center-sb">
//                     <a href="${gMapsLink}" class="stream-button list-btn btn-text">Google maps</a>
//                     <a href="${regLink}" class="btn-text sans-bold underlined cancello">Registrati</a>
//                 </div>
//             </div>`
//         )
//         .setMaxWidth("80%")
//         .addTo(map);

//     map.flyTo({
//         center: e.features[0].geometry.coordinates
//     });

//     // LINK HIDDEN IF VALUE NOT PRESENT
//     if(!regLink){
//         $(".cancello").hide();
//     }
// });

// map.on('click', 'Serata', (e) => {
//   const coordinates = e.features[0].geometry.coordinates.slice();
//   const type = e.features[0].properties.type;
//   const event = e.features[0].properties.event;
//   const description = e.features[0].properties.description;
//   const startDate = e.features[0].properties.startDate;
//   const endDate = e.features[0].properties.endDate;
//   const gMapsLink = e.features[0].properties.gMapsLink;
//   const regLink = e.features[0].properties.regLink;


//   // Ensure that if the map is zoomed out such that
//   // multiple copies of the feature are visible, the
//   // popup appears over the copy being pointed to.
//   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
//       coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
//   }

// //   let popup = new mapboxgl.Popup()
// //       .setLngLat(coordinates)
// //       .setHTML(` <div class="popUp">
// //           <div class="popUp-title">${type}</div>
// //               <div class="waiting-time-big sans-bold">
// //                       ${event}
// //                       <div>
// //                       ${description}
// //                       </div>
// //                   <div class="next-spot sans-regular"> Inizio <span class="sans-bold"> ${startDate} </span></div>
// //                   <div class="next-spot sans-regular"> Fine <span class="sans-bold"> ${endDate} </span></div>
// //                   <div class="comparison-data">
                      
// //                   </div>
// //               </div>

// //               <div class="popUp-footer flex-display-center-sb">
// //                   <a href="${gMapsLink}" class="stream-button list-btn btn-text">Google maps</a>
// //                   <a href="${regLink}" class="btn-text sans-bold underlined cancello">Registrati</a>
// //               </div>
// //           </div>`
// //       )
// //       .setMaxWidth("80%")
// //       .addTo(map);

//   map.flyTo({
//       center: e.features[0].geometry.coordinates
//   });

//   // LINK HIDDEN IF VALUE NOT PRESENT
//   if(!regLink){
//       $(".cancello").hide();
//   }
// });



var scrocco = document.getElementById("Scrocco");
var design = document.getElementById("Design");
var serata = document.getElementById("Serata");

// FILTRI TIPOLOGIA EVENTI
var check = document.querySelectorAll('.control')
var combinedFilter = ["all"];

for (let i = 0; i < check.length; i++) {
    var selectedLayer = check[i];
  
    $(selectedLayer).on('click', function() {
        var selType = this.id;
        var typeFilter = ['!=', ['get', 'type'], selType];
  
        //  combinedFilter.splice(1, 1, typeFilter);
        combinedFilter.push(typeFilter)
        console.log(combinedFilter[1][2]);
        // map.setFilter('eventini', typeFilter); // USE COMBINED-FILTER
        map.setFilter('eventini', combinedFilter);

    })
}

// DAYS FILTER
var dayFilter = ['!=', ['get', 'startDate']];
var monday = document.getElementById("monday");

var weekCheck = document.querySelectorAll('.weekControl')
for (let i = 0; i < weekCheck.length; i++) {
  var selectedLayer = weekCheck[i];

  $(selectedLayer).on('click', function() {
    var selDay = this.value;
    var dayFilter = ['!=', ['get', 'startDate'], selDay];
    combinedFilter.push(dayFilter)
    console.log(combinedFilter);
    map.setFilter('eventini', combinedFilter);

    if($(this).is(':checked')) {
        for (var i = combinedFilter.length - 1; i >= 0; --i) {
            if (combinedFilter[i][2] == this.value) {
                combinedFilter.splice(i,1);
            }
        }

        map.setFilter('eventini', combinedFilter);
        // console.log('Scrocco is now visible')
        console.log(combinedFilter)
    }
    
    }
)}


// SPLICE FILTERS TO REMOVE FROM ARRAY
$(scrocco).on('click', function() {
    if($(this).is(':checked')) {

        for (var i = combinedFilter.length - 1; i >= 0; --i) {
            if (combinedFilter[i][2] == "Scrocco") {
                combinedFilter.splice(i,1);
            }
        }
        map.setFilter('eventini', combinedFilter);
        // console.log('Scrocco is now visible')
        console.log(combinedFilter)
    }
})

$(design).on('click', function() {
    if($(this).is(':checked')) {
        for (var i = combinedFilter.length - 1; i >= 0; --i) {
            if (combinedFilter[i][2] == "Design") {
                combinedFilter.splice(i,1);
            }
        }

        map.setFilter('eventini', combinedFilter);
        console.log(combinedFilter)
    }
})

$(serata).on('click', function() {
    if($(this).is(':checked')) {
        for (var i = combinedFilter.length - 1; i >= 0; --i) {
            if (combinedFilter[i][2] == "Serata") {
                combinedFilter.splice(i,1);
            }
        }

        map.setFilter('eventini', combinedFilter);
        // console.log('Scrocco is now visible')
        console.log(combinedFilter)
    }
})
$(monday).on('click', function() {
    // if($(this).is(':checked')) {
    //     for (var i = combinedFilter.length - 1; i >= 0; --i) {
    //         if (combinedFilter[i][2] == this.value) {
    //             combinedFilter.splice(i,1);
    //         }
    //     }

    //     map.setFilter('eventini', combinedFilter);
    //     // console.log('Scrocco is now visible')
    //     console.log(combinedFilter)
    // }
})


// OPEN BOTH FILTER MODALS
$('.filter-btn').on('click', function(){
    let modalClass = '#' + $(this).attr('id') + '-filter';
    console.log(modalClass);

    $(modalClass).removeClass('hidden')

    setTimeout(() => {
        $(modalClass).css({
            "-webkit-transform":"translate(-50%,-50%)"
        });
    }, 100);
});


// CLOSE FILTER MODAL
$('.close-modal').on('click', function(){
    
    $(this).closest('.filter-card-container').css({
        "-webkit-transform":"translate(-50%, 50vh)"
    });
    setTimeout(() => {
        $(this).closest('.filter-card-container').addClass('hidden');
    }, 400);
})


// EXPAND FAVORITES TAB
let isExpnd = false;
function expandFav() {
    let expandBtn = document.getElementById('expand-btn');
    let favoritesContainer = document.getElementsByClassName('favorites-container')[0];
    let favEveCont = document.getElementsByClassName('favorites-events-content')[0];

    isExpnd ? collps() : expnd();
    function expnd() {
        isExpnd = true;
        expandBtn.innerHTML = "collapse";
        // favoritesContainer.style.height = '70vh';
        $(favoritesContainer).addClass('expnd');
        $(favEveCont).addClass('fav-eve-cont-up');
    }
    function collps() {
        isExpnd = false;
        expandBtn.innerHTML = "expand";
        // favoritesContainer.style.height = '42px';
        $(favoritesContainer).removeClass('expnd');
        $(favEveCont).removeClass('fav-eve-cont-up');
    }
}

// TRACK LOCATION OF USER
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
    }), 'bottom-right'
);



// CUSTOM USER GEOLOCATION
// $('.filter-date').on('click', function(){
//     console.log('geolocation is available');
//     navigator.geolocation.getCurrentPosition(position => {
//         const userCoordinates = [position.coords.longitude, position.coords.latitude];
//         console.log(userCoordinates);

//         map.flyTo({
//             center: [position.coords.longitude, position.coords.latitude],
//             zoom: 15,  // Adjust zoom level as needed
//             speed: 1.5, // Adjust speed (higher is faster)
//             curve: 1, // Controls the flight path curvature
//             essential: true // this animation is considered essential with respect to prefers-reduced-motion
//         });

//         if (window.userMarker) {
//             window.userMarker.remove();
//         }

//         // Add a new blue marker for user location
//         window.userMarker = new mapboxgl.Marker({
//             color: "blue" // Blue dot effect
//         })
//             .setLngLat(userCoordinates)
//             .addTo(map);
//     });
// });
