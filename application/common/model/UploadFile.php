<?php


namespace app\common\model;

use think\Model;
use app\common\model\File;
/**
* @author:韩丙松 - 2019-7-1
* Class UploadFile - 上传文件 - input上传
* @package app\common\model
* 
*/
class UploadFile extends File
{
    const AUDIO = 'audio';
    const VIDEO = 'video';
    /**
    * @author:韩丙松 - 2019-7-1
    * @method:上传音频文件
    * @return:array - file_name=>上传的文件名字
                    - primary_name=>原文件名
    **/
    public function uploadAudio($file){
        $path = '/file/audio';
        $file_path = ROOT_PATH . 'public_html' . $path;
        if(!is_dir($file_path)){
            if(!mkdir($file_path)){
                return ['code'=>400,'msg'=>'目录创建失败'];
            }
        }
        
        // 移动到框架应用根目录/public/file/audio 目录下
        //audio/mpeg
        //validate(['ext'=>'mp3,wma,avi,rm,rmvb,flv,mpg,mov,mkv,amr,m4a'])->
        if($file){
            $file_info = $file->getInfo();
            if($file_info['type'] == 'application/octet-stream' && strpos($file_info['name'],'.') === false){
                $file_info['name'] = $file_info['name'].'.mp3';
                //$file_info['type'] = 'audio/mp3';
                $file->setUploadInfo($file_info);
            }
            // dump();
            // ie;
            $info = $file->move($file_path);
            
            if($info){
                // 成功上传后 获取上传信息
                $file_name = $path.'/'.$info->getSaveName();
                if($info->getExtension() == 'm4a'){
                    $file_name = $path.'/'.$this->m4aToMp3($info->getSaveName());
                }

                $_info = $file->getInfo('info');
                return ['code'=>0,'msg'=>'文件上传成功','data'=>['file_name'=>$file_name,'primary_name'=>$_info['name']]];
                
            }else{
                // 上传失败获取错误信息
                return ['code'=>400,'msg'=>$file->getError()];
            }
        }
    }
    /**
    * @author:韩丙松 - 2019-7-1
    * @method:上传视频文件
    *
    **/
    public function uploadVideo($file){
        $path = '/file/video';
        $file_path = ROOT_PATH . 'public_html' . $path;
        if(!is_dir($file_path)){
            if(!mkdir($file_path)){
                return ['code'=>400,'msg'=>'目录创建失败'];
            }
        }
        // 移动到框架应用根目录/public/uploads/ 目录下
        if($file){
            $info = $file->validate(['ext'=>'avi,wmv,mpeg,mp4,mov,mkv,flv,f4v,m4v,rmvb,rm,3gp,dat,ts,mts,vob,quicktime'])->move($file_path);
            if($info){
                // 成功上传后 获取上传信息
                $file_name = $path.'/'.$info->getSaveName();
                $_info = $file->getInfo('info');
                return ['code'=>0,'msg'=>'文件上传成功','data'=>['file_name'=>$file_name,'primary_name'=>$_info['name']]];
                
            }else{
                // 上传失败获取错误信息
                return ['code'=>400,'msg'=>$file->getError()];
            }
        }
    }
    /**
    * @author:韩丙松 - 2019-7-1
    * @method:上传图片文件
    *
    **/
    public function uploadImage($file){
        $path = '/file/image';
        $file_path = ROOT_PATH . 'public_html' . $path;
        if(!is_dir($file_path)){
            if(!mkdir($file_path)){
                return ['code'=>400,'msg'=>'目录创建失败'];
            }
        }
        // 移动到框架应用根目录/public/uploads/ 目录下
        if($file){
            //->validate(['ext'=>'jpg,png'])
            $info = $file->move($file_path);
            if($info){
                // 成功上传后 获取上传信息
                $file_name = $path.'/'.$info->getSaveName();
                $_info = $file->getInfo('info');
                return ['code'=>0,'msg'=>'文件上传成功','data'=>['file_name'=>$file_name,'primary_name'=>$_info['name']]];
                
            }else{
                // 上传失败获取错误信息
                return ['code'=>400,'msg'=>$file->getError()];
            }
        }
    }
    /**
    * @author:韩丙松 - 2019-7-1
    * @method:上传图片Excel文件
    *
    **/
    public function uploadFile($file){
        $path = '/file/word';
        $file_path = ROOT_PATH .'/public_html' . $path;
        if(!is_dir($file_path)){
            if(!mkdir($file_path)){
                return ['code'=>400,'msg'=>'目录创建失败'];
            }
        }
        // 移动到框架应用根目录/public/uploads/ 目录下
        if($file){
            $info = $file->validate(['ext'=>'xls,xlsx,doc,docx'])->move($file_path);
            if($info){
                // 成功上传后 获取上传信息
                $file_name = $path.'/'.$info->getSaveName();
                $_info = $file->getInfo('info');
                return ['code'=>0,'msg'=>'文件上传成功','data'=>['file_name'=>$file_name,'primary_name'=>$_info['name']]];
                
            }else{
                // 上传失败获取错误信息
                return ['code'=>400,'msg'=>$file->getError()];
            }
        }
    }
    public function m4aToMp3($_m4a_path){
        $m4a_path = '/www/wwwroot/xxt.jin.yoolgou.com/v1.0.0/public_html/file/audio/'.$_m4a_path;
        $mp3_path = $m4a_path.".mp3";
        if(file_exists($mp3_path)) unlink ($mp3_path);
        shell_exec('ffmpeg -i '.$m4a_path.' -acodec libmp3lame -ab 128k '.$mp3_path); 
        return $_m4a_path.".mp3";
    }
    //多图
    // public function uploadImageMore(){
    //     $path = '/file/image';
    //     $file_path = ROOT_PATH . 'public_html' . $path;
    //     if(!is_dir($file_path)){
    //         if(!mkdir($file_path)){
    //             return ['code'=>400,'msg'=>'目录创建失败'];
    //         }
    //     }
    //     // 获取表单上传文件
    //     $files = request()->file('image');
    //     $_info = [];
    //     foreach($files as $file){
    //         // 移动到框架应用根目录/public/uploads/ 目录下
    //         $info = $file->validate(['ext'=>'jpg,png'])->move($file_path);
            
    //         if($info){
    //             // 成功上传后 获取上传信息
    //             // 输出 jpg
    //             $_info[] = [
    //                 'file_name'=>$file_name,
    //                 'primary_name'=>$_info['name']
    //             ]

    //         }else{
    //             // 上传失败获取错误信息
    //             return ['code'=>400,'msg'=>$file->getError()];
    //         }    
    //     }
    //     return ['code'=>0,'msg'=>'文件上传成功','data'=>$_info];
    // }
}
