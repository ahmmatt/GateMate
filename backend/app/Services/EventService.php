<?php

namespace App\Services;

use App\Models\Event;
use Illuminate\Database\Eloquent\Builder;

class EventService
{
    /**
     * Get a list of active public events with optional filters.
     *
     * @param array $filters
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getPublicEvents(array $filters = [])
    {
        $query = Event::with(['ticketTiers', 'admin'])
            ->where('status', 'active')
            ->whereDate('end_date', '>=', now()->toDateString());

        // Category filter
        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        // City filter
        if (!empty($filters['city'])) {
            $query->where('city', 'like', '%' . $filters['city'] . '%');
        }

        // Search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('city', 'like', '%' . $search . '%')
                  ->orWhere('venue_name', 'like', '%' . $search . '%')
                  ->orWhere('location_details', 'like', '%' . $search . '%');
            });
        }

        return $query->orderBy('start_date', 'asc')->get();
    }
}
