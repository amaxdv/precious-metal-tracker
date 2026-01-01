function calculatePortfolioFields({
  quantity,
  price_per_unit,
  extra_costs = 0,
  gross_weight_g = null,
  purity = null,
}) {
  const total_price =
    Number(quantity) * Number(price_per_unit) + Number(extra_costs || 0);

  let fine_weight_g = null;
  if (gross_weight_g != null && purity != null) {
    fine_weight_g =
      Number(gross_weight_g) * Number(purity);
  }

  return {
    total_price,
    fine_weight_g,
  };
}

module.exports = { calculatePortfolioFields };
