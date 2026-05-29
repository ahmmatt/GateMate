@extends('layouts.app')

@section('styles')
<style>

        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .coral-badge {
            background-color: #FFF0EE;
            color: #B83020;
        }
        .gray-badge {
            background-color: #F5F5F7;
            color: #5F5E5E;
        }
        .coral-border-button {
            border: 1px solid #b22110;
            color: #b22110;
            transition: all 0.2s ease;
        }
        .coral-border-button:hover {
            background-color: #FFF0EE;
        }
        .navbar { z-index: 50; }
    
</style>
@endsection

@section('content')
<main class="flex-grow max-w-[1280px] mx-auto w-full px-container-padding py-8">

@php
    $now = \Carbon\Carbon::now();
    $upcomingTickets = $tickets->filter(function($t) use ($now) {
        $endDate = $t->event->end_date ? \Carbon\Carbon::parse($t->event->end_date) : \Carbon\Carbon::parse($t->event->start_date)->endOfDay();
        return $endDate->isFuture();
    });
    $pastTickets = $tickets->filter(function($t) use ($now) {
        $endDate = $t->event->end_date ? \Carbon\Carbon::parse($t->event->end_date) : \Carbon\Carbon::parse($t->event->start_date)->endOfDay();
        return $endDate->isPast();
    });
@endphp

<!-- Header & Segmented Control -->
<div class="flex flex-col gap-6 mb-10">
<h1 class="font-headline-lg text-headline-lg text-on-surface">My Tickets</h1>
<div class="flex gap-8 border-b border-outline-variant">
<button id="btn-upcoming" class="pb-3 text-primary font-bold border-b-2 border-primary transition-all">
                    Upcoming
                </button>
<button id="btn-past" class="pb-3 text-secondary hover:text-on-surface transition-all">
                    Past
                </button>
</div>
</div>
<!-- Ticket List Container -->
<div id="container-upcoming" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!-- Section Title: Upcoming -->
<div class="flex items-center justify-between mt-2 col-span-full mt-4">
<span class="font-label-md text-label-md text-secondary uppercase tracking-wider">Upcoming Events</span>
<span class="font-label-md text-label-md text-primary">{{ $upcomingTickets->count() }} Active</span>
</div>

@foreach($upcomingTickets as $ticket)
    @php
        $ev = $ticket->event;
        $bannerSrc = !empty($ev->banner_image)
            ? asset('Media/uploads/' . $ev->banner_image)
            : asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif');
    @endphp
<!-- Card -->
<div class="bg-white rounded-xl p-4 flex flex-col gap-4 shadow-sm border border-outline-variant hover:shadow-md transition-shadow">
<div class="flex justify-between items-center text-xs font-bold text-secondary">
<span>{{ \Carbon\Carbon::parse($ev->start_date)->format('M d, l') }}</span>
<span class="text-[#f04e37]">{{ \Carbon\Carbon::parse($ev->start_time)->format('h:i A') }}</span>
</div>
<div class="w-full aspect-[16/9] overflow-hidden rounded-lg">
<img alt="{{ $ev->title }}" class="w-full h-full object-cover" src="{{ $bannerSrc }}">
</div>
<h2 class="text-lg font-bold text-on-surface line-clamp-1">{{ $ev->title }}</h2>
<div class="flex items-center gap-2 text-secondary text-xs">
<span class="material-symbols-outlined text-sm">location_on</span>
<span class="truncate">
    @if ($ev->location_type === 'online')
        Online
    @else
        {{ (!empty($ev->city) ? $ev->city . ', ' : '') . $ev->location_details }}
    @endif
</span>
</div>
<div class="flex flex-col gap-2 pt-2 border-t border-dashed border-outline-variant">
<div class="flex justify-between items-center text-xs">
<span class="text-secondary">Order ID</span>
<span class="font-medium">{{ $ticket->order_id }}</span>
</div>
<div class="flex justify-between items-center text-xs font-bold">
<span class="text-secondary">Total</span>
<span class="text-on-surface">Rp {{ number_format($ticket->gross_amount, 0, ',', '.') }}</span>
</div>
</div>
<a href="{{ url('/ticket/'.$ticket->id.'/qrcode') }}" class="w-full py-2.5 bg-[#f04e37] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined text-sm">qr_code_2</span>
    Lihat E-Ticket
</a>
</div>
@endforeach
</div>


<div id="container-past" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style="display: none;">
<!-- Section Title: Past -->
<div class="flex items-center justify-between col-span-full mt-4">
<span class="font-label-md text-label-md text-secondary uppercase tracking-wider">Past History</span>
</div>
<div class="opacity-60 grayscale-[0.5] contents">
@foreach($pastTickets as $ticket)
    @php
        $ev = $ticket->event;
        $bannerSrc = !empty($ev->banner_image)
            ? asset('Media/uploads/' . $ev->banner_image)
            : asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif');
    @endphp
<div class="bg-white rounded-xl p-4 flex flex-col gap-4 shadow-sm border border-outline-variant hover:shadow-md transition-shadow">
<div class="flex justify-between items-center text-xs font-bold text-secondary">
<span>{{ \Carbon\Carbon::parse($ev->start_date)->format('M d, l') }}</span>
<span class="text-[#f04e37]">{{ \Carbon\Carbon::parse($ev->start_time)->format('h:i A') }}</span>
</div>
<div class="w-full aspect-[16/9] overflow-hidden rounded-lg">
<img alt="{{ $ev->title }}" class="w-full h-full object-cover" src="{{ $bannerSrc }}">
</div>
<h2 class="text-lg font-bold text-on-surface line-clamp-1">{{ $ev->title }}</h2>
<div class="flex items-center gap-2 text-secondary text-xs">
<span class="material-symbols-outlined text-sm">location_on</span>
<span class="truncate">
    @if ($ev->location_type === 'online')
        Online
    @else
        {{ (!empty($ev->city) ? $ev->city . ', ' : '') . $ev->location_details }}
    @endif
</span>
</div>
<div class="flex flex-col gap-2 pt-2 border-t border-dashed border-outline-variant">
<div class="flex justify-between items-center text-xs">
<span class="text-secondary">Order ID</span>
<span class="font-medium">{{ $ticket->order_id }}</span>
</div>
<div class="flex justify-between items-center text-xs font-bold">
<span class="text-secondary">Total</span>
<span class="text-on-surface">Rp {{ number_format($ticket->gross_amount, 0, ',', '.') }}</span>
</div>
</div>
<a href="{{ url('/ticket/'.$ticket->id.'/qrcode') }}" class="w-full py-2.5 bg-[#f04e37] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined text-sm">qr_code_2</span>
    Lihat E-Ticket
</a>
</div>
@endforeach
</div></div>

</main>


@endsection

@section('scripts')
<script>

        // Simple micro-interaction for segmented control
        const btnUpcoming = document.getElementById('btn-upcoming');
        const btnPast = document.getElementById('btn-past');
        const containerUpcoming = document.getElementById('container-upcoming');
        const containerPast = document.getElementById('container-past');

        btnUpcoming.addEventListener('click', () => {
            btnUpcoming.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary');
            btnUpcoming.classList.remove('text-secondary');
            
            btnPast.classList.remove('text-primary', 'font-bold', 'border-b-2', 'border-primary');
            btnPast.classList.add('text-secondary');
            
            containerUpcoming.style.display = 'grid';
            containerPast.style.display = 'none';
        });

        btnPast.addEventListener('click', () => {
            btnPast.classList.add('text-primary', 'font-bold', 'border-b-2', 'border-primary');
            btnPast.classList.remove('text-secondary');
            
            btnUpcoming.classList.remove('text-primary', 'font-bold', 'border-b-2', 'border-primary');
            btnUpcoming.classList.add('text-secondary');
            
            containerPast.style.display = 'grid';
            containerUpcoming.style.display = 'none';
        });
    
</script>
@endsection
