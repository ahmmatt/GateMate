import React, { useState, useEffect } from 'react';
import EventCard from '../Cards/EventCard';
import { eventService } from '../../services/api';

export default function TrendingSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getTrendingEvents(10);
        setEvents(response.data.data || response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching trending events:', err);
        setError('Gagal memuat event trending');
        // Fallback ke data statis jika API error
        setEvents(getFallbackEvents());
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingEvents();
  }, []);

  const getFallbackEvents = () => [
    {
      id: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-R23g0xqmyCnV2kyGdLbIHqaBfGDjJC4v4e7sZrx2y1kh-VANneEcHfHiYSp8hSojhtvLFoK-B-mRYaeXNrDFz9RyB-5M-TeXuBX-mQ7n7-oSTmazzPj6WA_6l58dt2Ht0kH59Clv9ilB-9sISAN65TisSSsqZssq77b9EzlAOR3LP0jt-QFUOnRHXwt9Bc5qZF7C06KDxwY38RKAlbCrZAZSNVTu2DhyDjW3ND4i-4laIxxl2Zn3eEapj0BWZzwwpQosYZTJyzk',
      title: 'Electronic Dream Festival 2024',
      location: 'Jakarta',
      date: '15 Okt 2024',
      price: 'Rp 450.000',
      remaining: 'Sisa 20',
      trending: true
    },
    {
      id: 2,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU1JEPzWYntEVZ2-5eHxBbdgS2bTQc6jjfsnirHgb_1RosnmlJlAnX_jG-JX_CxrsYCGCLX4EYlhz7P08C641U58cXGwP9hCOi7dOfHMDXkIWWSOPvu-i8RKtfvbeS9s06DgdzucM5s019cWx8Z9Te0h0_d0NDv4YgLggix8l4rv-bbVAwfpSQxo8Zp0eSLd662Uie-W5LgIxqDJa02_tzrSWSLRlz0A475dAlTFCgljxJE5FZsrvg5bVrY7iGVZeP8SCHJADHFeA',
      title: 'AI Revolution Indonesia',
      location: 'Bandung',
      date: '22 Nov 2024',
      price: 'Rp 250.000',
      remaining: 'Sisa 50',
      trending: true
    },
    {
      id: 3,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiofYmOlkeHdee3akjenkzZRxo0dMi12F4Wpc5Jn0qScLOTl2FQcO5hA84tO9fZdUXocp2mU2kC6Uvs2FxAMmvWgHphj29YquwrlnMdHj1blpYdEkd5zK7TWAyOoXVIJIzXQ0J_Ju-41nOcpysPZnxN4HKvNFAYopRVim5SsCxf9OvI8Az4pECpLcn8BhyXm7no77036wDb5o4gGBPY9wHGxA8f6vlrine5Z2_k2RzeT5j24cx1oF7BEVm-If37g5748qCIcPZOz4',
      title: 'National Basketball Cup',
      location: 'Surabaya',
      date: '05 Des 2024',
      price: 'Rp 150.000',
      remaining: 'Sisa 100',
      trending: true
    },
    {
      id: 4,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPy_CQdc2eaVp3XD_7q70UCzMbLXsPDckkv0V9PXKHKjakCr6-OHmK4Yh5T0Q_Fy-BNz41zuATXh6alPUotENPLZXjYa7JnRGk1xY6PhslybyIOtO61gou1zsCLrNTN_Bru0jRxqGr5KUqF_QM88V2c7q4cGJuhuUzVOFkLN1EGOUFLLZBuwzG6I2nFOopJp-Ny_uxEfMUsUoWL7HGCWZtjJB1Ct-9xfU-AZ_XHiHbIq8as4g8IIho-9WA7QeaxWxQJ7FxqxP1z7c',
      title: 'Pasar Malam Modern 2.0',
      location: 'Bali',
      date: '12 Jan 2025',
      price: 'Rp 75.000',
      remaining: 'Terbatas',
      trending: false
    }
  ];

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-container-padding">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Trending Sekarang
          </h2>
          <a href="#all-events" className="font-label-md text-label-md text-primary hover:underline">
            Lihat Semua
          </a>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-error/10 text-error rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-gap-default overflow-x-auto no-scrollbar pb-8 -mx-container-padding px-container-padding">
          {loading ? (
            <div className="w-full text-center py-8 text-secondary">
              Memuat event trending...
            </div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <EventCard
                key={event.id || event.title}
                image={event.image}
                title={event.title}
                location={event.location}
                date={event.date}
                price={event.price}
                remaining={event.remaining}
                trending={event.trending}
              />
            ))
          ) : (
            <div className="w-full text-center py-8 text-secondary">
              Tidak ada event trending
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
