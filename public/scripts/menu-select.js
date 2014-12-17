// (function(){
  $('.checkbox').on('click', function(){
    
    if($(this).find('.figure-container div').hasClass('clicked')){
      $(this).find('.figure-container div').removeClass('clicked').animate('slow'); 
    } else {
      $(this).find('.figure-container div').addClass('clicked').animate('slow'); 
    }
    
  });
// })();