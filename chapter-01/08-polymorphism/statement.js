// ============================================================================
// CHAPTER 1: Refactoring, A First Example
// Step 8: Replace Conditional with Polymorphism - FORMATTING PHASE
// ============================================================================
//
// This file is UNCHANGED from Step 7.
//
// The formatting phase doesn't care HOW the calculations are done -
// it just receives the pre-calculated data and renders it.
//
// This is the beauty of Split Phase:
// - Step 7 separated calculation from formatting
// - Step 8 completely rewrote the calculation logic (using polymorphism)
// - This file required ZERO changes!
//
// The data structure contract between phases remained the same:
// - data.customer
// - data.performances[].play.name
// - data.performances[].amount
// - data.performances[].audience
// - data.performances[].volumeCredits
// - data.totalAmount
// - data.totalVolumeCredits
// ============================================================================

import createStatementData from "./createStatementData.js";

// ============================================================================
// PUBLIC API
// ============================================================================

export function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

export function htmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays));
}

// ============================================================================
// RENDERING FUNCTIONS
// ============================================================================

function renderPlainText(data) {
  let result = `Statement for ${data.customer}\n`;

  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
}

function renderHtml(data) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>\n";

  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }

  result += "</table>\n";
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
  return result;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber / 100);
}
