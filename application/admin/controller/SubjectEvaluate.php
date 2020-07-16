<?php
namespace app\admin\controller;

\think\Loader::import('controller/Controller', \think\Config::get('traits_path') , EXT);

use app\admin\Controller;
use think\Db;

class SubjectEvaluate extends Controller
{
    use \app\admin\traits\controller\Controller;
    // 方法黑名单
    protected static $blacklist = [];

    protected static $isdelete = false;

    protected function filter(&$map)
    {
        if ($this->request->param("subject_name")) {
            $map['_model'] = $this->getModel()::hasWhere('subject',['subject_name'=>["like", "%" . $this->request->param("subject_name") . "%"]]);
        }
        if ($this->excel) {
            $this->excel = [];
            $this->excel['header'] = [
                '项目名称',
                '评价用户',
                '评价日期',
                '评价内容'
            ];
            $this->excel['field'] = function($row) {
                $subject_name = Db::name("subject")->where(['id'=>$row['subject_id']])->value("subject_name");
                $name = Db::name("user")->where(['id'=>$row['user_id']])->value("name");
                return [
                    $subject_name,
                    $name,
                    date("Y-m-d H:i:s",$row['create_time']),
                    $row['content']
                ];
            };
            $this->excel['name'] = 'SubjectEvaluate'.date('YmdHis');
        }
 
        $map['_order_by'] = 'id desc';
    }

    
}
