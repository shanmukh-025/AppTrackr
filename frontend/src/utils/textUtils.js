export function stripHtmlTags(html) {
  if (!html) return '';
  // Create a temporary element to leverage browser HTML parsing
  try {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  } catch (e) {
    // Fallback: remove tags with regex
    return html.replace(/<[^>]*>/g, '');
  }
}
