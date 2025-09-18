import React from 'react';
import API from '../api';

export default function PaymentButton({ projectId, milestoneIndex }) {
  const pay = async () => {
    try {
      const { data } = await API.post(`/payments/create-order/${projectId}/${milestoneIndex}`);
      const { orderId, amount, currency, key, paymentRecordId } = data;
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
      script.onload = () => {
        const options = {
          key,
          amount,
          currency,
          order_id: orderId,
          handler: async function(response){
            await API.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentRecordId
            });
            alert('Payment verified & milestone funded');
            window.location.reload();
          }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      };
    } catch (err) { console.error(err); alert('Payment init failed'); }
  };
  return <button onClick={pay}>Pay Milestone</button>;
}