import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import { stripe } from '@/lib/stripe';
import { getURL } from '@/lib/helpers';
import { createOrRetrieveCustomer } from '@/lib/supabaseAdmin';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  const { price, quantity = 1, metadata = {} } = await req.json();

  try {
    const supabase = createRouteHandlerClient({
      cookies,
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Could not get user');

    const customer = await createOrRetrieveCustomer({
      uuid: user?.id || '',
      email: user?.email || '',
    });

    if (!customer) throw new Error('Could not get customer');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        metadata,
      },
      success_url: `${getURL()}/account`,
      cancel_url: `${getURL()}`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.log(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};
