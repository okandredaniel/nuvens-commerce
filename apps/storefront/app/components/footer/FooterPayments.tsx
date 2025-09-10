const PAYMENT_METHODS = ['VISA', 'PayPal', 'Maestro', 'Mastercard', 'Discover'];

export function FooterPayments() {
  if (PAYMENT_METHODS.length === 0) return null;

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <h3 className="text-base">Payment Methods</h3>
      <div className="flex justify-center items-center gap-3 md:gap-4 flex-wrap">
        {PAYMENT_METHODS.map((name) => (
          <div key={name} className="bg-white/90 rounded p-1 text-xs font-semibold text-black/90">
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
