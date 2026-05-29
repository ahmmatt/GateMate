<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketRefundNotification extends Notification
{
    use Queueable;

    protected $eventTitle;
    protected $ticketTier;
    protected $refundAmount;

    /**
     * Create a new notification instance.
     */
    public function __construct($eventTitle, $ticketTier, $refundAmount)
    {
        $this->eventTitle = $eventTitle;
        $this->ticketTier = $ticketTier;
        $this->refundAmount = $refundAmount;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'ticket_refund',
            'title' => 'Refund Tiket Berhasil',
            'message' => 'Tiket untuk event "' . $this->eventTitle . '" (' . $this->ticketTier . ') telah dibatalkan. Saldo sebesar Rp ' . number_format($this->refundAmount, 0, ',', '.') . ' telah dikembalikan ke dompet Anda.',
            'amount' => $this->refundAmount,
        ];
    }
}
