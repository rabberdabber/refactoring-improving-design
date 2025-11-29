// ============================================================================
// CHAPTER 1: Refactoring, A First Example
// Step 4: Extract Volume Credits Calculation
// ============================================================================
//
// REFACTORINGS APPLIED:
//
// 1. EXTRACT FUNCTION (for volume credits calculation)
//    Motivation:
//    The volume credits calculation is another logical chunk that we can
//    extract. This continues our strategy of breaking down the large
//    function into smaller, well-named pieces.
//
// 2. INLINE VARIABLE (for 'thisAmount')
//    The 'thisAmount' variable is only used once after being set.
//    We can inline it to simplify the code.
//
// CHANGES MADE:
// - Extracted volumeCreditsFor(aPerformance) function
// - Inlined 'thisAmount' variable (replaced with direct amountFor call)
// ============================================================================

export function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format;

  for (let perf of invoice.performances) {
    // REFACTORING: Extract Function
    // Volume credits calculation is now in volumeCreditsFor()
    volumeCredits += volumeCreditsFor(perf);

    // REFACTORING: Inline Variable
    // 'thisAmount' was only used once, so we inline amountFor(perf) directly
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
    totalAmount += amountFor(perf);
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance) {
    let result = 0;

    switch (playFor(aPerformance).type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }

    return result;
  }

  // -------------------------------------------------------------------------
  // EXTRACTED FUNCTION: volumeCreditsFor
  // -------------------------------------------------------------------------
  // This function calculates the volume credits for a single performance.
  //
  // Volume Credits Rules:
  // - Base: 1 credit for each audience member over 30
  // - Comedy bonus: 1 credit for every 5 audience members
  //
  // Benefits of extraction:
  // 1. Clear name describes what the calculation does
  // 2. Easier to understand the credits rules
  // 3. Can be tested independently
  // 4. Reusable if needed elsewhere
  // -------------------------------------------------------------------------
  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type) {
      result += Math.floor(aPerformance.audience / 5);
    }
    return result;
  }
}
