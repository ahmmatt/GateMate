<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * AttendeeResource — Format standar data Attendee/Peserta Event.
 */
class AttendeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id_attendee,
            'ticket_code'      => $this->ticket_code,
            'qr_token'         => $this->qr_token,
            'status'           => $this->status,
            'vibe_bio'         => $this->vibe_bio,
            'ig_handle'        => $this->ig_handle,
            'looking_for_match' => (bool) $this->looking_for_match,
            'created_at'       => $this->created_at?->toIso8601String(),
            'updated_at'       => $this->updated_at?->toIso8601String(),

            // Relasi opsional (hanya ada jika di-load)
            'user'        => new UserResource($this->whenLoaded('user')),
            'event'       => new EventResource($this->whenLoaded('event')),
            'ticket_tier' => new TicketTierResource($this->whenLoaded('ticketTier')),
        ];
    }
}
