<?php $__env->startSection('content'); ?>
<div class="flex flex-col gap-10">

    <!-- Hero Section -->
    <section class="bg-surface-container-low rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-fixed/30 to-transparent pointer-events-none"></div>
        <div class="relative z-10 max-w-2xl">
            <h1 class="font-headline-lg text-headline-lg md:text-5xl font-bold text-on-surface mb-4">Discover Event</h1>
            <p class="font-body-lg text-body-lg text-secondary mb-8">Find what's happening nearby, pick your favorite category, or search instantly.</p>
            
            <!-- Search Form -->
            <form action="<?php echo e(route('discover')); ?>" method="GET" class="flex items-center gap-2 bg-surface-container-lowest rounded-full p-2 shadow-sm focus-within:ring-2 ring-primary transition-all">
                <input type="hidden" name="city" value="<?php echo e($selectedCity ?? 'All'); ?>">
                <input type="hidden" name="category" value="<?php echo e($selectedCategory ?? 'All'); ?>">
                <span class="material-symbols-outlined text-secondary ml-3">search</span>
                <input type="text" name="search" placeholder="Search event by title..." value="<?php echo e($searchKeyword ?? ''); ?>" class="w-full bg-transparent border-none outline-none text-on-surface font-body-md focus:ring-0">
                <button type="submit" class="bg-primary hover:bg-primary-container text-on-primary px-6 py-2 rounded-full font-label-md font-bold transition-colors">Search</button>
            </form>
        </div>
    </section>

    <?php
    $categories = [
        'Music Concert' => 'Konser',
        'Workshop & Training' => 'Workshop',
        'Sport' => 'Sport',
        'Festival' => 'Festival',
        'Exhibition' => 'Pameran',
        'Tech Seminar' => 'Seminar'
    ];
    $selectedCity = $selectedCity ?? 'All';
    $selectedCategory = $selectedCategory ?? 'All';
    $searchKeyword = $searchKeyword ?? '';
    
    $cities = ['Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Yogyakarta', 'Medan', 'Makassar', 'Semarang'];
    ?>

    <!-- Filters & Dropdown -->
    <section class="flex flex-col md:flex-row md:items-center justify-between gap-gap-default mb-8 mt-8">
        <div class="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
            <a href="<?php echo e(route('discover', ['category' => 'All', 'city' => $selectedCity, 'search' => $searchKeyword])); ?>" 
               class="whitespace-nowrap px-5 py-2 rounded-full font-label-md text-label-md transition-all active:scale-95 <?php echo e($selectedCategory === 'All' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-secondary hover:bg-surface-container-high'); ?>">
               Semua
            </a>
            <?php $__currentLoopData = $categories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $catKey => $catLabel): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <a href="<?php echo e(route('discover', ['category' => $catKey, 'city' => $selectedCity, 'search' => $searchKeyword])); ?>" 
               class="whitespace-nowrap px-5 py-2 rounded-full font-label-md text-label-md transition-all active:scale-95 <?php echo e($selectedCategory === $catKey ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-secondary hover:bg-surface-container-high'); ?>">
               <?php echo e($catLabel); ?>

            </a>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
        
        <div class="relative min-w-[160px]">
            <select onchange="window.location.href=this.value" class="appearance-none w-full bg-surface-container-low border border-outline-variant/30 rounded-[10px] px-4 py-2 font-body-md text-body-md focus:outline-none focus:border-primary cursor-pointer">
                <option value="<?php echo e(route('discover', ['city' => 'All', 'category' => $selectedCategory, 'search' => $searchKeyword])); ?>" <?php echo e($selectedCity === 'All' ? 'selected' : ''); ?>>Semua Kota</option>
                <?php $__currentLoopData = $cities; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $city): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <option value="<?php echo e(route('discover', ['city' => $city, 'category' => $selectedCategory, 'search' => $searchKeyword])); ?>" <?php echo e($selectedCity === $city ? 'selected' : ''); ?>><?php echo e($city); ?></option>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </select>
            <span class="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary pointer-events-none">expand_more</span>
        </div>
    </section>

    <!-- Events Grid -->
    <section>
        <div class="flex items-center justify-between mb-6">
            <h2 class="font-headline-md text-headline-md font-bold text-on-surface">Recently Added</h2>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <?php $__empty_1 = true; $__currentLoopData = $events; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $event): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                <a href="<?php echo e(route('event.show', $event->id_event)); ?>" class="group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:border-primary hover:shadow-lg transition-all flex flex-col h-full">
                    
                    <div class="relative h-48 overflow-hidden">
                        <?php
                        $bannerSrc = !empty($event->banner_image)
                        ? asset('Media/uploads/' . $event->banner_image)
                        : asset('Media/09071799-7231-4faa-883e-a1eb2d01ef9b.avif');
                        ?>
                        <img src="<?php echo e($bannerSrc); ?>" alt="<?php echo e($event->title); ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <div class="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full text-primary font-label-md font-bold text-xs flex items-center gap-1">
                            <span class="material-symbols-outlined" style="font-size: 14px;">calendar_month</span>
                            <?php echo e(\Carbon\Carbon::parse($event->start_date)->format('M j')); ?>

                        </div>
                    </div>
                    
                    <div class="p-5 flex flex-col flex-grow">
                        <h3 class="font-headline-sm font-bold text-on-surface mb-2 line-clamp-2"><?php echo e($event->title); ?></h3>
                        
                        <div class="flex items-center gap-2 text-secondary font-caption mb-2">
                            <span class="material-symbols-outlined" style="font-size: 16px;">location_on</span>
                            <span class="truncate">
                                <?php if($event->location_type === 'online'): ?>
                                Online Event
                                <?php else: ?>
                                <?php echo e((!empty($event->city) ? $event->city . ', ' : '') . $event->location_details); ?>

                                <?php endif; ?>
                            </span>
                        </div>
                        
                        <div class="flex items-center gap-2 text-secondary font-caption mb-4">
                            <span class="material-symbols-outlined" style="font-size: 16px;">schedule</span>
                            <span><?php echo e(\Carbon\Carbon::createFromTimeString($event->start_time)->format('g:i A')); ?></span>
                        </div>
                        
                        <div class="mt-auto pt-4 border-t border-outline-variant/50 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <?php
                                $authorName = !empty($event->author_name) ? $event->author_name : 'Unknown Admin';
                                $authorInitial = strtoupper(substr($authorName, 0, 1));
                                ?>
                                <?php if(!empty($event->author_image)): ?>
                                <img src="<?php echo e(asset('Media/uploads/' . $event->author_image)); ?>" alt="Author Logo" class="w-6 h-6 rounded-full object-cover">
                                <?php else: ?>
                                <div class="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-[10px]"><?php echo e($authorInitial); ?></div>
                                <?php endif; ?>
                                <span class="font-caption text-secondary truncate max-w-[100px]"><?php echo e($authorName); ?></span>
                            </div>
                            
                            <div class="font-label-md font-bold text-primary">
                                <?php if($event->has_free > 0 || $event->min_price == 0): ?>
                                Free
                                <?php else: ?>
                                Rp <?php echo e(number_format($event->min_price, 0, ',', '.')); ?>

                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </a>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                <div class="col-span-full py-16 flex flex-col items-center justify-center bg-surface-container-low rounded-2xl border border-outline-variant border-dashed">
                    <span class="material-symbols-outlined text-secondary-fixed-variant" style="font-size: 48px;">event_busy</span>
                    <h3 class="mt-4 font-headline-sm font-bold text-on-surface">No Events Available</h3>
                    <p class="text-secondary font-body-md mt-2 text-center max-w-md">There are no upcoming events at the moment. Please check back later or try adjusting your filters.</p>
                </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- City Explorer -->
    <section class="mb-16 mt-8">
        <h2 class="font-headline-md text-headline-md font-bold text-on-surface mb-6">Cari Event di Kotamu</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <?php
            $cityMeta = [
                'Jakarta' => ['color' => 'bg-primary-container text-on-primary-container', 'icon' => 'location_city'],
                'Bali' => ['color' => 'bg-tertiary-container text-on-tertiary-container', 'icon' => 'holiday_village'],
                'Bandung' => ['color' => 'bg-secondary-container text-on-secondary-container', 'icon' => 'landscape'],
                'Surabaya' => ['color' => 'bg-error-container text-on-error-container', 'icon' => 'apartment'],
                'Yogyakarta' => ['color' => 'bg-surface-variant text-on-surface-variant', 'icon' => 'account_balance'],
                'Makassar' => ['color' => 'bg-primary-fixed text-on-primary-fixed', 'icon' => 'sailing'],
                'Medan' => ['color' => 'bg-tertiary-fixed text-on-tertiary-fixed', 'icon' => 'map'],
                'Semarang' => ['color' => 'bg-secondary-fixed text-on-secondary-fixed', 'icon' => 'train'],
            ];
            ?>
            
            <?php $__currentLoopData = $cityMeta; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $cityName => $meta): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <a href="<?php echo e(route('discover', ['category' => $selectedCategory, 'city' => $cityName])); ?>" 
               class="bg-surface-container-low border border-outline-variant/20 p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-all cursor-pointer">
                <div class="w-10 h-10 rounded-full flex items-center justify-center <?php echo e($meta['color']); ?>">
                    <span class="material-symbols-outlined"><?php echo e($meta['icon']); ?></span>
                </div>
                <div>
                    <h4 class="font-headline-sm text-[16px] text-on-surface"><?php echo e($cityName); ?></h4>
                    <p class="font-body-md text-primary"><?php echo e(isset($cityCounts) ? $cityCounts->get($cityName, 0) : 0); ?> Events</p>
                </div>
            </a>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
    </section>

</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\JVC26\gatemate\resources\views/discover.blade.php ENDPATH**/ ?>