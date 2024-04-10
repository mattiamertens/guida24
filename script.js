//Session storage for tutorial Waiting time
$(document).ready(function () {
    if (!window.sessionStorage.getItem("isExecuted")) {
      window.sessionStorage.setItem("isExecuted", true);
    }
     else {
      $('.popUp-index').addClass('hidden')
    }
});
$('.close').on('click', function(){
    $('.popUp-index').addClass('hidden')
})


function scrollDetection() {
    $('.place').each(function() {

        var offset = this.getBoundingClientRect().top;
        // console.log(offset)
        
        if (offset < 300 && offset > 290){ 
          var dataSource = this.getAttribute('data-attr')
          $('.player').attr('src', dataSource)
        }
        if (offset < 300 && offset > 120){ 
          $(this).find('.destination-title').addClass('yellow-text')
          $(this).find('.square').addClass('on-screen');
        }
        
        else {
            $(this).find('.destination-title').removeClass('yellow-text')
            $(this).find('.square').removeClass('on-screen');
        }
    })
}


// SIDEBAR TOGGLING
var txtToggle = true;
$('.animated-btn').on('click', function(){

    if (txtToggle) {
        this.innerHTML = "Hide list" + "<img src='../assets/arrow.svg' class='arrow'></img>";
        $('.arrow').addClass('rotate')
        txtToggle = false;

    } else if (!txtToggle) {
        this.innerHTML = "Show list" + "<img src='../assets/arrow.svg' class='arrow'></img>";
        $('.arrow').removeClass('rotate')
        txtToggle = true;
    }
    $('.sb-left').toggleClass('unfolded')
})

var statsToggle = true;

$('.statistics-btn').on('click', function(){
    if (statsToggle){
        $('.sb-right').addClass('unfolded')
        $(this).text('Hide statistics')
        statsToggle = false;

    } else if (!statsToggle) {
        $('.sb-right').removeClass('unfolded')
        $(this).text('See statistics')
        statsToggle = true;
    }
})

// SINGLE CAMERA STREAM
$('.location-menu').on('click', function(){
    $('.location-dropdown').toggleClass('hidden')
    $(this).find('img').toggleClass('rotate')
})

$('.location').on('click', function(){
    // $('.location-dropdown').addClass('hidden')
    $(this).find('.check').toggleClass('vis')
})

// CAMERA STREAMS

$('.single-stream-card').on('mouseover', function(){
    $(this).find('.player-single-str').addClass('noBW');
    $(this).find('.location-name, .waiting-time-big').removeClass('hidden');

}).on('mouseleave', function(){
    $(this).find('.player-single-str').removeClass('noBW')
    $(this).find('.location-name, .waiting-time-big').addClass('hidden'); 
})
