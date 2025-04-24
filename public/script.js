console.log('script.js loaded');
const supabase = window.supabase.createClient('https://oqquvpjikdbjlagdlbhp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xcXV2cGppa2RiamxhZ2RsYmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NTE4MDgsImV4cCI6MjA2MDUyNzgwOH0.ec28Q9VqiW2FomXESxVkiYswtWe6kJS-Vpc7W_tMsuU'); // Ganti dengan anon key dari Supabase Dashboard

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
          <p>Email: ${dev.email} | Score: ${dev.score}</p>
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
  const backButton = document.getElementById('back-to-mastermind');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.location.href = 'https://nft-main-bice.vercel.app';
    });
  }
});
