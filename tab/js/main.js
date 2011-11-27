/**
 * Main application file.
 * 
 * In this file all the processing and API calls are happening.
 * @author: Matthias Knoll <matt@kohlikohl.com>
 * @since: 0.1
 */
//app variables
//var appId = '314615535233400';
//var channelFile = 'https://www.saveme4later.net/facebook/savepromo/channel.php';
//var scope = 'email,publish_stream';
//var noScope = 2; //number of permissions
//var pages = ['113983615333828','6221307983'];
//var config.debug = false;
//var redirectUrl = config.appUrl;
//var friendsToInvite = 3;
//var link = config.appUrl;
//var picture = config.ogImage;
//var prefilled_message = config.prefilledMessage;
//prefilled_message['male'] = 'Hi, I have chosen you to join me on a Silverstone Track Day experience competition.'
//prefilled_message['female'] = 'Hey! I have chosen you to join me for Exclusive Spa competition.'
//var messageToOwnProfile = config.messageToOwnProfile;
//var postToOwnWall = true;
//var source = 'saveme4later';


//variables used on runtime
var token = '';
var likes = 0;
var likeChecks = 0;
var userId;
var likeListener = false;
var scenario = 'auth';
var authIsBound = false;
var reload = false;
var friends = [];
var invitedFriendsLoaded = false;
var invitedFriends = [];
var autocomplete = [];
var fbUser;
var selected = [];
var selected_count = 0;
var invited = 0;
var hasRecord = false;
var userFriendsSaved = 0;
var pressedEnter = 0;

$(document).ready(function(){
	initializeApp();
	
	$(document).bind('init',function(e){
		if(config.debug)console.log('The App has been initialised and can be used now.');
		FB.Canvas.setAutoGrow();
		scrollTo(0);
		isUserKnown();
	});
	
	$(document).bind('userKnown',function(e,isKnown){
		if(config.debug)console.log('We know now if the user is known: '+isKnown);
		if(!isKnown){
			//show welcome screen
			$('#loading').fadeOut(function(){
				scrollTo(0);
				$('#welcome').fadeIn();
				//bind enter now click event
				bindAuth();
			});
		} else if(isKnown){
			if(config.debug)console.log('The user is know, but we need to check the users permissions');
			scenario = 'known';
			checkUserPermissions();
		}
	});
	
	$(document).bind('authenticatedUser',function(e,response){
		if(config.debug)console.log('The user has acted on the authenticate dialog or has been checked automatically. Result: '+response.authenticated);
		if(config.debug)console.log(response.known);
		if(config.debug)console.log(response);
		if(reload){
			window.top.location = config.appUrl;
		}
		if(!response.authenticated){
			//show non Auth screen
			$('#loading, #welcome').fadeOut().promise().done(function(){
				if(scenario == 'known'){
					bindAuth();
				}
				scrollTo(0);
				$('#noAuth').fadeIn();
			});
		} else if(response.authenticated){
			if(scenario == 'known'){
				$('#noAuth, #welcome').fadeOut().promise().done(function(){
					$('#loadingText').html('preparing the app, please wait ...');
					scrollTo(0);
					$('#loading').fadeIn();
					checkRecord();
				});
			}else{
				$('#noAuth, #welcome').fadeOut().promise().done(function(){
					$('#loadingText').html('preparing the app, please wait ...');
					scrollTo(0);
					$('#loading').fadeIn();
					checkRecord();
				});
			}
		}
	});
	
	$(document).bind('likes',function(e){
		if(config.debug)console.log('We now know what pages the user already likes. ');
		if(config.debug)console.log(likeChecks + " "+ likes + " "+config.pages.length);
		if(config.debug)console.log(likeChecks >= config.pages.length && likes >= config.pages.length);
		if(likeChecks >= config.pages.length && likes >= config.pages.length){
			if(hasRecord){
				loadInvitedFriends();
			}else if (!hasRecord){
				loadFriends();
			}
		} else if(likeChecks >= config.pages.length && likes < config.pages.length) {
			$('#loading').fadeOut(function(){
				scrollTo(0);
				$('#step1').fadeIn();
				registerLikeListener();
			});
		}
		
	});
		
	$(document).bind('hasRecord',function(e,hasRecord){
		if(config.debug)console.log('We know if the user has a record in the database. Result: '+hasRecord);
		//if(!hasRecord){
			checkUserLikes();
		//} else if(hasRecord){
			//we jump directly to step 2 where the user can invite some more friends. We will load the friends the user has already invited though, so he doesnt invite them twice.
			//loadInvitedFriends();
		//}
	});
	
	$(document).bind('invitedfriendsLoaded',function(e){
		if(config.debug)console.log('We have loaded the users already invited friends now!');
		invitedFriendsLoaded = true;
		loadFriends();
	});

	
	$(document).bind('friendsLoaded',function(e){
		if(config.debug)console.log('We have loaded the users friends now!');
		prepareStep2Display();
	});
	
	$(document).bind('readyForDisplay',function(e){
		if(config.debug)console.log('We are now ready to display step 2.');
		$('#loading, #step1').fadeOut().promise().done(function(){
				scrollTo(0);
				$('#step2').fadeIn();
		});
	});
	
	$(document).bind('invited',function(e){
		invited ++;
		if(invited >= config.friendsToInvite){
			if(config.debug)console.log('All friends have been invited!');
			saveUserFriends();
		}
	});
	
	$(document).bind('userFriendsSaved',function(e){
		if(config.debug)console.log('The user and invited friends have been saved!');
		userFriendsSaved ++;
		if(hasRecord && userFriendsSaved >= 1){
			$('#loading').fadeOut().promise().done(function(){
				scrollTo(0);
				$('#step3').fadeIn();
				registerInviteMore();
			});	
		}else if(!hasRecord && userFriendsSaved >= 2){
			$('#loading').fadeOut().promise().done(function(){
				scrollTo(0);
				$('#step3').fadeIn();
				registerInviteMore();
			});
		}
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
	      appId      : config.appId, // App ID
	      channelURL : config.channelFile, // Channel File
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
		  if(config.debug)console.log(response);
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
			if(config.debug)console.log('Start Authentication');
			authenticateUser();
		});
	}
}

/* We are promting the user to authenticate the app. This is needed to access the users details and allow the app to post to the user's friends walls  */
function authenticateUser(){
	FB.login(function(response) {
		   if(config.debug)console.log(response);
		   if(response.status == 'unknown'){
		   		$(document).trigger('authenticatedUser',{authenticated:false});
		   }else if(response.status == 'connected'){
		   		token = response.authResponse.accessToken;
		   		userId = response.authResponse.userID;
		   		
		   		//now we need to check if the user has allowed us all the necessary permissions
		   		checkUserPermissions();
		   }		   
	},{scope:config.scope});

}
	
/* We are checking if the user has the permissions we require to use our app  */
function checkUserPermissions(){
	FB.api('/me/permissions/?access_token='+token, function(response) {
		    if(config.debug)console.log(response);
		    if(response.data.length == 0){
		    	setTimeout(function(){
		    		checkUserPermissions();
		    	}, 100);
		    	return false;
		    }
		    var perm = 0;
		    $.each(response.data[0],function(index,value){
		    	if(config.debug)console.log(index);
		    	if(config.scope.indexOf(index) >= 0)perm++;
		    });
		    if(perm >= config.noScope && scenario == 'auth'){
		    	if(config.debug)console.log('Auth: true');
		    	$(document).trigger('authenticatedUser',{authenticated:true});
		    } else if(perm < config.noScope && scenario == 'auth'){
		    	if(config.debug)console.log('Auth: false');
		    	$(document).trigger('authenticatedUser',{authenticated:false});
		    }
		    if(perm >= config.noScope && scenario == 'known'){
		    	if(config.debug)console.log('Known: true');
		    	$(document).trigger('authenticatedUser',{authenticated:true,known:true});
		    } else if(perm < config.noScope && scenario == 'known'){
		    	if(config.debug)console.log('Known: false');
		    	$(document).trigger('authenticatedUser',{authenticated:false,known:true});
		    }
	  });
}

/* Check which pages the user already likes and which ones he needs to like  */
function checkUserLikes(){
	likeChecks = 0;
	likes = 0;
	$.each(config.pages,function(index,value){
		if(config.debug)console.log(value);
		FB.api('/me/likes/'+value+'/?access_token='+token, function(response) {
			if(config.debug)console.log(response);
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
	if(config.debug)console.log('Querying the database if a record exists.');
	$.ajax({
	  url: '../ajax.php',
	  type: "POST",
	  data: {
	  	checkRecord: true,
	  	fb_uid: userId
	  },
	  success: function(response) {
	  	response = eval(response);
	  	response = response[0];
	  	if(config.debug)console.log(response);
	  	if(typeof response == 'undefined'){
	  		hasRecord = false;
	  		$(document).trigger('hasRecord',false);
	  	}else{
	  		hasRecord = true;
	  		$(document).trigger('hasRecord',true);
	  	}  
	  }
	});
}

/* This is a facebook event listener which checks if a user likes a page  */
function registerLikeListener(){
	if(!likeListener){
		if(config.debug)console.log('Set Listener');
		likeListener = true;
		FB.Event.subscribe('edge.create',function(response) {
			if(config.debug)console.log(response);
			checkUserLikes();
		});
	}
}

/* We now need to load the users friends to display them in the autocomplete  */
function loadFriends(){
	var user = FB.Data.query("SELECT uid,name,is_app_user FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())");
	FB.Data.waitOn([user], function(response) {
	   	if(config.debug)console.log(response);
	   	$.each(response[0],function(index,value){
	   		var invited = false;
	   		if(invitedFriendsLoaded){
	   			invited = checkIfInvited(value.uid);
	   		}
	   		friends[index] = value;
	   		autocomplete[index] = [];
	   		if(invited){
	   			autocomplete[index] = {label:'<span class="tick"><img src="https://graph.facebook.com/'+value.uid+'/picture"/><br />'+value.name+'</span>',value:value.uid,name:value.name,invited:true};
	   		}else{
	   			autocomplete[index] = {label:'<img src="https://graph.facebook.com/'+value.uid+'/picture"/><br />'+value.name+'',value:value.uid,name:value.name,invited:false};
	   		}
   		});
   		$(document).trigger('friendsLoaded');
   });
}

/* We need to check if the current friend has already been invited by the user before  */
function checkIfInvited(uid){
	if(config.debug)console.log('check if invited: '+ uid);
	if(typeof invitedFriends[uid] != 'undefined'){
		if(config.debug)console.log(true);
		return true;
	}
	return false;
}

/* We now need to load the users already invited friends from the database, so he doesnt invite them again  */
function loadInvitedFriends(){
	$.ajax({
	  url: '../ajax.php',
	  type: "POST",
	  data: {
	  	loadInvitedFriends:true,
	  	fb_uid: userId
	  },
	  success: function(response) {
	  	response = eval(response);
	  	if(config.debug)console.log(response);
	  	$.each(response,function(index,value){
	  		if(config.debug)console.log(value);
	  		invitedFriends[value.fb_uid_invited] = "*";
	  	});
	  	$(document).trigger('invitedfriendsLoaded');
	  }
	});
}

/* We need to prepare the HTML for step 2 including click events.  */
function prepareStep2Display(){
	if(config.debug)console.log('Set up autocomplete!');
	$("input#autocomplete").autocomplete({
	    source: autocomplete,
	    focus: function(event, ui) {
	    	$(this).val(ui.item.name);
	    	return false;
	    },
	    select: function(event, ui) {
	    	if(ui.item.invited){
	    		$(this).val('');
	    		return false;
	    	}
	    	$(this).val(ui.item.name);
	    	$("input#autocomplete_id").val(ui.item.value);
	    	return false;
	    	//$(ui.item).hide();
	    },
	    html:true
	});
	
	//we need to load the user's object to get his gender and information
	getUserObject();
	
	$(document).bind('userObjectPresent',function(e){
		if(config.debug)console.log('We have loaded the user object!');
		
		$('#content-'+fbUser.gender).show();
		if(fbUser.gender != 'male' && fbUser.gender != 'female'){
			$('#content-male').show();
			$('#content-female').show();
		}
		
		$('#startover').click(function(){
			window.location.href = window.location.href+"?signed_request=true";
			return false;
		});
		
		$('input#autocomplete').bind('keyup', function(e) {
			if(config.debug)console.log(e.keyCode);
			if(config.debug)console.log(e.which);
			if(e.keyCode == 13 || e.which == 13){
				pressedEnter ++;
				if(pressedEnter >= 2){
					$('button#addFriend').click();
					pressedEnter = 0;
				}
			}
		});
		
		$('button#addFriend').click(function(){
			if($('input#autocomplete_id').val() == '')return false;
			
			var exists = false;
			$.each(selected,function(index,value){
				if(config.debug)console.log(value);
				if(value == $('input#autocomplete_id').val()){
					exists = true;
				}
			});
			if(exists){
				$('input#autocomplete').val('');
				return false;
			}
			selected[selected_count++] = $('input#autocomplete_id').val();
			if(selected.length < (config.friendsToInvite-1)){
				$('#selectedFriends').html(' ');
				$('#selectedFriends').append('<div style=""><img src="https://graph.facebook.com/'+$('input#autocomplete_id').val()+'/picture"/><br />'+$('input#autocomplete').val()+'</div>');
			}else{
				$('#selectedFriends').append('<div style=""><img src="https://graph.facebook.com/'+$('input#autocomplete_id').val()+'/picture"/><br />'+$('input#autocomplete').val()+'</div>');
			}
			$('input#autocomplete').val('');
			if(selected_count >= config.friendsToInvite){
				$('#selectFriends').hide();
				$('#previewProfile').attr('src','https://graph.facebook.com/me/picture/?access_token='+token);
				$('#prevMessage').val(config.prefilledMessage[fbUser.gender]);
				$('#invite').show();
				
				$('button#postToWall').click(function(){
					$('#step2').fadeOut().promise().done(function(){
						scrollTo(0);
						$('#loadingText').html('adding you to the competition, please wait ...');
						$('#loading').fadeIn();
						postToFriendsWall();
					});					
				});
			}
		});
		
		$(document).trigger('readyForDisplay');
	});

}

/* Send the invitation message to the selected friends  */
function postToFriendsWall(){
	if(config.postToOwnWall){
		selected[selected_count++] = fbUser.id;
		config.friendsToInvite ++;
	}
	var message = $('#prevMessage').val();
	
	$.each(selected, function(index,value){
    	if(config.debug)console.log('Invite: '+value);
    	if(value == fbUser.id){
    		message = config.messageToOwnProfile;
    	}
    	
    	//only post if the app is not in debug modus
    	if(config.debug){
    		$(document).trigger('invited');
    		return true;
    	}
    	
    	FB.api('/'+value+'/feed', 'post', { 
        	message: message,
        	link:config.appUrl,
        	picture:config.ogImage
        
        }, function(response) {
		  if(config.debug)console.log(response);
		  $(document).trigger('invited');
		});
    });
}

/* We need to load the user object to get the user details  */
function getUserObject(){
	FB.api('/me/?access_token='+token, function(response) {
		    if(config.debug)console.log(response);
		    fbUser = response;
		    $(document).trigger('userObjectPresent');
	});
}

/* We are now saving the user details and the friends the user has invited to the database  */
function saveUserFriends(){
	//save User to database
	if(!hasRecord){
		$.ajax({
		  url: '../ajax.php',
		  type: "POST",
		  data: {
		  	saveUser: true,
		  	user: {
		  		fb_uid:fbUser.id,
		  		name:fbUser.name,
		  		email:fbUser.email,
		  		gender:fbUser.gender,
		  		is_in_comp:1,
		  		source:config.source
		  	}
		  },
		  success: function(response) {
		  	if(config.debug)console.log(response);
		  	$(document).trigger('userFriendsSaved');
		  }
		});
	}
	
	//save invited friends to database
	$.ajax({
	  url: '../ajax.php',
	  type: "POST",
	  data: {
	  	saveFriends: true,
	  	fb_uid: userId,
	  	invited: selected
	  },
	  success: function(response) {
	  	if(config.debug)console.log(response);
	  	$(document).trigger('userFriendsSaved');    
	  }
	});
}

/* Reload the iframe to invite more friends!  */
function registerInviteMore(){
	$('#inviteMore').click(function(){
		window.location.href = window.location.href+"?signed_request=true";
		return false;
	});
}

/* This function animates the scroll position to the top  */
function scrollTo(y){
    FB.Canvas.getPageInfo(function(pageInfo){
            $({y: pageInfo.scrollTop}).animate(
                {y: y},
                {duration: 1000, step: function(offset){
                    FB.Canvas.scrollTo(0, offset);
                }
            });
    });
}