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

//module.exports = { calculatePortfolioFields };

function calculateMetalSummary(entries, metal, spotPricePerGram) {
  // filter by metal
  const metalEntries = entries.filter(e => e.metal === metal);

  // cumulate total prices
  const sum_total_price = metalEntries.reduce(
    (sum, e) => sum + e.total_price,
    0
  );

  // cumulate fine weights
  const sum_fine_weight_g = metalEntries.reduce(
    (sum, e) => sum + e.fine_weight_g,
    0
  );

  // Calculate
  const asset_value = sum_fine_weight_g * spotPricePerGram;
  const net_value = asset_value - sum_total_price;

  // Extraction Point
  return {
    metal,
    sum_total_price,
    sum_fine_weight_g,
    spot_price_eur_per_g: spotPricePerGram,
    asset_value,
    net_value
  };
}

module.exports = {
  calculatePortfolioFields,
  calculateMetalSummary
};

