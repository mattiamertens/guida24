d3.json('assets/features.geojson')
.then(function(data){

    // ASSING ID TO EACH FEATURE
    let events = data.features;
    events.forEach((event, i) => {
        event.properties.id = i + 1;

        if(event.properties.type == "Freebies"){
            event.properties.color = 'var(--event_orange)';
        }
        else if(event.properties.type == "Design"){
            event.properties.color = 'var(--event_blue)';
        }
        else if(event.properties.type == "Club/gigs"){
            event.properties.color = 'var(--event_green)';
        }
    });
    $('.nr-all-events').text(events.length + ' events');
    
    let linkClass = d => d.properties.regLink ? "" : "no-vis";


    var dateFinder = document.querySelectorAll('.date-divider');
    // let selectedDates = Array.from(dateFinder).map(date => date.getAttribute('value'));

    dateFinder.forEach(date => {
        // console.log(selectedDates);
        // console.log(dateFinder);

        let eventContainer = date.closest('.date-card-container');

        // let dateCard = d3.select(eventContainer)
        // .selectAll('div')
        // .data(events)
        // .enter()
        // .filter(d => selectedDates.includes(d.properties.startDate))
        // .append('div')
        // .html(d => 
        //     `<div class="popUp flex column g-m white-bg" data-id="${d.properties.id}">
        //         <div class="popUp-header flex-display-center-sb">
        //             <div class="event-type" style="background-color: ${d.properties.color}">${d.properties.type}</div>
        //             <div class="popUp-icons flex-display-center-center g-xs">
        //                 <div class="icon icon-m" alt="favorites" id="bookmark" style="mask-image: var(--icon-favorites);"></div>
        //                 <button class="remove-popup"><div class="icon icon-m" alt="day-type" style="mask-image: var(--icon-close);"></div></button>
        //             </div>
        //         </div>
                
        //         <div class="event-title bold"> ${d.properties.event} </div>
    
        //         <div class="popUp-time flex column g-xs">
        //             <div class="day-type flex v-center g-xs muted-text"> 
        //                 <div class="mask-image icon icon-s muted-icon" alt="day-type" style="mask-image: var(--icon-dayType);"></div> 
        //                 This is a one-day event
        //             </div>
    
        //             <div class="event-dates flex v-center g-s">
        //                 <div class="flex v-center g-xs"><div class="mask-image icon-s muted-icon" alt="day-type" style="mask-image: var(--icon-date);"></div><span class="bold"> ${d.properties.startDate} </span></div> 
        //                 <div class="divider"></div>
        //                 <div class="flex v-center g-xs"><div class="mask-image icon-s muted-icon" alt="day-type" style="mask-image: var(--icon-time);"></div> <span>${d.properties.endDate}</span></div>
        //             </div>
        //         </div>
    
        //         <div class="popUp-footer flex-display-center-sb">
        //             <button class="primary-btn"><a href="${d.properties.gMapsLink}" class="btn-text">Google maps</a></button>
                    
        //             <button class="secondary-btn no-link ${linkClass(d)}">
        //                 <a href="${d.properties.regLink}" class="btn-text flex v-center underlined">
        //                     RSVP
        //                     <div class="mask-image icon-s icon" alt="day-type" style="mask-image: var(--icon-extLink);"></div>
        //                 </a>
        //             </button>
        //         </div>
        //     </div>`
        // )

    });

    for (let i = 0; i < dateFinder.length; i++) {
        console.log(dateFinder[i]);
        let currentDate = dateFinder[i].getAttribute('value');

        let eventContainer = dateFinder[i].closest('.date-card-container');

        let dateCard = d3.select(eventContainer)
        .selectAll('div')
        .data(events)
        .enter()
        .filter(d => d.properties.startDate === currentDate)
        .append('div')
        .html(d => 
            `<div class="popUp flex column g-m white-bg" data-id="${d.properties.id}">
            <div class="popUp-header flex-display-center-sb">
                <div class="event-type" style="background-color: ${d.properties.color}">${d.properties.type}</div>
                <div class="popUp-icons flex-display-center-center g-xs">
                <div class="icon icon-m" alt="favorites" id="bookmark" style="mask-image: var(--icon-favorites);"></div>
                <button class="remove-popup"><div class="icon icon-m" alt="day-type" style="mask-image: var(--icon-close);"></div></button>
                </div>
            </div>
            
            <div class="event-title bold"> ${d.properties.event} </div>
        
            <div class="popUp-time flex column g-xs">
                <div class="day-type flex v-center g-xs muted-text"> 
                <div class="mask-image icon icon-s muted-icon" alt="day-type" style="mask-image: var(--icon-dayType);"></div> 
                This is a one-day event
                </div>
        
                <div class="event-dates flex v-center g-s">
                <div class="flex v-center g-xs"><div class="mask-image icon-s muted-icon" alt="day-type" style="mask-image: var(--icon-date);"></div><span class="bold"> ${d.properties.startDate} </span></div> 
                <div class="divider"></div>
                <div class="flex v-center g-xs"><div class="mask-image icon-s muted-icon" alt="day-type" style="mask-image: var(--icon-time);"></div> <span>${d.properties.endDate}</span></div>
                </div>
            </div>
        
            <div class="popUp-footer flex-display-center-sb">
                <button class="primary-btn"><a href="${d.properties.gMapsLink}" class="btn-text">Google maps</a></button>
                
                <button class="secondary-btn no-link ${linkClass(d)}">
                <a href="${d.properties.regLink}" class="btn-text flex v-center underlined">
                    RSVP
                    <div class="mask-image icon-s icon" alt="day-type" style="mask-image: var(--icon-extLink);"></div>
                </a>
                </button>
            </div>
            </div>`
        )
        
    }




});




let savedEventsArray = JSON.parse(localStorage.getItem('savedEvents')) || [];

function saveEvents(event, element){
    // console.log(savedEventsArray);

    // CEHCK IF SAVED IN CASE: DON'T SAVE IF ALREADY PRESENT ---- first e.id is the one in the array, second is the one we are trying to save
    if(!savedEventsArray.some(e => e.id === event.id)){
        $(element).css('mask-image', 'var(--icon-favorites-filled)');

        // PUSH TO ARRAY
        savedEventsArray.unshift(event);
        localStorage.setItem('savedEvents', JSON.stringify(savedEventsArray));

        document.querySelector('.nr-fav-events').innerHTML = savedEventsArray.length + ' events';
        renderSavedEvents(event);

        // MAKE LITTLE ANIMATION FEEDBACK FOR SAVED EVENT

    }
    else{
        $(element).css('mask-image', 'var(--icon-favorites)');

        // REMOVE FROM ARRAY
        savedEventsArray = savedEventsArray.filter(e => e.id !== event.id);
        localStorage.setItem('savedEvents', JSON.stringify(savedEventsArray));

        removeSavedEvent(event);
    }
};

function renderSavedEvents(event){
    // console.log(savedEventsArray);

    let favContainer = $('.favorites-events-content');
    $('.placebo').hide();
    $(favContainer).addClass('flex-display-start-center h-100');

    let linkClass = event.regLink ? "" : "no-vis";

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
                
                <button class="secondary-btn ${linkClass}">
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