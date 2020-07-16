<?php
namespace app\admin\controller;

\think\Loader::import('controller/Controller', \think\Config::get('traits_path') , EXT);

use app\admin\Controller;

class HomeLog extends Controller
{
    use \app\admin\traits\controller\Controller;
    // 方法黑名单
    protected static $blacklist = [];

    protected static $isdelete = false;

    protected function filter(&$map)
    {
        if ($this->request->param("id")) {
            $map['id'] = ["like", "%" . $this->request->param("id") . "%"];
        }
        if ($this->request->param("admin")) {
            $map['admin'] = ["like", "%" . $this->request->param("admin") . "%"];
        }
        if ($this->request->param("admin_id")) {
            $map['admin_id'] = ["like", "%" . $this->request->param("admin_id") . "%"];
        }
        if ($this->request->param("describe")) {
            $map['describe'] = ["like", "%" . $this->request->param("describe") . "%"];
        }
        if ($this->request->param("ip")) {
            $map['ip'] = ["like", "%" . $this->request->param("ip") . "%"];
        }
        if ($this->request->param("time")) {
            $map['time'] = ["like", "%" . $this->request->param("time") . "%"];
        }
    }
}
