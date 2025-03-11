console.log('script.js loaded');
const supabase = window.supabase.createClient('https://jmqwuaybvruzxddsppdh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptcXd1YXlidnJ1enhkZHNwcGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MTUxNzEsImV4cCI6MjA1NTk5MTE3MX0.ldNdOrsb4BWyFRwZUqIFEbmU0SgzJxiF_Z7eGZPKZJg');

async function loadTopDevelopers() {
  try {
    console.log('Loading top developers');
    const res = await fetch('/top-developers');
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const developers = await res.json();
    console.log('Top developers loaded:', developers);
    const list = document.getElementById('developer-list');
    list.innerHTML = '';
    if (developers.length === 0) {
      list.innerHTML = '<p>No top developers yet.</p>';
    } else {
      developers.forEach(dev => {
        const div = document.createElement('div');
        div.innerHTML = `
          <p>Vendor ID: ${dev.vendor_id} | Email: ${dev.email} | Score: ${dev.score}</p>
        `;
        list.appendChild(div);
      });
    }
  } catch (error) {
    console.error('Error loading top developers:', error.message);
    document.getElementById('developer-list').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  loadTopDevelopers();
});