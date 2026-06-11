<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * TicketTierResource — Format standar data Tier Tiket.
 */
class TicketTierResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id_tier,
            'event_id'        => $this->id_event,
            'tier_name'       => $this->tier_name,
            'price'           => (float) $this->price,
            'capacity'        => (int) $this->capacity,
            'remaining_seats' => (int) $this->remaining_seats,
            'is_unlimited'    => (bool) $this->is_unlimited,
            'is_available'    => $this->is_unlimited || $this->remaining_seats > 0,
        ];
    }
}
