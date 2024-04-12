map.on('load', () => {
    map.loadImage('assets/mapbox-icon.png', 
    (error, image) => {
        if (error) throw error;
        map.addImage('pin', image);

        map.addSource('events', {
            type: 'geojson',
            // Use a URL for the value for the `data` property.
            data: 'assets/features.geojson',
            cluster: true,
            clusterRadius: 50,
            clusterMaxZoom: 11,
        });

        // MARKERS
        map.addLayer({
            'id': 'events',
            'type': 'symbol',
            'source': 'events',
            'layout': {
                'icon-image': 'pin',
                'icon-size': 0.2,
                'icon-allow-overlap': true,
            }
        });

        // CLUSTERS
        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'events',
            filter: ['has', 'point_count'],
            paint: {
                // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#fdffb8',
                    5,
                    '#F9FD60',
                    15,
                    '#ffbf47'
                    
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    5,
                    30,
                    25,
                    40
                ]
            }
        });

        // CLUSTERS COUNT
        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'events',
            // filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-size': 12
            },
            paint: {
                "text-color": "#000000"
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


map.on('click', 'events', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const type = e.features[0].properties.type;
    const event = e.features[0].properties.event;
    const description = e.features[0].properties.description;
    const startDate = e.features[0].properties.startDate;
    const endDate = e.features[0].properties.endDate;
    const gMapsLink = e.features[0].properties.gMapsLink;
    const regLink = e.features[0].properties.regLink;

    // map.getSource('events')._data.features.forEach(function(feature) {
    //     console.log('aaa')
    // });

    // for (e of geojson.features) {
   
    //     el.addEventListener('click', (e) => {
    //         console.log('aa')
    //     });
    // }
    
    // const tsunami =
    //     e.features[0].properties.tsunami === 1 ? 'yes' : 'no';

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
    console.log("link is:" + regLink)
    if(!regLink){
        console.log("no link present")
        $(".cancello").hide();
    }
    else{
        console.log('link exists')
    }
});

var scrocco = document.getElementById("scrocco");
var design = document.getElementById("design");
var serata = document.getElementById("serata");



$('#scrocco').on('click', function() {
  if($(scrocco).is(':checked')) {
    map.setFilter('events', ['==', ['get', 'type'], 'Scrocco']);
  }
  else{
    map.setFilter('events', null)
  }
})

$('#design').on('click', function() {
  if($(design).is(':checked')) {
    map.setFilter('events', ['==', ['get', 'type'], 'Design']);
  }
  else{
    map.setFilter('events', null)
  }
})

$('#serata').on('click', function() {
  if($(serata).is(':checked')) {
    map.setFilter('events', ['==', ['get', 'type'], 'Serata']);
  }
  else{
    map.setFilter('events', null)
  }
})

// WEEK DAYS FILTERS
var monday = document.getElementById("monday");

$(monday).on('click', function() {
  if($(monday).is(':checked')) {
    map.setFilter('events', ['==', ['get', 'startDate'], '15/04/2024']);
    map.setLayoutProperty('clusters', 'visibility', 'none');
    map.setLayoutProperty('cluster-count', 'visibility', 'none');
    map.setLayoutProperty('events', 'icon-allow-overlap', true);
  }
  else{
    map.setFilter('events', null)
    map.setLayoutProperty('clusters', 'visibility', 'visible');
    map.setLayoutProperty('cluster-count', 'visibility', 'visible');
  }
})