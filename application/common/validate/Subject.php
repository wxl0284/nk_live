<?php
namespace app\common\validate;

use think\Validate;

class Subject extends Validate
{
    protected $rule = [
        "cat_id|专业分类" => "require",
        "subject_level|项目级别" => "require",
        "subject_name|项目名称" => "require",
        "school_name|学校名称" => "require",
        "person_charge|负责人姓名" => "require",
    ];
}
