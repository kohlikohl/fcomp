<?php
/**
 * Bootstrap file
 *
 * @author Matthias Knoll <matt@kohlikohl.com>
 * @since 0.2
 *
 */

//error reporting setting
error_reporting(E_ALL ^ E_NOTICE);
ini_set('display_errors','0');

//Set up class autoloading
if(!function_exists('__autoload')){
	function __autoload($class_name) {
		include 'classes/'.$class_name . '.class.php';
	}
}

//if your system runs PHP 5 < 5.2 you can include the jsonwrapper to provide json_encode & json_decode function
//require 'lib/jsonwrapper/jsonwrapper.php';

//Load the configuration for PHP
$config = Config::loadPHP();
?>