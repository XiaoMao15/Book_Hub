<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

/** Fungsi: admin membaca dan mengelola pesan Contact Us. */
class AdminMessageController extends Controller
{
    public function index(Request $request)
    {
        $messages = Message::query()
            ->when($request->has('is_read'), fn ($q) => $q->where('is_read', $request->boolean('is_read')))
            ->orderByDesc('id')
            ->get();

        return response()->json($messages);
    }

        public function show($id)
    {
        return response()->json(Message::findOrFail($id));
    }

    public function markRead($id)
    {
        $message = Message::findOrFail($id);
        $message->update(['is_read' => true]);

        return response()->json($message);
    }
}