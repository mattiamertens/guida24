var geoJ = 'assets/features.geojson';
var feature;
map.on('load', () => {
  map.loadImage('assets/pin.png', 
  (error, image) => {
      if (error) throw error;
      map.addImage('pin', image);
  });
  map.loadImage('assets/pinD.png', 
  (error, image) => {
      if (error) throw error;
      map.addImage('pinD', image);
  });
  map.loadImage('assets/pinSc.png', 
  (error, image) => {
      if (error) throw error;
      map.addImage('pinSc', image);
  });
  map.loadImage('assets/pinSe.png', 
  (error, image) => {
      if (error) throw error;
      map.addImage('pinSe', image);
  });
      

      // const geojson = {
      //   "features": [
      //     {
      //       "type": "Feature",
      //       "properties": {
      //         "event": "Bagno diurno",
      //         "startDate": "15/04/2024",
      //         "startHour": "",
      //         "endDate": "21/04/2024",
      //         "gMapsLink": "https://www.google.com/maps/search/?api=1&query=Via+giacosa+30,+Milano",
      //         "regLink": "",
      //         "type": "Location",
      //         "description": ""
      //       },
      //       "geometry": {
      //         "coordinates": [
      //           9.221438,
      //           45.494965
      //         ],
      //         "type": "Point"
      //       },
      //       "id": "0a18449b5966c833d7e9e5d708c0f615"
      //     },
      //     {
      //       "type": "Feature",
      //       "properties": {
      //         "event": "ALESSI",
      //         "startDate": "16/04/2024",
      //         "startHour": "10:00",
      //         "endDate": "21/04/2024",
      //         "gMapsLink": "https://www.google.com/maps/search/?api=1&query=Palazzo+Borromeo+d'Adda,+Via+Alessandro+Manzoni,+41,+20121+Milano+MI,+Italia",
      //         "regLink": "",
      //         "type": "Design",
      //         "description": ""
      //       },
      //       "geometry": {
      //         "coordinates": [
      //           9.194015,
      //           45.471326
      //         ],
      //         "type": "Point"
      //       },
      //       "id": "0b5377b1d6455f45d6c1a6977d80b4a1"
      //     }
      //   ]
      // }
      
  $.getJSON(geoJ, function(events){

    for (feature of events.features) {
      const type = feature.properties.type;
      const layerID = `${type}`;
      
      // console.log(feature)
      if (!map.getLayer(layerID)) {
        map.addLayer({
          id: layerID,
          type: 'symbol',
          source: 'events',
          layout: {
            'icon-image': [
                  'match',
                  ['get', 'type'],
                  'Scrocco', 'pinSc',
                  'Design', 'pinD',
                  'Serata', 'pinSe',
                  'pin'
                ],
            'icon-size': 0.2,
            'icon-allow-overlap': true
            },
          filter: ['==', ['get', 'type'], type],
        });
      }
    }
  }); // getJSON

  map.addSource('events', {
              type: 'geojson',
              // Use a URL for the value for the `data` property.
              data: geoJ,
              cluster: false,
              clusterRadius: 50,
              clusterMaxZoom: 11,
  });
});

// inspect a cluster on click
map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
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
});

// for (e of e.features[0]) {
   
//   el.addEventListener('click', (e) => {
//       console.log('aa')
//   });
// }

// POPUP 
map.on('click', 'Design', function poppinUp(e){
  const coordinates = e.features[0].geometry.coordinates.slice();
  const type = e.features[0].properties.type;
  const event = e.features[0].properties.event;
  const description = e.features[0].properties.description;
  const startDate = e.features[0].properties.startDate;
  const endDate = e.features[0].properties.endDate;
  const gMapsLink = e.features[0].properties.gMapsLink;
  const regLink = e.features[0].properties.regLink;

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
  let popup = new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(` <div class="popUp">
          <div class="popUp-title">${type}</div>
              <div class="waiting-time-big sans-bold">
                      ${event}
                      <div>
                      ${description}
                      </div>
                  <div class="next-spot sans-regular"> Inizio <span class="sans-bold"> ${startDate} </span></div>
                  <div class="next-spot sans-regular"> Fine <span class="sans-bold"> ${endDate} </span></div>
                  <div class="comparison-data">
                      
                  </div>
              </div>

              <div class="popUp-footer flex-display-center-sb">
                  <a href="${gMapsLink}" class="stream-button list-btn btn-text">Google maps</a>
                  <a href="${regLink}" class="btn-text sans-bold underlined cancello">Registrati</a>
              </div>
          </div>`
      ).setMaxWidth("80%").addTo(map);

      map.flyTo({
          center: e.features[0].geometry.coordinates
      });

      // LINK HIDDEN IF VALUE NOT PRESENT
      if(!regLink){
          $(".cancello").hide();
      }
  }
);

map.on('click', 'Scrocco', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const type = e.features[0].properties.type;
    const event = e.features[0].properties.event;
    const description = e.features[0].properties.description;
    const startDate = e.features[0].properties.startDate;
    const endDate = e.features[0].properties.endDate;
    const gMapsLink = e.features[0].properties.gMapsLink;
    const regLink = e.features[0].properties.regLink;


    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    let popup = new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(` <div class="popUp">
            <div class="popUp-title">${type}</div>
                <div class="waiting-time-big sans-bold">
                        ${event}
                        <div>
                        ${description}
                        </div>
                    <div class="next-spot sans-regular"> Inizio <span class="sans-bold"> ${startDate} </span></div>
                    <div class="next-spot sans-regular"> Fine <span class="sans-bold"> ${endDate} </span></div>
                    <div class="comparison-data">
                        
                    </div>
                </div>

                <div class="popUp-footer flex-display-center-sb">
                    <a href="${gMapsLink}" class="stream-button list-btn btn-text">Google maps</a>
                    <a href="${regLink}" class="btn-text sans-bold underlined cancello">Registrati</a>
                </div>
            </div>`
        )
        .setMaxWidth("80%")
        .addTo(map);

    map.flyTo({
        center: e.features[0].geometry.coordinates
    });

    // LINK HIDDEN IF VALUE NOT PRESENT
    if(!regLink){
        $(".cancello").hide();
    }
});

map.on('click', 'Serata', (e) => {
  const coordinates = e.features[0].geometry.coordinates.slice();
  const type = e.features[0].properties.type;
  const event = e.features[0].properties.event;
  const description = e.features[0].properties.description;
  const startDate = e.features[0].properties.startDate;
  const endDate = e.features[0].properties.endDate;
  const gMapsLink = e.features[0].properties.gMapsLink;
  const regLink = e.features[0].properties.regLink;


  // Ensure that if the map is zoomed out such that
  // multiple copies of the feature are visible, the
  // popup appears over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  let popup = new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(` <div class="popUp">
          <div class="popUp-title">${type}</div>
              <div class="waiting-time-big sans-bold">
                      ${event}
                      <div>
                      ${description}
                      </div>
                  <div class="next-spot sans-regular"> Inizio <span class="sans-bold"> ${startDate} </span></div>
                  <div class="next-spot sans-regular"> Fine <span class="sans-bold"> ${endDate} </span></div>
                  <div class="comparison-data">
                      
                  </div>
              </div>

              <div class="popUp-footer flex-display-center-sb">
                  <a href="${gMapsLink}" class="stream-button list-btn btn-text">Google maps</a>
                  <a href="${regLink}" class="btn-text sans-bold underlined cancello">Registrati</a>
              </div>
          </div>`
      )
      .setMaxWidth("80%")
      .addTo(map);

  map.flyTo({
      center: e.features[0].geometry.coordinates
  });

  // LINK HIDDEN IF VALUE NOT PRESENT
  if(!regLink){
      $(".cancello").hide();
  }
});

// var scrocco = document.getElementById("Scrocco");
// var design = document.getElementById("Design");
// var serata = document.getElementById("Serata");

var check = document.querySelectorAll('.control')

for (let i = 0; i < check.length; i++) {
  var selectedLayer = check[i];
  // console.log(selectedLayer);

  $(selectedLayer).on('click', function() {
    var currentID = this.id;
    console.log(currentID)

    if(!$(this).is(':checked')) {
        map.setLayoutProperty(currentID, 'visibility', 'none');
      }
      else{
        map.setLayoutProperty(currentID, 'visibility', 'visible');
      }
  })
}


// $(scrocco).on('click', function() {
//   if(!$(this).is(':checked')) {
//     map.setLayoutProperty('Scrocco', 'visibility', 'none');
//   }
//   else{
//     map.setLayoutProperty('Scrocco', 'visibility', 'visible');
//   }
  
//   // console.log($(this).val())
// })



// WEEK DAYS FILTERS
var monday = document.getElementById("monday");

// var statusCheck = monday.prop('checked');
$(monday).on('click', function() {
  
  console.log($(this).prop('checked'))

  if(!$(monday).is(':checked')) {
    map.setFilter('Design', ['!=', ['get', 'startDate'], '15/04/2024']);
    
    // map.setLayoutProperty('clusters', 'visibility', 'none');
    // map.setLayoutProperty('cluster-count', 'visibility', 'none');
    // map.setLayoutProperty('events', 'icon-allow-overlap', true);
  }
  else{
    map.setFilter('Design', null);
    // map.setFilter('Design', null)
    // map.setLayoutProperty('clusters', 'visibility', 'visible');
    // map.setLayoutProperty('cluster-count', 'visibility', 'visible');
  }
})