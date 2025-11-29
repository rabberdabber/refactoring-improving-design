// ============================================================================
// CHAPTER 1: Refactoring, A First Example
// Step 5: Split Loop + Slide Statements
// ============================================================================
//
// REFACTORINGS APPLIED:
//
// 1. SPLIT LOOP
//    Motivation:
//    The single loop is doing multiple things: accumulating totalAmount,
//    accumulating volumeCredits, and building the result string.
//    By splitting the loop, each loop does one thing, making it easier
//    to extract each accumulation into its own function.
//
//    "But wait, won't this be slower?"
//    Yes, we iterate multiple times. But:
//    - The performance impact is usually negligible
//    - Clean code is easier to optimize later if needed
//    - Refactoring first, then optimize based on profiling
//
// 2. SLIDE STATEMENTS
//    After splitting the loop, we move the variable declaration next to
//    its related loop. This groups related code together, making it
//    easier to see what belongs together and to extract functions.
//
// CHANGES MADE:
// - Split the single loop into three separate loops
// - Moved volumeCredits declaration next to its loop
// - Moved totalAmount declaration next to its loop
// ============================================================================

export function statement(invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format;

  // -------------------------------------------------------------------------
  // LOOP 1: Build the result string
  // -------------------------------------------------------------------------
  for (let perf of invoice.performances) {
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
  }

  // -------------------------------------------------------------------------
  // REFACTORING: Slide Statements
  // We move the declaration of totalAmount right next to its loop.
  // This makes it clear that totalAmount is only used by this loop.
  // -------------------------------------------------------------------------
  // LOOP 2: Calculate total amount
  // -------------------------------------------------------------------------
  let totalAmount = 0;
  for (let perf of invoice.performances) {
    totalAmount += amountFor(perf);
  }

  // -------------------------------------------------------------------------
  // REFACTORING: Slide Statements
  // We move the declaration of volumeCredits right next to its loop.
  // -------------------------------------------------------------------------
  // LOOP 3: Calculate volume credits
  // -------------------------------------------------------------------------
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
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

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type) {
      result += Math.floor(aPerformance.audience / 5);
    }
    return result;
  }
}
