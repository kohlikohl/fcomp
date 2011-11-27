<?php 
/**
 * 
 * Class to handle the Facebook user
 * @author Matthias Knoll <matt@kohlikohl.com>
 * @since 0.2
 *
 */
class FBUser extends Base {
	/**
	 * 
	 * Name of database Table
	 * @var string
	 */
	protected $table = 'fb_user';
	
	/**
	 * 
	 * Constructor.
	 * Calls parent constructor.
	 */
	function FBUser(){
		parent::Base();
	}	
}
 ?>