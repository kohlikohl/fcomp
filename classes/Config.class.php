<?php
/**
 * 
 * Class to load the configuration and prepare it to use.
 * @author Matthias Knoll <matt@kohlikohl.com>
 * @since 0.2
 * 
 */
class Config {
	
	/**
	 * Static function to read the configuration file and load it into an array
	 * @since 0.2
	 * 
	 * @return array Configuration Array
	 * 
	 */
	static function loadPHP() {
		if(file_exists('conf/config.js'))
			$datastring = file_get_contents('conf/config.js');
		else if(file_exists('/conf/config.js'))
			$datastring = file_get_contents('/conf/config.js');
		else if(file_exists('../conf/config.js'))
			$datastring = file_get_contents('../conf/config.js');
		$datastring = str_replace('//','\/\/',$datastring);  
		$regexes = array(
		array("p"=>"/[\w]*(\/\/).*$/m", "r"=>""),    //remove comments
		array("p"=>"/'/m", "r"=>"\""),               //replace single-quotes with double-quotes
		array("p"=>"#/\*.+?\*/#s","r"=>""), //remove comment blocks
		);
		foreach($regexes as $regex)
		{
			$datastring = preg_replace($regex['p'], $regex['r'], $datastring);
		}
		preg_match("/config[ ]?=[ ]?\{([^\;]+)\\;/", $datastring, $matches);
		return json_decode('{' . $matches[1], true);
	}
}
?>