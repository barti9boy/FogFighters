const toggleBtn = document.querySelector(".sidebar-toggle");
const closebtn = document.querySelector(".closebtn");
const sidebar = document.querySelector(".sidebar");

toggleBtn.addEventListener("click", function () {
  sidebar.classList.toggle("show-sidebar");
});

closebtn.addEventListener("click", function () {
  sidebar.classList.remove("show-sidebar");
});

$(window).scroll(function() {
  if ($(this).scrollTop() > 1){
  $('.header').addClass('sticky');
  }
  else{
  $('.header').removeClass('sticky');
  }
});