export const triggerAuthUpdate = () => {
  const event = new Event('authEvent')
  window.dispatchEvent(event)
}
