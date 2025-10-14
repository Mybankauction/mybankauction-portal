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
  const selectedDate = new Date(date)
  // Construct the date string in MM/DD/YY format (no time)
  const yy = String(selectedDate.getFullYear()).slice(-2)
  const mm = String(selectedDate.getMonth() + 1).padStart(2, '0')
  const dd = String(selectedDate.getDate()).padStart(2, '0')
  return `${mm}/${dd}/${yy}`
}

export const formattedEndOfDay = (date: string) => {
  if (!date) return ''
  const selectedDate = new Date(date)
  // Return MM/DD/YY format (no time)
  const yy = String(selectedDate.getFullYear()).slice(-2)
  const mm = String(selectedDate.getMonth() + 1).padStart(2, '0')
  const dd = String(selectedDate.getDate()).padStart(2, '0')
  return `${mm}/${dd}/${yy}`
}

export const dateOnly = (dateStr: any): string | null => {
  if (!dateStr) return null
  try {
    if (typeof dateStr === 'string') {
      if (dateStr.includes('T')) {
        return dateStr.split('T')[0]
      }
      // handle 'DD-MM-YYYY hh:mm AM/PM'
      const m = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})/)
      if (m) {
        const [_, dd, mm, yyyy] = m
        return `${yyyy}-${mm}-${dd}`
      }
      // fallback: try Date
      const d = new Date(dateStr)
      if (!isNaN(d.getTime())) {
        const y = d.getFullYear()
        const m2 = String(d.getMonth() + 1).padStart(2, '0')
        const d2 = String(d.getDate()).padStart(2, '0')
        return `${y}-${m2}-${d2}`
      }
      return null
    }
    if (dateStr instanceof Date) {
      const y = dateStr.getFullYear()
      const m2 = String(dateStr.getMonth() + 1).padStart(2, '0')
      const d2 = String(dateStr.getDate()).padStart(2, '0')
      return `${y}-${m2}-${d2}`
    }
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear()
      const m2 = String(d.getMonth() + 1).padStart(2, '0')
      const d2 = String(d.getDate()).padStart(2, '0')
      return `${y}-${m2}-${d2}`
    }
    return null
  } catch {
    return null
  }
}

export function convertDateToReadableFormat(dateStr: any) {
  if (!dateStr) return 'N/A'

  try {
    let date: Date

    if (typeof dateStr === 'string') {
      // Handle strings like "DD-MM-YYYY hh:mm AM/PM"
      if (dateStr.match(/^\d{2}-\d{2}-\d{4} \d{1,2}:\d{2} (AM|PM)$/)) {
        const [datePart, timePart, ampm] = dateStr.split(' ')
        const [day, month, year] = datePart.split('-')
        const [hours, minutes] = timePart.split(':')
        const mmddyyyy = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`
        date = new Date(mmddyyyy)
      }
      // Handle ISO-like strings
      else if (dateStr.includes('T')) {
        date = parseISO(dateStr)
      }
      // Fallback to Date constructor
      else {
        date = new Date(dateStr)
      }
    } else if (dateStr instanceof Date) {
      date = dateStr
    } else {
      date = new Date(dateStr)
    }

    if (isNaN(date.getTime())) return 'N/A'

    return format(date, 'dd-MM-yyyy hh:mm a')
  } catch {
    return 'N/A'
  }
}

export function generateLoginCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function readableDate(dateStr: any) {
  if (!dateStr) return 'N/A'
  
  try {
    let date: Date
    
    // Handle different date formats
    if (typeof dateStr === 'string') {
      // Handle DD-MM-YYYY hh:mm AM/PM format
      if (dateStr.match(/^\d{2}-\d{2}-\d{4} \d{1,2}:\d{2} (AM|PM)$/)) {
        // Convert DD-MM-YYYY hh:mm AM/PM to MM/DD/YYYY hh:mm AM/PM for Date constructor
        const parts = dateStr.split(' ')
        const datePart = parts[0] // DD-MM-YYYY
        const timePart = parts[1] // hh:mm
        const ampm = parts[2] // AM/PM
        
        const [day, month, year] = datePart.split('-')
        const [hours, minutes] = timePart.split(':')
        
        // Create date string in MM/DD/YYYY format for Date constructor
        const formattedDateStr = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`
        date = new Date(formattedDateStr)
      }
      // Handle ISO format
      else if (dateStr.includes('T')) {
        date = parseISO(dateStr)
      } 
      // Try regular Date constructor for other formats
      else {
        date = new Date(dateStr)
      }
    } else if (dateStr instanceof Date) {
      date = dateStr
    } else {
      date = new Date(dateStr)
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateStr)
      return 'Invalid Date'
    }
    
    return format(date, 'dd MMM, yy')
  } catch (error) {
    console.error('Error parsing date:', dateStr, error)
    return 'Invalid Date'
  }
}
