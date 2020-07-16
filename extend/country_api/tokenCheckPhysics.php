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
//连接数据库
$servername = "localhost";
$username = "root";
$password = "Nklab2018";
$dbname = "ilab-x";

// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);
mysqli_query($conn, "set names 'utf8'"); 
// 检测连接
if ($conn->connect_error) {
	die("连接失败: " . $conn->connect_error);
} 


// 获取13位时间戳
function getUnixTimestamp()
{
    list($s1, $s2) = explode(' ', microtime());
    return (string)sprintf('%.0f',(floatval($s1) + floatval($s2)) * 1000);
}
/**
 * 直接输出Json信息，支持JsonP跨域
 * json响应信息输出，只给$code即可。
 * 可根据需要提供$result返回附加信息，如需自定义message信息，可以提供$message。
 * 调用本函数后，建议不要再使用任何输出语句，否直则会接跟在json消息后输出。
 *
 * 对于前端：如果需要跨域，只要在jQuery提交时将dataType设置为jsonP即可
 * 对于前端：如果采用iframe框架提交内容，需要在iframe框架外取得参数，需要在框架外定义一个js函数，然后将函数名作为get参数iframe_upload即可
 *
 * @param string $code    信息码
 * @param mixed  $result  [返回数据]
 * @param string $message [自定义信息文本]
 *
 * @return void
 *
 * Created by Notepad++;
 * User: 黎明;
 * Date: 2016/1/24
 * Last Modified: 2016/3/7
 * Last Change: 识别参数：@get_param String [$iframe_upload] 在子iframe中调用父窗口函数
 */
function jsonReturn($code, $result = null, $message = null) {
//    header('Author: Jin Liming, jinliming2@gmail.com');
    //消息信息
    if($message == null) {
        switch($code) {
            case "001":
                $message = "Success";  //成功
                break;
            case "002":
                $message = "Missing Parameter";  //缺少参数
                break;
            case "003":
                $message = "Invalid Token";  //无效Token
                break;
            case "004":
                $message = "Server Authentication Failed";  //服务器认证失败
                break;
            case "005":
                $message = "Inadequate Permissions";  //权限不够
                break;
            case "006":
                $message = "Unknown Reason";  //未知原因
                break;
            case "007":
                $message = "Database Error";  //数据库错误
                break;
            case "008":
                $message = "Server Error";  //服务器错误
                break;
            case "009":
                $message = "Parameter Error";  //参数错误
                break;
            default:
                $message = "程序猿君开小差了~";
                break;
        }
    }
    //返回信息拼接
    $ret = json_encode(array(
        "code"    => $code,
        "message" => $message,
        "result"  => $result
    ));
    if(isset($_GET['callback'])) {
        //跨域JsonP设置
        $ret = $_GET['callback'].'('.$ret.')';
        header('Content-type: application/javascript');
    } else if(isset($_GET['iframe_upload'])) {
        //iframe中调用父窗口函数
        $ret = "<script>parent.".$_GET['iframe_upload']."(".$ret.");</script>";
        header('Content-Type: text/html;charset=utf-8');
    } else {  //普通json
//        header("Access-Control-Allow-Origin:*");
//        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
        header('Content-type: application/json');
    }
    echo $ret;
}


// 向ilabjwt类中的issuerId、secretKey、aesKey赋值
IlabJwt::$issuerId = '102178';
IlabJwt::$appName = '核衰变及高速带电粒子动能动量测量';
IlabJwt::$secretKey = 'r78686';
IlabJwt::$aesKey = 'UzoQIRp71dY9mHKLE+N2YMuDwZfddR4ADPnFx6TZLYo==';

//获取token并验证
$token = (string)$_GET['token'];
$jwt = str_replace(' ', '+', urldecode($token));
$ilanUserFromToken = IlabJwt::getBody($jwt);
if (!$ilanUserFromToken) {
	jsonReturn('002',null,'Token is invalid.');
}else{
	$ilanUserFromToken['startDate'] = getUnixTimestamp();
	$_SESSION['userinfoPhysics'] = $ilanUserFromToken;
	
	//用户session信息
	$rand = md5($ilanUserFromToken['un'] . mt_rand(10000000,99999999));  //session_id
    $return = array('session_id' => $rand, 'user_name' => $ilanUserFromToken['dis']);
	$time = time();
	//将用户信息写入数据库
	$sql = "INSERT INTO nk_physics_user(session_id,username,time,status) VALUES ('" . $rand ."', '" . $return['user_name'] ."', '" . $time ."', 1)";
	$result = $conn->query($sql);
	$conn->close();
	if($result){
		$_SESSION['userinfo'] = $return;
		jsonReturn('001',$return);
	}	
	
}