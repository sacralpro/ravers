import React, { useEffect, useState, useRef } from "react";
import getStripe from "../getStripe"; // Importing your `getStripe` utility function


const FooterButtons = () => {
  const [pulsate, setPulsate] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: '40%', left: 'auto' });
  const buttonRef = useRef(null);


  // Handle payment using Stripe Checkout
  const handlePayment = async (cartItems) => {
      try {
          const stripe = await getStripe();
          const cartItems = [ // Example cart items. Replace with your actual cart data.
              { name: "Album", price: 18, quantity: 1 },
          ];

          console.log('cartItems:', cartItems);

          const response = await fetch('/api/checkout-sessions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cartItems }),
          });

          if (!response.ok) {
              const errorData = await response.json();
              const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
              console.error("Error:", errorMessage);
              throw new Error(errorMessage);
          }

          const { sessionId } = await response.json();
          const result = await stripe.redirectToCheckout({ sessionId });
          if (result.error) {
              throw new Error(`Stripe error: ${result.error.message}`);
          }
      } catch (error) {
          console.error('Payment error:', error);
          alert('Payment failed. See console for details.'); //Improved user message
      }
  };







  useEffect(() => {
    const interval = setInterval(() => {
      setPulsate(!pulsate);
    }, 500);
    return () => clearInterval(interval);
  }, []);



  const handleMouseEnter = () => {
    setIsHovered(true);
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      setButtonPosition({ top: `${rect.top + rect.height / 2}px`, left: `${rect.left + rect.width / 2}px` });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setButtonPosition({ top: '40%', left: 'auto' });
  };

  const Button1 = ({ children, className, onClick, pulsate }) => {
    return (
      <div
        onClick={onClick}
        className={`fixed flex items-center justify-center top-[40%] rounded-full bg-yellow-400/95 text-white w-32 h-12 mr-4 shadow-lg shadow-yellow-400/30 ${className} ${
          pulsate ? "scale-110" : "scale-100"
        }`}
      >
        {children}
      </div>
    );
  };

  return (
    <div
      className="fixed bottom-5 right-3 flex"
      style={{ zIndex: 12 }}
    >
     <a href="https://idalllab.webflow.io/" target="_blank" rel="noopener noreferrer"> {/* Replace with your label URL */}
          <div className="relative w-12 h-12 rounded-full mr-12 mb-[60px]">
            <img
              src="/images/idall.png"
              alt="Your Logo"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full cursor-pointer"
              style={{ animation: "rotate 10s linear infinite" }}
            />
          </div>
        </a>

        <div
        ref={buttonRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'fixed',
          top: isHovered ? buttonPosition.top : '40%',
          left: isHovered ? buttonPosition.left : 'auto',
          transition: 'top 0.2s ease, left 0.2s ease',
        }}
        className={``}
      >

      <button1
                onClick={handlePayment} // Call the Stripe payment method on click

        className={`fixed items-center md:top-[40%] top-[60%] rounded-full cursor-pointer bg-yellow-400/95 text-white  mr-4 shadow-lg shadow-yellow-400/30  ${
          pulsate ? "scale-110" : "scale-100"
        }`}
      >          
          <span class='pulse-button ml-1'>BUY</span>
      </button1>

      </div>
      
    </div>
  );
};

export default FooterButtons;
