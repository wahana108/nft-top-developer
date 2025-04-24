const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const app = express();
const port = process.env.PORT || 3003;

const supabaseUrl = 'https://oqquvpjikdbjlagdlbhp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xcXV2cGppa2RiamxhZ2RsYmhwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDk1MTgwOCwiZXhwIjoyMDYwNTI3ODA4fQ.cJri-wLQcDod3J49fUKesAY2cnghU3jtlD4BiuYMelw'; // Ganti dengan service_role key dari Supabase Dashboard
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/top-developers', async (req, res) => {
  try {
    console.log('Fetching top developers');
    const { data, error } = await supabase
      .from('vendor_score')
      .select('vendor_id, score')
      .order('score', { ascending: false })
      .limit(10);
    if (error) throw error;

    const topDevelopers = await Promise.all(data.map(async (vendor) => {
      const { data: nftData, error: nftError } = await supabase
        .from('nfts')
        .select('description')
        .eq('vendor_id', vendor.vendor_id)
        .limit(1)
        .maybeSingle();
      const email = nftData?.description ? nftData.description.split(' | ').pop() : vendor.vendor_id;
      return { vendor_id: vendor.vendor_id, score: vendor.score, email };
    }));
    console.log('Top developers:', topDevelopers);
    res.json(topDevelopers);
  } catch (error) {
    console.error('Error fetching top developers:', error.message);
    res.status(500).send(error.message);
  }
});

app.get('/', (req, res) => {
  console.log('Serving index.html from public');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
