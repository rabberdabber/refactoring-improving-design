// ============================================================================
// CHAPTER 1: Refactoring, A First Example
// Step 8: Replace Conditional with Polymorphism - CALCULATION PHASE
// ============================================================================
//
// This file is updated from Step 7 to use the polymorphic calculator.
//
// KEY CHANGES FROM STEP 7:
// - Import createPerformanceCalculator factory
// - enrichPerformance() now creates a calculator and delegates to it
// - amountFor() and volumeCreditsFor() are REMOVED - logic is now in classes
//
// REFACTORINGS APPLIED:
// - Replace Constructor with Factory Function (use createPerformanceCalculator)
// - Move Function (calculation logic moved to PerformanceCalculator classes)
// ============================================================================

import { createPerformanceCalculator } from "./PerformanceCalculator.js";

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
  // REFACTORING: Replace Constructor with Factory Function
  //
  // Instead of calling amountFor() and volumeCreditsFor() directly,
  // we now create a calculator and ask IT for the values.
  //
  // The calculator is created by the factory function, which returns
  // the appropriate subclass (TragedyCalculator or ComedyCalculator)
  // based on the play type.
  //
  // BEFORE (Step 7):
  //   result.amount = amountFor(result);
  //   result.volumeCredits = volumeCreditsFor(result);
  //
  // AFTER (Step 8):
  //   const calculator = createPerformanceCalculator(...);
  //   result.amount = calculator.amount;
  //   result.volumeCredits = calculator.volumeCredits;
  // -------------------------------------------------------------------------
  function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  // -------------------------------------------------------------------------
  // FUNCTION: playFor
  // -------------------------------------------------------------------------
  // Still needed to look up the play for the factory function.
  // -------------------------------------------------------------------------
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  // NOTE: amountFor() and volumeCreditsFor() are REMOVED!
  // Their logic now lives in TragedyCalculator and ComedyCalculator.
  // This is the payoff of "Replace Conditional with Polymorphism" -
  // the switch statement is gone from this file entirely.

  // -------------------------------------------------------------------------
  // FUNCTION: totalAmount
  // -------------------------------------------------------------------------
  function totalAmount(data) {
    return data.performances.reduce((total, perf) => total + perf.amount, 0);
  }

  // -------------------------------------------------------------------------
  // FUNCTION: totalVolumeCredits
  // -------------------------------------------------------------------------
  function totalVolumeCredits(data) {
    return data.performances.reduce((total, perf) => total + perf.volumeCredits, 0);
  }
}
