<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class ChatController extends Controller
{
    // Mengambil daftar orang yang pernah chat dengan user
    public function getInbox()
    {
        $userId = Auth::user()->id_user;

        // Ambil daftar user_id unik yang pernah berkomunikasi
        $contactIds = DB::table('messages')
            ->where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->selectRaw('CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as contact_id', [$userId])
            ->groupBy('contact_id')
            ->pluck('contact_id');

        $contacts = User::whereIn('id_user', $contactIds)->get()->map(function($user) use ($userId) {
            // Ambil pesan terakhir
            $lastMessage = DB::table('messages')
                ->where(function($q) use ($user, $userId) {
                    $q->where('sender_id', $userId)->where('receiver_id', $user->id_user);
                })
                ->orWhere(function($q) use ($user, $userId) {
                    $q->where('sender_id', $user->id_user)->where('receiver_id', $userId);
                })
                ->orderBy('created_at', 'desc')
                ->first();

            return [
                'id_user' => $user->id_user,
                'name' => $user->full_name,
                'avatar' => $user->profile_picture_url,
                'last_message' => $lastMessage->content ?? '',
                'time' => $lastMessage->created_at ?? '',
                'unread' => 0
            ];
        });

        // Urutkan berdasarkan waktu terakhir chat
        $contacts = $contacts->sortByDesc('time')->values();

        return response()->json(['success' => true, 'data' => $contacts]);
    }

    // Mengambil histori pesan dengan spesifik user
    public function getMessages($contactId)
    {
        $userId = Auth::user()->id_user;

        // Tandai pesan sebagai sudah dibaca
        DB::table('messages')
            ->where('sender_id', $contactId)
            ->where('receiver_id', $userId)
            ->update(['is_read' => true]);

        $messages = DB::table('messages')
            ->where(function($q) use ($userId, $contactId) {
                $q->where('sender_id', $userId)->where('receiver_id', $contactId);
            })
            ->orWhere(function($q) use ($userId, $contactId) {
                $q->where('sender_id', $contactId)->where('receiver_id', $userId);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        $contact = User::find($contactId);

        return response()->json([
            'success' => true, 
            'contact' => [
                'id_user' => $contact->id_user,
                'name' => $contact->full_name,
                'avatar' => $contact->profile_picture_url
            ],
            'messages' => $messages
        ]);
    }

    // Mengirim pesan
    public function sendMessage(Request $request, $contactId)
    {
        $request->validate([
            'content' => 'required|string'
        ]);

        $userId = Auth::user()->id_user;

        $msgId = DB::table('messages')->insertGetId([
            'sender_id' => $userId,
            'receiver_id' => $contactId,
            'content' => $request->content,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $message = DB::table('messages')->where('id', $msgId)->first();

        return response()->json(['success' => true, 'data' => $message]);
    }
}
