export default function CheckoutSuccessPage() {
  return (
    <section className="mx-auto max-w-2xl rounded-xl border bg-white p-8 text-center shadow-sm">
      <h1 className="text-3xl font-bold text-emerald-600">Paiement confirmé 🎉</h1>
      <p className="mt-3 text-slate-700">
        Merci pour votre commande. Vous recevrez un email de confirmation depuis Stripe.
      </p>
    </section>
  );
}
