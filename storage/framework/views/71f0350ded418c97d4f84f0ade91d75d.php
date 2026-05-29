<?php $__env->startSection('styles'); ?>
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
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
<main class="flex-grow max-w-[1280px] mx-auto w-full px-container-padding py-8">

<?php
    $now = \Carbon\Carbon::now();
    $upcomingTickets = $tickets->filter(function($t) use ($now) {
        $endDate = $t->event->end_date ? \Carbon\Carbon::parse($t->event->end_date) : \Carbon\Carbon::parse($t->event->start_date)->endOfDay();
        return $endDate->isFuture();
    });
    $pastTickets = $tickets->filter(function($t) use ($now) {
        $endDate = $t->event->end_date ? \Carbon\Carbon::parse($t->event->end_date) : \Carbon\Carbon::parse($t->event->start_date)->endOfDay();
        return $endDate->isPast();
    });
?>

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
<span class="font-label-md text-label-md text-primary"><?php echo e($upcomingTickets->count()); ?> Active</span>
</div>

<?php $__currentLoopData = $upcomingTickets; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $ticket): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <?php
        $ev = $ticket->event;
        $bannerSrc = !empty($ev->banner_image)
            ? asset('Media/uploads/' . $ev->banner_image)
            : asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif');
    ?>
<!-- Card -->
<div class="bg-white rounded-xl p-4 flex flex-col gap-4 shadow-sm border border-outline-variant hover:shadow-md transition-shadow">
<div class="flex justify-between items-center text-xs font-bold text-secondary">
<span><?php echo e(\Carbon\Carbon::parse($ev->start_date)->format('M d, l')); ?></span>
<span class="text-[#f04e37]"><?php echo e(\Carbon\Carbon::parse($ev->start_time)->format('h:i A')); ?></span>
</div>
<div class="w-full aspect-[16/9] overflow-hidden rounded-lg">
<img alt="<?php echo e($ev->title); ?>" class="w-full h-full object-cover" src="<?php echo e($bannerSrc); ?>">
</div>
<h2 class="text-lg font-bold text-on-surface line-clamp-1"><?php echo e($ev->title); ?></h2>
<div class="flex items-center gap-2 text-secondary text-xs">
<span class="material-symbols-outlined text-sm">location_on</span>
<span class="truncate">
    <?php if($ev->location_type === 'online'): ?>
        Online
    <?php else: ?>
        <?php echo e((!empty($ev->city) ? $ev->city . ', ' : '') . $ev->location_details); ?>

    <?php endif; ?>
</span>
</div>
<div class="flex flex-col gap-2 pt-2 border-t border-dashed border-outline-variant">
<div class="flex justify-between items-center text-xs">
<span class="text-secondary">Order ID</span>
<span class="font-medium"><?php echo e($ticket->order_id); ?></span>
</div>
<div class="flex justify-between items-center text-xs font-bold">
<span class="text-secondary">Total</span>
<span class="text-on-surface">Rp <?php echo e(number_format($ticket->gross_amount, 0, ',', '.')); ?></span>
</div>
</div>
<a href="<?php echo e(url('/ticket/'.$ticket->id.'/qrcode')); ?>" class="w-full py-2.5 bg-[#f04e37] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined text-sm">qr_code_2</span>
    Lihat E-Ticket
</a>
</div>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</div>


<div id="container-past" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style="display: none;">
<!-- Section Title: Past -->
<div class="flex items-center justify-between col-span-full mt-4">
<span class="font-label-md text-label-md text-secondary uppercase tracking-wider">Past History</span>
</div>
<div class="opacity-60 grayscale-[0.5] contents">
<?php $__currentLoopData = $pastTickets; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $ticket): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <?php
        $ev = $ticket->event;
        $bannerSrc = !empty($ev->banner_image)
            ? asset('Media/uploads/' . $ev->banner_image)
            : asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif');
    ?>
<div class="bg-white rounded-xl p-4 flex flex-col gap-4 shadow-sm border border-outline-variant hover:shadow-md transition-shadow">
<div class="flex justify-between items-center text-xs font-bold text-secondary">
<span><?php echo e(\Carbon\Carbon::parse($ev->start_date)->format('M d, l')); ?></span>
<span class="text-[#f04e37]"><?php echo e(\Carbon\Carbon::parse($ev->start_time)->format('h:i A')); ?></span>
</div>
<div class="w-full aspect-[16/9] overflow-hidden rounded-lg">
<img alt="<?php echo e($ev->title); ?>" class="w-full h-full object-cover" src="<?php echo e($bannerSrc); ?>">
</div>
<h2 class="text-lg font-bold text-on-surface line-clamp-1"><?php echo e($ev->title); ?></h2>
<div class="flex items-center gap-2 text-secondary text-xs">
<span class="material-symbols-outlined text-sm">location_on</span>
<span class="truncate">
    <?php if($ev->location_type === 'online'): ?>
        Online
    <?php else: ?>
        <?php echo e((!empty($ev->city) ? $ev->city . ', ' : '') . $ev->location_details); ?>

    <?php endif; ?>
</span>
</div>
<div class="flex flex-col gap-2 pt-2 border-t border-dashed border-outline-variant">
<div class="flex justify-between items-center text-xs">
<span class="text-secondary">Order ID</span>
<span class="font-medium"><?php echo e($ticket->order_id); ?></span>
</div>
<div class="flex justify-between items-center text-xs font-bold">
<span class="text-secondary">Total</span>
<span class="text-on-surface">Rp <?php echo e(number_format($ticket->gross_amount, 0, ',', '.')); ?></span>
</div>
</div>
<a href="<?php echo e(url('/ticket/'.$ticket->id.'/qrcode')); ?>" class="w-full py-2.5 bg-[#f04e37] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined text-sm">qr_code_2</span>
    Lihat E-Ticket
</a>
</div>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</div></div>

</main>


<?php $__env->stopSection(); ?>

<?php $__env->startSection('scripts'); ?>
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
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\JVC26\gatemate\resources\views/my_tickets.blade.php ENDPATH**/ ?>