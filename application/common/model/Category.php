<?php
namespace app\common\model;

use think\Model;
use think\Db;

class Category extends Model
{
    // 指定表名,不含前缀
    protected $name = 'category';
    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 关闭自动写入更新时间
    protected $updateTime = false;

    
    public function cat_list($cat_id, $selected = 0, $re_type = true, $level = 0, $is_show_all = true){
        $res = Db::name("category")->alias("c")->join("category t","c.id = t.parent_id","left")->field("c.id,c.cat_name,c.parent_id,COUNT(c.id) AS has_children")->group("c.id")->order("c.parent_id")->select();
      
        $options = $this->cat_options($cat_id, $res); // 获得指定分类下的子分类的数组
       
        $children_level = 99999; //大于这个分类的将被删除
        if ($is_show_all == false)
        {
            foreach ($options as $key => $val)
            {
                if ($val['level'] > $children_level)
                {
                    unset($options[$key]);
                }
                else
                {
                    if ($val['is_show'] == 0)
                    {
                        unset($options[$key]);
                        if ($children_level > $val['level'])
                        {
                            $children_level = $val['level']; //标记一下，这样子分类也能删除
                        }
                    }
                    else
                    {
                        $children_level = 99999; //恢复初始值
                    }
                }
            }
        }

        /* 截取到指定的缩减级别 */
        if ($level > 0)
        {
            if ($cat_id == 0)
            {
                $end_level = $level;
            }
            else
            {
                $first_item = reset($options); // 获取第一个元素
                $end_level  = $first_item['level'] + $level;
            }

            /* 保留level小于end_level的部分 */
            foreach ($options AS $key => $val)
            {
                if ($val['level'] >= $end_level)
                {
                    unset($options[$key]);
                }
            }
        }
     
        $select = '';
        foreach ($options AS $var)
        {
            if($re_type == false){
            	$select .= '<tr class="text-c">';
	            $select .= '<td style="text-align: left;">';
	            if ($var['level'] > 0)
	            {
	                $select.= str_pad("┗", $var['level']*36 + 2, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', STR_PAD_LEFT);
	            }
	            
	            $select .= $var['cat_name'].'</td>';
	            $select .= '<td class="f-14">';
                $select .= '<a title="编辑" href="javascript:;" onclick="layer_open(\'编辑\',\'/admin/category/edit/id/'.$var['id'].'.html\')" style="text-decoration:none;background: #5A98DE;" class="label label-danger radius ml-5">编辑</a>';
                $select .= '<a href="javascript:;" onclick="del_forever(this,'.$var['id'].',\'/admin/category/deleteforever.html\')" class="label label-danger radius ml-5">删除</a>';
                $select .= "</td>";
	            $select .= '</tr>';
            }else{
            	$select .= '<option value="' . $var['id'] . '" ';
	            $select .= ($selected == $var['id']) ? "selected='ture'" : '';
	            $select .= '>';
	            if ($var['level'] > 0)
	            {
	                $select .= str_repeat('&nbsp;', $var['level'] * 4);
	            }
	            $select .= htmlspecialchars(addslashes($var['cat_name']), ENT_QUOTES) . '</option>';
            } 
            
        }
        return $select;
       
    }

 

    /**
     * 过滤和排序所有分类，返回一个带有缩进级别的数组
     *
     * @access  private
     * @param   int     $cat_id     上级分类ID
     * @param   array   $arr        含有所有分类的数组
     * @param   int     $level      级别
     * @return  void
     */
    function cat_options($spec_cat_id, $arr)
    {
       
        static $cat_options = array();

        if (isset($cat_options[$spec_cat_id]))
        {
            return $cat_options[$spec_cat_id];
        }


        if (!isset($cat_options[0]))
        {
        
     
            $level = $last_cat_id = 0;
            $options = $cat_id_array = $level_array = array();
         
            while (!empty($arr))
            {
                foreach ($arr AS $key => $value)
                {
                    $cat_id = $value['id'];
                    if ($level == 0 && $last_cat_id == 0)
                    {
                        if ($value['parent_id'] > 0)
                        {
                            break;
                        }

                        $options[$cat_id]          = $value;
                        $options[$cat_id]['level'] = $level;
                        $options[$cat_id]['id']    = $cat_id;
                        $options[$cat_id]['name']  = $value['cat_name'];
                        unset($arr[$key]);

                        if ($value['has_children'] == 0)
                        {
                            continue;
                        }
                        $last_cat_id  = $cat_id;
                        $cat_id_array = array($cat_id);
                        $level_array[$last_cat_id] = ++$level;
                        continue;
                    }

                    if ($value['parent_id'] == $last_cat_id)
                    {
                        $options[$cat_id]          = $value;
                        $options[$cat_id]['level'] = $level;
                        $options[$cat_id]['id']    = $cat_id;
                        $options[$cat_id]['name']  = $value['cat_name'];
                        unset($arr[$key]);

                        if ($value['has_children'] > 0)
                        {
                            if (end($cat_id_array) != $last_cat_id)
                            {
                                $cat_id_array[] = $last_cat_id;
                            }
                            $last_cat_id    = $cat_id;
                            $cat_id_array[] = $cat_id;
                            $level_array[$last_cat_id] = ++$level;
                        }
                    }
                    elseif ($value['parent_id'] > $last_cat_id)
                    {
                        break;
                    }
                }

                $count = count($cat_id_array);
                if ($count > 1)
                {
                    $last_cat_id = array_pop($cat_id_array);
                }
                elseif ($count == 1)
                {
                    if ($last_cat_id != end($cat_id_array))
                    {
                        $last_cat_id = end($cat_id_array);
                    }
                    else
                    {
                        $level = 0;
                        $last_cat_id = 0;
                        $cat_id_array = array();
                        continue;
                    }
                }

                if ($last_cat_id && isset($level_array[$last_cat_id]))
                {
                    $level = $level_array[$last_cat_id];
                }
                else
                {
                    $level = 0;
                }
            }
         
        }
        else
        {
        	
            $options = $cat_options[0];
        }

        if (!$spec_cat_id)
        {
        
            return $options;
        }
        else
        {
        
     
            if (empty($options[$spec_cat_id]))
            {
                return array();
            }

            $spec_cat_id_level = $options[$spec_cat_id]['level'];

            foreach ($options AS $key => $value)
            {
                if ($key != $spec_cat_id)
                {
                    unset($options[$key]);
                }
                else
                {
                    break;
                }
            }

            $spec_cat_id_array = array();
            foreach ($options AS $key => $value)
            {
                if (($spec_cat_id_level == $value['level'] && $value['id'] != $spec_cat_id) ||
                    ($spec_cat_id_level > $value['level']))
                {
                    break;
                }
                else
                {
                    $spec_cat_id_array[$key] = $value;
                }
            }
            $cat_options[$spec_cat_id] = $spec_cat_id_array;
            
          
            return $spec_cat_id_array;
        }
    }

}
