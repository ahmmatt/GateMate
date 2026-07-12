<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ETicketMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Objek transaksi yang akan dikirim sebagai lampiran e-ticket.
     */
    public Transaction $transaction;

    /**
     * Terima objek transaksi (beserta relasi eager-loaded) dari webhook.
     */
    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction;
    }

    /**
     * Subjek dan pengirim email.
     */
    public function envelope(): Envelope
    {
        $eventTitle = $this->transaction->event->title ?? 'Event GateMate';

        return new Envelope(
            subject: "🎟️ E-Ticket Anda: {$eventTitle}",
        );
    }

    /**
     * Isi email — mengarah ke view emails.eticket.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.eticket',
            with: [
                'transaction' => $this->transaction,
            ],
        );
    }

    /**
     * Tidak ada lampiran file untuk saat ini.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
