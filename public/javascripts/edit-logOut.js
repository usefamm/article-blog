let logOut = document.getElementById("logOut");
let submit = document.getElementById("submit");
let passWordUpdate = document.getElementById("updatePassWord");
let deleteImage = $("#deleteImage");
let image = document.getElementById("imagePreview");
let editPhoto = $("#editPhoto");
let imageUpload = $("#imageUpload");
let imageId = $("#imagePreview").attr("class");
let imagePreview = $("#imagePreview");
let Delete=$('.delete')

//for LogOut
if (logOut) {
  logOut.onclick = function () {
    $.ajax({
      type: "post",
      url: `/user/dashboard`,
      success: function () {
        window.location.href = "http://localhost:3000";
      },
    });
  };
}

//for update except password
if (submit) {
  submit.onclick = function () {
    let data = {};

    data.userName = document.getElementById("userName").value;
    data.phone = document.getElementById("phone").value;
    data.email = document.getElementById("email").value;
    data._id = document.getElementById("_id").value;
    $.ajax({
      type: "PUT",
      url: "/user/update",
      data: data,
      dataType: "text",
      success: function (response) {
        window.location.href = `http://localhost:3000/user/dashboard`;
        alert("Your Profile Updated Successfully😋");
      },
      error: function (err) {
        window.location.href = `http://localhost:3000/user/update?msg=${err.responseText}`;
      },
    });
  };
}
//for updating password
if (passWordUpdate) {
  passWordUpdate.onclick = function () {
    let data = {};
    data.oldPassWord = document.getElementById("oldPassWord").value;
    data.passWord = document.getElementById("newPassWord").value;
    data._id = document.getElementById("_id").value;

    $.ajax({
      type: "PUT",
      url: "/user/update/passWord",
      data: data,
      dataType: "text",
      success: function (response) {
        window.location.href = `http://localhost:3000/auth/loginPage`;
        alert("Your Password Has Been Updated Successfully😊");
      },
      error: function (err) {
        window.location.href = `http://localhost:3000/user/update?msg=${err.responseText}`;
      },
    });
  };
}
//for deleting profile image
if (deleteImage) {
  //disabling Delete if he hadn't chosen any photo
  if (imagePreview.attr("src") === "../images/avatar.png") {
    deleteImage.attr("disabled", true);
  } else {
    deleteImage.attr("disabled", false);
  }

  deleteImage.click(function (e) {
    e.preventDefault();
    $.ajax({
      type: "delete",
      url: `/user/photo/${imageId}`,
      success: function (response) {
        window.location.href = `http://localhost:3000/user/dashboard`;
        alert("Your Photo Has Been Deleted Successfully😋");
      },
      error: function (err) {
        window.location.href = `http://localhost:3000/user/update?msg=${err.responseText}`;
      },
    });
  });
}

//disabling save new photo if he hadn't chosen any photo
if (editPhoto) {
  editPhoto.attr("disabled", true);
  imageUpload.change(function (e) {
    e.preventDefault();

    if ($(this).val().length != 0) {
      editPhoto.attr("disabled", false);
    } else {
      editPhoto.attr("disabled", true);
    }
  });
}

/////deleting article///////
Delete.click(function (e) { 
  e.preventDefault()

 const id=this.id

 const text=$(this).parent().find('.data').text()
 const image=$(this).parent().find('.img').text()
const data={}
data.text=text
data.image=image


   $.ajax({
       type: "delete",
       url: `/admin/article/${id}`,
       data:data,
       
       success: function (response) {
           alert('Article Deleted Successfully😊')
           
           window.location.href="http://localhost:3000/user/dashboard"
       },

     error: function (err) {

       alert(err.responseText)
         
           
       }
   });
   
})