// ============================================================================
// CHAPTER 1: Refactoring, A First Example
// Step 3: Replace Temp with Query + Inline Variable
// ============================================================================
//
// REFACTORINGS APPLIED:
//
// 1. REPLACE TEMP WITH QUERY (for 'play' variable)
//    Motivation:
//    The 'play' variable is set once and never modified. Instead of storing
//    it in a temporary variable, we can replace it with a function call.
//    This removes the temp variable and makes it easier to extract code
//    that uses 'play' into separate functions.
//
//    Mechanics:
//    - Create a function that returns the value (playFor)
//    - Replace all references to the temp with the function call
//    - Remove the temp variable declaration
//
// 2. INLINE VARIABLE (for 'play')
//    After creating playFor(), we inline the 'play' variable.
//    The function call is just as clear as the variable.
//
// 3. CHANGE FUNCTION DECLARATION (for amountFor)
//    Now that we have playFor(), we can remove the 'play' parameter
//    from amountFor() - it can call playFor() itself.
//
// CHANGES MADE:
// - Added playFor(aPerformance) function
// - Removed 'play' parameter from amountFor()
// - amountFor() now calls playFor() internally
// - Inlined 'play' variable in the main loop
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
    // REFACTORING: Inline Variable
    // We no longer need: const play = plays[perf.playID];
    // Instead, we use playFor(perf) directly wherever we need the play

    let thisAmount = amountFor(perf);

    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    // REFACTORING: Replace Temp with Query - using playFor(perf) instead of 'play'
    if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);

    // print line for this order
    // REFACTORING: Replace Temp with Query - using playFor(perf) instead of 'play'
    result += ` ${playFor(perf).name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;

  // -------------------------------------------------------------------------
  // EXTRACTED FUNCTION: playFor (Replace Temp with Query)
  // -------------------------------------------------------------------------
  // This replaces the temporary variable 'play'.
  // Benefits:
  // 1. No mutable state to track
  // 2. Other functions can call this directly
  // 3. Easier to move code around during refactoring
  //
  // Note: This does mean we look up the play multiple times per iteration.
  // This is a performance trade-off, but:
  // - The lookup is O(1) in a hash map
  // - Clarity usually trumps micro-optimization
  // - If profiling shows it's a problem, we can cache later
  // -------------------------------------------------------------------------
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  // -------------------------------------------------------------------------
  // REFACTORED FUNCTION: amountFor
  // -------------------------------------------------------------------------
  // CHANGE FUNCTION DECLARATION:
  // Removed the 'play' parameter - amountFor now calls playFor() internally.
  // This makes the function signature simpler and reduces coupling.
  // -------------------------------------------------------------------------
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
}
