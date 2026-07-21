import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function CartPage() {
  const supabase = await createClient();

  // 1. Get the logged-in user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // 2. Redirect to login if not authenticated
  if (userError || !user) {
    redirect('/login');
  }

  // 3. Fetch cart items belonging to this user
  const { data: cartItems, error: cartError } = await supabase
    .from('cart')
    .select('productid, product, price, userid') // Joins product details
    .eq('userid', user.id);

  if (cartError) {
    console.log(cartError.message)
    return (
      <>
        <p>Error loading cart items.</p>
      </>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index} className="border-b py-2 flex justify-between">
              <div>
                <p className="font-semibold">{item.product}</p>
                <p className="text-sm text-gray-500">Qty: 1</p>
              </div>
              <p>Value: ${item.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
