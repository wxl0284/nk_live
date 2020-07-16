<?php
//namespace sdk;
namespace country_api\sdk;

class IlabJwt
{
	const TYPE_RESERVED = 0;
	const TYPE_JSON = 1;
	const TYPE_SYS = 2;
	
	public static $enableLog = true;
	protected static $logger = null;
	
	public static $appName = '';
	public static $issuerId = 0;
	public static $secretKey = '';
	public static $aesKey = '';
	


	//拼接要返回给ilab的xjwt消息
	public static function getJwt($body)
	{
		$body = json_encode($body, JSON_UNESCAPED_UNICODE);	//JSON_UNESCAPED_UNICODE 必须
		
		$header = self::packHeader();
		$body = self::encrypt($body);
		
		$base64Header = base64_encode($header);
		$base64Payload = base64_encode($body);
		$base64Signature = base64_encode(self::sign($base64Header, $base64Payload));
		
		return "{$base64Header}.{$base64Payload}.{$base64Signature}";
	}
	
	// 添加头部header
	protected static function packHeader()
	{
		$header = '';
		
		$expiry = round((microtime(true) + 900) * 1000);	//900秒过期时间
		$header .= pack('J', $expiry);
		
		$type = pack('n', self::TYPE_SYS);
		$header .= $type[1];
		
		$header .= pack('J', self::$issuerId);
		
		return $header;
	}
	
	// 添加payload
	protected static function encrypt($body)
	{
		$payload = '';
		
		//前接8字节随机整数
		$randLong = pack('J', rand(0, PHP_INT_MAX));
		$payload .= $randLong;
		
		$payload .= $body;
		
		//补齐为64字节的整数倍
		$tempLen = strlen($payload) + 1;
		$paddingLen = 16 - $tempLen % 16;
		if($paddingLen === 16){
		  $paddingLen = 0;
		}
		$padding = str_pad('', $paddingLen + 1, pack('c', $paddingLen));
		$payload .= $padding;
		
		//aes加密
		$aesKey = base64_decode(self::$aesKey);
		$iv = substr($aesKey, 0, 16);
		
		$payload = openssl_encrypt($payload, 'AES-256-CBC', $aesKey, OPENSSL_RAW_DATA | OPENSSL_NO_PADDING, $iv);
		
		return $payload;
	}
	
	// 将header和Payload加密成signature
	protected static function sign($base64Header, $base64Payload)
	{
		$signature = hash_hmac('sha256', $base64Header . '.' . $base64Payload, self::$secretKey, true);
		return $signature;
	}
	
	// 验证token的有效性
	public static function getBody($jwt)
	{
		list($base64Header, $base64Payload, $base64Signature) = explode('.', $jwt);
		
		$header = base64_decode($base64Header);
		$payload = base64_decode($base64Payload);
		$signature = base64_decode($base64Signature);
		
		// 验证signature
		if (!self::validateSignature($signature, $base64Header, $base64Payload)) {
			// self::log('Signature is invalid.');
			return null;
		}
	
		// 验证过期时间
		//header:expiry
		$expiry = substr($header, 0, 8);
		if (self::isExpired($expiry)) {
			// self::log('Data is expired.');
			return null;
		}
	
		// 验证类型
		//header:type
		$type = substr($header, 8, 1);
		if (!self::isValidType($type)) {
			// self::log('Type is invalid.');
			return null;
		}
	
		// 验证issuerId
		//header:issuerid
		$issuerId = substr($header, 9);
		if (!self::isValidIssuer($issuerId)) {
			// self::log('Issuer is invalid.');
			return null;
		}
	
		// 解密payload获取body信息
		//payload
		$body = self::decrypt($payload);
		if (!$body) {
			return null;
		}
	
		//['id' => xxx, 'un' => 'xxx', 'dis' => 'xxx']
		return json_decode($body, true);
		
	}
	
	// 验证过期时间
	protected static function isExpired($expiry)
	{
		$expiry = unpack('J', $expiry);
		
		$expiry = $expiry[1] / 1000;
		
		// self::log('Expiry : ' . $expiry);
		
		return $expiry + 86400 < time();
	}
	
	// 验证类型
	protected static function isValidType($type)
	{
		$type = unpack('n', "\0" . $type);
		
		$type = $type[1];
		
		// self::log('Type : ' . $type);
		
		return $type === self::TYPE_JSON;
	}
	
	// 验证issuerId
	protected static function isValidIssuer($issuerId)
	{
		$issuerId = unpack('J', $issuerId);
		
		$issuerId = $issuerId[1];
		
		// self::log('IssuerId : ' . $issuerId);
		
		return $issuerId === (int)self::$issuerId;
	}
	
	// 解密payload获取body信息
	protected static function decrypt($payload)
	{
		$aesKey = base64_decode(self::$aesKey);
		$iv = substr($aesKey, 0, 16);
		
		$data = openssl_decrypt($payload, 'AES-256-CBC', $aesKey, OPENSSL_RAW_DATA | OPENSSL_NO_PADDING, $iv);
		
		$dataLen = strlen($data);
		$paddingLen = unpack('n', "\0" . $data[$dataLen - 1]);
		$paddingLen = $paddingLen[1];
		
		$body = substr($data, 8, - $paddingLen - 1);
		
		// self::log('Body : ' . $body);
		
		return $body;
	}
	

	// 解码signature，验证secret key
	protected static function validateSignature($signature, $base64Header, $base64Payload)
	{
		$caculatedSignature = self::sign($base64Header, $base64Payload);
		
		// self::log('Caculated signature (base64 code) : ' . base64_encode($caculatedSignature)
		// 		. ', received signature (base64 code) : ' . base64_encode($signature));
		
		return $caculatedSignature === $signature;
	}
	
	// public static function log($message, $type = 'info', $errno = null, $error = '', $file = null)
	// {
	// 	if (!self::$enableLog) {
	// 		return;
	// 	}
		
	// 	if (!self::$logger) {
	// 		self::$logger = new Log(['logFile' => DIR_LOG . '/' . APP_NAME . '.log']);
	// 	}
		
	// 	return self::$logger->log($message, $type, $errno, $error, $file);
	// }
}