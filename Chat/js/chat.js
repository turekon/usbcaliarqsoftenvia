var myFirebase = new Firebase('https://incandescent-torch-3997.firebaseio.com/');
var usernameInput = document.querySelector('#username');
var textInput = document.querySelector('#text');
var postButton = document.querySelector('#post');

postButton.addEventListener("click", function() { 
	var username = usernameInput.value;  
	var text = textInput.value;

	username = username.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
	text = text.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");

	myFirebase.push({username:username, text:text});textInput.value = "";

	myFirebase.set(username + " says: " + text);  
	textInput.value = "";
});

myFirebase.on('child_added', function(snapshot) {    
	var msg = snapshot.val();    
	var html ='<div class="msg"><div class="name">'+'<b>'+ msg.username +'</b>'+'<p>'+ msg.text +'</p>'+'</div>'; 
	document.querySelector("#results").innerHTML += html;  
});