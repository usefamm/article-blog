let modal = document.getElementById("modal");
let save = document.getElementById("save");
let id = document.getElementById("id");
let passWord = document.getElementById("passWord");
let err = document.getElementById("error");


modal.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  let button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  let recipient = button.getAttribute("data-bs-whatever");

 
  // Update the modal's content.

  let modalBodyInput = modal.querySelector("#id");

  modalBodyInput.value = recipient;
});


//validating new password//
passWord.onkeyup = function () {
  if (passWord.value.length >= 8) {
    save.disabled = false;
  } else {
    save.disabled = true;
  }
};

save.onclick = function () {
  let regexValidate = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

  let validationResult = regexValidate.test(passWord.value);
  if (validationResult === false) {
    err.style.display = "block";
    err.innerText =
      "Password Must Be At Least 8 Characters Including At Least An Uppercase and A lowercase And A Number";
  } else {
    let data = {};
    data.id = id.value;
    data.passWord = passWord.value;

    $.ajax({
      type: "put",
      url: "/admin",
      data: data,
      success: function (response) {
        alert("Password Has Changed Successfully.");
        $("#modal").modal("hide");
        location.reload();
      },
      error: function (err) {
        alert("Server Error");
      },
    });
  }
};

$(".Delete").click(function (e) { 
  e.preventDefault();
 let id= $(this).parent()[0].className.split(' ')[1];

 $.ajax({
   type: "delete",
   url: `/admin/blogger/${id}`,
   success: function (response) {
   alert('Blogger Deleted Successfully✔')
   window.location.reload()
     
   }
 });
  
});


