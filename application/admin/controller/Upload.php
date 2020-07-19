<?php
namespace app\admin\controller;

use app\admin\Controller;
use think\Db;

class Upload extends Controller
{
    /**
     * 首页-多图
     */
    public function index()
    {
        return $this->view->fetch();
    }

    /**
     * 单图
     */
    public function one()
    {
        return $this->view->fetch();
    }

    /**
     * 文件上传-多图
     */
    public function upload()
    {
        $files = $this->request->file('file');
        $path = ROOT_PATH . 'public_html/tmp/uploads/';
        $data = '';

        $err_msg = '';

        foreach ($files as $file) {
            //验证图片格式和大小
            $file_info = $file->getInfo();

            if ( !($file_info['type'] == 'image/gif' || $file_info['type'] == 'image/jpg' || $file_info['type'] == 'image/png') )
            {
                $err_msg .= '图片格式须为jpg/png/gif';
            }

            if ( ($file_info['size']/1024) > 150 )
            {
                if ( $err_msg )
                {
                    $err_msg .= ',图片大小最大为150kb';
                }else{
                    $err_msg .= '图片大小最大为150kb';
                }
            }

            if ( $err_msg !== '' )
            {
                return ajax_return_error($err_msg);
            }
			//验证图片格式和大小 结束
            $info = $file->move($path);
			
            if (!$info) {
                return ajax_return_error($file->getError());
            }
			
            if (!$data) {
                $data .= '/tmp/uploads/'.$info->getSaveName(); 
            }else{
                $data .= ',/tmp/uploads/'.$info->getSaveName(); 
            }
		
            $insert = [
                'cate'     => 3,
                'name'     => '/tmp/uploads/'.$info->getSaveName(),
                'original' => $info->getInfo('name'),
                'domain'   => '',
                'type'     => $info->getInfo('type'),
                'size'     => $info->getInfo('size'),
                'mtime'    => time(),
            ];
			
            $res = Db::name('File')->insert($insert);
			if ( !$res )
			{
				return ajax_return_error ('路径写入数据库失败');
			}
			
        }
		
        return ajax_return(['name' => $data]);
    }

    /**
     * 文件上传-单图
     */
    public function uploadone()
    {
        $file = $this->request->file('file');
        $path = ROOT_PATH . 'public_html/tmp/uploads/';
        $info = $file->move($path);
        if (!$info) {
            return ajax_return_error($file->getError());
        }
        $data = '/tmp/uploads/'.$info->getSaveName();
        $insert = [
            'cate'     => 3,
            'name'     => '/tmp/uploads/'.$info->getSaveName(),
            'original' => $info->getInfo('name'),
            'domain'   => '',
            'type'     => $info->getInfo('type'),
            'size'     => $info->getInfo('size'),
            'mtime'    => time(),
        ];
        Db::name('File')->insert($insert);

        return ajax_return(['name' => $data]);
    }

    /**
     * 远程图片抓取
     */
    public function remote()
    {
        $url = $this->request->post('url');
        // validate
        $name = ROOT_PATH . 'public/tmp/uploads/' . get_random();
        $name = \File::downloadImage($url, $name);

        $ret = $this->request->root() . '/tmp/uploads/' . basename($name);

        return ajax_return(['url' => $ret], '抓取成功');
    }

    /**
     * 图片列表
     */
    public function listImage()
    {
        $page = $this->request->param('p', 1);
        if ($this->request->param('count')) {
            $ret['count'] = Db::name('File')->where('cate=3')->count();
        }
        $ret['list'] = Db::name('File')->where(['cate'=>3,'type'=>['in','image/png,image/jpeg']])->field('id,name,original')->order('mtime desc')->page($page, 10)->select();

        return ajax_return($ret);
    }
}