//app variables
var appId = 'app_id';
var channelFile = 'absolute_path_to_channel_file.html';
var scope = 'email,publish_stream';
var noScope = 2; //number of permissions
var pages = ['page_id','page_id'];
var debug = true;
var redirectUrl = 'absolute_path_to_page';


//variables used on runtime
var token = '';
var likes = 0;
var likeChecks = 0;
var userId = '';
var likeListener = false;
var scenario = 'auth';
var authIsBound = false;
var reload = false;

$(document).ready(function(){
	initializeApp();
	
	$(document).bind('init',function(e){
		if(debug)console.log('The App has been initialised and can be used now.');
		isUserKnown();
	});
	
	$(document).bind('userKnown',function(e,isKnown){
		if(debug)console.log('We know now if the user is known: '+isKnown);
		if(!isKnown){
			//show welcome screen
			$('#loading').fadeOut(function(){
				$('#welcome').fadeIn();
				//bind enter now click event
				bindAuth();
			});
		} else if(isKnown){
			if(debug)console.log('The user is know, but we need to check the users permissions');
			scenario = 'known';
			checkUserPermissions();
		}
	});
	
	$(document).bind('authenticatedUser',function(e,response){
		if(debug)console.log('The user has acted on the authenticate dialog or has been checked automatically. Result: '+response.authenticated);
		if(debug)console.log(response.known);
		if(reload){
			window.top.location = redirectUrl;
		}
		if(!response.authenticated){
			//show non Auth screen
			$('#loading, #welcome').fadeOut().promise().done(function(){
				if(scenario == 'known'){
					bindAuth();
				}
				$('#noAuth').fadeIn();
			});
		} else if(response.authenticated){
			if(scenario == 'known'){
				$('#noAuth, #welcome').fadeOut().promise().done(function(){
					$('#loadingText').html('preparing the app, please wait ...');
					$('#loading').fadeIn();
					checkRecord();
				});
			}else{
				$('#noAuth, #welcome').fadeOut().promise().done(function(){
					$('#loadingText').html('preparing the app, please wait ...');
					$('#loading').fadeIn();
					checkUserLikes();
				});
			}
		}
	});
	
	$(document).bind('likes',function(e){
		if(debug)console.log('We now know what pages the user already likes. ');
		if(debug)console.log(likeChecks + " "+ likes + " "+pages.length);
		if(debug)console.log(likeChecks >= pages.length && likes >= pages.length);
		if(likeChecks >= pages.length && likes >= pages.length){
			loadFriends();
		} else if(likeChecks >= pages.length && likes < pages.length) {
			$('#loading').fadeOut(function(){
				$('#step1').fadeIn();
				registerLikeListener();
			});
		}
		
	});
		
	$(document).bind('hasRecord',function(e,hasRecord){
		if(debug)console.log('We know if the user has a record in the database. Result: '+hasRecord);
		if(!hasRecord){
			checkUserLikes();
		} else if(hasRecord){
			//we jump directly to step 2 where the user can invite some more friends. We will load the friends the user has already invited though, so he doesnt invite them twice.
			loadInvitedFriends();
		}
	});
	
	$(document).bind('invitedfriendsLoaded',function(e){
		if(debug)console.log('We have loaded the users already invited friends now!');
		loadFriends();
	});

	
	$(document).bind('friendsLoaded',function(e){
		if(debug)console.log('We have loaded the users friends now!');
		$('#loading, #step1').fadeOut().promise().done(function(){
				$('#step2').fadeIn();
			});
	});


});

/* We need to initialize the app and load the facebook SDK before we can do anything.  */
function initializeApp(){
	//load the SDK
	(function(d){
	     var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
	     js = d.createElement('script'); js.id = id; js.async = true;
	     js.src = "//connect.facebook.net/en_US/all.js";
	     d.getElementsByTagName('head')[0].appendChild(js);
	   }(document));
	
	
	//initialize the APP
	window.fbAsyncInit = function() {
	    FB.init({
	      appId      : appId, // App ID
	      channelURL : channelFile, // Channel File
	      status     : true, // check login status
	      cookie     : true, // enable cookies to allow the server to access the session
	      oauth      : true, // enable OAuth 2.0
	      xfbml      : true  // parse XFBML
		});
		
		$(document).trigger('init');
	}	
}

/* Check if the user is know to the app, if he is we will redirect the user to the correct page according to the actions he has taken already. If not we will present the welcom screen.  */
function isUserKnown(){
	FB.getLoginStatus(function(response) {
		  if(debug)console.log(response);
		  if(response.status == 'not_authorized'){
		  		$(document).trigger('userKnown',false);
		  }else if(response.status == 'connected'){
		  		userId = response.authResponse.userID;
		  		token = response.authResponse.accessToken;
		  		$(document).trigger('userKnown',true);
		  }else if(response.status == 'unknown'){
		  		reload = true;
		  		$(document).trigger('userKnown',false);
		  }
	});
}

/* Function to bind a click event on the button that triggers the user's authentication  */
function bindAuth(){
	if(!authIsBound){
		authIsBound = true;
		$('button#enterNow').click(function(){
			if(debug)console.log('Start Authentication');
			authenticateUser();
		});
	}
}

/* We are promting the user to authenticate the app. This is needed to access the users details and allow the app to post to the user's friends walls  */
function authenticateUser(){
	FB.login(function(response) {
		   if(debug)console.log(response);
		   if(response.status == 'unknown'){
		   		$(document).trigger('authenticatedUser',{authenticated:false});
		   }else if(response.status == 'connected'){
		   		token = response.authResponse.accessToken;
		   		
		   		//now we need to check if the user has allowed us all the necessary permissions
		   		checkUserPermissions();
		   }		   
	},{scope:scope});
}

/* We are checking if the user has the permissions we require to use our app  */
function checkUserPermissions(){
	FB.api('/me/permissions/?access_token='+token, function(response) {
		    if(debug)console.log(response);
		    var perm = 0;
		    $.each(response.data[0],function(index,value){
		    	if(debug)console.log(index);
		    	if(scope.indexOf(index) >= 0)perm++;
		    });
		    if(perm >= noScope && scenario == 'auth'){
		    	if(debug)console.log('Auth: true');
		    	$(document).trigger('authenticatedUser',{authenticated:true});
		    } else if(perm < noScope && scenario == 'auth'){
		    	if(debug)console.log('Auth: false');
		    	$(document).trigger('authenticatedUser',{authenticated:false});
		    }
		    if(perm >= noScope && scenario == 'known'){
		    	if(debug)console.log('Known: true');
		    	$(document).trigger('authenticatedUser',{authenticated:true,known:true});
		    } else if(perm < noScope && scenario == 'known'){
		    	if(debug)console.log('Known: false');
		    	$(document).trigger('authenticatedUser',{authenticated:false,known:true});
		    }
	  });
}

/* Check which pages the user already likes and which ones he needs to like  */
function checkUserLikes(){
	likeChecks = 0;
	likes = 0;
	$.each(pages,function(index,value){
		if(debug)console.log(value);
		FB.api('/me/likes/'+value+'/?access_token='+token, function(response) {
			if(debug)console.log(response);
			likeChecks ++;
			if(typeof response.data[0] != 'undefined'){
				likes ++;
				$('#p'+value).html('LIKED');
			}
			$(document).trigger('likes');
		});
	});
}

/* We check if we have a database entry of the user already. If we have the user has already completed all the necessary steps to take part in the competition  */
function checkRecord(){
	//not implemented
	setTimeout(function(){$(document).trigger('hasRecord',false);},1000);
}

/* This is a facebook event listener which checks if a user likes a page  */
function registerLikeListener(){
	if(!likeListener){
		if(debug)console.log('Set Listener');
		likeListener = true;
		FB.Event.subscribe('edge.create',function(response) {
			if(debug)console.log(response);
			checkUserLikes();
		});
	}
}

/* We now need to load the users friends to display them in the autocomplete  */
function loadFriends(){
	//not implemented
	setTimeout(function(){$(document).trigger('friendsLoaded');},10000);
}

/* We now need to load the users already invited friends from the database, so he doesnt invite them again  */
function loadInvitedFriends(){
	//not implemented
	setTimeout(function(){$(document).trigger('invitedfriendsLoaded');},10000);
}