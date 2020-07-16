<?php
namespace app\admin\controller;

\think\Loader::import('controller/Controller', \think\Config::get('traits_path') , EXT);

use app\admin\Controller;
use think\exception\HttpException;
use think\Loader;
use think\Config;
use think\Db;

class Banner extends Controller
{
    use \app\admin\traits\controller\Controller;
    // 方法黑名单
    protected static $blacklist = [];

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
            return $this->view->fetch();
        }
    }

    //上传视频
    public function uploadVideo(){
        $file = $this->request->file('lead_video');
        $data = model('upload_file')->uploadVideo($file);
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

    
}
