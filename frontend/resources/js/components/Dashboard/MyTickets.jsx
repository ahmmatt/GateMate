import React, { useState, useEffect } from 'react';
import MaterialIcon from '../Common/MaterialIcon';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Replace with your actual API endpoint
        // const response = await fetch('/api/tickets');
        // const data = await response.json();
        // setTickets(data);

        // Mock data
        setTickets([
          {
            id: 1,
            event_name: 'Electronic Dream Festival 2024',
            location: 'Jakarta',
            date: '2024-10-15',
            time: '19:00',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-R23g0xqmyCnV2kyGdLbIHqaBfGDjJC4v4e7sZrx2y1kh-VANneEcHfHiYSp8hSojhtvLFoK-B-mRYaeXNrDFz9RyB-5M-TeXuBX-mQ7n7-oSTmazzPj6WA_6l58dt2Ht0kH59Clv9ilB-9sISAN65TisSSsqZssq77b9EzlAOR3LP0jt-QFUOnRHXwt9Bc5qZF7C06KDxwY38RKAlbCrZAZSNVTu2DhyDjW3ND4i-4laIxxl2Zn3eEapj0BWZzwwpQosYZTJyzk',
            ticket_number: '#TK001234567',
            quantity: 2,
            status: 'active',
            price: 900000,
          },
          {
            id: 2,
            event_name: 'AI Revolution Indonesia',
            location: 'Bandung',
            date: '2024-11-22',
            time: '08:30',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU1JEPzWYntEVZ2-5eHxBbdgS2bTQc6jjfsnirHgb_1RosnmlJlAnX_jG-JX_CxrsYCGCLX4EYlhz7P08C641U58cXGwP9hCOi7dOfHMDXkIWWSOPvu-i8RKtfvbeS9s06DgdzucM5s019cWx8Z9Te0h0_d0NDv4YgLggix8l4rv-bbVAwfpSQxo8Zp0eSLd662Uie-W5LgIxqDJa02_tzrSWSLRlz0A475dAlTFCgljxJE5FZsrvg5bVrY7iGVZeP8SCHJADHFeA',
            ticket_number: '#TK002345678',
            quantity: 1,
            status: 'active',
            price: 250000,
          },
          {
            id: 3,
            event_name: 'National Basketball Cup',
            location: 'Surabaya',
            date: '2024-12-05',
            time: '18:00',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiofYmOlkeHdee3akjenkzZRxo0dMi12F4Wpc5Jn0qScLOTl2FQcO5hA84tO9fZdUXocp2mU2kC6Uvs2FxAMmvWgHphj29YquwrlnMdHj1blpYdEkd5zK7TWAyOoXVIJIzXQ0J_Ju-41nOcpysPZnxN4HKvNFAYopRVim5SsCxf9OvI8Az4pECpLcn8BhyXm7no77036wDb5o4gGBPY9wHGxA8f6vlrine5Z2_k2RzeT5j24cx1oF7BEVm-If37g5748qCIcPZOz4',
            ticket_number: '#TK003456789',
            quantity: 3,
            status: 'active',
            price: 450000,
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { label: 'Aktif', color: 'bg-tertiary-fixed text-tertiary-fixed-variant' },
      used: { label: 'Terpakai', color: 'bg-secondary-fixed text-secondary-fixed-variant' },
      expired: { label: 'Kadaluarsa', color: 'bg-error-container text-error' },
    };
    return statusMap[status] || statusMap.active;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="font-body-md text-body-md text-secondary">Memuat tiket...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl overflow-hidden card-shadow">
      {/* Header */}
      <div className="p-6 border-b border-outline-variant/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline-md text-headline-md text-on-surface">Tiket Saya</h2>
          <a href="#" className="font-label-md text-label-md text-primary hover:underline">
            Lihat Semua
          </a>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 overflow-x-auto">
          {['upcoming', 'active', 'used', 'expired'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-body-md text-body-md whitespace-nowrap transition-all ${
                filter === tab
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-secondary hover:text-on-surface'
              }`}
            >
              {tab === 'upcoming' && 'Mendatang'}
              {tab === 'active' && 'Aktif'}
              {tab === 'used' && 'Terpakai'}
              {tab === 'expired' && 'Kadaluarsa'}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="divide-y divide-outline-variant/20">
        {tickets.length === 0 ? (
          <div className="p-12 text-center">
            <MaterialIcon icon="confirmation_number" />
            <p className="font-body-md text-body-md text-secondary mt-2">Tidak ada tiket</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="p-6 hover:bg-surface-container-low/30 transition-colors group">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                {/* Ticket Image */}
                <div className="w-full md:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-low">
                  <img
                    src={ticket.image}
                    alt={ticket.event_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Ticket Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 truncate">
                        {ticket.event_name}
                      </h3>
                      <p className="font-label-md text-label-md text-secondary">{ticket.ticket_number}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-label-md text-label-md whitespace-nowrap ${getStatusBadge(ticket.status).color}`}>
                      {getStatusBadge(ticket.status).label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-secondary">
                    <div className="flex items-center gap-2">
                      <MaterialIcon icon="location_on" />
                      <span className="font-body-md text-body-md">{ticket.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MaterialIcon icon="calendar_today" />
                      <span className="font-body-md text-body-md">{formatDate(ticket.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MaterialIcon icon="schedule" />
                      <span className="font-body-md text-body-md">{ticket.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MaterialIcon icon="confirmation_number" />
                      <span className="font-body-md text-body-md">x{ticket.quantity}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none px-4 py-2 border border-primary text-primary rounded-lg font-body-md text-body-md hover:bg-surface-container-low transition-all">
                    Detail
                  </button>
                  <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-on-primary rounded-lg font-body-md text-body-md hover:bg-primary-container transition-all">
                    Tunjukkan QR
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
