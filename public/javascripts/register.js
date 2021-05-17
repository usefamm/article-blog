var input = document.querySelector("#phone");
let submit = document.getElementById("submit");
//using int tel input
var iti = window.intlTelInput(input, {
  autoPlaceholder: "polite",
  preferredCountries: ["ir"],
  separateDialCode: false,
  customPlaceholder: function (
    selectedCountryPlaceholder,
    selectedCountryData
  ) {
    return "e.g. " + selectedCountryPlaceholder;
  },
  utilsScript: "js/utils.js",
});

window.iti = iti;
//when inputs change it give us the number with country code
input.onchange = function () {
  let countryCode = iti.s.dialCode;

  let final = "+" + countryCode + input.value;

  input.value = final;
};
