// ============================================================================
// CHAPTER 1: Refactoring, A First Example
// Step 7: Split Phase - FORMATTING PHASE
// ============================================================================
//
// REFACTORING APPLIED: Split Phase
//
// This file handles PHASE 2: FORMATTING
//
// It receives pre-calculated data from createStatementData and renders it.
// Notice how clean this code is now:
// - No calculation logic
// - Just string building and formatting
// - Easy to add new output formats
//
// POLYMORPHIC OUTPUT:
// One of the main benefits of Split Phase is that we can now easily
// support multiple output formats. We demonstrate this with:
// - statement() -> Plain text output
// - htmlStatement() -> HTML output
//
// Both use the SAME calculation logic (createStatementData) but different
// rendering functions.
//
// REFACTORINGS USED IN THIS FILE:
// - Extract Function (usd, renderPlainText, renderHtml)
// - Split Phase (separation from calculation)
// ============================================================================

import createStatementData from "./createStatementData.js";

// ============================================================================
// PUBLIC API
// ============================================================================

// -------------------------------------------------------------------------
// FUNCTION: statement
// -------------------------------------------------------------------------
// Main entry point for plain text statement.
// Demonstrates Split Phase: first calculate, then format.
// -------------------------------------------------------------------------
export function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

// -------------------------------------------------------------------------
// FUNCTION: htmlStatement
// -------------------------------------------------------------------------
// Entry point for HTML statement.
// Uses the SAME calculation logic but different rendering.
// This is the payoff of Split Phase - adding a new format is trivial.
// -------------------------------------------------------------------------
export function htmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays));
}

// ============================================================================
// RENDERING FUNCTIONS
// ============================================================================

// -------------------------------------------------------------------------
// FUNCTION: renderPlainText
// -------------------------------------------------------------------------
// REFACTORING: Extract Function
//
// Renders the statement data as plain text.
// Notice how simple this is - just string concatenation.
// All the complex calculation is done; we just format the results.
// -------------------------------------------------------------------------
function renderPlainText(data) {
  let result = `Statement for ${data.customer}\n`;

  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
}

// -------------------------------------------------------------------------
// FUNCTION: renderHtml
// -------------------------------------------------------------------------
// REFACTORING: Extract Function
//
// Renders the statement data as HTML.
// This demonstrates the power of Split Phase:
// - We added a completely new output format
// - Zero changes to calculation logic
// - The HTML renderer is self-contained and focused
// -------------------------------------------------------------------------
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

// -------------------------------------------------------------------------
// FUNCTION: usd
// -------------------------------------------------------------------------
// REFACTORING: Extract Function
//
// Formats a number (in cents) as USD currency.
// Shared between both plain text and HTML renderers.
// -------------------------------------------------------------------------
function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber / 100);
}
