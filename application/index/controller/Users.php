<?php
namespace app\index\controller;

\think\Loader::import('controller/Controller', \think\Config::get('traits_path') , EXT);

\think\Loader::import('controller/Jump', TRAIT_PATH, EXT);
use app\common\model\Redis;

use think\Loader;
use think\Session;
use think\Db;
use think\Config;
use app\admin\Controller;

class Users extends Wx
{

    // 方法黑名单
    protected static $blacklist = [];

    protected $config = [];

    public function __construct()
    {
        parent::__construct();

        $this->config = [
            'token'=>"", //填寫應用接口的Token
            'encodingaeskey'=>"", //填寫加密用的EncodingAESKey
            'appid'=>"ww22806caa18113fb0", //填寫高級調用功能的app id
            'appsecret'=>'bW9F6prj9bb6EGYOEUmrm-WIWi5SYk4-d0hXaC2ky1w', //填寫高級調用功能的密鑰
            'agentid'=>0,
            'debug'=>true, //調試開關
            'logcallback'=>'log', //調試輸出方法，需要有壹個string類型的參數
        ];
    }

    public function synchro(){
       
    	$import_no = $this->request->get("import_no");
        $import_key = $this->request->get("import_key") > 0 ? $this->request->get("import_key") : 0;
        $model = new Redis();
        // if(!$import_no){
        //     if(!Db::name("department")->select()){
        //         $this->error("请先同步部门！");
        //     }
            Vendor("wechat.Qywechat");
            $wechat = new \Qywechat($this->config);
            $list = $wechat->getUserListInfo(1,1);//群光集团是1
       
            if ($list['errcode'] != 0) {
                $this->error($list['errmsg']);
            }
            $import_no = date("YmdGis", time());
            echo("<pre>");
            print_r($list['userlist'][0]);
            $model->setValue("addr" . $import_no, 0, $list['userlist'][0]);
        //     if($list['userlist']){
        //         foreach ($list['userlist'] as $key => $val) {
        //              $model->setValue("addr" . $import_no, $key, $val);
        //         }
        //     }
        // }
        $i_count = 0;
        $icount = 0;
        $keys = $model->getKeys("addr" . $import_no);
        echo("<pre>");
        print_r($keys);

        if($keys){
            foreach ($keys as $key => $val) {
                $getData = $model->getValue("addr" . $import_no, $val);
                if ($getData) {
                    echo("<pre>");
                    print_r($getData);

                    // if($getData['name']){
                    //     $setData['nickname'] = removeSpecialCharacters($getData['name']);
                    // }
                    

                    // if($dep = Db::name("department")->where(['dept_id'=>$getData['department'][0]])->find()) {
                    //     $setData['department_id'] = $dep['dept_id']; 
                    //     $setData['department_name'] = $dep['dept_name'];
                    // }
                    // $setData['mobile'] = $getData['mobile']; 
                    // $setData['gender'] = $getData['gender'];
                    // $setData['email'] = $getData['email'];
                    // $where = array();
                    // $where['userid'] = $getData['userid'];
                    // $rs = DB::name("user")->where($where)->find();
                    // $setData['userid'] = $getData['userid']; 
                    // $setData['position'] = $getData['position'];
                    // $setData['avatar'] = $getData['avatar'];
                   
                    // if (empty($rs)) {
                         
                    //     $setData['status'] = -1;
                    //     $setData['errmsg'] = "同步新增";
                    //     $setData['create_time'] = time();
                    //     DB::name("user")->insert($setData);
                    // } 
                    // else {
                    //     if($dep = Db::name("department")->where(['dept_id'=>$getData['department'][0]])->find()) {
	                   //      $setData['department_id'] = $dep['dept_id']; 
                    //         $setData['department_name'] = $dep['dept_name'];
	                   //  }
                    //     $setData['errmsg'] = "同步修改";
                    //     $setData['update_time'] = time();
                    //     DB::name("user")->where($where)->update($setData);
                    // }
                    // $model->del("addr" . $import_no, $val);
                    //++$icount;
                }
                // if($i_count > 500){
                //     $this->success("同步".($import_key*500)."条", 'index&import_no='.$import_no."&import_key=".++$import_key);
                // }
                // $i_count++;
            }
        }
        //$this->success("同步通讯录成功！", url('index'));

    }

    protected function filter(&$map)
    {
        
        if ($this->request->param("nickname")) {
            $map['nickname'] = ["like", "%" . $this->request->param("nickname") . "%"];
        }
        
        if ($this->excel) {
            $this->excel = [];
            $this->excel['header'] = [];
            $this->excel['field'] = function($row) {
                
                return [
                    
                ];
            };
            $this->excel['name'] = "";
        }
        $map['_table'] = 'tp_user'; // 强制加表名
    }

    
}
