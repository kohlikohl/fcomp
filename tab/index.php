<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://ogp.me/ns/fb#">
	<head>
		<title>SaveMe4Later Competition</title>
		<link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="stylesheet" type="text/css"/>
		<link href="css/style.css" rel="stylesheet" type="text/css"/>
		<script type="text/javascript" language="JavaScript" src="js/jquery.js"></script>
		<script type="text/javascript" language="JavaScript" src="js/jquery.ui.js"></script>
		<script type="text/javascript" language="JavaScript" src="js/jquery.autocomplete.html.js"></script>
		<script type="text/javascript" language="JavaScript" src="js/main.js"></script>
	</head>
	<body>
	<!-- Facebook DIV -->
	<div id="fb-root"></div>
	
	<!-- loading Screen -->
	<div id="loading">
		<img src="images/ajax-loader.gif" id="loading" />
		<p id="loadingText">loading app, please wait.</p>
	</div>
	
	<!-- Welcome screen -->
	<div id="welcome">
		<h1>Welcome</h1>
		<p>Some information about the competition which gets the users to participate.<br />Maybe pointing out the different prices etc.</p>
		<button type="button" id="enterNow">Enter Now</button>
	</div>
	
	<!-- Not authenticated -->
	<div id="noAuth">
		<h1>Ohhps!</h1>
		<p>You have not authenticated the app. If you would like to participate you need to fully authenticate the app. We will not use any of your information for third party advertising etc. Some text about trust.</p>
		<button type="button" id="enterNow">Enter Now</button>
	</div>
	
	<!-- Step 1: Liking the two pages -->
	<div id="step1">
		<h1>Step 1</h1>
		<p>In order to participate please like <b>SaveMe4Later</b> & <b>Figleaves</b> page.</p>
		<div style="width:200px;float:left">
			<h3>Save Me 4 Later</h3>
			<div id="p168399503222553" style="width:51px;height:24px;overflow:hidden">
				<fb:like href="https://www.facebook.com/pages/Name/168399503222553" send="false" width="450" show_faces="false"></fb:like>
			</div>
		</div>
		<div style="width:200px;float:left">
			<h3>Figleaves</h3>
			<div id="p6221307983" style="width:51px;height:24px;overflow:hidden">
				<fb:like href="http://www.facebook.com/figleaveshome" send="false" width="450" show_faces="false"></fb:like>
			</div>
		</div>
	</div>
	
	<!-- Step 2: Inviting your friends -->
	<div id="step2">
		<h1>Step 2</h1>
	</div>
	</body>
</html>
