<?php
namespace app\index\controller;
use think\Response;
use think\Db;
use think\Session;
use think\Cookie;
/**
 * 用户模块控制器
 * Class Subject
 * @package app\index\controller
 */
class Register extends Wx
{


    //注册
    /*public function index(){
        $region = Db::name("region")->select();
        $this->assign("region",$region);
        $industry = Db::name("industry")->select();
        $this->assign("industry",$industry);
        $school = Db::name("school")->select();
        $this->assign("school",$school);
        return $this->fetch();
    }*/

    //学校
    public function school(){
        $get = $this->request->get();
        $school = Db::name("school")->where(['region_id'=>$get['province']])->select();
        return json(['code'=>200,'result'=>$school]);
    }

    public function register_up(){
        $date = $this->request->post();
        if(empty($date['phone']) || !is_mobile($date['phone'])){
            return json(['code'=>100,'msg'=>"请输入正确的手机号！"]);
        }
        if(empty($date['code'])){
            return json(['code'=>100,'msg'=>"请输入验证码！"]);
        }
        if(empty($date['name'])){
            return json(['code'=>100,'msg'=>"请输入昵称！"]);
        }
        if(empty($date['email']) || !is_email($date['email'])){
            return json(['code'=>100,'msg'=>"请输入正确的邮箱！"]);
        }
        if(!$date['identity']){
            return json(['code'=>100,'msg'=>"请选择身份！"]);
        }
        if(($date['identity'] == '学生' || $date['identity'] == '教师') && !$date['school']){
            return json(['code'=>100,'msg'=>"请选择学校！"]);
        }
        if($date['identity'] == '学生'){
            if(!$date['collect']){
                return json(['code'=>100,'msg'=>"请填写学院！"]);
            }
            if(!$date['major']){
                return json(['code'=>100,'msg'=>"请填写专业！"]);
            }
        }
        if($date['identity'] == '社会人士' && !$date['industry']){
            return json(['code'=>100,'msg'=>"请选择行业！"]);
        }
        if(strlen($date['password']) < 6 || strlen($date['password']) > 64){
            return json(['code'=>100,'msg'=>"请输入正确的密码（6-64位）！"]);
        }
        if(strlen($date['password2']) < 6 || strlen($date['password2']) > 64){
            return json(['code'=>100,'msg'=>"请输入正确的确认密码"]);
        }
        if($date['password'] != $date['password2']){
            return json(['code'=>100,'msg'=>"两次输入的密码不一致！"]);
        }
        if(Db::name("user")->where(['phone'=>$date['phone']])->find()){
            return json(['code'=>100,'msg'=>"该手机号已被注册过！"]);
        }
        if(Db::name("user")->where(['email'=>$date['email']])->find()){
            return json(['code'=>100,'msg'=>"该邮箱已被注册过！"]);
        }
        $data = array(
            "name" => $date['name'],
            "province" => $date['province'],
            "identity" => $date['identity'],
            "school" => $date['school'],
            "unit" => $date['unit'],
            "password" => password_hash_tp($date['password']),
            "position" => $date['industry'],
            "phone" => $date['phone'],
            "email" => $date['email'],
            "create_time" => time(),
            "collect" => $date['collect'],
            "major" => $date['major']
        );
        $user = Db::name("user")->insertGetId($data);
        session::set('home_user_id',$user);
        return json(['code'=>200,'msg'=>"注册成功！"]);
    }


}
