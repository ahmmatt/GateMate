<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * WalletTransactionResource — Format standar data histori transaksi wallet.
 */
class WalletTransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Label tipe transaksi dalam Bahasa Indonesia
        $typeLabels = [
            'topup'           => 'Top-up Saldo',
            'ticket_purchase' => 'Pembelian Tiket',
            'ticket_refund'   => 'Refund Tiket',
            'payment'         => 'Pembayaran ke Tenant',
            'tenant_revenue'  => 'Pendapatan Tenant',
            'withdrawal'      => 'Penarikan Dana',
        ];

        $statusLabels = [
            'pending'           => 'Menunggu',
            'success'           => 'Berhasil',
            'failed'            => 'Gagal',
            'pending_admin'     => 'Menunggu Persetujuan Admin',
            'pending_superadmin'=> 'Menunggu Persetujuan Superadmin',
        ];

        return [
            'id'           => $this->id,
            'order_id'     => $this->order_id,
            'type'         => $this->type,
            'type_label'   => $typeLabels[$this->type] ?? $this->type,
            'amount'       => (float) $this->amount,
            'status'       => $this->status,
            'status_label' => $statusLabels[$this->status] ?? $this->status,
            'meta'         => $this->meta,
            'created_at'   => $this->created_at?->toIso8601String(),
        ];
    }
}
