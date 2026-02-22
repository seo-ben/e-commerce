const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
    }

    const { productId, quantity } = JSON.parse(event.body || '{}');
    if (!productId || !quantity) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Payload invalide' }) };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !product) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Produit introuvable' }) };
    }

    if (product.stock < quantity) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Stock insuffisant pour cette quantité' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Article validé pour le panier',
        item: {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  }
};
