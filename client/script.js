function login() {
 window.location.href = "./Login-Signup/login.html"
}

function signup() {
    window.location.href = "./Login-Signup/signup.html"
   }

function StartCampaign() {
    window.location.href = "dashboard.html"
}   

function logout(){
    localStorage.removeItem("token");
    window.location.href = "index.html";
}