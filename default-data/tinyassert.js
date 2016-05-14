export default function(condition, message = null) {
  if (!condition) {
    throw new Error(message || 'Assertion error');
  }
}
