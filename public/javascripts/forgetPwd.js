$(document).ready(function() {


  
    $("#forgotPwd").click(function(){
$(".username").attr("placeHolder","Enter Your Email (Registered)");
$(".username").attr("name","email");
$('#form').attr("action","/auth/forget")
    
        $(".box").toggleClass("forgot");

      if (!$("#change").hasClass("forgot")){
        $(".username").attr("placeHolder","Username");
        $(".username").attr("name","userName");
        $('#form').attr("action","/auth/login")

      }
  
    
        
    
    });
    
    
    });