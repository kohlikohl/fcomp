<?php
/**
 * The view of the app.
 * @author: Base structure by Matthias Knoll <matt@kohlikohl.com>
 * @author: Fitting content by Peter Wimren <peter@peweedesign.com>
 * @since 0.1
 */

require '../bootstrap.php';

if(!isset($_REQUEST['signed_request'])){
	header("Location: ".$config['fbUrl']);
}
 ?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://ogp.me/ns/fb#">
	<head>
		<title><?php echo $config['ogTitle']?></title>
		<link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="stylesheet" type="text/css"/>
		<link href="css/style.css?<?php echo rand(); ?>" rel="stylesheet" type="text/css"/>
        <!--[if lt IE 9]>
        <link rel="stylesheet" type="text/css" href="css/ie.css?<?php echo rand(); ?>" />
        <![endif]-->
		<script type="text/javascript" language="JavaScript" src="js/jquery.js"></script>
		<script type="text/javascript" language="JavaScript" src="js/jquery.ui.js"></script>
		<script type="text/javascript" language="JavaScript" src="js/jquery.autocomplete.html.js"></script>
		<script type="text/javascript" language="JavaScript" src="../conf/config.js?<?php echo rand(); ?>"></script>
		<script type="text/javascript" language="JavaScript" src="js/main.js?<?php echo rand(); ?>"></script>
		<script type="text/javascript" language="JavaScript">
			$(document).ready(function(){
				$('#whatIs').click(function(){
					$('#whatIs').fadeOut(function(){
						$('#accordian').fadeIn();
					});
					return false;
				});
			});
		</script>
	</head>
	<body>
	<!-- Facebook DIV -->
	<div id="fb-root"></div>
	
	<!-- loading Screen -->
	<div id="loading">
		<img src="images/ajax-loader.gif" />
		<p id="loadingText">loading app, please wait.</p>
	</div>
	
	<!-- Welcome screen -->
	<div id="welcome">
    	<h1>Welcome Screen</h1>
    	<p>Some content describing the nature of the app. Possibly an image to make it more attractive.</p>
    	<p>The aim of this screen should also be to inform the user of the prices that can be won, and to convince him to enter the competition.</p>        
        <hr />
        <div style="text-align:center;"><button type="button" id="enterNow">Enter Now</button></div>
	</div>
	
	<!-- Not authenticated -->
	<div id="noAuth">
		<h1>Why do we need your permission?</h1>
		<p><strong>Access my basic information</strong><br />
        In order to ensure your best possible outcome, we need to know your gender. Furthermore we need to know who your friends are, so you can share the prize with them. It is a treat for you and three of your friends, after all.
We can assure you that we will not share or sell your personal information or email address.</p>
        <p><strong>Access my email address</strong><br />
		We would like to contact you should you be the winner of this great competition.</p>
        <p><strong>Permission to publish status updates</strong><br />
        We would like to share this great competition with the friends you have chosen to join you on this special day. We will only post at your request.</p>
		<button type="button" id="enterNow">Enter Now</button>
	</div>
	
	<!-- Step 1: Liking the two pages -->
	<div id="step1">
		<h1>Step 1</h1>
		<p>Simply 'Like' both the <strong>[Page 1]</strong> and <strong>[Page 2]</strong> pages then choose 3 of your closest friends to join you</p>
		<div class="save">
			<p>[Page 1]</p>
			<div id="p<?php echo $config['pages'][0]?>" style="width:51px;height:24px;overflow:hidden">
				<fb:like href="<?php echo $config['pageUrl'][0]?>" send="false" width="450" show_faces="false"></fb:like>
			</div>
		</div>
		<div class="fig">
			<p>[Page 2]</p>
			<div id="p<?php echo $config['pages'][1]?>" style="width:51px;height:24px;overflow:hidden">
				<fb:like href="<?php echo $config['pageUrl'][1]?>" send="false" width="450" show_faces="false"></fb:like>
			</div>
		</div>
	</div>
	
	<!-- Step 2: Inviting your friends -->
	<div id="step2">
		<h1>Step 2</h1>
		<div id="content-male" class="hidden">
        	<img src="images/Racing.png" class="absolute" alt="Racing at Silverstone" title="Racing at Silverstone" />
			<p>This is showing some detailed information about the prize that can be won by a male user.</p>
			<h2>What are you waiting for?</h2>	
		</div>
		<div id="content-female" class="hidden">
        	<img src="images/spa.png" class="absolute" alt="Spa treatment" title="Spa treatment" />
            <p>This is showing some detailed information about the prize that can be won by a male user.</p>
			<h2>What are you waiting for?</h2>
		</div>
		<div id="invitations">
			<h3>Selected Friends</h3>
            <a href="#" class="right" id="startover">Start over</a>
			<div id="selectedFriends">            	
				<p>You have no friends selected!</p>
			</div>
			<div id="selectFriends">
				<span class="left">Start typing to select friend:</span>
				<input id="autocomplete" value="" name="autocomplete"/> <button id="addFriend" type="button">Add</button>
				<input id="autocomplete_id" type="hidden"/>
			</div>
			<div id="invite" class="hidden">
				<div id="preview">
                    <h3>Preview</h3>
                    <img src="" id="previewProfile" class="" alt="" title="" />
                    <textarea id="prevMessage"></textarea>
                    <div id="appinfo">
                    	<img src="<?php echo $config['appUrl']?>/tab/images/share.png" class="" alt="" title="" />
                        <p>
                        	<strong><?php echo $config['ogTitle']?></strong>
                            <a href="#"><?php echo $config['appUrl']?></a>
                    	</p>
                        <p><?php echo $config['ogDescription']?></p>
                    </div>
				</div>
                <hr />
				<button name="" id="postToWall" type="button">invite your friends now!</button>
				<p>NOTE: This is a demo mode and no actual wall posts will be sent once you click the invite button.</p>
			</div>
		</div>
	</div>
	
	<!-- Step 3: Invitation completed, User is participating -->
	<div id="step3">
		<h1>Step 3</h1>
        <p>Thank you for entering our competition!</p>
        
        <p>Increase your chances of winning by inviting more friends.</p>
		<hr />
        <div style="text-align:center;"><button type="button" id="inviteMore">Invite more friends</button></div>
	</div>
	<hr />
    	<div class="right">
        <a href="" data-url="<?php echo $config['appUrl']?>" data-counturl="<?php echo $config['appUrl']?>" data-text="<?php echo $config['twitterText']?>" class="twitter-share-button" data-count="horizontal" data-via="<?php echo $config['twitterAccount']?>" data-related="<?php echo $config['twitterRelated']?>">Tweet</a><script type="text/javascript" src="//platform.twitter.com/widgets.js"></script>
        <div class="fb-like" data-href="<?php echo $config['appUrl']?>" data-send="false" data-layout="button_count" data-width="50" data-show-faces="false"></div>
        </div>        
        <a href="<?php echo $config['tc']?>" target="_blank">Terms &amp; Conditions</a>
	</body>
</html>
