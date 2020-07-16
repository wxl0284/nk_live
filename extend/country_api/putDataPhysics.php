<?php
use sdk\IlabJwt;
use sdk\IlabApi;
session_start();
require __DIR__ . '/autoload.php';
// var_dump(strtotime('2019-10-07 15:48:10'));var_dump(strtotime('2019-10-07 15:53:10'));exit;
//default_charset
ini_set('default_charset', 'UTF-8');
//timezone
date_default_timezone_set('Asia/Shanghai');

//init
define('APP_NAME', 'ilab');
define('DIR_LOG', __DIR__);
define('ILAB_SERVER_HOST', 'www.ilab-x.com');

// 获取13位时间戳
function getUnixTimestamp()
{
    list($s1, $s2) = explode(' ', microtime());
    return (string)sprintf('%.0f',(floatval($s1) + floatval($s2)) * 1000);
}

function exitError($error)
{
	header('Access-Control-Allow-Origin:*');
	echo json_encode(['code' => 1, 'error' => $error], JSON_UNESCAPED_UNICODE);
	exit();
}

function exitSuccess()
{
	header('Access-Control-Allow-Origin:*');
	echo json_encode(['code' => 0, 'error' => ''], JSON_UNESCAPED_UNICODE);
	exit();
}

//data接收要传给ilab平台的数据
$userinfoPhysics = $_SESSION['userinfoPhysics'];
if(!$userinfoPhysics){
	exitError('session is invalid.');
}
$endDate = getUnixTimestamp();
$timeUsed = round(($endDate - $userinfoPhysics['startDate'])/1000/60, 0);

$data = [
	'childProjectTitle' => '核衰变及高速带电粒子动能动量测量',	//id-name-alias
	'status' => 1,
	'score' => rand(60,100),
	'startDate' => $userinfoPhysics['startDate'],
	'endDate' => $endDate,
	'timeUsed' => $timeUsed,
];




// 向ilabjwt类中的issuerId、secretKey、aesKey赋值
IlabJwt::$issuerId = '102178';
IlabJwt::$appName = '核衰变及高速带电粒子动能动量测量';
IlabJwt::$secretKey = 'r78686';
IlabJwt::$aesKey = 'UzoQIRp71dY9mHKLE+N2YMuDwZfddR4ADPnFx6TZLYo==';

//获取token并验证
//$token = (string)$_GET['token'];
//$jwt = str_replace(' ', '+', urldecode($token));
//$ilanUserFromToken = IlabJwt::getBody($jwt);
//if (!$ilanUserFromToken) {
//	exitError('Token is invalid.');
//}

$res = IlabApi::log(
		$userinfoPhysics['un'], 
		$data['childProjectTitle'], 
		$data['status'], 
		$data['score'], 
		$data['startDate'], 
		$data['endDate'],
		$data['timeUsed']
	);

$res === false ? exitError('Send data to ilab failed.') : exitSuccess();