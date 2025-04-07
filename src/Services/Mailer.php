<?php
namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class Mailer {
    private $mailer;
    private $config;

    public function __construct() {
        $this->config = require_once __DIR__ . '/../../config/config.php';
        $this->mailer = new PHPMailer(true);
        
        // SMTPの設定
        $this->mailer->isSMTP();
        $this->mailer->Host = 'smtp.gmail.com';
        $this->mailer->SMTPAuth = true;
        $this->mailer->Username = $this->config['mail']['from'];
        $this->mailer->Password = $_ENV['GMAIL_APP_PASSWORD']; // 環境変数から取得
        $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mailer->Port = 587;
        $this->mailer->CharSet = 'UTF-8';
        
        // デバッグ出力を有効化（本番環境では削除してください）
        // $this->mailer->SMTPDebug = SMTP::DEBUG_SERVER;
    }

    public function sendContactMail($name, $email, $message) {
        try {
            // 送信元の設定
            $this->mailer->setFrom($this->config['mail']['from'], $this->config['site']['name']);
            $this->mailer->addReplyTo($email, $name);
            
            // 送信先の設定
            $this->mailer->addAddress($this->config['mail']['to']);
            
            // メール内容の設定
            $this->mailer->Subject = $this->config['mail']['subject'];
            $this->mailer->Body = $this->createMailBody($name, $email, $message);
            
            // 送信
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log('メール送信エラー: ' . $e->getMessage());
            return false;
        }
    }

    private function createMailBody($name, $email, $message) {
        return "名前: {$name}\n"
             . "メールアドレス: {$email}\n"
             . "お問合せ内容:\n{$message}";
    }
} 