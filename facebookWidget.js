// Global Variables
var RKMFacebookAPIURL = "https://api.facebook.com/restserver.php";
var RKMAPIKey = "dd0c4ce9c740b811ea5028c121568904";
var RKMSecret = "3549d7f9bfd9b42606845fcf7697f6af";
var RKMSession;
var RKMFacebookRestClient;
var	RKMAuthToken;
var RKMUID;
var RKMFriends;
var lastRequest;
var facebookEmail, facebookPassword;

alert("");
function load()
{
	RKMFacebookRestClient= new FacebookRestClient(RKMFacebookAPIURL, "", RKMAPIKey, RKMSecret);
	lastRequest = RKMFacebookRestClient.callMethod("facebook.auth.createToken", new Array(), processToken); 

	var name= document.getElementById("name");
	name.innerHTML= "Logging in...";
}

function processToken()
{
	var box= document.getElementById("box");
	if(lastRequest==null) return;
	if(lastRequest.readyState==4)
	{
		box.value=lastRequest.responseText;
		var tokenTag = lastRequest.responseXML.getElementsByTagName("token")[0];
		RKMAuthToken = tokenTag.textContent;
		box.value+=RKMAuthToken;
		lastRequest= null;

		lastRequest = _XMLHttpRequest();
		lastRequest.onreadystatechange = processLoggedIn;
		lastRequest.open("POST", "https://api.facebook.com/login.php", true);
		lastRequest.setRequestHeader("Cookie", "test_cookie=1");
		lastRequest.send("api_key="+RKMAPIKey+"&auth_token="+RKMAuthToken+"&email="+facebookEmail+"&pass="+facebookPassword+"&login=Login");

		window.open("https://api.facebook.com/login.php?api_key="+RKMAPIKey+"&auth_token="+RKMAuthToken);
	}
	
}

function processLoggedIn()
{
	alert("Logged In.");
}

function didLogIn()
{
		lastRequest= RKMFacebookRestClient.callMethod("facebook.auth.getSession", new Array("auth_token="+RKMAuthToken), processSession);
}

function processSession()
{
	var box= document.getElementById("box");
	if(lastRequest==null) return;
	if(lastRequest.readyState==4)
	{
		box.value=lastRequest.responseText;
		
		var sessionTag = lastRequest.responseXML.getElementsByTagName("session_key")[0];
		RKMSession = sessionTag.textContent;
		RKMFacebookRestClient.setSession(RKMSession);
		
		var uidTag = lastRequest.responseXML.getElementsByTagName("uid")[0];
		RKMUID = uidTag.textContent;
		
		var secretTag = lastRequest.responseXML.getElementsByTagName("secret")[0];
		RKMSecret = secretTag.textContent;
		RKMFacebookRestClient.setSecret(RKMSecret);

		lastRequest= null;
	}
}

function remove()
{
	// your widget has just been removed from the layer
	// remove any preferences as needed
	// widget.setPreferenceForKey(null, "your-key");
}

function hide()
{
	// your widget has just been hidden stop any timers to
	// prevent cpu usage
}

function show()
{
	// your widget has just been shown.  restart any timers
	// and adjust your interface as needed
}

function showBack(event)
{
	// your widget needs to show the back

	var front = document.getElementById("front");
	var back = document.getElementById("back");

	if (window.widget)
		widget.prepareForTransition("ToBack");

	front.style.display="none";
	back.style.display="block";
	
	if (window.widget)
		setTimeout('widget.performTransition();', 0);
}

function showFront(event)
{
	// your widget needs to show the front
	facebookEmail= document.getElementById("facebookEmail").value;
	facebookPassword= document.getElementById("facebookPassword").value;
	lastRequest = RKMFacebookRestClient.callMethod("facebook.auth.createToken", new Array(), processToken); 

	var front = document.getElementById("front");
	var back = document.getElementById("back");

	if (window.widget)
		widget.prepareForTransition("ToFront");

	front.style.display="block";
	back.style.display="none";
	
	if (window.widget)
		setTimeout('widget.performTransition();', 0);
}

/*
 getLocalizedString() pulls a string out an array named localizedStrings.  Each language project directory in this widget contains a file named "localizedStrings.js", which, in turn, contains an array called localizedStrings.  This method queries the array of the file of whichever language has highest precedence, according to the International pane of System Preferences.
*/
function getLocalizedString(string)
{
	try { string = localizedStrings[string] || string; } catch (e) {}
	return string;
}

if (window.widget)
{
	widget.onremove = remove;
	widget.onhide = hide;
	widget.onshow = show;
}


function launchUrl(event) 
{
	RKMAuthToken = document.getElementById("textfield").value;
	widget.openURL("https://api.facebook.com/login.php?api_key="+RKMAPIKey+"&auth_token="+RKMAuthToken);

}

function getFriends(event) 
{
	lastRequest = RKMFacebookRestClient.callMethod("facebook.friends.get", new Array(), processFriends); 
}

function processFriends()
{
	var box= document.getElementById("box");
	if(lastRequest==null) return;
	if(lastRequest.readyState==4)
	{
		box.value=lastRequest.responseText;
		RKMFriends= new Array();
		var friendNodes = lastRequest.responseXML.getElementsByTagName("result_elt");
		for(var i=0; i< friendNodes.length; i++) 
		{
			var element= friendNodes.item(i);
			RKMFriends.push(element.textContent);
		}
		lastRequest= null;
	}
}

function getFriendInfo(event) 
{
	var friendsString= "users=";
	for(var i=0; i< RKMFriends.length; i++)
	{
		friendsString+=RKMFriends[i];
		if(i!=RKMFriends.length-1) friendsString+=",";
	}
	
	lastRequest = RKMFacebookRestClient.callMethod("facebook.users.getInfo", new Array(friendsString, "fields=first_name,last_name,school_info"), processFriendInfo); 
}

function processFriendInfo()
{
	var box= document.getElementById("box");
	if(lastRequest==null) return;
	if(lastRequest.readyState==4)
	{
		box.value=lastRequest.responseText;

		lastRequest= null;
	}
}