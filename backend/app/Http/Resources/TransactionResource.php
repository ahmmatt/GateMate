<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * TransactionResource — Format standar data Transaksi.
 * Digunakan di TicketController, CheckoutController, dll.
 */
class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'order_id'       => $this->order_id,
            'gross_amount'   => (float) $this->gross_amount,
            'formatted_amount' => $this->formatted_amount,
            'payment_status' => $this->payment_status,
            'seat_number'    => $this->seat_number,
            'is_used'        => (bool) $this->is_used,
            'scanned_at'     => $this->scanned_at?->toIso8601String(),
            'created_at'     => $this->created_at?->toIso8601String(),

            // Relasi opsional (hanya ada jika di-load)
            'event'          => new EventResource($this->whenLoaded('event')),
            'ticket_tier'    => new TicketTierResource($this->whenLoaded('ticketTier')),
            'user'           => new UserResource($this->whenLoaded('user')),
        ];
    }
}
