<?php


//------------------------
// 节点快速导入控制器
//-------------------------

namespace app\admin\controller;

\think\Loader::import('controller/Controller', \think\Config::get('traits_path') , EXT);

use app\admin\Controller;

class AdminNodeLoad extends Controller
{
    use \app\admin\traits\controller\Controller;

    protected static $isdelete = false;

    protected static $blacklist = ['delete', 'recycle'];

    protected function filter(&$map)
    {
        if ($this->request->param('title')) {
            $map['title'] = ["like", "%" . $this->request->param('title') . "%"];
        }
        if ($this->request->param('name')) {
            $map['name'] = ["like", "%" . $this->request->param('name') . "%"];
        }
    }
}
