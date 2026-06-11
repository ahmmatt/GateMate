<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * TicketResource — Format standar data Tiket (Transaction) milik user.
 * Berisi data QR code (order_id) dan relasi event + tier.
 */
class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'order_id'       => $this->order_id,
            'gross_amount'   => (float) $this->gross_amount,
            'payment_status' => $this->payment_status,
            'is_used'        => (bool) $this->is_used,
            'scanned_at'     => $this->scanned_at
                ? \Carbon\Carbon::parse($this->scanned_at)->toIso8601String()
                : null,
            'created_at'     => $this->created_at?->toIso8601String(),

            // Relasi
            'event'          => new EventResource($this->whenLoaded('event')),
            'ticket_tier'    => new TicketTierResource($this->whenLoaded('ticketTier')),
            'user'           => new UserResource($this->whenLoaded('user')),

            // QR Code data — untuk generate QR di frontend
            'qr_data'        => $this->order_id,
        ];
    }
}
