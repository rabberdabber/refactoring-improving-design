// ============================================================================
// CHAPTER 1: Refactoring, A First Example
// Step 2: Extract Function
// ============================================================================
//
// REFACTORING APPLIED: Extract Function
//
// Motivation:
// The switch statement inside the loop calculates the charge for a single
// performance. This is a logical chunk of code that we can extract into its
// own function. By giving it a good name (amountFor), we make the code
// self-documenting.
//
// Mechanics:
// 1. Create a new function with a name that describes what it does
// 2. Copy the extracted code into the new function
// 3. Pass any variables from the original scope as parameters
// 4. Replace the original code with a call to the new function
// 5. Test!
//
// CHANGE MADE:
// - Extracted the switch statement into amountFor(aPerformance, play)
// - Renamed parameter from 'perf' to 'aPerformance' (clearer naming)
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
    const play = plays[perf.playID];

    // REFACTORING: Extract Function
    // The switch statement is now extracted into amountFor()
    let thisAmount = amountFor(perf, play);

    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    // print line for this order
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;

  // -------------------------------------------------------------------------
  // EXTRACTED FUNCTION: amountFor
  // -------------------------------------------------------------------------
  // This function calculates the amount charged for a single performance.
  // By extracting it, we:
  // 1. Give the calculation a clear name
  // 2. Make the main function easier to read
  // 3. Make the calculation logic reusable
  // 4. Make it easier to test this logic in isolation
  // -------------------------------------------------------------------------
  function amountFor(aPerformance, play) {
    let result = 0;

    switch (play.type) {
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
        throw new Error(`unknown type: ${play.type}`);
    }

    return result;
  }
}
