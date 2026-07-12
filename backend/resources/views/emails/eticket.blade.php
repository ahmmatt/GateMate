<!DOCTYPE html>
<html lang="id" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>E-Ticket GateMate</title>
    <style>
        /* ── Reset ─── */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { background: #f0f4f8; font-family: 'Segoe UI', Arial, sans-serif; }

        /* ── Wrapper ─── */
        .wrapper {
            background: #f0f4f8;
            padding: 40px 16px;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }

        /* ── Header ─── */
        .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-radius: 20px 20px 0 0;
            padding: 36px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: -60px; left: -60px; right: -60px;
            height: 200px;
            background: radial-gradient(ellipse at center, rgba(74,222,128,0.15) 0%, transparent 70%);
        }
        .header-brand {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #4ade80;
            margin-bottom: 10px;
        }
        .header-title {
            font-size: 26px;
            font-weight: 800;
            color: #ffffff;
            line-height: 1.2;
            margin-bottom: 6px;
        }
        .header-sub {
            font-size: 14px;
            color: #94a3b8;
        }

        /* ── Ticket Body ─── */
        .ticket-body {
            background: #ffffff;
            padding: 0;
            border-left: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
        }

        /* ── Event Hero ─── */
        .event-hero {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
            padding: 28px 40px;
            text-align: center;
        }
        .event-tag {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 4px 12px;
            border-radius: 100px;
            margin-bottom: 12px;
        }
        .event-name {
            font-size: 22px;
            font-weight: 800;
            color: #ffffff;
            line-height: 1.3;
        }

        /* ── Perforated separator ─── */
        .perforation {
            position: relative;
            height: 24px;
            background: #ffffff;
            border-left: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
        }
        .perforation::before {
            content: '';
            position: absolute;
            top: 50%; left: 0; right: 0;
            border-top: 2px dashed #e2e8f0;
            transform: translateY(-50%);
        }
        .perforation::after {
            content: '';
            position: absolute;
            top: 50%; left: -16px;
            width: 32px; height: 32px;
            background: #f0f4f8;
            border-radius: 50%;
            transform: translateY(-50%);
            border: 1px solid #e2e8f0;
        }
        .perforation .notch-right {
            position: absolute;
            top: 50%; right: -16px;
            width: 32px; height: 32px;
            background: #f0f4f8;
            border-radius: 50%;
            transform: translateY(-50%);
            border: 1px solid #e2e8f0;
        }

        /* ── Info grid ─── */
        .info-section {
            padding: 28px 40px;
        }
        .greeting {
            font-size: 15px;
            color: #334155;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .greeting strong { color: #0f172a; }

        .info-grid {
            display: table;
            width: 100%;
            border-collapse: collapse;
        }
        .info-row {
            display: table-row;
        }
        .info-label, .info-value {
            display: table-cell;
            padding: 10px 0;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: top;
        }
        .info-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #94a3b8;
            width: 40%;
            padding-right: 16px;
            white-space: nowrap;
        }
        .info-value {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
        }
        .info-value.mono {
            font-family: 'Courier New', monospace;
            font-size: 13px;
            letter-spacing: 0.5px;
            color: #6366f1;
        }
        .info-value.green { color: #059669; }

        /* ── QR Button ─── */
        .cta-section {
            padding: 0 40px 32px;
            text-align: center;
        }
        .cta-label {
            font-size: 12px;
            color: #94a3b8;
            margin-bottom: 14px;
            font-weight: 500;
        }
        .btn-ticket {
            display: inline-block;
            padding: 14px 36px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #ffffff !important;
            text-decoration: none;
            font-size: 15px;
            font-weight: 700;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(99,102,241,0.35);
            letter-spacing: -0.2px;
        }

        /* ── Instructions ─── */
        .instructions {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px 24px;
            margin: 0 40px 28px;
        }
        .instructions-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #64748b;
            margin-bottom: 12px;
        }
        .instructions ul {
            padding-left: 18px;
        }
        .instructions li {
            font-size: 13px;
            color: #475569;
            line-height: 1.7;
        }

        /* ── Footer ─── */
        .footer {
            background: #0f172a;
            border-radius: 0 0 20px 20px;
            padding: 28px 40px;
            text-align: center;
        }
        .footer p {
            font-size: 12px;
            color: #475569;
            line-height: 1.7;
            margin-bottom: 8px;
        }
        .footer .footer-brand {
            font-size: 13px;
            font-weight: 700;
            color: #4ade80;
            letter-spacing: 1px;
        }

        /* ── Responsive ─── */
        @media (max-width: 600px) {
            .header, .info-section, .cta-section, .instructions { padding-left: 24px; padding-right: 24px; }
            .event-hero { padding: 22px 24px; }
            .footer { padding: 24px; }
            .event-name { font-size: 18px; }
        }
    </style>
</head>
<body>
<div class="wrapper">
<div class="container">

    {{-- ── Header ── --}}
    <div class="header">
        <div class="header-brand">GateMate</div>
        <div class="header-title">🎟️ E-Ticket Anda Siap!</div>
        <div class="header-sub">Pembayaran telah dikonfirmasi</div>
    </div>

    <div class="ticket-body">

        {{-- ── Event Hero ── --}}
        <div class="event-hero">
            <div class="event-tag">{{ $transaction->event->category ?? 'Event' }}</div>
            <div class="event-name">{{ $transaction->event->title ?? 'Event GateMate' }}</div>
        </div>

        {{-- ── Perforation ── --}}
        <div class="perforation"><div class="notch-right"></div></div>

        {{-- ── Info Section ── --}}
        <div class="info-section">
            <p class="greeting">
                Halo, <strong>{{ $transaction->user->full_name ?? 'Peserta' }}</strong>! 🎉<br>
                Terima kasih telah membeli tiket. Pembayaran Anda telah kami terima dan tiket sudah aktif. Tunjukkan QR Code di bawah kepada panitia saat tiba di lokasi.
            </p>

            <div class="info-grid">
                <div class="info-row">
                    <div class="info-label">Order ID</div>
                    <div class="info-value mono">{{ $transaction->order_id }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Nama Pemesan</div>
                    <div class="info-value">{{ $transaction->user->full_name ?? '—' }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Event</div>
                    <div class="info-value">{{ $transaction->event->title ?? '—' }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Tanggal</div>
                    <div class="info-value">
                        @if($transaction->event && $transaction->event->start_date)
                            {{ \Carbon\Carbon::parse($transaction->event->start_date)->translatedFormat('d F Y') }}
                        @else
                            —
                        @endif
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-label">Tipe Tiket</div>
                    <div class="info-value green">{{ $transaction->ticketTier->tier_name ?? '—' }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Status</div>
                    <div class="info-value green">✅ Lunas</div>
                </div>
            </div>
        </div>

        {{-- ── CTA Button ── --}}
        <div class="cta-section">
            <p class="cta-label">Klik tombol di bawah untuk melihat QR Code Anda</p>
            <a href="{{ route('ticket.qrcode', $transaction->id) }}" class="btn-ticket">
                Lihat QR Code & E-Ticket
            </a>
        </div>

        {{-- ── Instructions ── --}}
        <div class="instructions">
            <div class="instructions-title">📋 Petunjuk Penggunaan Tiket</div>
            <ul>
                <li>Simpan email ini atau screenshot QR Code Anda sebagai backup.</li>
                <li>Tunjukkan QR Code kepada panitia saat tiba di lokasi event.</li>
                <li>Setiap QR Code hanya dapat digunakan <strong>satu kali</strong>.</li>
                <li>Tiket tidak dapat dipindahtangankan setelah verifikasi.</li>
            </ul>
        </div>

    </div>{{-- /.ticket-body --}}

    {{-- ── Footer ── --}}
    <div class="footer">
        <p class="footer-brand">GateMate</p>
        <p>Email ini dikirim secara otomatis. Mohon jangan membalas email ini.<br>
           Butuh bantuan? Hubungi panitia event terkait.</p>
        <p style="margin-top:8px; color:#334155;">
            © {{ date('Y') }} GateMate · Tiket Aman, Acara Lancar.
        </p>
    </div>

</div>
</div>
</body>
</html>
