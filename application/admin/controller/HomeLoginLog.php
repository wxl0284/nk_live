<?php
/**
 * tpAdmin [a web admin based ThinkPHP5]
 *
 * @author yuan1994 <tianpian0805@gmail.com>
 * @link http://tpadmin.yuan1994.com/
 * @copyright 2016 yuan1994 all rights reserved.
 * @license http://www.apache.org/licenses/LICENSE-2.0
 */

//------------------------
// 登录日志控制器
//-------------------------

namespace app\admin\controller;

\think\Loader::import('controller/Controller', \think\Config::get('traits_path') , EXT);

use think\Session;
use think\Db;
use think\Config;
use app\admin\Controller;
use app\common\model\HomeLoginLog as ModelLoginLog;
use app\common\model\AdminUser as ModelAdminUser;

class HomeLoginLog extends Controller
{
//    use \app\admin\traits\controller\Controller;

    protected static $isdelete = false; //禁用该字段

    protected static $blacklist = ['add', 'edit', 'delete', 'deleteforever', 'forbid', 'resume', 'recycle', 'recyclebin', 'clear'];

    public function index()
    {
//        $model = $this->getModel();
//
//        // 列表过滤器，生成查询Map对象
//        $map = $this->search($model, [$this->fieldIsDelete => $this::$isdelete]);
//
//        // 特殊过滤器，后缀是方法名的
//        $actionFilter = 'filter' . $this->request->action();
//        if (method_exists($this, $actionFilter)) {
//            $this->$actionFilter($map);
//        }
//
//        // 自定义过滤器
//        if (method_exists($this, 'filter')) {
//            $this->filter($map);
//        }
//
//        // 生成excel表
//        $excel = $this->excel;
//        //生成云图
//        // $nephogram = $this->nephogram;
//        //导出
//        if ($excel) {
//            if (empty($excel['header']) || empty($excel['name']) || empty($excel['field'])) {
//                throw new Exception('excel缺少参数');
//            }
//            $res = $this->datalist($model, $map, null, '', false, true, false);
//            if ($res) {
//                $data = [];
//                foreach ($res as $row) {
//                    $data[] = $excel['field']($row);
//                }
//                // 生成excel
//                if ($error = \Excel::export($excel['header'], $data, $excel['name'], '2007')) {
//                    throw new Exception($error);
//                }
//            }
//        }
//        //云图
//        // else if($nephogram){
//        //     $res = $this->datalist($model, $map, null, '', false, true, false);
//        //     $this->assign('res',$res);
//        //     $json_res = json_encode($res,true);
//        //     $this->assign('json_res',$json_res);
//        // }
//        else {
//            $this->datalist($model, $map);
//        }

        $where = [];
        $data = $this->request->param();
        if(array_key_exists('account', $data)){
            $where['u.name'] = ['like', '%'.$data['account'].'%'];
        }

        $listRows = $this->request->param('numPerPage') ?: Config::get("paginate.list_rows");
        $list = Db::name('home_login_log')
            ->alias('h')
            ->join('user u','h.uid=u.id')
            ->field('h.*,u.name')
            ->where($where)
            ->order('id desc')
            ->paginate($listRows, false, ['query' => $this->request->get()]);

        $this->view->assign('list', $list);
        $this->view->assign("count", $list->total());
        $this->view->assign("page", $list->render());
        $this->view->assign('numPerPage', $list->listRows());

        return $this->view->fetch();
    }

    protected function filter(&$map)
    {
        if ($this->request->param('login_location')) {
            $map['login_location'] = ["like", "%" . $this->request->param('login_location') . "%"];
        }

        // 关联筛选
        if ($this->request->param('name')) {
            $map['user.name'] = ["like", "%" . $this->request->param('name') . "%"];
        }
//        if ($this->request->param('name')) {
//            $map['user.realname'] = ["like", "%" . $this->request->param('name') . "%"];
//        }
        $admin_id = Session::get('auth_id');
        if ($admin_id > 1) {
            $map['uid'] = ['=', $admin_id];
        }

        // 设置属性
        $map['_table'] = "home_login_log";
        $map['_order_by'] = "home_login_log.id desc";
        $map['_func'] = function (ModelLoginLog $model) use ($map) {
            $model->alias($map['_table'])->join(ModelAdminUser::getTable() . ' user', 'home_login_log.uid = user.id');
        };
    }
}
