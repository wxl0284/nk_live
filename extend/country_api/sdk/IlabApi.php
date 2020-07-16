<?php
//namespace sdk;
namespace country_api\sdk;

class IlabApi
{
	public static function log($ilabUserName, $childProjectTitle, $status, $score, $started_at, $ended_at, $time)
	{
		$data = [
			'username' => (string)$ilabUserName,
			'projectTitle' => IlabJwt::$appName,
			'childProjectTitle' => (string)$childProjectTitle,	//id-name-alias
			'status' => (int)$status,
			'score' => (int)$score,
			'startDate' => (int)$started_at,
			'endDate' => (int)$ended_at,
			'timeUsed' => (int)$time,
			'issuerId' => (string)IlabJwt::$issuerId,
		];
		
		$params = [
			'xjwt' => IlabJwt::getJwt($data),
		];
		
		$result = IlabClient::sendRequest('POST', 'project/log/upload', $params, [], '');
		
		//log info
		// $data = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
		// $params = json_encode($params, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
		if (!$result) {
			// IlabJwt::log("POST project/log/upload failed. Data(json):{$data}, Params(json):{$params}");
			return false;
		} else {
			// IlabJwt::log("POST project/log/upload succeeded. Data(json):{$data}, Params:{$params}, Result:{$result}");
			$result = json_decode($result, true);
			return $result['code'] == 0;
		}
	}
}