<?php
namespace app\common\validate;

use think\Validate;

class TeamMajor extends Validate
{
    protected $rule = [
        "name|姓名" => "require",
        "unit|所在单位" => "require",
        "skill_work|专业技术职务" => "require",
        "administration_work|行政职务" => "require",
        "ready_task|承担任务" => "require",
        "type|团队成员类型" => "require",
    ];
}
