<?php
/**
 * 
 * Handles Database access of database table which stores the information on 
 * which users have already been invited by the 
 * @author Matthias Knoll <matt@kohlikohl.com>
 *
 */
class FBUserInvited extends Base {
	/**
	 * 
	 * Table name.
	 * @var string
	 */
	protected $table = 'fb_user_invited';
	/**
	 * 
	 * Constructor.
	 * Calls parent constructor.
	 */
	public function FBUser(){
		parent::Base();
	}
	/**
	 * 
	 * Saving the list of user that have been invited
	 * @param int $uid The user ID of the Facebook user using the app.
	 * @param array $array An array containing the user ID's of the user that have been invited.
	 */
	public function saveFriends($uid,$array){
		foreach($array as $friend){
			$this->save(array('fb_uid'=>$uid,'fb_uid_invited'=>$friend));
		}
	}
	
}
 ?>