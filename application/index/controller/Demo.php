<?php
namespace app\index\controller;
use app\common\model\Equipment as ModelEquipment;
use app\common\model\PatrolLog as ModelPatrolLog;
use think\Response;
use think\Db;
use mailer\tp5\Mailer;
use app\common\model\Redis;
header("Content-Type:text/html; charset=utf-8");
/**
 * 首页管理
 * Class Index
 * @package app\index\controller
 */
class Demo extends Wx
{
    public function aaa(){
        $id = 20;
        $subject = Db::name("subject")->where(['id'=>$id])->field("zip_file,zip_name,zip_name_file")->find();
        $zip = new \ZipArchive;
        $res = $zip->open($subject['zip_file']);
        if (!$subject['zip_name_file'] && $res === TRUE) {
            //解压缩
            $path = 'file/decompression/'.date('YmdHis',time()); // 解压缩目录
            
            $e_res = $zip->extractTo(ROOT_PATH . 'public_html/'.$path);
            $zip_name = explode(".",$subject['zip_name']);
            Db::name("subject")->where(['id'=>$id])->update(['zip_name_file'=>$path."/".$zip_name[0]]);
           
        }
        
    }


    public function test(){
        echo("<pre>");
        print_r($this->request->ip(0,1));
        print_r($_SERVER);
    }

    public function aa(){
    	Vendor("GetMacAddr");
        $mac = new \GetMacAddr(PHP_OS); 
        $pc_card = $mac->mac_addr; 
        echo $mac->mac_addr;
        print_r("11");
        print_r($pc_card);
        print_r("11");
    }

    public function examine_url(){
        $url = "http://www.ilab-x.com/";
        $subject_id = 8;
        
        Vendor("GetMacAddr");
        $mac = new \GetMacAddr(PHP_OS); 
        $pc_card = $mac->mac_addr; 
        $examine = array(
        	"pc_card" => $pc_card,
            "subject_id" => $subject_id,
            "create_time" => time()
        );
        $import_no = date("YmdGis", time());
        $model = new Redis();
        
        $keys = $model->getKeys("examine" . $import_no);
        $icount = 0;

	    if($keys){
	    	foreach ($keys as $key => $val) {
	            $getData = $model->getValue("examine" . $import_no, $val);
	            if((time() - $getData['create_time'] <= 1800) && ($getData['subject_id'] == $examine['subject_id']) &&($getData['pc_card'] == $examine['pc_card'])){
                   echo "该项目正在做实验，请勿重复点击！";
                   return;
	            }
	         
	        }
	        foreach ($keys as $key => $val) {
	            $getData = $model->getValue("examine" . $import_no, $val);
	            if(time() - $getData['create_time'] > 1800){
                   $model->del("examine" . $import_no, $val);
	            }
	            if($getData['subject_id'] == $examine['subject_id']){
	            	++$icount;
	            }
	        }
	        if($icount >= 99){
	        	echo "该项目做实验已超过100，请稍后再试！";
	        }else{
	        	foreach ($keys as $key => $val) {
		            $getData = $model->getValue("examine" . $import_no, $val);
		            if((($getData['pc_card'] == $examine['pc_card']) && ($getData['subject_id'] <> $examine['subject_id'])) || (($getData['pc_card'] <> $examine['pc_card']) && ($getData['subject_id'] == $examine['subject_id'])) || (($getData['pc_card'] <> $examine['pc_card']) && ($getData['subject_id'] <> $examine['subject_id']))){
	                   $model->setValue("examine" . $import_no, $icount, $examine);
		            }
		        }
	        }
	    }else{
	    	$model->setValue("examine" . $import_no, $icount, $examine);
	    }
	    // $keys = $model->getKeys("examine" . $import_no);
	    // foreach ($keys as $key => $val) {
     //        $getData = $model->getValue("examine" . $import_no, $val);
     //        echo("<pre>");
     //        print_r($getData);
     //    }
    }

}
