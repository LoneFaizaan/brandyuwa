import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qypufzpwfixkhkofojaz.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cHVmenB3Zml4a2hrb2ZvamF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNTQ1NTMsImV4cCI6MjEwNTgzMDU1M30.YpGUD9T0CgTdvwkdsAkfuzEvDlCdhYKvvkESflt7F5E';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verify() {
  console.log('--- Verifying Supabase Backend Connection ---');
  
  // 1. Check products
  const { data: products, error: pErr } = await supabase.from('products').select('*');
  if (pErr) throw pErr;
  console.log(`✓ Products queried successfully: ${products.length} products found in database.`);

  // 2. Test inserting an order
  const testOrderId = `TEST-ORDER-${Date.now()}`;
  const testOrder = {
    id: testOrderId,
    customer: { name: 'Test Customer', phone: '9999999999' },
    fulfilment: 'pickup',
    items: [{ productId: 'printed-cotton-shirt', name: 'Printed Cotton Shirt', price: 1499, size: 'M', quantity: 1 }],
    subtotal: 1499,
    discount: 0,
    delivery_fee: 0,
    total: 1499,
    payment: 'store',
    paid: false,
    status: 'new',
    history: [{ status: 'new', at: new Date().toISOString() }],
    note: 'Verification test order',
  };

  const { error: insErr } = await supabase.from('orders').insert(testOrder);
  if (insErr) throw insErr;
  console.log(`✓ Order inserted successfully: ${testOrderId}`);

  // 3. Test querying the order
  const { data: fetchedOrder, error: fetchErr } = await supabase.from('orders').select('*').eq('id', testOrderId).single();
  if (fetchErr) throw fetchErr;
  console.log(`✓ Order retrieved successfully: status=${fetchedOrder.status}, total=${fetchedOrder.total}`);

  // 4. Test updating the order
  const { error: updErr } = await supabase.from('orders').update({ status: 'delivered', paid: true }).eq('id', testOrderId);
  if (updErr) throw updErr;
  console.log(`✓ Order status updated successfully`);

  // 5. Clean up test order
  const { error: delErr } = await supabase.from('orders').delete().eq('id', testOrderId);
  if (delErr) throw delErr;
  console.log(`✓ Test order cleaned up successfully.`);

  console.log('--- All Supabase backend operations verified successfully! ---');
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
