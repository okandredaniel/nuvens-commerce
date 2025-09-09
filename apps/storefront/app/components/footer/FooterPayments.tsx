const PAYMENT_METHODS = ['VISA', 'PayPal', 'Maestro', 'Mastercard', 'Discover'];

export function FooterPayments() {
  if (PAYMENT_METHODS.length === 0) return null;

  return (
    <div className="flex items-center gap-8">
      <h3 className="text-base">Payment Methods</h3>
      <div className="flex justify-center items-center gap-3 md:gap-4 flex-wrap">
        {PAYMENT_METHODS.map((name) => (
          <div
            key={name}
            className="bg-white/90 rounded px-2 py-1 text-sm font-semibold text-black/90"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
