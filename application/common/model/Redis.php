<?php

namespace app\common\model;
use think\Model;
use think\Request;
use think\DB;
/**
 * 用户模型
 * Class User
 * @package app\store\model
 */
class Redis extends Model
{
	protected static $_redis;
    public function __construct()
    {
        parent::__construct();
        Vendor("Myredis");
		//实例化
		$this->_redis = new \Myredis();
	    $this->_redis->expire = 60*60*8;
    }

    public function setValue($dbindex="0",$key = "0",$value=array()) {

	    $this->_redis->dbindex = $dbindex;
	    $this->_redis->key = $key;
	    $this->_redis->value = $value;

	    $res = $this->_redis->get($key);
	   
	    if($res) $this->_redis->del();

	    return $this->_redis->set(); 
    }
    public function getValue($dbindex="0",$key = "0") {
	    $this->_redis->dbindex = $dbindex;
	    $this->_redis->key = $key;
	    return $this->_redis->get();
    }

    public function getKeys($dbindex="0") {
	    $this->_redis->dbindex = $dbindex;
	    return $this->_redis->keys(); 
    }
    public function getValues($dbindex="0") {
    	$result = array();
	    $this->_redis->dbindex = $dbindex;
	    $keys = $this->_redis->keys(); 
	    foreach ($keys as $k => $val) {
		    $this->_redis->key = $val;
		    $result[$k] = $this->_redis->get();
	    }
	    return $result;
    }
    public function flushall() {
	    return $this->_redis->flushall();
    }
    public function del($dbindex="0",$key = "0") {
	    $this->_redis->dbindex = $dbindex;
	    $this->_redis->key = $key;
	    return $this->_redis->del();
    }
}