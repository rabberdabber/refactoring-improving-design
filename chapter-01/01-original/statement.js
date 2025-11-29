// ============================================================================
// CHAPTER 1: Refactoring, A First Example
// Step 1: The Original Code (Before Any Refactoring)
// ============================================================================
//
// This is the starting point - a single function that does everything:
// - Calculates charges for each performance
// - Calculates volume credits
// - Formats the output as a string
//
// PROBLEMS WITH THIS CODE:
// 1. The function is too long and does too many things
// 2. The switch statement is doing calculation inside a loop
// 3. Temporary variables (thisAmount, play) obscure the data flow
// 4. Hard to add new output formats (e.g., HTML) without duplicating logic
// 5. Hard to change calculation rules without risking the formatting
//
// In the following steps, we'll apply various refactoring techniques to
// improve this code while keeping its behavior exactly the same.
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
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }

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
}
