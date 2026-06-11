<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * UserResource — Format standar data User yang di-return ke client.
 * Password dan token selalu dikecualikan secara otomatis oleh #[Hidden].
 */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                     => $this->id_user,
            'full_name'              => $this->full_name,
            'email'                  => $this->email,
            'gender'                 => $this->gender,
            'role'                   => $this->role,
            'wallet_balance'         => (float) $this->wallet_balance,
            'is_verified_organizer'  => (bool) $this->is_verified_organizer,
            'face_verified_at'       => $this->face_verified_at?->toIso8601String(),
            'profile_picture_url'    => $this->profile_picture
                ? asset('Media/uploads/' . $this->profile_picture)
                : null,
            'organization_name'      => $this->organization_name,
            'phone'                  => $this->phone,
            'instagram'              => $this->instagram,
            'created_at'             => $this->created_at?->toIso8601String(),
        ];
    }
}
