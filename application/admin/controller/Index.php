<?php


//------------------------
// 管理后台首页
//-------------------------

namespace app\admin\controller;

use app\admin\Controller;
use think\Loader;
use think\Session;
use think\Db;

class Index extends Controller
{

    public function index()
    {
        // 读取数据库模块列表生成菜单项
        $nodes = Loader::model('AdminNode', 'logic')->getMenu();
        
        // 节点转为树
        $tree_node = list_to_tree($nodes);
   
        // 显示菜单项
        $menu = [];
        $groups_id = [];
        foreach ($tree_node as $module) {
            if ($module['pid'] == 0 && strtoupper($module['name']) == strtoupper($this->request->module())) {
                if (isset($module['_child'])) {
                    foreach ($module['_child'] as $controller) {
                        $group_id = $controller['group_id'];
                        array_push($groups_id, $group_id);
                        $menu[$group_id][] = $controller;
                    }
                }
            }
        }

        // 获取授权节点分组信息
        $groups_id = array_unique($groups_id);
        if (!$groups_id) {
            // exception("没有权限");
        }
        $groups = Db::name("AdminGroup")->where(['id' => ['in', $groups_id], 'status' => "1"])->order("sort asc,id asc")->field('id,name,icon')->select();

        $this->view->assign('groups', $groups);
        $this->view->assign('menu', $menu);
        
        return $this->view->fetch();
    }

    /**
     * 欢迎页
     * @return mixed
     */
    public function welcome()
    {
        // 查询 ip 地址和登录地点
        if (Session::get('last_login_time')) {
            $last_login_ip = Session::get('last_login_ip');
            $last_login_loc = \Ip::find($last_login_ip);

            $this->view->assign("last_login_ip", $last_login_ip);
            $this->view->assign("last_login_loc", implode(" ", $last_login_loc));

        }
        $current_login_ip = $this->request->ip(0,1);
        $current_login_loc = \Ip::find($current_login_ip);

        $this->view->assign("current_login_ip", $current_login_ip);
        $this->view->assign("current_login_loc", implode(" ", $current_login_loc));

        // 查询个人信息
        $info = Db::name("AdminUser")->where("id", UID)->find();
        $this->view->assign("info", $info);

        return $this->view->fetch();
    }

    /**
     * 清理数据表
     * @return mixed
     */
    public function tableclear()
    {
        //白名单
        $allowList = [
            'tp_admin_access',
            'tp_admin_group',
            'tp_admin_node',
            'tp_admin_node_load',
            'tp_admin_role',
            'tp_admin_role_user',
            'tp_admin_user',
            'tp_node_map',
            'tp_web_log_all',
            // 'tp_web_log_001',
        ];
        $this->view->assign('allowList', $allowList);
        if ($this->request->isAjax()) {
            $data = $this->request->param();
            $tables = $data['tables'];
            $res = [];
            foreach ($tables as $key => $table) {
                // $tableInfo = Db::getTableInfo($table);
                // dump($tableInfo);
                $str = "TRUNCATE TABLE $table";
                Db::execute($str);
                $res[] = $table;
            }
            $res_str = implode('--', $res);
            return ajax_return_adv('清理成功,已清理表'.$res_str);
        }
        $tables = Db::getTables();
        $this->view->assign('tables', $tables);

        return $this->view->fetch();
    }

    public function sessionclear(){
        $url = TEMP_PATH;
        $this->delDir($url);
        return ajax_return_adv('缓存清理成功，需重新登录');
    }
}