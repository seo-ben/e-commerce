const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
    }

    const payload = JSON.parse(event.body || '{}');

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const cleanPayload = {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      image_url: payload.image_url,
      stock: payload.stock
    };

    let query;
    if (payload.id) {
      query = supabase.from('products').update(cleanPayload).eq('id', payload.id).select().single();
    } else {
      query = supabase.from('products').insert(cleanPayload).select().single();
    }

    const { data, error } = await query;
    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ product: data })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  }
};
