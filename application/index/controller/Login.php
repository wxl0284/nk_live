<?php
namespace app\index\controller;
use think\Response;
use think\Db;
use think\Session;
use think\Cookie;
use PHPMailer\PHPMailer;
use mailer\tp5\Mailer;
/**
 * 设备台账管理
 * Class Subject
 * @package app\index\controller
 */
class Login extends Wx
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(){
        return $this->fetch();
    }

    // 登陆
    public function login_up(){
        $date = $this->request->post();
        $info = Db::name("user")->where(['password' => password_hash_tp($date['password'])])->whereOr(['email'=>$date['phone']])->where(['phone'=>$date['phone']])->find();
        if($info){
            if($info['identity'] != '社会人士'){
                if($info['school']){
                    $school_info = Db::name('school')->where(array('id' => $info['school']))->find();
                    $info['position'] = $school_info['school_name'];
                }else{
                    $info['position'] = '';
                }
            }else{
                if($info['position']){
                    $school_info = Db::name('industry')->where(array('id' => $info['position']))->find();
                    $info['position'] = $school_info['industry_name'];
                }else{
                    $info['position'] = '';
                }
            }
            if($info['province']){
                $school_info = Db::name('region')->where(array('id' => $info['province']))->find();
                $info['province'] = $school_info['province'];
            }else{
                $info['province'] = '';
            }
            if($info){
                session::set('home_user_id',$info['id']);
                session::set('home_info',$info);
                // 记录登录日志
                $log['uid'] = $info['id'];
                $log['login_ip'] = $this->request->ip(0,1);
                $log['login_location'] = implode(" ", \Ip::find($log['login_ip']));
                $log['login_browser'] = \Agent::getBroswer();
                $log['login_os'] = \Agent::getOs();
                Db::name("home_login_log")->insert($log);
                $this->log('【登陆成功！】');
                return json(['code'=>200,'msg'=>"登陆成功！"]);
            }
        }
        return json(['code'=>500,'msg'=>"登陆失败！"]);
    }

    // 退出
    public function logout(){
        //Session::delete('home_user_id');
        //Session::delete('home_info');
        Session::clear();
        $this->redirect('/');
        //return $this->fetch('index');
    }

    // 忘记密码
    public function find_password(){
        return $this->fetch();
    }

    //发送短信验证码
    public function send(){
        $receive = $this->request->post("phone");
        $info = Db::name('user')->where(array('phone' => $receive))->find();
        if(!$info){
            return ajax_return_adv_error('该手机不存在');
        }
        return ajax_return_adv("待开发", '');
    }

    //修改密码
    public function change_password(){
        if($this->request->isPost()){
            $data = $this->request->param();
            Db::name('user')->where(array('id' => Session::get('home_phone')))->update(array('password' => password_hash_tp($data['password'])));
            $info = Db::name('user')->where(array('phone' => Session::get('home_phone')))->whereOr(array('email' => Session::get('home_phone')))->find();
            Db::name('home_log')->insert(array('admin' => $info['name'], 'admin_id' => Session::get('home_user_id'), 'describe' => '【重置密码】', 'ip' => $this->request->ip(), 'time' => date('Y-m-d H:i:s', time())));
            return json(array('code' => 0, 'msg' => '重置成功!'));
        }
    }

    // 发送邮件
    public function send_email(){
        $receive = $this->request->post("email");
        $info = Db::name('user')->where(array('email' => $receive))->find();
        if(!$info){
            return ajax_return_adv_error('该邮箱不存在');
        }
        Session::set('home_phone', $receive);
        $result = $this->validate(
            ['email' => $receive],
            ['email|收件人' => 'require|email']
        );
        if ($result !== true) {
            return ajax_return_adv_error($result);
        }
        $mailer = Mailer::instance();
        $rand = rand(1000,9999);
        $res = $mailer->to($receive)
            ->subject('验证码:'.$rand)
            ->send();
        if ($res == 0) {
            return ajax_return_adv_error($mailer->getError());
        } else {
            return ajax_return_adv("邮件发送成功，请注意查收", '', '', false, '', array('rand' => $rand));
        }
    }
}