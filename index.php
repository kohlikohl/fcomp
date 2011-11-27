<?php
/**
 * Page on which Facebook spiders the meta information if a link to the app is liked or shared.
 * 
 * @author Matthias Knoll <matt@kohlikohl.com>
 * @since 0.2
 */
require 'bootstrap.php';

//The infromation is only presented if the facebook user agent is detected. Otherwise we forward to the app.
if($_SERVER['HTTP_USER_AGENT'] != $config['FBUserAgent']){
	header("Location: ".$config['fbUrl']);
	exit;
}
 ?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://ogp.me/ns/fb#">
	<head>
		<title><?php echo $config['ogTitle']?></title>
		<meta property="og:title" content="<?php echo $config['ogTitle']?>" />
		<meta property="og:type" content="<?php echo $config['ogType']?>" />
		<meta property="og:url" content="<?php echo $config['appUrl']?>" />
		<meta property="og:image" content="<?php echo $config['ogImage']?>" />
		<meta property="og:site_name" content="<?php echo $config['ogTitle']?>" />
		<meta property="og:description" content="<?php echo $config['ogDescription']?>" />
		<meta property="fb:app_id" content="<?php echo $config['appId']?>" />
	</head>
	<body>
	</body>
</html>