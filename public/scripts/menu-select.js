(function(){
  $('.checkbox').on('click', function(){
    
    if($(this).find('.figure-container div').hasClass('clicked')){
      $(this).find('.figure-container div').addClass('face').removeClass('entypo-check clicked').animate('slow'); 
    } else {
      $(this).find('.figure-container div').removeClass('face').addClass('entypo-check clicked').animate('slow'); 
    }
    
  });
})();