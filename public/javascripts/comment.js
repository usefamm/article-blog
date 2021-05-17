
//////////CreatingComment//////////
$('.comment-text').each(function(){

$(this).keyup(function (e) { 
   
    if ($(this).val().length >= 1 && $(this).val().length <=100 ) {
        $(this).parent().find(".comment-btn").attr('disabled',false)
      } else {
        $(this).parent().find(".comment-btn").attr('disabled',true)
      }
    
});
})
$('.comment-btn').each(function(){

$(this).click(function (e) { 
  let comment= $(this).parent().find('.comment-text').val()
  let user=$(this).parent().find('.user-id').text().trim()
  let article=$(this).parent().find('.article-id').text().trim()
    
    $.ajax({
        type: "POST",
        url: "/comment",
        data: {comment,user,article},
    
        success: function (response) {
           alert('Comment Added Sucessfully...')
           window.location.reload()
        },
        error: function (err) {
            alert(err.responseText)
         }
    });
    
});
})
 

//////////Deleting Comment//////////
$('.comment-delete').each(function(){
  $(this).click(function(){
   let id=$(this).attr('id').trim()

    $.ajax({
      type: "delete",
      url: `/admin/comment/${id}`,
     
      success: function (response) {
        alert('Comment Deleted Successfully Sir.')
        window.location.reload()
      },
      error: function (err) {
        alert(err.responseText)
        
      }
    });
  })


})