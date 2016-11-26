function login() {
    var username = $("#username").val();
    var password = $("#password").val();

    clearIt("#usernameIO");
    clearIt("#passwordIO");

    if(username.length==0){
        bindIt("#usernameIO", "Please enter the username")
        return false;
    }

    if(password.length==0){
        bindIt("#passwordIO","Please enter the password");
        return false;
    }

    var uri = '/login?';
            $.ajax({
                type: "POST",
                data: '[username]='+username+'&[password]='+password,
                url: uri,
                success: function() {
                      window.location = '/CivMoneyHome'
                },
                error: function(){
                  bindIt("#passwordMatch", "Username password combination does not match!");
                }
            });
}

function addUser() {
    var username = $("#username").val();
    var password = $("#password").val();
    var passwordConfirmation = $("#passwordConfirmation").val();

    clearIt("#usernameIO");
    clearIt("#passwordIO");
    clearIt("#passwordConfirmationIO");
    clearIt("#passwordMatch");

    if(username.length==0){
        bindIt("#usernameIO", "Please enter the username")
        return false;
    }

    if(password.length==0){
        bindIt("#passwordIO","Please enter the password");
        return false;
    }

    if(password.length < 6){
        bindIt("#passwordIO","Password must be greater than 6 charecters");
        return false;
    }

    if(passwordConfirmation.length==0){
        bindIt("#passwordConfirmationIO","Please enter the password");
        return false;
    }

    if(password != passwordConfirmation){
        bindIt("#passwordMatch","Passwords do not match");
        return false;
    }

    var uri = '/user?';

    if (password === passwordConfirmation) {
        $.ajax({
            type: "POST",
            data: '[username]='+username+'&[password]='+password,
            url: uri,
            success: function() {
                window.location = '/CivMoneyHome';
            },
            error: function(){
              bindIt("#passwordMatch","Failed To Add New User");
            }
        });
    } else {
        bindIt("#passwordMatch","Failed To Add New User");
    }
}

function logout(){
  $.ajax({
      type: "POST",
      url: '/logout',
      success: function() {
         location.reload();
      }
  });
}

function getUsername(){
  $.ajax({
      type: "GET",
      url: '/user/username',
      dataType: "json",
      data: {},
      success: function(data) {
         bindIt("#userName", data);
      }
  });
}
