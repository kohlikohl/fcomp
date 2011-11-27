/**
 * Configuration for the app!
 *  
 * This is the configuration file for the while app. It will be read by the PHP 
 * components as well as the Javascript components.
 * 
 * @author: Matthias Knoll <matt@kohlikohl.com>
 * @since: 0.2
 * */
const config = {
		
		/*
		 * APP CONGFIGURATION
		 * -------------------------------------
		 * 
		 * URL of the app on facebook, can be a link to a page tab or the app itself. 
		 * If the user clicks in a link which lead back to the app he will end up there.
		 * og:url attribute
		 * redirectUrl
		 */
		'appUrl' : 'https://example.com',
		
		/*
		 * Facebook Url.
		 * The url of your app on facebook. e.g. url to tab of page
		 */
		'fbUrl' : 'https://www.facebook.com/pages/Fcomp-Test-Page-1/123264697786213?sk=app_194171327335921',
		
		/*
		 * App ID.
		 * The Facebook id for the app. Can be optained from the Facebook developer app.
		 * fb:app_id attribute
		 */
		'appId' : '194171327335921',
		
		/*
		 * Facebook user agent
		 * */
		'FBUserAgent' : 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
		
		/*
		 * Debug Modus
		 * If switched on we will print the state of the app to console.log()
		 */
		'debug' : true,
		
		/*
		 * Channel File.
		 * Absolute Url.
		 */
		'channelFile' : 'https://example.com/tab/channel.php',
		
		/*
		 * Permissions.
		 * The permissions that are requested by the App.
		 */
		'scope' : 'email,publish_stream',
		
		/*
		 * Amount of requested permissions.
		 */
		'noScope' : '2',
		
		/*
		 * Pages that need to be liked to enter the competition.
		 * Please specify the page ID's
		 */
		'pages' : ['123264697786213','239373712796050'],
		
		/*
		 * Facebook Page Url's
		 */
		'pageUrl' : ['https://www.facebook.com/pages/Fcomp-Test-Page-1/123264697786213', 'https://www.facebook.com/pages/Fcomp-Test-Page-2/239373712796050'],
		
		/*
		 * Amount of friends to invite
		 */
		'friendsToInvite' : '3',
		
		/*
		 * Post To Own Wall.
		 * If true a message will be posted on the users wall as well as on the users friends wall
		 */
		'postToOwnWall' : true,
		
		/*
		 * Source.
		 * A source can be specified to be recorded in the database. Usefull when same database is used for different apps.
		 */
		'source' : '',
		
		
		
		/*
		 * CONTENT CONFIGURATION
		 * --------------------------------------
		 * 
		 * The title that will be shown if the app is liked or shared.
		 * og:title attribute
		 * og:site_name attribute
		 */
		'ogTitle' : 'fcomp - Facebook Competition app',
		
		/*
		 * Type of the app
		 * og:type attribute
		 */
		'ogType' : 'website',
		
		/*
		 * Application image.
		 * URL to the image that will be shared alongside the title and a description.
		 * og:image attribute
		 */
		'ogImage' : '',
		
		/*
		 * Description.
		 * The description which will be shared alongside the title and the image.
		 * og:description attribute
		 */
		'ogDescription' : 'fcomp - This is a ready made script to help you run competitions in Facebook.',
		
		/*
		 * Prefilled Message.
		 * The message that will be posted to the friends wall. This message is prefilled into a textbox and can be changed 
		 * before the message is posted.
		 * One for male and one for female.
		 */
		'prefilledMessage' : {
								'male':'Hi, I have chosen you to join me on this great man event!',
								'female':'Hi, I have chosen you to join me on this great woman event!'
							},
		
		/*
		 * Message to own profile.
		 * The message that will be posted to the app user's profile
		 */
		'messageToOwnProfile' : 'Check out this competition I just entered!',
		
		/*
		 * Twitter share text
		 */
		'twitterText' : 'Fcomp - the number one Facebook competition App',
		
		/*
		 * Twitter account
		 */
		'twitterAccount' : 'kohlikohl',
		
		/*
		 * Twitter Related
		 */
		'twitterRelated' : '',
		
		/*
		 * Url to Terms and Conditions
		 */
		'tc' : ''

};