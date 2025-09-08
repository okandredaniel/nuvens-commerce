const PAYMENT_METHODS = ['VISA', 'PayPal', 'Maestro', 'Mastercard', 'Discover'];

export function FooterPayments() {
  if (PAYMENT_METHODS.length === 0) return null;

  return (
    <div className="text-center">
      <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Payment Methods</h3>
      <div className="flex justify-center items-center gap-3 md:gap-4 flex-wrap">
        {PAYMENT_METHODS.map((name) => (
          <div
            key={name}
            className="bg-white rounded px-3 py-2 text-sm font-semibold text-black/90"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
