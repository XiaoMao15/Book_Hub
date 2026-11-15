<?php

use Illuminate\Support\Facades\Route;

// Fungsi: penanda bahwa API aktif. Endpoint sebenarnya ada di routes/api.php.
Route::get('/', fn () => response()->json(['app' => 'Book.Hub API']));