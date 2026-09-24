import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qypufzpwfixkhkofojaz.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cHVmenB3Zml4a2hrb2ZvamF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNTQ1NTMsImV4cCI6MjEwNTgzMDU1M30.YpGUD9T0CgTdvwkdsAkfuzEvDlCdhYKvvkESflt7F5E';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testUpload() {
  const dummyBuffer = Buffer.from('test-image-content-12345');
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(`test/test-${Date.now()}.txt`, dummyBuffer, { contentType: 'text/plain' });

  if (error) {
    console.error('Storage upload error:', error);
    process.exit(1);
  }
  console.log('Upload success:', data);
  const { data: pub } = supabase.storage.from('product-images').getPublicUrl(data.path);
  console.log('Public URL:', pub.publicUrl);
}

testUpload();
