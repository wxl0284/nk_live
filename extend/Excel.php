<?php
/**
 * tpAdmin [a web admin based ThinkPHP5]
 *
 * @author yuan1994 <tianpian0805@gmail.com>
 * @link http://tpadmin.yuan1994.com/
 * @copyright 2016 yuan1994 all rights reserved.
 * @license http://www.apache.org/licenses/LICENSE-2.0
 */

use think\Exception;

class Excel
{
    /**
     * 一键导 出Excel
     * @param array $header       Excel 头部 ["COL1","COL2","COL3",...]
     * @param array $body         和头部长度相等字段查询出的数据就可以直接导出
     * @param null|string $name   文件名，不包含扩展名，为空默认为当前时间
     * @param string|int $version Excel版本 2003|2007
     * @return string
     */
    public static function export($head, $body, $name = null, $version = '2007')
    {
        try {
            // 输出 Excel 文件头
            $name = empty($name) ? date('YmdHis') : $name;

            $objPHPExcel = new \PHPExcel();
            $sheetPHPExcel = $objPHPExcel->setActiveSheetIndex(0);
            $char_index = range("A", "Z");

            // Excel 表格头
            foreach ($head as $key => $val) {
                $sheetPHPExcel->setCellValue("{$char_index[$key]}1", $val);
            }

            // Excel body 部分
            foreach ($body as $key => $val) {
                $row = $key + 2;
                $col = 0;
                foreach ($val as $k => $v) {
                    $sheetPHPExcel->setCellValue("{$char_index[$col]}{$row}", $v);
                    $col++;
                }
            }

            // 版本差异信息
            $version_opt = [
                '2007' => [
                    'mime'       => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'ext'        => '.xlsx',
                    'write_type' => 'Excel2007',
                ],
                '2003' => ['mime'       => 'application/vnd.ms-excel',
                           'ext'        => '.xls',
                           'write_type' => 'Excel5',
                ],
                'pdf'  => ['mime'       => 'application/pdf',
                           'ext'        => '.pdf',
                           'write_type' => 'PDF',
                ],
                'ods'  => ['mime'       => 'application/vnd.oasis.opendocument.spreadsheet',
                           'ext'        => '.ods',
                           'write_type' => 'OpenDocument',
                ],
            ];

            header('Content-Type: ' . $version_opt[$version]['mime']);
            header('Content-Disposition: attachment;filename="' . $name . $version_opt[$version]['ext'] . '"');
            header('Cache-Control: max-age=0');
            // If you're serving to IE 9, then the following may be needed
            header('Cache-Control: max-age=1');

            // If you're serving to IE over SSL, then the following may be needed
            header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
            header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
            header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
            header('Pragma: public'); // HTTP/1.0

            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $version_opt[$version]['write_type']);
            $objWriter->save('php://output');
            exit;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
/**
     * 一键导 出Excel
     * @param array $header       Excel 头部 ["COL1","COL2","COL3",...]
     * @param array $body         和头部长度相等字段查询出的数据就可以直接导出
     * @param null|string $name   文件名，不包含扩展名，为空默认为当前时间
     * @param string|int $version Excel版本 2003|2007
     * @return string
     */
    public static function export2($type, $body, $name = null, $version = '2007')
    {
        try {
            // dump($type);
            // exit;
            // 输出 Excel 文件头
            $name = empty($name) ? date('YmdHis') : $name;
            $keys = 2;
            switch ($type) {
                case 'equipmentMobilityRecord':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_mobility.xls";
                    $keys = 3;
                    break;
                case 'equipmentOperator':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_operator.xls";
                    $keys = 4;
                    break; 
                case 'operateLog':
                    $url = ROOT_PATH . "public_html/static/excel/operate_log.xls";
                    $keys = 4;
                    break;      
                case 'equipmentInspect':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_inspect.xls";
                    $keys = 3;
                    break;
                case 'equipmentRegular':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_regular.xls";
                    $keys = 3;
                    break;       
                case 'equipmentOilChange':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_oil_change.xls";
                    $keys = 5;
                    break;
                case 'equipmentRepairBroken':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_broken.xls";
                    $keys = 3;
                    break;
                case 'equipmentRepairBroken':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_broken.xls";
                    $keys = 3;
                    break;   
                case 'equipmentAccident':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_accident.xls";
                    $keys = 3;
                    break;
                case 'equipmentAnnex':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_annex.xls";
                    $keys = 3;
                    break;
                case 'equipmentStandingTool':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_standing.xls";
                    $keys = 3;
                    break;
                case 'equipmentExamineRecord':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_examine.xls";
                    $keys = 3;
                    break;
                case 'equipmentOtherRecord':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_other.xls";
                    $keys = 3;
                    break;

                             
                
                default:
                    break;
            }
          
            $objPHPExcel = \PHPExcel_IOFactory::load($url);
            // print_r($objPHPExcel);die;
            $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
            //$objPHPExcel = new \PHPExcel();
            $sheetPHPExcel = $objPHPExcel->setActiveSheetIndex(0);
            $char_index = range("A", "Z");

            // Excel body 部分
            foreach ($body as $key => $val) {
                $row = $key + $keys;
                $col = 0;
                foreach ($val as $k => $v) {
                    $sheetPHPExcel->setCellValue("{$char_index[$col]}{$row}", $v);
                    $col++;
                }
            }

            // 版本差异信息
            $version_opt = [
                '2007' => [
                    'mime'       => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'ext'        => '.xlsx',
                    'write_type' => 'Excel2007',
                ],
                '2003' => ['mime'       => 'application/vnd.ms-excel',
                           'ext'        => '.xls',
                           'write_type' => 'Excel5',
                ],
                'pdf'  => ['mime'       => 'application/pdf',
                           'ext'        => '.pdf',
                           'write_type' => 'PDF',
                ],
                'ods'  => ['mime'       => 'application/vnd.oasis.opendocument.spreadsheet',
                           'ext'        => '.ods',
                           'write_type' => 'OpenDocument',
                ],
            ];

            header('Content-Type: ' . $version_opt[$version]['mime']);
            header('Content-Disposition: attachment;filename="' . $name . $version_opt[$version]['ext'] . '"');
            header('Cache-Control: max-age=0');
            // If you're serving to IE 9, then the following may be needed
            header('Cache-Control: max-age=1');

            // If you're serving to IE over SSL, then the following may be needed
            header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
            header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
            header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
            header('Pragma: public'); // HTTP/1.0

            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $version_opt[$version]['write_type']);
            $objWriter->save('php://output');
            exit;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    /**
     * 一键导 出Excel - 以模板文件导出
     * @param array $header       Excel 头部 ["COL1","COL2","COL3",...]
     * @param array $body         和头部长度相等字段查询出的数据就可以直接导出
     * @param null|string $name   文件名，不包含扩展名，为空默认为当前时间
     * @param string|int $version Excel版本 2003|2007
     * @return string
     */
    // public static function export_template($title, $body, $head = null,$name = null, $version = '2007',$file_name = "assets/index/template.xls")
    // {
    //     set_time_limit (0);
    //     try {
    //         // 输出 Excel 文件头
    //         $name = empty($name) ? date('YmdHis') : $name;
    //         import('phpoffice.phpexcel.Classes.PHPExcel',VENDOR_PATH,'.php');
    //         $objPHPExcel = \PHPExcel_IOFactory::load($file_name);
    //         // print_r($objPHPExcel);die;
    //         $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
    //         // $objPHPExcel = new \PHPExcel();
    //         $sheetPHPExcel = $objPHPExcel->setActiveSheetIndex(0);
    //         $char_index = range("A", "Z");
    //         array_push($char_index,'AA','AB','AC');
    //         $index = 1;
    //         if(!empty($head)) {
    //             $objPHPExcel->getActiveSheet()->getStyle("{$char_index[0]}".$index)->getAlignment()->setWrapText(true);
    //             $sheetPHPExcel->setCellValue("{$char_index[0]}".$index, $head);
    //             $pRange = $char_index[0] . $index . ":" . $char_index[count($title) - 1] . $index;
    //             $sheetPHPExcel->mergeCells($pRange);
    //             $index = 2;
    //         };
            
    //         // Excel body 部分
    //         foreach ($body as $key => $val) {
    //             $row = $key + 1 + $index;
    //             $col = 0;
    //             $black_str = "";
    //             foreach ($val as $k => $v) {
    //                 $text = $v;
                    
                    
    //                 $sheetPHPExcel->setCellValue("{$char_index[$col]}{$row}", $text);
    //                 $col++;
    //             }
    //             //if($row%600 == 0) sleep(2);
    //         }
    //         // 版本差异信息
    //         $version
    /**
     * 解析 Excel 数据并写入到数据库
     * @param string $file Excel 路径名文件名
     * @param array $header 表头对应字段信息 ['A'=>'field1', 'B'=>'field2', ...]
     * @param int $perLimit 每次一次性写入数据库中的行数
     * @param mixed $insertFunc 写入数据库的回调函数，可以用匿名函数
     * @param string $type Excel2007|Excel5
     * @return int
     */
    public static function parse($file, $header,$header_num, $perLimit, $insertFunc, $type = '')
    {
        $type = self::getType($file, $type);
        $objReader = PHPExcel_IOFactory::createReader($type);
        $objPHPExcel = $objReader->load($file);
        // 数据数组
        $data = [];
        // 已导入数据计数
        $count = 0;
        // 跳过第一行
        foreach ($objPHPExcel->getSheet()->getRowIterator($header_num) as $row) {
            // 逐个单元格读取，减少内存消耗
            $cellIterator = $row->getCellIterator();
            // 不跳过空值
            $cellIterator->setIterateOnlyExistingCells();
            // 只读取显示的行、列，跳过隐藏行、列
            if ($objPHPExcel->getActiveSheet()->getRowDimension($row->getRowIndex())->getVisible()) {
                $rowData = [];
                foreach ($cellIterator as $cell) {
                    if ($objPHPExcel->getActiveSheet()->getColumnDimension($cell->getColumn())->getVisible()) {
                        if (isset($header[$cell->getColumn()])) {
                            $rowData[$header[$cell->getColumn()]] = $cell->getValue();
                        }
                    }
                }
                $data[] = $rowData;
                $count++;
                //dump($perLimit);
                // 数据分批写入数据库，防止一条SQL太长数据库不支持
                if ($count && $count % $perLimit == 0) {
                    $insertFunc($data);
                    // 清空已有数据
                    $data = [];
                }
            }
        }
        // 写入剩余数据
        if ($data) {
            $insertFunc($data);
        }

        return $count;
    }


    /**
     * 解析 Excel 获取第一行头信息
     * @param string $file Excel 路径名文件名
     * @param string $type Excel2007|Excel5
     * @return array
     */
    public static function parseHeader($file, $type = '')
    {
        $type = self::getType($file, $type);
        $objReader = PHPExcel_IOFactory::createReader($type);
      
        $objPHPExcel = $objReader->load($file);
        
        $header = [];
        foreach ($objPHPExcel->getSheet()->getRowIterator() as $row) {
            // 逐个单元格读取，减少内存消耗
            $cellIterator = $row->getCellIterator();
            // 不跳过空值
            $cellIterator->setIterateOnlyExistingCells();
            if ($objPHPExcel->getActiveSheet()->getRowDimension($row->getRowIndex())->getVisible()) {
                foreach ($cellIterator as $cell) {
                    if ($objPHPExcel->getActiveSheet()->getColumnDimension($cell->getColumn())->getVisible()) {
                        $header[$cell->getColumn()] = $cell->getValue();
                    }
                }
                break;
            }
        }
        // dump($header);
        // exit;

        return $header;
    }

    /**
     * 自动获取 Excel 类型
     * @param string $file Excel 路径名文件名
     * @param string $type Excel2007|Excel5
     * @return string
     * @throws Exception
     */
    private static function getType($file, $type = '')
    {
        if (!$type) {
            $ext = pathinfo($file, PATHINFO_EXTENSION);
            switch ($ext) {
                case 'xls' :
                    $type = 'Excel5';
                    break;
                case 'xlsx' :
                    $type = 'Excel2007';
                    break;
                default:
                    throw new Exception('请指定Excel的类型');
            }
        }
        return $type;
    }

    /**
     * 将 Excel 时间转为标准的时间格式
     * @param $date
     * @param bool $time
     * @return array|int|string
     */
    public static function excelTime($date, $time = false)
    {
        if (function_exists('GregorianToJD')) {
            if (is_numeric($date)) {
                $jd = GregorianToJD(1, 1, 1970);
                $gregorian = JDToGregorian($jd + intval($date) - 25569);
                $date = explode('/', $gregorian);
                $date_str = str_pad($date [2], 4, '0', STR_PAD_LEFT)
                    . "-" . str_pad($date [0], 2, '0', STR_PAD_LEFT)
                    . "-" . str_pad($date [1], 2, '0', STR_PAD_LEFT)
                    . ($time ? " 00:00:00" : '');

                return $date_str;
            }
        } else {
            $date = $date > 25568 ? $date + 1 : 25569;
            $ofs = (70 * 365 + 17 + 3) * 86400;
            $date = date("Y-m-d", ($date * 86400) - $ofs) . ($time ? " 00:00:00" : '');
        }

        return $date;
    }


    /**
     * 本地生成Excel
     * @param array $header       Excel 头部 ["COL1","COL2","COL3",...]
     * @param array $body         和头部长度相等字段查询出的数据就可以直接导出
     * @param null|string $name   文件名，不包含扩展名，为空默认为当前时间
     * @param string|int $version Excel版本 2003|2007
     * @param string              指定保存位置
     * @return string
     */
    public static function exportLocal($head, $body, $name = null, $version = '2007',$save="test.xls")
    {
        try {
            // 输出 Excel 文件头
            $name = empty($name) ? date('YmdHis') : $name;

            $objPHPExcel = new \PHPExcel();
            $sheetPHPExcel = $objPHPExcel->setActiveSheetIndex(0);
            $char_index = range("A", "Z");

            // Excel 表格头
            foreach ($head as $key => $val) {
                $sheetPHPExcel->setCellValue("{$char_index[$key]}1", $val);
            }

            // Excel body 部分
            foreach ($body as $key => $val) {
                $row = $key + 2;
                $col = 0;
                foreach ($val as $k => $v) {
                    $sheetPHPExcel->setCellValue("{$char_index[$col]}{$row}", $v);
                    $col++;
                }
            }

            // 版本差异信息
            $version_opt = [
                '2007' => [
                    'mime'       => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'ext'        => '.xlsx',
                    'write_type' => 'Excel2007',
                ],
                '2003' => ['mime'       => 'application/vnd.ms-excel',
                           'ext'        => '.xls',
                           'write_type' => 'Excel5',
                ],
                'pdf'  => ['mime'       => 'application/pdf',
                           'ext'        => '.pdf',
                           'write_type' => 'PDF',
                ],
                'ods'  => ['mime'       => 'application/vnd.oasis.opendocument.spreadsheet',
                           'ext'        => '.ods',
                           'write_type' => 'OpenDocument',
                ],
            ];
            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $version_opt[$version]['write_type']);
            $objWriter->save($save);

        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * 本地生成Excel
     * @param array $header       Excel 头部 ["COL1","COL2","COL3",...]
     * @param array $body         和头部长度相等字段查询出的数据就可以直接导出
     * @param null|string $name   文件名，不包含扩展名，为空默认为当前时间
     * @param string|int $version Excel版本 2003|2007
     * @param string              指定保存位置
     * @return string
     */
    public static function exportLocal1($body, $name = null, $version = '2007',$save="test.xls")
    {
        try {
            // 输出 Excel 文件头
            $name = empty($name) ? date('YmdHis') : $name;
            
            $keys = 1;
            $objPHPExcel = \PHPExcel_IOFactory::load($url);
            $sheet = $objPHPExcel->getSheet(0);
            // print_r($objPHPExcel);die;
            $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
            //$objPHPExcel = new \PHPExcel();
            $sheetPHPExcel = $objPHPExcel->setActiveSheetIndex(0);
            $xml_path = ROOT_PATH . "public_html/static/xml/oper_records.xml";
            $file_content = $this->make_content($xml_path,$body); 
            // 版本差异信息
            $version_opt = [
                '2007' => [
                    'mime'       => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'ext'        => '.xlsx',
                    'write_type' => 'Excel2007',
                ],
                '2003' => ['mime'       => 'application/vnd.ms-excel',
                           'ext'        => '.xls',
                           'write_type' => 'Excel5',
                ],
                'pdf'  => ['mime'       => 'application/pdf',
                           'ext'        => '.pdf',
                           'write_type' => 'PDF',
                ],
                'ods'  => ['mime'       => 'application/vnd.oasis.opendocument.spreadsheet',
                           'ext'        => '.ods',
                           'write_type' => 'OpenDocument',
                ],
            ];
            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $version_opt[$version]['write_type']);
            $objWriter->save($save);

        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * 本地生成Excel
     * @param array $header       Excel 头部 ["COL1","COL2","COL3",...]
     * @param array $body         和头部长度相等字段查询出的数据就可以直接导出
     * @param null|string $name   文件名，不包含扩展名，为空默认为当前时间
     * @param string|int $version Excel版本 2003|2007
     * @param string              指定保存位置
     * @return string
     */
    public static function exportLocal3($body, $equipment, $name = null, $version = '2007',$save="test.xls")
    {
        try {
          
            // 输出 Excel 文件头
            $name = empty($name) ? date('YmdHis') : $name;
            if($equipment['patrol_standard'] == 1){
                $url = ROOT_PATH . "public_html/static/excel/patrol_metals.xls";
                $num_index = range("4","16");
            }else{
                $url = ROOT_PATH . "public_html/static/excel/patrol_numberical.xls";
                $num_index = range("4","18");
            }
            
            $objPHPExcel = \PHPExcel_IOFactory::load($url);
            // print_r($objPHPExcel);die;
            $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
            //$objPHPExcel = new \PHPExcel();
            $sheetPHPExcel = $objPHPExcel->setActiveSheetIndex(0);
            // $char_index = range("A", "Z");

            // // Excel body 部分
            // foreach ($body as $key => $val) {
            //     $row = $key + $keys;
            //     $col = 0;
            //     foreach ($val as $k => $v) {
            //         echo("<pre>");
            //         print_r("{$char_index[$col]}{$row}");
            //         //$sheetPHPExcel->setCellValue("{$char_index[$col]}{$row}", $v);
            //         $col++;
            //     }
            // }
            // exit;
            $char_index1 = range("C", "Z");
            $char_index2 = ["AA","AB","AC","AD","AE","AF","AG"];
            $char_index = array_merge($char_index1,$char_index2);
            
           
            // Excel body 部分
            foreach ($body as $key => $val) {
                $col = 0;
                foreach ($val as $k => $v) {
                    // echo("<pre>");
                    // print_r("{$char_index[$key]}{$num_index[$col]}");
                     $sheetPHPExcel->setCellValue("{$char_index[$key]}{$num_index[$col]}", $v);
                     $col++;
                }
            }

            $sheetPHPExcel->setCellValue("A2", "编码：".$equipment['encrypt']);
            $sheetPHPExcel->setCellValue("A3", "单位：".$equipment['name_unit']);
            $sheetPHPExcel->setCellValue("F3", "机床编号：".$equipment['equip_factory_num']);
            $sheetPHPExcel->setCellValue("O3", "型号：".$equipment['equip_model']);
            $sheetPHPExcel->setCellValue("U3", $equipment['create_time']);
            $sheetPHPExcel->setCellValue("AA3", "操作者：".$equipment['nickname']);

        
            // 版本差异信息
            $version_opt = [
                '2007' => [
                    'mime'       => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'ext'        => '.xlsx',
                    'write_type' => 'Excel2007',
                ],
                '2003' => ['mime'       => 'application/vnd.ms-excel',
                           'ext'        => '.xls',
                           'write_type' => 'Excel5',
                ],
                'pdf'  => ['mime'       => 'application/pdf',
                           'ext'        => '.pdf',
                           'write_type' => 'PDF',
                ],
                'ods'  => ['mime'       => 'application/vnd.oasis.opendocument.spreadsheet',
                           'ext'        => '.ods',
                           'write_type' => 'OpenDocument',
                ],
            ];

            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $version_opt[$version]['write_type']);

            $objWriter->save($save);
         

        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * 本地生成Excel
     * @param array $header       Excel 头部 ["COL1","COL2","COL3",...]
     * @param array $body         和头部长度相等字段查询出的数据就可以直接导出
     * @param null|string $name   文件名，不包含扩展名，为空默认为当前时间
     * @param string|int $version Excel版本 2003|2007
     * @param string              指定保存位置
     * @return string
     */
    public static function exportLocal2($type, $body, $name = null, $version = '2007',$save="test.xls")
    {
        try {
            // 输出 Excel 文件头
            $name = empty($name) ? date('YmdHis') : $name;
            $keys = 2;
            switch ($type) {
                case 'equipment_mobility_record':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_mobility.xls";
                    $keys = 3;
                    break;
                case 'equipment_operator':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_operator.xls";
                    $keys = 4;
                    break; 
                case 'operate_log':
                    $url = ROOT_PATH . "public_html/static/excel/operate_log.xls";
                    $keys = 4;
                    break;      
                case 'equipment_inspect':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_inspect.xls";
                    $keys = 3;
                    break;
                case 'equipment_regular':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_regular.xls";
                    $keys = 3;
                    break;       
                case 'equipment_oil_change':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_oil_change.xls";
                    $keys = 5;
                    break;
                case 'equipment_repair_broken':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_broken.xls";
                    $keys = 3;
                    break;   
                case 'equipment_accident':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_accident.xls";
                    $keys = 3;
                    break;
                case 'equipment_annex':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_annex.xls";
                    $keys = 3;
                    break;
                case 'equipment_standing_tool':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_standing.xls";
                    $keys = 3;
                    break;
                case 'equipment_examine_record':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_examine.xls";
                    $keys = 3;
                    break;
                case 'equipment_other_record':
                    $url = ROOT_PATH . "public_html/static/excel/equipment_other.xls";
                    $keys = 3;
                    break;

                default:
                    break;
            }
            $objPHPExcel = \PHPExcel_IOFactory::load($url);
            // print_r($objPHPExcel);die;
            $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
            //$objPHPExcel = new \PHPExcel();
            $sheetPHPExcel = $objPHPExcel->setActiveSheetIndex(0);
            $char_index = range("A", "Z");

            // Excel body 部分
            foreach ($body as $key => $val) {
                $row = $key + $keys;
                $col = 0;
                foreach ($val as $k => $v) {
                    $sheetPHPExcel->setCellValue("{$char_index[$col]}{$row}", $v);
                    $col++;
                }
            }

            // 版本差异信息
            $version_opt = [
                '2007' => [
                    'mime'       => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'ext'        => '.xlsx',
                    'write_type' => 'Excel2007',
                ],
                '2003' => ['mime'       => 'application/vnd.ms-excel',
                           'ext'        => '.xls',
                           'write_type' => 'Excel5',
                ],
                'pdf'  => ['mime'       => 'application/pdf',
                           'ext'        => '.pdf',
                           'write_type' => 'PDF',
                ],
                'ods'  => ['mime'       => 'application/vnd.oasis.opendocument.spreadsheet',
                           'ext'        => '.ods',
                           'write_type' => 'OpenDocument',
                ],
            ];
            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $version_opt[$version]['write_type']);
            $objWriter->save($save);

        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}
