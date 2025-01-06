import { format, parseISO } from 'date-fns'

export function generateReferralCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function formatRupee(amount: string | number) {
  return amount.toString().replace(/\B(?=(\d{3})(\d{2})*(?!\d))/g, ',')
}

export const convertToTimeZoneOffset = (
  date: string | Date,
  offsetHours = 5,
  offsetMinutes = 30
) => {
  if (!date) return null

  // Create a copy of the date to avoid mutating the original
  const localDate = new Date(date)

  // Adjust for the offset
  localDate.setHours(localDate.getHours() + offsetHours)
  localDate.setMinutes(localDate.getMinutes() + offsetMinutes)

  // Format as ISO string and replace `Z` with timezone offset
  return localDate
    .toISOString()
    .replace(
      'Z',
      `+${String(offsetHours).padStart(2, '0')}:${String(
        offsetMinutes
      ).padStart(2, '0')}`
    )
}

export const formattedDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toISOString().replace('.000Z', '+05:30')
}

export function convertDateToReadableFormat(dateStr: any) {
  if (!dateStr) return
  const date = parseISO(dateStr)
  return format(date, 'dd-MM-yyyy hh:mm a')
}

export function generateLoginCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function readableDate(dateStr: any) {
  if (!dateStr) return
  const date = parseISO(dateStr)
  return format(date, 'dd MMM, yy') // Example: 10 Jan, 25
}
