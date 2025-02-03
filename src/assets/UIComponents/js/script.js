// function removeClass(){
//   let element = document.getElementById('offcanvasScrolling');
// if (element.classList.contains('show')) {
//     element.classList.remove('show');
// }
// }

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.getElementById("logo").style.width = "80%";
  } else {
    document.getElementById("logo").style.width = "100%";
  }
}