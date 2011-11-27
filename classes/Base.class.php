<?php
/**
 * 
 * This is the base class that provides database intreaction for sub classes.
 * @author Matthias Knoll <matt@kohlikohl.com>
 * @since 0.2
 *
 */
class Base {
	
	private $databaseHost = '';
	private $database = '';
	private $username = '';
	private $password = '';
	
	/**
	 * 
	 * Database connection
	 * @var Database
	 */
	public $db;
	
	/**
	 * 
	 * Constructor.
	 * Initialising database connection.
	 */
	function Base(){
		$this->db = new Database($this->databaseHost,$this->database,$this->username,$this->password);	
	}
	
	/**
	 * 
	 * Querys the database and returns one result as json string.
	 * @param array $array The parameters that will be searched for in the database
	 */
	public function getByAttributes($array = array()){
		if(!is_array($array))return false;
		$query = "Select * from ".$this->table.$this->generateWhereString($array);
		$result = $this->db->executeQuery($query);
		echo json_encode($result);
	}
	
	/**
	 * 
	 * Saves new entry into database
	 * @param array $array Data that needs saving.
	 */
	public function save($array){
		if(!is_array($array))return false;
		$query = "Insert into ".$this->table.$this->generateInsertString($array);
		$result = $this->db->executeQuery($query);
		echo json_encode($result);
	}
	
	/**
	 * Generates the WHERE string out of array
	 * @param array $array WHERE conditions
	 * @return string Where string
	 */
	private function generateWhereString($array){
		$str = " WHERE ";
		foreach($array as $k => $v){
			$str .= " $k = $v";
		}
		return $str;
	}
	
	/**
	 * 
	 * Generates insert string.
	 * @param array $array Values to be inserted
	 * @return string Insert String
	 */
	private function generateInsertString($array){
		$str = " (";
		$columns = array();
		foreach($array as $k => $v){
			$columns[] = $k;
		}
		
		$values = array();
		foreach($array as $k => $v){
			$values[] = "'$v'";
		}
		
		$str .= implode(',',$columns);
		$str .= ") VALUES (";
		$str .= implode(',',$values);
		$str .= ") ";
		return $str;
	}
	
}
 ?>