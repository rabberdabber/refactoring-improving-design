// ============================================================================
// CHAPTER 1: Refactoring, A First Example
// Step 6: Replace Loop with Pipeline + Extract Functions for Totals
// ============================================================================
//
// REFACTORINGS APPLIED:
//
// 1. REPLACE LOOP WITH PIPELINE
//    Motivation:
//    Now that we've split the loops, we can replace the accumulation loops
//    with pipeline operations (reduce). Pipelines are often more declarative
//    and easier to read than explicit loops.
//
//    Before: for (let perf of perfs) { total += amountFor(perf); }
//    After:  perfs.reduce((total, p) => total + amountFor(p), 0)
//
// 2. EXTRACT FUNCTION (for totalAmount and totalVolumeCredits)
//    We wrap each pipeline in a function. This:
//    - Gives a clear name to what the calculation does
//    - Removes the mutable variable from the main function
//    - Prepares us for the next step (Split Phase)
//
// CHANGES MADE:
// - Replaced totalAmount loop with reduce() inside totalAmount() function
// - Replaced volumeCredits loop with reduce() inside totalVolumeCredits()
// - Main function now calls these functions directly in the output
// ============================================================================

export function statement(invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(totalAmount())}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;

  // -------------------------------------------------------------------------
  // EXTRACTED FUNCTION: totalAmount
  // -------------------------------------------------------------------------
  // REFACTORING: Replace Loop with Pipeline
  // Uses reduce() to sum all performance amounts.
  //
  // The reduce function:
  // - Takes an accumulator (total) starting at 0
  // - For each performance, adds its amount to the total
  // - Returns the final sum
  // -------------------------------------------------------------------------
  function totalAmount() {
    return invoice.performances.reduce((total, perf) => total + amountFor(perf), 0);
  }

  // -------------------------------------------------------------------------
  // EXTRACTED FUNCTION: totalVolumeCredits
  // -------------------------------------------------------------------------
  // REFACTORING: Replace Loop with Pipeline
  // Uses reduce() to sum all volume credits.
  // -------------------------------------------------------------------------
  function totalVolumeCredits() {
    return invoice.performances.reduce((total, perf) => total + volumeCreditsFor(perf), 0);
  }

  // -------------------------------------------------------------------------
  // EXTRACTED FUNCTION: usd
  // -------------------------------------------------------------------------
  // REFACTORING: Extract Function
  // Currency formatting extracted into its own function.
  // This makes formatting consistent and reusable.
  // -------------------------------------------------------------------------
  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(aNumber / 100);
  }

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

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type) {
      result += Math.floor(aPerformance.audience / 5);
    }
    return result;
  }
}
