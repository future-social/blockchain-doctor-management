function logout() {
    console.log("Logout button clicked");
    try {
      localStorage.removeItem('user');
      window.location.href = "/LoginPage.html";
    } catch (error) {
      alert("Logout unsuccessful" + error);
    }
  };

  function authentication(){
    console.log("TEST");
  if(!localStorage.getItem('user')){
    alert("Please login");
    window.location.href = "LoginPage.html";
  }
}
