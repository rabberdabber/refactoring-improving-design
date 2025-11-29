// ============================================================================
// CHAPTER 1: Refactoring, A First Example
// Step 7: Split Phase - CALCULATION PHASE
// ============================================================================
//
// REFACTORING APPLIED: Split Phase
//
// This is the culmination of all our refactoring work. We now split the
// code into two distinct phases:
//
// PHASE 1 (this file): CALCULATION
// - Takes raw invoice and plays data
// - Computes all derived values (amounts, credits, totals)
// - Returns an intermediate data structure with everything pre-calculated
//
// PHASE 2 (statement.js): FORMATTING
// - Takes the pre-calculated data structure
// - Renders it as text or HTML
// - No calculation logic - purely presentation
//
// WHY SPLIT PHASE?
// 1. Separation of Concerns: Calculation logic is separate from presentation
// 2. Testability: Each phase can be tested independently
// 3. Flexibility: Easy to add new output formats (HTML, JSON, PDF)
// 4. Maintainability: Changes to calculation don't affect formatting
//
// REFACTORINGS USED IN THIS FILE:
// - Extract Function (playFor, amountFor, volumeCreditsFor)
// - Replace Temp with Query (playFor instead of play variable)
// - Replace Loop with Pipeline (reduce for totals)
// - Introduce Intermediate Data Structure (enriched performance objects)
// ============================================================================

export default function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;

  // -------------------------------------------------------------------------
  // FUNCTION: enrichPerformance
  // -------------------------------------------------------------------------
  // REFACTORING: Introduce Intermediate Data Structure
  //
  // This is a key technique: instead of repeatedly looking up and calculating
  // values, we "enrich" each performance object with all the computed data
  // it needs. The rendering phase then just reads these values.
  //
  // We use Object.assign to create a shallow copy, avoiding mutation of
  // the original data.
  // -------------------------------------------------------------------------
  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  // -------------------------------------------------------------------------
  // FUNCTION: playFor
  // -------------------------------------------------------------------------
  // REFACTORING: Replace Temp with Query
  // Looks up the play from the plays object.
  // This replaces what was a temporary variable in the original code.
  // -------------------------------------------------------------------------
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  // -------------------------------------------------------------------------
  // FUNCTION: amountFor
  // -------------------------------------------------------------------------
  // REFACTORING: Extract Function
  //
  // Calculates the charge for a single performance based on:
  // - Play type (tragedy or comedy)
  // - Audience size
  //
  // Pricing Rules:
  // - Tragedy: Base $400, +$10 per person over 30
  // - Comedy: Base $300, +$100 + $5/person if over 20, +$3/person always
  // -------------------------------------------------------------------------
  function amountFor(aPerformance) {
    let result = 0;

    switch (aPerformance.play.type) {
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
        throw new Error(`unknown type: ${aPerformance.play.type}`);
    }

    return result;
  }

  // -------------------------------------------------------------------------
  // FUNCTION: volumeCreditsFor
  // -------------------------------------------------------------------------
  // REFACTORING: Extract Function
  //
  // Calculates volume credits for a single performance:
  // - Base: 1 credit per audience member over 30
  // - Comedy bonus: 1 credit per 5 audience members
  // -------------------------------------------------------------------------
  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === aPerformance.play.type) {
      result += Math.floor(aPerformance.audience / 5);
    }
    return result;
  }

  // -------------------------------------------------------------------------
  // FUNCTION: totalAmount
  // -------------------------------------------------------------------------
  // REFACTORING: Replace Loop with Pipeline
  // Sums all performance amounts using reduce.
  // -------------------------------------------------------------------------
  function totalAmount(data) {
    return data.performances.reduce((total, perf) => total + perf.amount, 0);
  }

  // -------------------------------------------------------------------------
  // FUNCTION: totalVolumeCredits
  // -------------------------------------------------------------------------
  // REFACTORING: Replace Loop with Pipeline
  // Sums all volume credits using reduce.
  // -------------------------------------------------------------------------
  function totalVolumeCredits(data) {
    return data.performances.reduce((total, perf) => total + perf.volumeCredits, 0);
  }
}
