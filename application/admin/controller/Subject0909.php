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
        if($this->request->param("type") == 2){
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
          
                $ret = $model->isUpdate(true)->save($data, ['id' => $data['id']]);
                
            } else {


                // 简单的直接使用db更新
                Db::startTrans();
                try {
                    $model = Db::name($this->parseTable($controller));
                    //保存修改记录
                    // Db::name('purchase_modify_log')->add([
                    //     ''
                    // ]);
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
            $data = array(
                "status" =>1,
                "admin_id" => $_SESSION['think']['auth_id'],
                "status_time" => time()
            );
            Db::name("subject")->where(['id'=>$id])->update($data);
            return ajax_return_adv("发布成功！");
        }
    }

}
