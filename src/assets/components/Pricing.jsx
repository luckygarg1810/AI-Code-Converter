import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../security/AuthContext";
import axios from "axios";
import { fetchUserDetails } from "../service/fetchUserDetails";
import { useToken } from "../../security/TokenContext";
import { BeatLoader } from "react-spinners";

function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { token, userId } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly"); // Track current plan
  const navigate = useNavigate();
  const {refreshTokens} = useToken();
  const [loading, setLoading] = useState(false);
  
  const [hasAnnualPlan, setHasAnnualPlan] = useState(false); // Track if user has an annual plan
  // Plans array with added pricing details
  const plans = [
    {
      id: "FREE",
      title: "Free Plan",
      tokens: "100 tokens",
      description: "Few Languages support",
      price: 0,
      order: 1
    },
    {
      id: "BASE",
      title: "Base Plan",
      tokens: "Unlimited tokens",
      description: "Few Languages support",
      monthlyPrice: 199,
      annualPrice: 199 * 12 * 0.8, // 20% discount on annual payment
      discount: "20% off annually!",
      order: 2
    },
    {
      id: "SUPER",
      title: "Super Plan",
      tokens: "Unlimited tokens",
      description: "All Languages support",
      monthlyPrice: 349,
      annualPrice: 349 * 12 * 0.7, // 30% discount on annual payment
      discount: "30% off annually!",
      order: 3
    },
  ];

  useEffect(() => {
    if (token && userId) {
      fetchUserDetails(token, userId)
        .then((data) => {
          const normalizedPlanType = data.planType;
          setCurrentPlan(normalizedPlanType);

          const expiryDate = new Date(data.planExpiryDate);
          const currentDate = new Date();
          const differenceInDays = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
          setHasAnnualPlan(differenceInDays > 30); // User has an annual plan if expiry > 30 days
        })
        .catch((error) => console.log(error));
    }
  }, [token, userId]);

  const calculateFinalPrice = () => {
    if (!selectedPlan) return 0;

    const selectedPlanDetails = plans.find((p) => p.id === selectedPlan);

    if (!selectedPlanDetails) return 0;

    // Pricing logic
    if (currentPlan !== "FREE" && !hasAnnualPlan && billingCycle === "annually") {
      // Discounted annual plan price for users without an annual plan
      return selectedPlanDetails.annualPrice - 100;
    } else if (currentPlan !== "FREE" && hasAnnualPlan && billingCycle === "annually") {
      return selectedPlanDetails.annualPrice - 1910;
    }
    else if (currentPlan === "BASE" && selectedPlan === "SUPER" && billingCycle === "monthly") {
      // ₹100 upgrade from monthly Base to monthly Super
      return 100; 65
    } else {
      // Regular pricing
      return billingCycle === "monthly"
        ? selectedPlanDetails.monthlyPrice
        : selectedPlanDetails.annualPrice;
    }
  };


  const handlePlanSelection = (planId) => {
    const selectedPlanOrder = plans.find((p) => p.id === planId)?.order;
    const currentPlanOrder = plans.find((p) => p.id === currentPlan)?.order;

    if (selectedPlanOrder > currentPlanOrder) {
      setSelectedPlan(planId); // Allow selection only for higher plans
    }

    const selectedPlanDetails = plans.find((p) => p.id === planId);
    let calculatedPrice = 0;

    if (!hasAnnualPlan && billingCycle === "annually") {
      // Discounted annual plan price for users without an annual plan
      calculatedPrice = selectedPlanDetails.annualPrice - 100;
    }
    else if (currentPlan === "BASE" && planId === "SUPER" && billingCycle === "monthly") {
      // ₹100 upgrade from monthly Base to monthly Super
      calculatedPrice = 100;
    }
    else if (billingCycle === "annually" && currentPlan === "BASE" && planId === "BASE") {
      // Monthly to Annual upgrade for Base Plan
      calculatedPrice = selectedPlanDetails.annualPrice - selectedPlanDetails.monthlyPrice;
    }
    else if (billingCycle === "annually" && currentPlan === "SUPER" && planId === "SUPER") {
      // Monthly to Annual upgrade for Super Plan
      calculatedPrice = selectedPlanDetails.annualPrice - selectedPlanDetails.monthlyPrice;
    }
    else {
      // Regular pricing
      calculatedPrice =
        billingCycle === "monthly"
          ? selectedPlanDetails.monthlyPrice
          : selectedPlanDetails.annualPrice;
    }

  };

  // Handle the upgrade button click
  const handleUpgradeClick = async () => {
    setLoading(true)
    if (selectedPlan && token) {
      try {
        // Call backend to create Razorpay order
        const finalPrice = calculateFinalPrice();
        console.log(finalPrice)
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/payment/razorpay`,
          {
            amount: finalPrice, // Send the amount to be paid (in INR)
            currency: "INR",
            planId: selectedPlan,
          },
          {
            headers: { Authorization: `Bearer ${token}` }, // Pass token in the Authorization header
          }
        );

        const { orderId, key } = response.data;
        console.log(response.data);
        if (!orderId || !key) {
          console.error("Missing Razorpay orderId or key from the backend response");
          return;
        }
        const selectedPlanDetails = plans.find((p) => p.id === selectedPlan);
        const options = {
          key,
          amount: Math.round(finalPrice * 100),
          currency: "INR",
          name: "AI Code Converter",
          description: `Upgrade to ${selectedPlanDetails.title}`,
          order_id: orderId, // Razorpay order ID
          handler: async function (paymentResponse) {
            console.log("Payment handler triggered"); // ✅ Check if this appears
    console.log("Payment response from Razorpay:", paymentResponse);
    
            // Handle payment success
            const paymentDetails = {
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              planType: selectedPlan,
              isAnnual: billingCycle === "annually"
            };
            // Send payment details to backend for verification and plan upgrade
            const upgradeResponse = await axios.post(
              `${import.meta.env.VITE_APP_API_URL}/api/payment/upgrade/${userId}`,
              paymentDetails,
              {
                headers: { Authorization: `Bearer ${token}` }, // Include token for authentication
              }
            );
            console.log(upgradeResponse.data);
            refreshTokens();
            setLoading(false)
            navigate("/"); // Redirect to home page on successful payment
          },
          prefill: {
            name: "Your Name",
            email: "your-email@example.com",
          },
          theme: {
            color: "#3399cc",
            backdrop: false, // Ensures that the pricing page remains visible
          },
          modal: {
            backdropclose: false, // Prevents closing on clicking outside the modal
            escape: true, // Allows users to close with Esc key
            ondismiss: function () {
              console.log("Payment modal closed by user"); // Debug log
              setLoading(false); // Reset loading state when user exits
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        
      } catch (error) {
        setLoading(false)
        console.error("Error initiating Razorpay payment:", error);
        alert("An error occurred while processing the payment. Please try again.");
      }
    } else {
      setLoading(false)
      alert("Please select a valid plan to upgrade.");
    }
  };

  return (
    <div className="pricing-container">
      <h2 className="pricing-heading">Choose the Perfect Plan for You</h2>
      <div className="pricing-plans">
        {plans.map((plan) => {
          const selectedPlanOrder = plans.find((p) => p.id === plan.id)?.order;
          const currentPlanOrder = plans.find((p) => p.id === currentPlan)?.order;
          const isDisabled = selectedPlanOrder <= currentPlanOrder; // Disable lower/equal plans

          return (
            <div
              key={plan.id}
              className={`pricing-plan ${currentPlan === plan.id
                  ? "current-plan"
                  : selectedPlan === plan.id
                    ? "selected"
                    : isDisabled
                      ? "disabled-plan"
                      : ""
                }`}
              onClick={() => !isDisabled && handlePlanSelection(plan.id)} // Prevent click on disabled plans
              title={isDisabled ? "You cannot downgrade or select the same plan." : ""}
            >
              <h3 className="plan-title">{plan.title}</h3>
              <p className="plan-details">{plan.tokens}</p>
              <p className="plan-description">{plan.description}</p>
              {plan.monthlyPrice && (
                <>
                  <p className="plan-price">
                    <strong>₹{plan.monthlyPrice}/month</strong>
                  </p>
                  <p className="plan-annual-price">
                    Pay annually: <strong>₹{plan.annualPrice.toFixed(2)}</strong> ({plan.discount})
                  </p>
                </>
              )}
              {currentPlan === plan.id && <span className="current-badge">Current Plan</span>}
            </div>

          );
        })}
      </div>
      {/* Billing Cycle Toggle */}
      <div className="billing-cycle-toggle">
        <button
          className={billingCycle === "monthly" ? "active" : ""}
          onClick={() => setBillingCycle("monthly")}
        >
          Monthly
        </button>
        <button
          className={billingCycle === "annually" ? "active" : ""}
          onClick={() => setBillingCycle("annually")}
        >
          Annually
        </button>
      </div>
      {/* Upgrade Button */}
      <button
        className="btn-upgrade"
        onClick={handleUpgradeClick}
        disabled={
          !selectedPlan ||
          plans.find((p) => p.id === selectedPlan)?.order <= plans.find((p) => p.id === currentPlan)?.order
        }
      >
          {loading ? (
        <BeatLoader className="loader-container" color="#ffffff" size={8} />
      ) : (
        <>Pay ₹{calculateFinalPrice().toFixed(2)}</>
      )}
      </button>

    </div>
  );
}

export default Pricing;
