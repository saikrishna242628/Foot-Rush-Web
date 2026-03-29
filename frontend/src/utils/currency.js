const USD_TO_INR = 84;

export const formatINR = (usdPrice) => {
  const inrPrice = Math.round(parseFloat(usdPrice) * USD_TO_INR);
  return '₹' + inrPrice.toLocaleString('en-IN');
};
