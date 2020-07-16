<?php
//namespace sdk;
namespace country_api\sdk;

class SdkUtil
{
    // md5加密
    /**
     * uppercase md5
     * @return string 
     */
    public static function md5($str)
    {
        return strtoupper(md5($str));
    }
    
    /**
     * hmac sha256 with secret key
     * @return string
     */
    public static function hmacSHA256($str, $secret)
    {
        $signature = hash_hmac("sha256", $str, $secret, false);
        return $signature;
    }
    
    // urlencode方法
    /**
     * urlEncode
     * @return string
     */
    public static function urlencode($str)
    {
        return urlencode($str);
    }
    

    // 拼接
    /**
     * @param array assc array of query params like k=v
     * @return string
     */
    public static function buildQuery($params, $prefix = '?')
    {
        ksort($params, SORT_REGULAR);	//compare items normally (don't change types)
        
        $query = '';
        foreach ($params as $k => $v) {
            $v = self::urlencode($v);
            $query .= "&$k=$v";
        }
        $query[0] = $prefix;
        
        return $query;
    }
    
    /**
     * Get canonicalizedHeader string
     * @return string
     */
    public static function canonicalizedXHeader($headers, $headerPrefix)
    {
    	$headerPrefix = strtolower($headerPrefix);
    	
        ksort($headers, SORT_REGULAR);
        
        $xheaderStr = '';
        
        $first = true;
        foreach ($headers as $k => $v) {
        	if (strpos(strtolower($k), $headerPrefix) === 0) { // x-mg- header
        		if ($first === true) {
        			$xheaderStr .= $k . ':' . $v;
        			$first = false;
        		} else {
        			$xheaderStr .= "\n" . $k . ':' . $v;
        		}
        	}
        }
        
        return $xheaderStr;
    }
    
    /**
     * Get canonicalizedPath string
     * @return string
     */
    public static function canonicalizedPath($path, $params = [])
    {
        if ($params !== []) {
            ksort($params, SORT_REGULAR);
            
            $query = '';
            foreach ($params as $k => $v) {
                  $query .= "&$k=$v";	//no urlencode
            }
            $query[0] = '?';
            
            return $path . $query;
        }
        
        return $path;
    }
}

