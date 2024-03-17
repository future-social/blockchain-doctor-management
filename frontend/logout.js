/*
function logout() {
console.log("Logout button clicked");
fetch("/logout", {
method: "POST"
})
.then(response => {
if (response.redirected) {
    // Redirect to login page after logout
    window.location.href = "/LoginPage.html";
} else {
    console.error("Logout failed:", response.statusText);
}
})
.catch(error => {
console.error("Logout failed:", error);
});
} */
function logout() {
    console.log("Logout button clicked");
    try {
      localStorage.removeItem('user');
      window.location.href = "/LoginPage.html";
    } catch (error) {
      alert("Logout unsuccessful" + error);
    }
  };

  if(!localStorage.getItem('user')){
    alert("Please login");
    window.location.href = "LoginPage.html";
}