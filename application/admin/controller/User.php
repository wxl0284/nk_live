<?php
namespace app\admin\controller;

\think\Loader::import('controller/Controller', \think\Config::get('traits_path') , EXT);

use app\admin\Controller;
use think\Loader;
use think\Db;

class User extends Controller
{
    use \app\admin\traits\controller\Controller;
    // 方法黑名单
    protected static $blacklist = [];

    protected function filter(&$map)
    {
        if ($this->request->param("name")) {
            $map['name'] = ["like", "%" . $this->request->param("name") . "%"];
        }
    }

    /**
     * 修改密码
     */
    public function password(){
        $id = $this->request->param('id/d');
        if ($this->request->isPost()) {
            $password = $this->request->post('password');
            if (!$password) {
                return ajax_return_adv_error("密码不能为空");
            }
            if (false === Loader::model('User')->updatePassword($id, $password)) {
                return ajax_return_adv_error("密码修改失败");
            }
            $this->log(array('用户管理', '用户列表'), '修改密码', $id, array('password' => $password));
            return ajax_return_adv("密码已修改为{$password}", '');
        }
        return $this->view->fetch();
    }

    /**
     * 导入
     */
    public function import(){
        if ($this->request->isPost()) {
            Loader::import('PHPExcel.Classes.PHPExcel');
            Loader::import('PHPExcel.Classes.PHPExcel.IOFactory.PHPExcel_IOFactory');
            Loader::import('PHPExcel.Classes.PHPExcel.Reader.Excel5');
            //获取表单上传文件
            $file = request()->file('file');
            $info = $file->validate(['ext' => 'xlsx,xls'])->move(ROOT_PATH . 'public_html' . DS . 'uploads');//上传验证后缀名,以及上传之后移动的地址
            if ($info) {
                $exclePath = $info->getSaveName();  //获取文件名
                $file_name = ROOT_PATH . 'public_html' . DS . 'uploads' . DS . $exclePath;   //上传文件的地址
                $objReader = \PHPExcel_IOFactory::createReader('Excel2007');
                $obj_PHPExcel = $objReader->load($file_name, $encode = 'utf-8');  //加载文件内容,编码utf-8
                $excel_array=$obj_PHPExcel->getsheet(0)->toArray();   //转换为数组格式
                array_shift($excel_array);  //删除第一个数组(标题);
                $city = [];
                foreach($excel_array as $k=>$v) {
                    $city[$k]['name'] = $v[0];
                    $city[$k]['phone'] = $v[1];
                    $city[$k]['password'] = password_hash_tp($v[2]);
                    $city[$k]['email'] = $v[3];
                    $city[$k]['create_time'] = time();
                }
                try{
                    Db::name('user')->insertAll($city); //批量插入数据
                    $this->log(array('用户管理', '用户列表'), '导入', '', $city);
                } catch (Exception $e) {
                    return json(array("code" => "500"));
                }
                return json(array("code" => "200"));
            } else {
                return $file->getError();
            }
            return json(array("code" => "500"));
        }
        return $this->view->fetch();
    }
    public function export(){
//        Loader::import('PHPExcel.Classes.PHPExcel');
//        Loader::import('PHPExcel.Classes.PHPExcel.IOFactory.PHPExcel_IOFactory');
//        Loader::import('PHPExcel.Classes.PHPExcel.Reader.Excel5');
        //文件名
        $fileName = "用户导入模板.xlsx";
        //加载第三方类库
        Loader::import('PHPExcel.Classes.PHPExcel');
        Loader::import('PHPExcel.Classes.PHPExcel.IOFactory.PHPExcel_IOFactory');
        //实例化excel类
        $excelObj = new \PHPExcel();
        //构建列数--根据实际需要构建即可
        $letter = array('A', 'B', 'C', 'D');
        //表头数组--需和列数一致
        $tableheader = array('昵称', '电话', '密码', '邮箱');
        //填充表头信息
        for ($i = 0; $i < count($tableheader); $i++) {
            $excelObj->getActiveSheet()->setCellValue("$letter[$i]1", "$tableheader[$i]");
        }
        //循环填充数据
//        foreach ($data as $k => $v) {
//            $num = $k + 1 + 1;
//            //设置每一列的内容
//            $excelObj->setActiveSheetIndex(0)
//                ->setCellValue('A' . $num, $v['number'])
//                ->setCellValue('B' . $num, $v['name'])
//                ->setCellValue('C' . $num, $v['age'])
//                ->setCellValue('D' . $num, $v['sex'])；
//
//            //设置行高
//            $excelObj->getActiveSheet()->getRowDimension($k+4)->setRowHeight(30);
//    }
        //以下是设置宽度
//        $excelObj->getActiveSheet()->getColumnDimension('A')->setWidth(46);
//        $excelObj->getActiveSheet()->getColumnDimension('B')->setWidth(20);
//        $excelObj->getActiveSheet()->getColumnDimension('C')->setWidth(10);
//        $excelObj->getActiveSheet()->getColumnDimension('D')->setWidth(20);

        //设置表头行高
//        $excelObj->getActiveSheet()->getRowDimension(1)->setRowHeight(28);
//        $excelObj->getActiveSheet()->getRowDimension(2)->setRowHeight(28);
//        $excelObj->getActiveSheet()->getRowDimension(3)->setRowHeight(28);

        //设置居中
//        $excelObj->getActiveSheet()->getStyle('A1:D1'.($k+2))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);

        //所有垂直居中
//        $excelObj->getActiveSheet()->getStyle('A1:D1'.($k+2))->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);

        //设置字体样式
//        $excelObj->getActiveSheet()->getStyle('A1:D1')->getFont()->setName('黑体');
//        $excelObj->getActiveSheet()->getStyle('A1:D1')->getFont()->setSize(20);
//        $excelObj->getActiveSheet()->getStyle('A1:D1')->getFont()->setBold(true);
//        $excelObj->getActiveSheet()->getStyle('A1:D1')->getFont()->setBold(true);
//        $excelObj->getActiveSheet()->getStyle('A1:D1')->getFont()->setName('宋体');
//        $excelObj->getActiveSheet()->getStyle('A1:D1')->getFont()->setSize(16);
//        $excelObj->getActiveSheet()->getStyle('A1:D1'.($k+2))->getFont()->setSize(10);

        //设置自动换行
//        $excelObj->getActiveSheet()->getStyle('A1:D1'.($k+2))->getAlignment()->setWrapText(true);

        // 重命名表
//        $fileName = iconv("utf-8", "gb2312", $fileName);

        // 设置下载打开为第一个表
        $excelObj->setActiveSheetIndex(0);

        $ua = $_SERVER['HTTP_USER_AGENT'];
        $ua = strtolower($ua);
        if(preg_match('/msie/', $ua) || preg_match('/edge/', $ua) || preg_match('/Gecko/', $ua) || strstr($ua,'gecko')) { //判断是否为IE或Edge浏览器 360
            $fileName = str_replace('+', '%20', urlencode($fileName)); //使用urlencode对文件名进行重新编码
        }
//        if(strstr($ua,'gecko')){
//            $fileName = str_replace('+', '%20', urlencode($fileName)); //使用urlencode对文件名进行重新编码
//        }

        //设置header头信息
        header("Content-Type: text/html;charset=utf-8");
        header('Content-Type: application/vnd.ms-excel;charset=UTF-8');
        header("Content-Disposition: attachment;filename=".$fileName);
        header('Cache-Control: max-age=0');
        $writer = \PHPExcel_IOFactory::createWriter($excelObj, 'Excel2007');
        $writer->save('php://output');
        exit();
    }
//
//Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko
//
//Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586
//
//Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36
}