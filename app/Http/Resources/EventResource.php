<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * EventResource — Format standar data Event.
 * Digunakan baik untuk list public maupun detail.
 */
class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id_event,
            'title'            => $this->title,
            'category'         => $this->category,
            'status'           => $this->status,
            'description'      => $this->description,
            'location_type'    => $this->location_type,
            'location_details' => $this->location_details,
            'venue_name'       => $this->venue_name,
            'city'             => $this->city,
            'maps_link'        => $this->maps_link,
            'start_date'       => $this->start_date?->toDateString(),
            'end_date'         => $this->end_date?->toDateString(),
            'start_time'       => $this->start_time,
            'end_time'         => $this->end_time,
            'timezone'         => $this->timezone,
            'require_approval' => (bool) $this->require_approval,
            'capacity_type'    => $this->capacity_type,
            'max_capacity'     => $this->max_capacity,
            'seat_assignment'  => $this->seat_assignment,
            'custom_questions' => $this->custom_questions ?? [],
            'banner_image_url' => $this->banner_image
                ? asset('Media/uploads/' . $this->banner_image)
                : null,
            'poster_image_url' => $this->poster_path
                ? asset('Media/uploads/' . $this->poster_path)
                : null,
            'created_at'       => $this->created_at?->toIso8601String(),

            // Relasi opsional (hanya ada jika di-load)
            'ticket_tiers'     => TicketTierResource::collection(
                $this->whenLoaded('ticketTiers')
            ),
            'organizer'        => new UserResource($this->whenLoaded('admin')),
        ];
    }
}
