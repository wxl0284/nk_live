<?php
namespace app\country\controller;
use think\Response;
use think\Db;
use think\Cookie;
use think\Session;
use country_api\sdk\IlabJwt;
use country_api\sdk\IlabApi;
use country_api\sdk\IlabClient;
use country_api\sdk\RequestCore;
use country_api\sdk\SdkUtil;

class Test 
{
    public function test ()
    {
        return IlabJwt::TYPE_SYS;
    }

    /*
     send_score_to_state() 给国家平台回传成绩
    */

    protected function send_score_to_state ($param)
    {
        define('ILAB_SERVER_HOST', 'www.ilab-x.com'); //国家平台域名
        
        // 向ilabjwt类中的issuerId、secretKey、aesKey赋值 如下4个值都是国家空间分配给各实验的
        IlabJwt::$issuerId  = $param['issuerId'];
        IlabJwt::$appName   = $param['projectTitle'];
        IlabJwt::$secretKey = $param['secretKey'];
        IlabJwt::$aesKey    = $param['aesKey'];

        $res = IlabApi::log(
            $param['user_un'],
            $param['childProjectTitle'],//子实验名 默认为''
            $param['status'],//是否做完实验
            $param['score'],//成绩
            $param['start'],//开始时刻 13位时间戳
            $param['end'],//结束时刻 13位时间戳
            $param['used_time'],//实验用时 分钟
        );

        //

    }//send_score_to_state 结束

    /*
     accept_score() 接收实验程序提交的实验成绩
     实验程序须用post方法提交这些数据：实验开始和结束的13位时间戳，实验做完用的时间（分钟），成绩值
    */

    public function accept_score ()
    {
        $d = input();

        $user_type = cookie('user_type');//用户类型
        $subject_id = cookie('experiment_id');//实验的id

        if ( $user_type == 1 )//用户类型是1，就回传成绩给国家平台
        {
            $subject = Db::table('tp_subject')->where('id', $subject_id )->field('issuerId, projectTitle, secretKey, aesKey')->find();

            //检查这4个字段是否具备 否则不能上传成绩
            if ( !$subject_id['issuerId'] || !$subject_id['projectTitle'] || !$subject_id['secretKey'] || !$subject_id['aesKey'] )
            {
                return;//不上传成绩
            }else{//上传成绩
                $user = Db::table('tp_user')->where('id', session('home_user_id'))->field('country_un')->find();

                $param = [
                    'issuerId'        => $subject['issuerId'],
                    'projectTitle'    => $subject['projectTitle'],
                    'secretKey'       => $subject['secretKey'],
                    'aesKey'          => $subject['aesKey'],
                    'user_un'            => $user['country_un'],//用户的国家平台账号
                    'childProjectTitle'=> '',
                    'status'          => 1,
                    'score'           => $d['score'],
                    'start'           => $d['start'],
                    'end'             => $d['end'],
                    'used_time'       => $d['used_time'],
                ];

                $this->send_score_to_state($param);
            }//上传成绩结束
            
        }else if( $user_type == 2 || $user_type == 5 )//仅把成绩存入tp_experiment_score表
        {
            $res = Db::table('tp_experiment_score')->where('user_id', session('home_user_id'))->insert(['score'=>$d['score'], 'experiment_id'=>$subject_id]);
        }
    }//accept_score 结束

}