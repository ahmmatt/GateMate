<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PageController extends Controller
{
    /**
     * Menampilkan halaman Landing Page utama.
     */
    public function index(): View
    {
        return view('landing');
    }

    /**
     * Menampilkan halaman Discover dengan filter event.
     */
    public function discover(Request $request): View
    {
        // ── Tangkap Filter dari Query String atau Cookie ───────────────────────
        $selectedCity     = $request->query('city', $request->cookie('user_city', 'All'));
        $selectedCategory = $request->query('category', 'All');
        $searchKeyword    = trim($request->query('search', ''));

        // ── Query Events dengan Subquery Harga & Join Author ──────────────────
        $events = Event::select('events.*')
            ->selectRaw('u.full_name AS author_name')
            ->selectRaw('u.profile_picture AS author_image')
            ->selectRaw('(SELECT MIN(price) FROM ticket_tiers WHERE ticket_tiers.id_event = events.id_event) as min_price')
            ->selectRaw('(SELECT COUNT(*) FROM ticket_tiers WHERE ticket_tiers.id_event = events.id_event AND price = 0) as has_free')
            ->leftJoin('users as u', 'events.id_admin', '=', 'u.id_user')
            ->where('events.status', 'active')
            ->when($selectedCategory !== 'All', fn ($q) => $q->where('events.category', $selectedCategory))
            ->when($selectedCity !== 'All',     fn ($q) => $q->where('events.city', $selectedCity))
            ->when($searchKeyword !== '',        fn ($q) => $q->where('events.title', 'LIKE', "%{$searchKeyword}%"))
            ->orderByDesc('events.created_at')
            ->limit(10)
            ->get();

        // ── Hitung Jumlah Event per Kategori ──────────────────────────────────
        $catCounts = Event::where('status', 'active')
            ->selectRaw('category, COUNT(*) as cnt')
            ->groupBy('category')
            ->pluck('cnt', 'category');

        // ── Hitung Jumlah Event per Kota ──────────────────────────────────────
        $citiesList = ['Jakarta', 'Bali', 'Bandung', 'Surabaya', 'Yogyakarta', 'Makassar', 'Medan', 'Semarang'];

        $cityCounts = Event::where('status', 'active')
            ->whereIn('city', $citiesList)
            ->selectRaw('city, COUNT(*) as cnt')
            ->groupBy('city')
            ->pluck('cnt', 'city');

        return view('discover', compact(
            'events',
            'catCounts',
            'cityCounts',
            'selectedCity',
            'selectedCategory',
            'searchKeyword',
        ));
    }
}
