<?php
/**
 * tpAdmin [a web admin based ThinkPHP5]
 *
 * @author    yuan1994 <tianpian0805@gmail.com>
 * @link      http://tpadmin.yuan1994.com/
 * @copyright 2016 yuan1994 all rights reserved.
 * @license   http://www.apache.org/licenses/LICENSE-2.0
 */

namespace app\admin\traits\controller;

use think\Db;
use think\Loader;
use think\exception\HttpException;
use think\Config;
use app\common\model\Equipment as ModelEquipment;

trait Controller
{
    /**
     * 首页
     * @return mixed
     */
    public function index()
    {
        $model = $this->getModel();

        // 列表过滤器，生成查询Map对象
        $map = $this->search($model, [$this->fieldIsDelete => $this::$isdelete]);

        // 特殊过滤器，后缀是方法名的
        $actionFilter = 'filter' . $this->request->action();
        if (method_exists($this, $actionFilter)) {
            $this->$actionFilter($map);
        }

        // 自定义过滤器
        if (method_exists($this, 'filter')) {
            $this->filter($map);
        }

        // 生成excel表
        $excel = $this->excel;
        //生成云图
        // $nephogram = $this->nephogram;
        //导出
        if ($excel) {
            if (empty($excel['header']) || empty($excel['name']) || empty($excel['field'])) {
                throw new Exception('excel缺少参数');
            }
            $res = $this->datalist($model, $map, null, '', false, true, false);
            if ($res) {
                $data = [];
                foreach ($res as $row) {
                    $data[] = $excel['field']($row);
                }
                // 生成excel
                if ($error = \Excel::export($excel['header'], $data, $excel['name'], '2007')) {
                    throw new Exception($error);
                }
            }
        } 
        //云图
        // else if($nephogram){
        //     $res = $this->datalist($model, $map, null, '', false, true, false);
        //     $this->assign('res',$res);
        //     $json_res = json_encode($res,true);
        //     $this->assign('json_res',$json_res);
        // }
        else {
            $this->datalist($model, $map);
        } 

        return $this->view->fetch();
    }

    /**
     * 生成excel
     */
    public function excel()
    {
        $this->excel = true;
        return $this->index();
    }

    /**
     * 回收站
     * @return mixed
     */
    public function recycleBin()
    {
        $this::$isdelete = 1;

        return $this->index();
    }

    /**
     * 本地测试用
     * 去除数据中键的值
     * @param array             $data 数据
     * @param string|array      $type 数据的键
     * @return array
    */
    public function chu($data,$jian){
        if (is_string($jian)) {
            $jian = explode(',',$jian);
        }
        foreach ($jian as $v) {
            if (isset($data[$v])) {
                unset($data[$v]);
            }
        }
        return $data;
    }

    /**
     * 添加
     * @return mixed
     */
    public function add()
    {
        $controller = $this->request->controller();

        if ($this->request->isAjax()) {
            // 插入
            // $data = $this->request->except(['id']);
            //本地测试用  chu()
            $data = input('post.');
            $data = $this->chu($data,['id']);

            // 验证
            if (class_exists($validateClass = Loader::parseClass(Config::get('app.validate_path'), 'validate', $controller))) {
                $validate = new $validateClass();
                if (!$validate->check($data)) {
                    return ajax_return_adv_error($validate->getError());
                }
            }

            // 写入数据
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
            // 添加
            return $this->view->fetch(isset($this->template) ? $this->template : 'edit');
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
            $data = $this->request->post();
            if (!$data['id']) {
                return ajax_return_adv_error("缺少参数ID");
            }

            // 验证
            if (class_exists($validateClass = Loader::parseClass(Config::get('app.validate_path'), 'validate', $controller))) {
                $validate = new $validateClass();
                if (!$validate->check($data)) {
                    return ajax_return_adv_error($validate->getError());
                }
            }

        

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

    /**
     * 展示 zhitian add
     * @return mixed
     */
    public function show()
    {
        $controller = $this->request->controller();
        
        // 展示
        $id = $this->request->param('id');
        if (!$id) {
            throw new HttpException(404, "缺少参数ID");
        }
        if (method_exists($this, 'my_show')) { // 自定义方法
            $res = $this->my_show($id);
            if($res){
                return $res;
            }
        } else {
            $vo = $this->getModel($controller)->find($id);
            if (!$vo) {
                throw new HttpException(404, '该记录不存在');
            }

            $this->view->assign("vo", $vo);
        }

        return $this->view->fetch();
    }

    /**
     * 默认删除操作
     */
    public function delete()
    {
        return $this->updateField($this->fieldIsDelete, 1, "移动到回收站成功");
    }

    /**
     * 从回收站恢复
     */
    public function recycle()
    {
        return $this->updateField($this->fieldIsDelete, 0, "恢复成功");
    }

    /**
     * 默认禁用操作
     */
    public function forbid()
    {
        return $this->updateField($this->fieldStatus, 0, "禁用成功");
    }


    /**
     * 默认恢复操作
     */
    public function resume()
    {
        return $this->updateField($this->fieldStatus, 1, "恢复成功");
    }


    /**
     * 永久删除
     */
    public function deleteForever()
    {
        $model = $this->getModel();
        $pk = $model->getPk();
        $ids = $this->request->param($pk);
        $where[$pk] = ["in", $ids];
        if (false === $model->where($where)->delete()) {
            return ajax_return_adv_error($model->getError());
        }

        return ajax_return_adv("删除成功");
    }

    /**
     * 清空回收站
     */
    public function clear()
    {
        $model = $this->getModel();
        $where[$this->fieldIsDelete] = 1;
        if (false === $model->where($where)->delete()) {
            return ajax_return_adv_error($model->getError());
        }

        return ajax_return_adv("清空回收站成功");
    }

    /**
     * 保存排序
     */
    public function saveOrder()
    {
        $param = $this->request->param();
        if (!isset($param['sort'])) {
            return ajax_return_adv_error('缺少参数');
        }

        $model = $this->getModel();
        foreach ($param['sort'] as $id => $sort) {
            $model->where('id', $id)->update(['sort' => $sort]);
        }

        return ajax_return_adv('保存排序成功', '');
    }

    /**
     * 文件导入
     * @return mixed
     */
    public function import($step = 0){
        if ($this->request->isPost()) {
           
            $file = $this->request->file('file');

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
            $file->validate(['ext'=>['xlsx','xls','zip'],'size'=>1024*1024*50]);
            if (!$file->check()) {
                return ajax_return_error($file->getError());
            }
            $info = $file->move($path);
            if (empty($info)) {
                return ajax_return_error($file->getError());
            }
            $data = 'file/'.$type.'/'.$info->getSaveName(); 
            $insert = [
                'cate'     => $cate,
                'name'     => $data,
                'original' => $info->getInfo('name'),
                'domain'   => '',
                'type'     => $info->getInfo('type'),
                'size'     => $info->getInfo('size'),
                'mtime'    => time(),
            ];
            // dump($insert);
            // exit;
            ///Db::name('File')->insert($insert);
           //  dump($type);die;
            if (!$this->{$type."_import"}($data,$step)) {
                return ajax_return_error('文件处理错误！');
            }
            return ajax_return([],'成功');    
        }else{

            return $this->view->fetch();
        }
    }

    /**
     * 处理excel
     * @return mixed
     */
    public function excel_import($file,$step){
        // dump("11");
        // 通过文件上传，然后取到上传后的完整路径文件名
        // $file = 'demo.xlsx';
        // 解析 Excel 头部信息，返回 $excelHeader = ['A' => '第一行A列描述', 'B' => '第一行B列描述', 'C' => '第一行C列描述',...]
       //  $excelHeader = \Excel::parse($file);
       // // dump("11");
       //  dump($excelHeader);die;

        // 将 $excelHeader 数据抛给前端，让用户选择对应关系，然后再返回给后台进行对应数据的解析，例如抛给后台的数据如下
        // array(10) {
            //   ["A"] =&gt; string(12) "产品名称"
            //   ["B"] =&gt; string(12) "产品代码"
            //   ["C"] =&gt; string(6) "类别"
            //   ["D"] =&gt; string(6) "颜色"
            //   ["E"] =&gt; string(6) "材质"
            //   ["F"] =&gt; string(14) "尺寸（mm）"
            //   ["G"] =&gt; string(13) "容积（l）"
            //   ["H"] =&gt; string(6) "品牌"
            //   ["I"] =&gt; string(12) "天猫链接"
            //   ["J"] =&gt; string(12) "京东链接"
            // }
        if($step == 1){
            $header = ['A' => 'equip_name', 'B' => 'equip_num', 'C' => 'equip_factory_num', 'D' => 'equip_model', 'E' => 'equp_supplier', 'F' => 'buying_time', 'G' => 'remarks'];
            $result = \Excel::parse($file, $header,2, 1, function ($data){
                /**
                 * 可以在此处对数据进行过滤处理，例如：
                 */
                foreach ($data as &$v) {
                    // 从 Excel 里直接解析出来的时间无法使用，需要进行转化，\Excel::excelTime($date, $time=false) 可以将解析出的时间转为为标准时间格式 Y-m-d，如果 $time=true，则解析出来为 Y-m-d H:i:s 格式的时间，如果需要转化为时间戳再次使用 strototime 就 OK 了
                    $equip_num = Db::name("equipment")->where(['equip_factory_num'=>$v['equip_factory_num']])->find();
                    if(!$equip_num){
                        $v['create_time'] = time();
                        $v['buying_time'] = strtotime(\Excel::excelTime($v['buying_time'], $time=false));
                        Db::name('equipment')->insert($v);
                    }
                }
            });
        }else{
            $header = ['A' => 'number', 'B' => 'matter', 'C' => 'purchase_name', 'D' => 'specification', 'E' => 'unit_measure', 'F' => 'quantity_number', 'G' => 'amount_number', 'H' => 'route_number', 'I' => 'purchase_quantity', 'J' => 'plan_unit_price','K' => 'plan_price','L' => 'supply_commodity','M' => 'feed_basis', 'N' => 'quantity_standard','O' => 'remarks','P' => 'purchase_type','Q' => 'userid','R' => 'supply_commodity'];
            $result = \Excel::parse($file, $header, 4,1, function ($data) {

                /**
                 * 可以在此处对数据进行过滤处理，例如：
                 */
                foreach ($data as &$v) {
                    // 从 Excel 里直接解析出来的时间无法使用，需要进行转化，\Excel::excelTime($date, $time=false) 可以将解析出的时间转为为标准时间格式 Y-m-d，如果 $time=true，则解析出来为 Y-m-d H:i:s 格式的时间，如果需要转化为时间戳再次使用 strototime 就 OK 了
                    
                    if($v['purchase_name']){
                        if($v['purchase_type'] == '设备采购'){
                            $v['purchase_type'] = 1;
                        }
                        if($v['purchase_type'] == '耗材采购'){
                            $v['purchase_type'] = 2;
                        }
                        $v['purchase_num'] =date("Ymd",time());
                        $v['create_time'] = time();
                        $v['applicant'] = $_SESSION['think']['userid'];
                        $v['supply_commodity'] = strtotime(\Excel::excelTime($v['supply_commodity'], $time=false));
                        Db::name('purchase')->insert($v);
                    }
                }
            });
        }
        
        
           // exit;
        if ($result) {
            return true;
        }
        return false;
    }

    /**
     * 处理zip
     * @return mixed
     */
    public function zip_import($image){
        $zip = new \ZipArchive;
        $res = $zip->open($image);
        if ($res === TRUE) {
            //解压缩
            $path = ROOT_PATH . 'public_html/tmp/decompression/'.date('YmdHis',time()); // 解压缩目录
            $e_res = $zip->extractTo($path);
            $zip->close();
            @unlink($image);

            // 遍历并处理文件
            $code_array = Db::name('product')->column('code');
            $this->img_import($path, $code_array);
            return true;
        } 
        return false;
    }

    /**
     * 遍历并处理图片
     */
    function img_import($path, $code_array) {
        set_time_limit(600);
        $filelist = scandir($path);
        // 去掉.和..
        $res1 = array_search('.', $filelist);
        if ($res1!==false && $res1!==null) unset($filelist[$res1]);
        $res2 = array_search('..', $filelist);
        if ($res2!==false && $res2!==null) unset($filelist[$res2]);
        asort($filelist);
        foreach ($filelist as $sub_file) { // 遍历
            $sub_file_path = $path.DS.$sub_file;
            if (is_dir($sub_file_path)) { // 查询文件名在product表中是否存在
                if (in_array($sub_file, $code_array)) {
                    $filelist_code = scandir($sub_file_path);
                    // 去掉.和..
                    $res1_code = array_search('.', $filelist_code);
                    if ($res1_code!==false && $res1_code!==null) unset($filelist_code[$res1_code]);
                    $res2_code = array_search('..', $filelist_code);
                    if ($res2_code!==false && $res2_code!==null) unset($filelist_code[$res2_code]);
                    if (!empty($filelist_code)) {
                        $pic_path = str_replace('/www/web/xtl_china_wdcp_com/public_html', '', $sub_file_path);
                        // dump($sub_file_path);die;
                        $pic = $pic_path.DS.implode(','.$pic_path.DS, $filelist_code);
                        Db::name('product')->where('code',$sub_file)->update(['pic'=>$pic,'content'=>$pic]);
                    }
                }else{
                    $this->img_import($sub_file_path, $code_array);                   
                }
            }
        }
    }
}
