import React, { useEffect, useRef, useState } from 'react';

export default function PayPalButton ({merchantId, price, description}) {

  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(null);
  const paypalRef = useRef();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?&client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&merchant-id=${merchantId}`
    script.async = true;
    document.head.appendChild(script);
    window.onload = () => {
      if (document.readyState === "complete") {
        window.paypal
          .Buttons({
            env: 'sandbox',
            style: {
              color: 'blue',
              label: 'pay',
              layout: 'vertical',
              shape: 'pill'
            },
            createOrder: (data, actions) => actions.order.create({
                intent: 'CAPTURE',
                purchase_units: [
                  {
                    description,
                    amount: {
                      currency_code: 'USD',
                      value: price,
                    },
                  },
                ],
              }),
            onApprove: async (data, actions) => {
              await actions.order.capture();
              setPaid(true);
            },
            onError: (err) => {
              setError(err);
            },
          })
        .render(paypalRef.current);
      }
    };
  }, [description, merchantId, price]);

  if (paid) {
    return <div>Payment successful!</div>;
  }

  if (error) {
    return <div>Error Occurred in processing payment! Please try again.</div>;
  }

  return (
    <>
      <div>
        <div ref={paypalRef} />
      </div>
    </>
  );

}
