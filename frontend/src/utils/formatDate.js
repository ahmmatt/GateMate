/**
 * Format tanggal ke format Indonesia
 * @param {string|Date} date
 * @returns {string} - contoh: "15 Agustus 2025"
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format tanggal singkat
 * @param {string|Date} date
 * @returns {string} - contoh: "15 Agt 2025"
 */
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format harga ke Rupiah
 * @param {number} price
 * @returns {string} - contoh: "Rp 350.000" atau "Gratis"
 */
export const formatPrice = (price) => {
  if (price === 0) return 'Gratis'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

/**
 * Format waktu jam
 * @param {string} time - "09:00"
 * @returns {string} - "09.00 WIB"
 */
export const formatTime = (time) => {
  return `${time} WIB`
}

/**
 * Hitung sisa tiket
 * @param {number} max
 * @param {number} sold
 * @returns {number}
 */
export const remainingTickets = (max, sold) => max - sold

/**
 * Hitung persentase tiket terjual
 * @param {number} max
 * @param {number} sold
 * @returns {number} - 0-100
 */
export const soldPercentage = (max, sold) => Math.round((sold / max) * 100)

/**
 * Format waktu relatif
 * @param {string|Date} date
 * @returns {string} - "2 hari lalu", "3 jam lalu"
 */
export const timeAgo = (date) => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffMins = Math.round(diffMs / 60000)
  const diffHours = Math.round(diffMs / 3600000)
  const diffDays = Math.round(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays < 30) return `${diffDays} hari lalu`
  return formatDate(date)
}
