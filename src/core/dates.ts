function treatAsUTC(date: Date) {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset())
  return result
}

export function fullDaysBetween(startDate: Date, endDate: Date) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  const result = treatAsUTC(endDate).getTime() - treatAsUTC(startDate).getTime()
  return Math.ceil(result / millisecondsPerDay)
}
