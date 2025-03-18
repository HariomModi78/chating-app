let ball = document.querySelector(".ball");
let signup = document.querySelector(".signup");
ball.addEventListener("click",function(){
    ball.classList.toggle("move")
    signup.classList.toggle("top")
})