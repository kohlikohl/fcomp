<?php
/**
 * File that gets called on AJAX requests to process the sent and requested data.
 * @author Matthias Knoll <matt@kohlikohl.com>
 * @since 0.2
 */

require 'bootstrap.php';

//Check if a user record exists
if($_POST['checkRecord'] == true){
	$fbUser = new FBUser();
	$fbUser->getByAttributes(array('fb_uid'=>$_POST['fb_uid']));
}

//save new user
if($_POST['saveUser'] == true){
	$fbUser = new FBUser();
	$fbUser->save($_POST['user']);

}

//save invited friends
if($_POST['saveFriends'] == true){
	$fbUserInvited = new FBUserInvited();
	$fbUserInvited->saveFriends($_POST['fb_uid'],$_POST['invited']);

}

//load invited friends
if($_POST['loadInvitedFriends'] == true){
	$fbUserInvited = new FBUserInvited();
	$fbUserInvited->getByAttributes(array('fb_uid'=>$_POST['fb_uid']));
}
?>