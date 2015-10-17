(function () {

	var app = angular.module('myApp', []);

    app.config(['$routeProvider',
				  function($routeProvider) {
				    $routeProvider.
				      when('/login', {
				        templateUrl: 'views/login.html',
				        controller: 'LoginController'
				      }).
				      when('/chat', {
				        templateUrl: 'views/chat.html',
				        controller: 'ChatController'
				      }).
				      when('/registro', {
				        templateUrl: 'views/singin.html',
				        controller: 'SingInController'
				      }).
				      otherwise({
				        redirectTo: '/login'
				      });
				}]);

	app.controller('SingInController',function($scope,$location) {

	        $scope.email = '';
	        $scope.password = '';

	        $scope.registro = function(){

	        	var ref = new Firebase('https://incandescent-torch-3997.firebaseio.com/');

	        	ref.createUser({
				  email    : $scope.email,
				  password : $scope.password
				}, function(error, userData) {
				  if (error) {
				    alert("Error creating user:", error);
				  } else {
				    console.log("Successfully created user account with uid:", userData.uid);
				    alert("registro exitoso!");
				    window.location.href = window.location.pathname+"#/";
				  }
				});

	        }

	        $scope.volver = function(){
	        	$location.path("/");
	        }
	        
    });

    app.controller('LoginController',function($scope,$location) {

	        $scope.email = '';
	        $scope.password = '';
	        $scope.login = function(){
	        	
	        	console.log("login");
	        	
	        	var ref = new Firebase('https://incandescent-torch-3997.firebaseio.com/');

	        	ref.authWithPassword({
				  email    : $scope.email,
				  password : $scope.password
				}, function(error, authData) {
				  if (error) {
				    console.log("Login Failed!", error);
				  } else {
				    console.log("Authenticated successfully with payload:", authData);
				    document.cookie = "email" + "=" + $scope.email + ";";
				    window.location.href = window.location.pathname+"#/chat";
				  }
				});
	        }

	        $scope.registrarse = function(){
	        	$location.path("/registro");
	        }

    });

	app.controller('ChatController',function($scope,$location) {
	 	
	 	if( getCookie("email") != ""){
	 		$scope.email = getCookie("email");
	 	}else{
	 		$location.path("/");
	 	}

	 	var ref = new Firebase('https://incandescent-torch-3997.firebaseio.com/');

		var textInput = document.querySelector('#text');
		var postButton = document.querySelector('#post');

		postButton.addEventListener("click", function() { 
			var email = getCookie("email"); 
			var text = textInput.value;

			email = email.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
			text = text.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");

			ref.push({email:email, text:text});textInput.value = "";

			//ref.set(username + " says: " + text);  
			textInput.value = "";
		});

		ref.on('child_added', function(snapshot) {    
			var msg = snapshot.val();    
			var html ='<div class="msg"><div class="name">'+'<b>'+ msg.email +'</b>'+'<p>'+ msg.text +'</p>'+'</div>'; 
			document.querySelector("#results").innerHTML += html;  
		});

		$scope.logout = function(){
			deleteAllCookies();
			$location.path("/");
		}
	 
	});

})();
