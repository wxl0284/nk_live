<?php
/**
 * Created by PhpStorm.
 * User: 97318
 * Date: 2017/3/9 0009
 * Time: 15:16
 */
class WeChatHttp{

    private $Host='https://qyapi.weixin.qq.com/cgi-bin';
    private $appId='';
    private $appsecret='';

    function __construct()
    {

    }

    /**
     * @param $data
     * @return mixed
     */
    public function updateUser($data)
    {
        if (!empty($this->Host)) {
            $userUp=$this->https($this->urlFo('/user/update?access_token='),$data,"POST");
        }
        return json_decode($userUp,true);
    }

    /**
     * @return mixed
     */
    public function listDepartment()
    {

        $list=$this->https($this->urlFo('/department/list?access_token='));
        return json_decode($list,true);
    }

    /**
     * @param $data
     * @return mixed
     */
    public function setDepartment($data)
    {

        $list=$this->https($this->urlFo('/department/create?access_token='),$data,"POST");
        return json_decode($list,true);
    }

    /**
     *获取标签列表
     */
    public function tagList()
    {
        $list=$this->https($this->urlFo('/tag/list?access_token='),array(),"GET");
        return json_decode($list,true);
    }

    /**
     * 添加标签
     * @param $tagname
     * @return mixed
     */
    public function tagAdd($tagname){
        $info=$this->https($this->urlFo('/tag/create?access_token='),array('tagname'=>$tagname),"POST");
        return json_decode($info,true);
    }

    /**
     * @param $data
     * @return mixed
     */
    public function tagAddUser($data)
    {
        $info=$this->https($this->urlFo('/tag/addtagusers?access_token='),$data,"POST");
        return json_decode($info,true);
    }

    /**
     *删除标签成员
     */
    public function tagDel($data)
    {
        $info=$this->https($this->urlFo('/tag/deltagusers?access_token='),$data,'POST');
        return json_decode($info,true);
    }
    /**
     * 删除标签
     * @param $TAGID
     * @return mixed
     */
    public function tagsDel($TAGID)
    {
        $info=$this->https($this->urlFo('/tag/delete?tagid='.$TAGID.'&access_token='));
        return json_decode($info,true);
    }

    public function userList($DEPARTMENT_ID)
    {
//        set_time_limit(0);
//        ini_set("memory_limit","2048M");
        $info=$this->https($this->urlFo("/user/list?department_id=$DEPARTMENT_ID&fetch_child=1&status=1&access_token="));
        //var_dump($info);
        return json_decode($info,true);
        //        return S('userList',json_decode($info,true));//json_decode($info,true);
    }
    public function userDel($USERID)
    {
        $info=$this->https($this->urlFo("/user/delete?userid=$USERID&access_token="));
        return json_decode($info,true);
    }
    public function userbatchdelete($data)
    {
//        var_dump($data);
        $info=$this->https($this->urlFo("/user/batchdelete?access_token="),$data,"POST");
        return json_decode($info,true);
    }
    //添加用户
    public function addUser($data)
    {
        $info=$this->https($this->urlFo("/user/create?access_token="),$data,"POST");
        return json_decode($info,true);
    }

    /**
     * 获取企业号登录用户信息
     * @param $auth_code
     * @return mixed
     */
    public function login_info($auth_code,$ACCESS_TOKEN)
    {
        $info=$this->https($this->Host.'/service/get_login_info?access_token='.$ACCESS_TOKEN,array('auth_code'=>$auth_code),"POST");
        return json_decode($info,true);
    }
    /**
     * 获取企业号登录用户信息
     * @param $auth_code
     * @return mixed
     */
    public function login_wid($auth_code,$ACCESS_TOKEN)
    {
//        var_dump($this->Host.'/user/getuserinfo?access_token='.$ACCESS_TOKEN.'&code='.$auth_code);
        $info=$this->https($this->Host.'/user/getuserinfo?access_token='.$ACCESS_TOKEN.'&code='.$auth_code,array(),"GET");
        return json_decode($info,true);
    }
    /**
     * 获取企业号登录用户信息
     * @param $auth_code
     * @return mixed
     */
    public function getUser($USERID,$ACCESS_TOKEN)
    {
        $info=$this->https($this->Host.'/user/get?access_token='.$ACCESS_TOKEN.'&userid='.$USERID,array(),"POST");
        return json_decode($info,true);
    }
    /**
     * 获取企业号登录用户信息
     * @param $auth_code
     * @return mixed
     */
    public function gettoken($corpid,$secrect)
    {
        $info=$this->https($this->Host."/gettoken?corpid=$corpid&corpsecret=$secrect",array(),"GET");
        return json_decode($info,true);
    }
    /**
     * 获取企业号登录用户信息
     * @param $auth_code
     * @return mixed
     */
    public function message($data,$cid)
    {
        $info=$this->https($this->urlFo("/message/send?access_token=",$cid),$data,"POST");
        return json_decode($info,true);
    }
    
    public function getCache(){
        $access_token=session('access_token');
        return array('access_token'=>$access_token);
    }
    public function remCache(){
        S('access_token',null);
//        return array('refresh_token'=>$refresh_token,'access_token'=>$access_token);
    }

    private function urlFo($url,$cid='')
    {
        $access_token=session('access_token'.$cid);
        return $this->Host.$url.$access_token;
    }
    private function https($url, $data=array(), $method='GET'){
        set_time_limit(0);
        $curl = curl_init(); // 启动一个CURL会话
        curl_setopt($curl, CURLOPT_URL, $url); // 要访问的地址
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); // 对认证证书来源的检查
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false); // 从证书中检查SSL加密算法是否存在
//        curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']); // 模拟用户使用的浏览器
        curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36");
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
        curl_setopt($curl, CURLOPT_AUTOREFERER, 1); // 自动设置Referer
        if($method=='POST'){
            curl_setopt($curl, CURLOPT_POST, 1); // 发送一个常规的Post请求
            if ($data != ''){
                curl_setopt($curl, CURLOPT_POSTFIELDS, $this->encode_json($data)); // Post提交的数据包
            }
        }
        curl_setopt($curl, CURLOPT_TIMEOUT, 3000); // 设置超时限制防止死循环
        curl_setopt($curl, CURLOPT_HEADER, 0); // 显示返回的Header区域内容
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); // 获取的信息以文件流的形式返回
        $tmpInfo = curl_exec($curl); // 执行操作
        curl_close($curl); // 关闭CURL会话
//        var_dump($tmpInfo);
        return $tmpInfo; // 返回数据
    }
    private function encode_json($str) {
        return urldecode(json_encode($this->url_encode($str)));
    }
    private function url_encode($str) {
        if(is_array($str)) {
            foreach($str as $key=>$value) {
                $str[urlencode($key)] = $this->url_encode($value);
            }
        } else {
            $str = urlencode($str);
        }

        return $str;
    }
}