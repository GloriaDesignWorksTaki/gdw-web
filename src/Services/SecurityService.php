<?php
namespace App\Services;

class SecurityService {
    private $rateLimitFile;
    private $logFile;
    private $maxAttempts = 5; // 1時間あたりの最大送信回数
    private $timeWindow = 3600; // 時間窓（秒）
    private $minSubmitTime = 10; // 最短送信間隔（秒）- ボット対策のため10秒に設定

    public function __construct() {
        $logDir = __DIR__ . '/../../logs';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        $this->rateLimitFile = $logDir . '/rate_limit.json';
        $this->logFile = $logDir . '/contact_form.log';
    }

    /**
     * IPアドレスを取得
     */
    public function getClientIp() {
        $ipKeys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
        foreach ($ipKeys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP, 
                        FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                        return $ip;
                    }
                }
            }
        }
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    /**
     * レート制限チェック
     */
    public function checkRateLimit($ip = null) {
        if ($ip === null) {
            $ip = $this->getClientIp();
        }

        $data = $this->loadRateLimitData();
        $now = time();

        // 古いデータをクリーンアップ
        $data = $this->cleanOldData($data, $now);

        // IPの送信履歴を取得
        if (!isset($data[$ip])) {
            $data[$ip] = [];
        }

        // 時間窓内の送信回数をカウント
        $recentAttempts = array_filter($data[$ip], function($timestamp) use ($now) {
            return ($now - $timestamp) < $this->timeWindow;
        });

        if (count($recentAttempts) >= $this->maxAttempts) {
            $this->logSecurityEvent('RATE_LIMIT_EXCEEDED', $ip);
            return false;
        }

        // 送信時刻を記録
        $data[$ip][] = $now;
        $this->saveRateLimitData($data);

        return true;
    }

    /**
     * 時間制限チェック（短時間での連続送信を防ぐ）
     * 注意: このメソッドはレート制限チェックの前に実行する必要があります
     */
    public function checkTimeLimit($ip = null) {
        if ($ip === null) {
            $ip = $this->getClientIp();
        }

        $data = $this->loadRateLimitData();
        
        if (!isset($data[$ip]) || empty($data[$ip])) {
            return true;
        }

        // 最新の記録を除外（まだ記録されていないので、2番目に新しい記録をチェック）
        $timestamps = $data[$ip];
        if (count($timestamps) < 2) {
            // 記録が1つ以下なら時間制限なし
            return true;
        }

        // ソートして2番目に新しい記録を取得
        rsort($timestamps);
        $secondLastAttempt = $timestamps[1] ?? null;
        
        if ($secondLastAttempt === null) {
            return true;
        }

        $timeSinceLastAttempt = time() - $secondLastAttempt;

        if ($timeSinceLastAttempt < $this->minSubmitTime) {
            $this->logSecurityEvent('TIME_LIMIT_EXCEEDED', $ip, ['time_since' => $timeSinceLastAttempt]);
            return false;
        }

        return true;
    }

    /**
     * Honeypotフィールドチェック
     */
    public function checkHoneypot($honeypotValue) {
        // Honeypotフィールドに値が入っていればボット
        if (!empty($honeypotValue)) {
            $this->logSecurityEvent('HONEYPOT_TRIGGERED', $this->getClientIp(), ['value' => $honeypotValue]);
            return false;
        }
        return true;
    }

    /**
     * reCAPTCHA v3検証
     */
    public function verifyRecaptcha($token, $secretKey) {
        if (empty($token)) {
            return false;
        }

        $url = 'https://www.google.com/recaptcha/api/siteverify';
        $data = [
            'secret' => $secretKey,
            'response' => $token,
            'remoteip' => $this->getClientIp()
        ];

        $options = [
            'http' => [
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($data)
            ]
        ];

        $context = stream_context_create($options);
        $result = file_get_contents($url, false, $context);
        $response = json_decode($result, true);

        if ($response && isset($response['success']) && $response['success'] === true) {
            // スコアが0.5以上なら人間として判定（調整可能）
            $score = $response['score'] ?? 0;
            if ($score >= 0.5) {
                return true;
            } else {
                $this->logSecurityEvent('RECAPTCHA_LOW_SCORE', $this->getClientIp(), ['score' => $score]);
            }
        } else {
            $this->logSecurityEvent('RECAPTCHA_FAILED', $this->getClientIp(), ['response' => $response]);
        }

        return false;
    }

    /**
     * メールアドレスの検証強化
     */
    public function validateEmail($email) {
        // 基本的なバリデーション
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        // 一時メールアドレスのドメインをチェック（一部）
        $tempMailDomains = [
            '10minutemail.com',
            'guerrillamail.com',
            'tempmail.com',
            'mailinator.com',
            'throwaway.email',
            'getnada.com'
        ];

        $domain = substr(strrchr($email, "@"), 1);
        if (in_array(strtolower($domain), $tempMailDomains)) {
            $this->logSecurityEvent('TEMP_EMAIL_DETECTED', $this->getClientIp(), ['email' => $email]);
            return false;
        }

        return true;
    }

    /**
     * 入力値のサニタイズ強化
     */
    public function sanitizeInput($input, $maxLength = 10000) {
        // 長すぎる入力を制限
        if (strlen($input) > $maxLength) {
            return substr($input, 0, $maxLength);
        }

        // 制御文字を除去
        $input = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $input);

        // HTMLエンティティをデコードしてから再エンコード（ダブルエンコード攻撃対策）
        $input = html_entity_decode($input, ENT_QUOTES, 'UTF-8');
        $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');

        return trim($input);
    }

    /**
     * レート制限データを読み込む
     */
    private function loadRateLimitData() {
        if (!file_exists($this->rateLimitFile)) {
            return [];
        }

        $content = file_get_contents($this->rateLimitFile);
        $data = json_decode($content, true);

        return is_array($data) ? $data : [];
    }

    /**
     * レート制限データを保存
     */
    private function saveRateLimitData($data) {
        file_put_contents($this->rateLimitFile, json_encode($data), LOCK_EX);
    }

    /**
     * 古いデータをクリーンアップ
     */
    private function cleanOldData($data, $now) {
        foreach ($data as $ip => $timestamps) {
            $data[$ip] = array_filter($timestamps, function($timestamp) use ($now) {
                return ($now - $timestamp) < $this->timeWindow;
            });
            
            if (empty($data[$ip])) {
                unset($data[$ip]);
            }
        }
        return $data;
    }

    /**
     * セキュリティイベントをログに記録
     */
    private function logSecurityEvent($eventType, $ip, $additionalData = []) {
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'event' => $eventType,
            'ip' => $ip,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
            'data' => $additionalData
        ];

        $logLine = json_encode($logEntry, JSON_UNESCAPED_UNICODE) . "\n";
        file_put_contents($this->logFile, $logLine, FILE_APPEND | LOCK_EX);
    }
}
