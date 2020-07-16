<?php
namespace app\admin\controller;

\think\Loader::import('controller/Controller', \think\Config::get('traits_path') , EXT);

use app\admin\Controller;
use think\exception\HttpException;
use think\Loader;
use think\Config;
use think\Db;

class Subject extends Controller
{
    use \app\admin\traits\controller\Controller;
    // 方法黑名单
    protected static $blacklist = [];

    protected function filter(&$map)
    {

        if($_SESSION['think']['type'] == 2){
            $map['teacher_id'] = ["=",$_SESSION['think']['auth_id']];
        }
        if ($this->request->param("cat_id")) {
            $parent_id = Db::name("category")->where(['id'=>$this->request->param("cat_id")])->value("parent_id");
            if($parent_id == 0){
                $category = Db::name("category")->where(['parent_id'=>$this->request->param("cat_id")])->select();
                if($category){
                    $cat_id = [];
                    foreach($category as $key => $val){
                        $cat_id[] = $val['id'];
                    }
                    $cat_id = implode(",",$cat_id);
                    $map['cat_id'] = ["in",$cat_id];
                }else{
                    $map['cat_id'] = ["=", $this->request->param("cat_id")];
                }
            }else{
                $map['cat_id'] = ["=", $this->request->param("cat_id")];
            }
            
        }
        if ($this->request->param("subject_level")) {
            $map['subject_level'] = ["=",$this->request->param("subject_level")];
        }
        if ($this->request->param("subject_name")) {
            $map['subject_name'] = ["like", "%" . $this->request->param("subject_name") . "%"];
        }
        if ($this->request->param("school_name")) {
            $map['school_name'] = ["like", "%" . $this->request->param("school_name") . "%"];
        }
        if ($this->request->param("person_charge")) {
            $map['person_charge'] = ["like", "%" . $this->request->param("person_charge") . "%"];
        }
        if ($this->excel) {
            $this->excel = [];
            $this->excel['header'] = [
                '专业大类',
                '专业分类',
                '项目级别',
                '获奖年份',
                '申报年份',
                '项目名称',
                '学校名称',
                '负责人姓名',
               
            ];
            $this->excel['field'] = function($row) {
                $category = Db::name("category")->where(['id'=>$row['cat_id']])->field("id,cat_name,parent_id")->find();
                $row['cat_name1'] = $category['cat_name'];
                $row['cat_name2'] = Db::name("category")->where(['id'=>$category['parent_id']])->value("cat_name");
                if($row['subject_level'] == 1){
                    $row['subject_level'] = '认定项目';
                }
                if($row['subject_level'] == 2){
                    $row['subject_level'] = '其他项目';
                }

                return [
                    $row['cat_name1'],
                    $row['cat_name2'],
                    $row['subject_level'],
                    $row['award_year'],
                    $row['declare_year'],
                    $row['subject_name'],
                    $row['school_name'],
                    $row['person_charge'],
                ];
            };
            $this->excel['name'] = 'SUBJECT'.date('YmdHis');
        }
        $map['_table'] = 'tp_subject'; // 强制加表名
    }

    /**
    * 添加
    *
    */
    public function add(){
        $controller = $this->request->controller();
        
        if ($this->request->isAjax()) {
            // 插入
            // $data = $this->request->except(['id']);
            //本地测试用  chu()
            $data = input('post.');
            if($data['subject_brief_video'] && !$data['subject_brief_img']){
                return ajax_return_adv_error("请上传项目简介封面！");
            } 
            if($data['subject_lead_video'] && !$data['subject_lead_img']){
                return ajax_return_adv_error("请上传项目引导封面！");
            } 
            $data['teacher_id'] = $_SESSION['think']['auth_id'];
            
            // 验证
            if (class_exists($validateClass = Loader::parseClass(Config::get('app.validate_path'), 'validate', $controller))) {
                $validate = new $validateClass();
                if (!$validate->check($data)) {
                    return ajax_return_adv_error($validate->getError());
                }
            }
          
            // 写入数据
            
            //获得结束时间
            // $data['end_time'] = $this->getEndTime($data['start_time'],$data['plan_cycle'],$data['plan_type']);
            if (
                class_exists($modelClass = Loader::parseClass(Config::get('app.model_path'), 'model', $this->parseCamelCase($controller)))
                || class_exists($modelClass = Loader::parseClass(Config::get('app.model_path'), 'model', $controller))
            ) {
                //使用模型写入，可以在模型中定义更高级的操作
                $model = new $modelClass();
                $ret = $model->isUpdate(false)->save($data);
            } else {
                // 简单的直接使用db写入
                Db::startTrans();
                try {
                    $model = Db::name($this->parseTable($controller));
                    $ret = $model->insert($data);
                    // 提交事务
                    Db::commit();
                } catch (\Exception $e) {
                    // 回滚事务
                    Db::rollback();

                    return ajax_return_adv_error($e->getMessage());
                }
            }

            return ajax_return_adv('添加成功');
        } else {
            return $this->view->fetch(isset($this->template) ? $this->template : 'add');
        }
        
    }

     /**
     * 编辑
     * @return mixed
     */
    public function edit()
    {
        $controller = $this->request->controller();
        if ($this->request->isAjax()) {
            // 更新
            $data = input('post.');
			
            // 验证
            if (class_exists($validateClass = Loader::parseClass(Config::get('app.validate_path'), 'validate', $controller))) {
                $validate = new $validateClass();
                if (!$validate->check($data)) {
                    return ajax_return_adv_error($validate->getError());
                }
            }

            //获得结束时间
            // $data['end_time'] = $this->getEndTime($data['start_time'],$data['plan_cycle'],$data['plan_type']);
            // 更新数据
            if (
                class_exists($modelClass = Loader::parseClass(Config::get('app.model_path'), 'model', $this->parseCamelCase($controller)))
                || class_exists($modelClass = Loader::parseClass(Config::get('app.model_path'), 'model', $controller))
            ) {
                // 使用模型更新，可以在模型中定义更高级的操作
                $model = new $modelClass();
				
				 //检查上传的实验zip文件是否与之前的zip文件不用 如果不同表示是新上传了zip文件
                $old_zip = $model->where('id', $data['id'] )->field('zip_file')->find();

                if ( $old_zip["zip_file"] != $data['zip_file'] ) //新上传了zip文件
                {
                    $data['zip_name_file'] = null;
                }
          
                $ret = $model->isUpdate(true)->save($data, ['id' => $data['id']]);
                
            } else {

                // 简单的直接使用db更新
                Db::startTrans();
                try {
                    $model = Db::name($this->parseTable($controller));
					
					//检查上传的实验zip文件是否与之前的zip文件不用 如果不同表示是新上传了zip文件
					$old_zip = $model->where('id', $data['id'] )->field('zip_file')->find();

					if ( $old_zip["zip_file"] != $data['zip_file'] ) //新上传了zip文件
					{
						$data['zip_name_file'] = null;
					}
                  
                    $ret = $model->where('id', $data['id'])->update($data);
                    // 提交事务
                    Db::commit();
                } catch (\Exception $e) {
                    // 回滚事务
                    Db::rollback();

                    return ajax_return_adv_error($e->getMessage());
                }
            }

            return ajax_return_adv("编辑成功");
        } else {
            // 编辑
            $id = $this->request->param('id');

            if (!$id) {
                throw new HttpException(404, "缺少参数ID");
            }
            $vo = $this->getModel($controller)->find($id);

            if (!$vo) {
                throw new HttpException(404, '该记录不存在');
            }
            $this->view->assign("vo", $vo);
            $this->view->assign("cat_id",$this->request->param("cat_id"));
            return $this->view->fetch();
        }
    }

    //上传视频
    public function uploadVideo(){
        $file = $this->request->file('brief_video');
        $data = model('upload_file')->uploadVideo($file);
        return json($data);
    }
    //上传视频
    public function uploadVideoLead(){
        $file = request()->file('lead_video');
        $data = model('upload_file')->uploadVideo($file);
        return json($data);
    }
    //上传视频
    public function uploadVideoReport(){
        $file = request()->file('report_video');
        $data = model('upload_file')->uploadFile($file);
        return json($data);
    }
    //上传Zip
    public function uploadZip(){
        $file = $this->request->file('file');
        $type = 'zip';
        $path = ROOT_PATH . 'public_html/file/'.$type.'/';

        $file->validate(['ext'=>['xlsx','xls','zip']]);
        if (!$file->check()) {
            return ajax_return_error($file->getError());
        }
        $info = $file->move($path);
        $_info = $file->getInfo('info');
        if (!$info) {
            return ajax_return_error($file->getError());
        }
        $data['name'] = $_info['name'];
        $data['zip_file'] = 'file/'.$type.'/'.$info->getSaveName(); 
        return ['code'=>0,'msg'=>"上传成功！",'data'=>$data];

    }
    public function imports(){

            $file = $this->request->file('file');
            echo("<pre>");
            print_r($file);
            exit;
            $extension = strtolower(pathinfo($file->getInfo('name'), PATHINFO_EXTENSION));
            switch ($extension) {
                case 'xls':
                case 'xlsx':
                    $cate = 4;
                    $type = 'excel';                    
                    break;
                case 'zip':
                    $cate = 5;
                    $type = 'zip';
                    break;                
                default:
                    # code...
                    break;
            }
            $path = ROOT_PATH . 'public_html/file/'.$type.'/';
            $file->validate(['ext'=>['xlsx','xls','zip']]);
            if (!$file->check()) {
                return ajax_return_error($file->getError());
            }
            $info = $file->move($path);
            if (!$info) {
                return ajax_return_error($file->getError());
            }
            $data = 'file/'.$type.'/'.$info->getSaveName(); 
            
            $insert = [
                'cate'     => $type,
                'name'     => $data,
                'original' => $info->getInfo('name'),
                'domain'   => '',
                'type'     => $info->getInfo('type'),
                'size'     => $info->getInfo('size'),
                'mtime'    => time(),
            ];
            Db::name('File')->insert($insert);
            // dump($type);die;
            if (!$this->{$type."_import"}($data)) {
                return ajax_return_error('文件处理错误！');
            }
            return ajax_return([],'成功');    
       
    }
    //截图
    public function capture(){
        if($this->request->isAjax()){
            $img = $this->request->post("img");
            $base64_string= explode(',', $img);
            $data1 = str_replace(' ', '+', $base64_string[1]);
            $data= base64_decode($data1);
            $a = rand(1111,9999);
            $url = "data/attached/img/".time().$a.".png";
            file_put_contents($url, $data); 
            return json($url);
           
        }
    }

    public function deleteforever(){
        if ($this->request->isAjax()) {
            $id = $this->request->param("id");
            Db::name("subject_browse")->where(['subject_id'=>$this->request->param("id")])->delete();
            Db::name("subject_collect")->where(['subject_id'=>$this->request->param("id")])->delete();
            Db::name("subject_evaluate")->where(['subject_id'=>$this->request->param("id")])->delete();
            Db::name("subject_examine")->where(['subject_id'=>$this->request->param("id")])->delete();
            Db::name("subject_like")->where(['subject_id'=>$this->request->param("id")])->delete();
            Db::name("subject_score")->where(['subject_id'=>$this->request->param("id")])->delete();
            Db::name("team_major")->where(['subject_id'=>$this->request->param("id")])->delete();
            $subject = Db::name("subject")->where(['id'=>$this->request->param("id")])->delete();
            if($subject){
                return ajax_return_adv("删除成功");
            }
        }
    }

    public function publish(){
        if ($this->request->isAjax()) {
            $id = $this->request->param("id") ? $this->request->param("id") : 0;
            $status = $this->request->param("status") ? $this->request->param("status") : 0;
            if($status == 1){
                $data = array(
                    "status" =>1,
                    "admin_id" => $_SESSION['think']['auth_id'],
                    "status_time" => time()
                );
                Db::name("subject")->where(['id'=>$id])->update($data);
                return ajax_return_adv("发布成功！");
            }else{
                $data = array(
                    "status" =>2,
                    "admin_id" => $_SESSION['think']['auth_id'],
                    "status_time" => time()
                );
                Db::name("subject")->where(['id'=>$id])->update($data);
                return ajax_return_adv("撤销成功！");
            }
            
        }
    }

    public function info(){
        $id = $this->request->param("id") ? $this->request->param("id") : 0;
        $controller = $this->request->controller();
        $vo = $this->getModel($controller)->find($id);
        $vo['cat_name'] = Db::name("category")->where(['id'=>$vo['cat_id']])->value("cat_name");
        if (!$vo) {
            throw new HttpException(404, '该记录不存在');
        }
        $this->view->assign("vo", $vo);
        return $this->view->fetch();
    }

}
