
//updating editor inputs//
function CKupdate(){
    
    for ( instance in CKEDITOR.instances )
        CKEDITOR.instances[instance].updateElement();
}


//sending our article//
function ajaxSubmit(){
    
  
    const form = new FormData();
        let file = $("#imageUpload")[0].files;
        let title=$('#title')   
        let text=$('#text')
        if (file.length === 0) {
            alert('Select atleast 1 image to upload.');
            return false;
        }
        if (file.length > 0 && title.val().length > 1 && text.val().length >= 100 ) {

            form.append('image', file[0])
            form.append('title', $("#title").val())
            form.append('text', $("#text").val())

            $.ajax({
                
                type: "post",
                url: "/article",
                data: form,
                contentType: false,
                processData: false,
                success: function(response) {
                  
                   alert('Article created Successfully😊')
                 
                  window.location.href="http://localhost:3000/article"
                },
                error:function(err) {
                    alert(err.responseText)
                }
            });

        }
        else{
            alert("empty fields...")
        }
    
}
if ($("#sendPhoto")) {
    $("#sendPhoto").attr("disabled", true);
    $("#imageUpload").change(function (e) {
      e.preventDefault();
  
      if ($(this).val().length != 0) {
        $("#sendPhoto").attr("disabled", false);
      } else {
        $("#sendPhoto").attr("disabled", true);
      }
    });
  }
  

//editing our article image//
function ajaxSubmitPhoto(){
  
    const form = new FormData();
        let file = $("#imageUpload")[0].files;
        if (file.length === 0) {
            alert('Select atleast 1 image to upload.');
            return false;
        }
        if (file.length > 0) {

            form.append('image', file[0])
            form.append('name',$("#Name").val())
            form.append('imageAdr',$("#image_adr").val())

            $.ajax({
                
                type: "put",
                url: "/article/photo",
                data: form,
                contentType: false,
                processData: false,
                success: function(response) {
                  
                   alert('Article edited Successfully😊')
                 
                  window.location.href="http://localhost:3000/article"
                },
                error:function(err) {
                    alert(err.responseText)
                }
            });

        }
    
}


//editing our article text and title//
function ajaxSubmitText(){
   let data={}
    data.text=$("#text").val()
    data.title=$("#title").val()
    data.name=$("#Name").val()
    
  
   

            $.ajax({
                
                type: "put",
                url: "/article/text",
                data: data,
                success: function(response) {
                  
                   alert('Article edited Successfully😊')
                 
                  window.location.href="http://localhost:3000/article"
                },
                error:function(err) {
                    alert(err.responseText)
                }
            });

        }
    


/////////////////Deleting Article////////////////////



$(".Delete").click(function (e) { 
    e.preventDefault()
  
   const id=this.id

   const text=$(this).parent().find('.data').text()
   const image=$(this).parent().find('.img').text()
  const data={}
  data.text=text
  data.image=image
   
    $.ajax({
        type: "delete",
        url: `/article/${id}`,
        data:data,
        
        success: function (response) {
            alert('Article Deleted Successfully😊')
            
            window.location.href="http://localhost:3000/article"
        },

      error: function (err) {

        alert(err.responseText)
          
            
        }
    });
    
});

    


