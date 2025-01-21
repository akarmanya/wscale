export const handleEnterKeyPress = (
  event: React.KeyboardEvent,
  callback: () => void,
  shouldPreventDefault: boolean = true
) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    if (shouldPreventDefault) {
      event.preventDefault();
    }
    callback();
  }
}; 