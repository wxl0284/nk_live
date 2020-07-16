<?php
namespace app\index\controller;
use think\Controller as ThinkController;
use think\Db;
use think\Session;
/**
 * API控制器基类
 * Class BaseController
 * @package app\store\controller
 */
class Controller extends ThinkController
{
    const JSON_SUCCESS_STATUS = 1;
    const JSON_ERROR_STATUS = 0;
    /* @ver $wxapp_id 小程序id */
    protected $wxapp_id;
    const LANG_CH = "ch";
    const LANG_EN = "en";
    /**
     * 基类初始化
     * @throws BaseException
     */
    public function _initialize()
    {
        // 当前小程序id
        //$this->wxapp_id = $this->getWxappId();
        $this->assign('debug', time());

        $system = Db::name("system")->where(['id'=>1])->find();
        $this->assign("system",$system);

        $category = Db::name("category")->where(['parent_id'=>0])->select();
        foreach($category as $key => $val){
            $category[$key]['children'] = Db::name("category")->where(['parent_id'=>$val['id']])->select();
        }
        // echo("<pre>");
        // print_r(json_encode($category));
        $this->assign("subjects",json_encode($category));
    
        
        //$this->assign('debug', strtotime('2018-9-18'));
    }

    /**
     * 返回封装后的 API 数据到客户端
     * @param int $code
     * @param string $msg
     * @param array $data
     * @return array
     */
    protected function renderJson($code = self::JSON_SUCCESS_STATUS, $msg = '', $data = [])
    {
        return compact('code', 'msg', 'url', 'data');
    }

    /**
     * 返回操作成功json
     * @param string $msg
     * @param array $data
     * @return array
     */
    protected function renderSuccess($data = [], $msg = 'success')
    {
        return $this->renderJson(self::JSON_SUCCESS_STATUS, $msg, $data);
    }

    /**
     * 返回操作失败json
     * @param string $msg
     * @param array $data
     * @return array
     */
    protected function renderError($msg = 'error', $data = [])
    {
        return $this->renderJson(self::JSON_ERROR_STATUS, $msg, $data);
    }

    /**
     * 获取post数据 (数组)
     * @param $key
     * @return mixed
     */
    protected function postData($key)
    {
        return $this->request->post($key . '/a');
    }
    //异步下载头像
    public function head_pic(){
        $userid = input("userid");
        _log('userid:'.$userid );
        $avatar = input("avatar");
        _log('avatar:'.$avatar );
        $headpic = 'headpic/user/'.$userid.".png";
        if(!file_exists(WEB_PATH.'headpic')) mkdir(WEB_PATH.'headpic', 0777);
        if(file_exists(WEB_PATH.$headpic)) unlink(WEB_PATH.$headpic);
        if(substr($avatar, -2) == '/0'){
            $avatar = substr($avatar, 0,strlen($avatar)-1)."100";
        }
        $_avatar = curlGet($avatar);
        file_put_contents($headpic, $_avatar);
        db('user')->where(['userid'=>$userid])->update(['avatar'=>$headpic]);
    }

    //$upload_dir上传的目录名
    protected function ectouchUpload($key = '', $upload_dir = 'images', $thumb = false, $width = 220, $height = 220) {
        Vendor("UploadFile");
        $upload = new \UploadFile();
        //设置上传文件大小
        $upload->maxSize = 1024 * 1024 * 50; //最大2M
        //设置上传文件类型
        $upload->allowExts = explode(',', 'jpg,jpeg,gif,png,bmp,mp3,amr,mp4,xls,xlsx');
        //生成缩略图
        $upload->thumb = $thumb;
        //缩略图大小
        $upload->thumbMaxWidth = $width;
        $upload->thumbMaxHeight = $height;

        //设置附件上传目录
        $upload->savePath = './static/attached/' . $upload_dir . "/";

        if (!$upload->upload($key)) {
            //捕获上传异常
            return array('error' => 1, 'message' => $upload->getErrorMsg());
        } else {
            //取得成功上传的文件信息
            return array('error' => 0, 'message' => $upload->getUploadFileInfo());
        }
    }
}
