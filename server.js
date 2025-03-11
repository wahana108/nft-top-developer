const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const app = express();
const port = process.env.PORT || 3003;

const supabaseUrl = 'https://jmqwuaybvruzxddsppdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptcXd1YXlidnJ1enhkZHNwcGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MTUxNzEsImV4cCI6MjA1NTk5MTE3MX0.ldNdOrsb4BWyFRwZUqIFEbmU0SgzJxiF_Z7eGZPKZJg';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).send('Unauthorized');
  req.user = user;
  next();
};

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
        .single();
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
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
