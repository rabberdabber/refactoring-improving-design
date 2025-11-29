// ============================================================================
// CHAPTER 1: Refactoring, A First Example
// Step 8: Replace Conditional with Polymorphism
// ============================================================================
//
// REFACTORINGS APPLIED:
//
// 1. REPLACE TYPE CODE WITH SUBCLASSES
//    Instead of using a type field (play.type) and switching on it,
//    we create subclasses for each type. Each subclass knows how to
//    calculate its own amount and volume credits.
//
// 2. REPLACE CONSTRUCTOR WITH FACTORY FUNCTION
//    The factory function createPerformanceCalculator() encapsulates
//    the logic of choosing which subclass to instantiate. Client code
//    doesn't need to know about the subclasses.
//
// 3. REPLACE CONDITIONAL WITH POLYMORPHISM
//    The switch statement in amountFor() is replaced by polymorphic
//    method dispatch. Each subclass implements its own get amount().
//
// 4. MOVE FUNCTION
//    The calculation logic moves from standalone functions (amountFor,
//    volumeCreditsFor) into methods on the calculator classes.
//
// 5. CHANGE FUNCTION DECLARATION
//    Methods become getters (get amount(), get volumeCredits()) for
//    cleaner syntax when accessing calculated values.
//
// WHY POLYMORPHISM?
// - Adding a new play type (e.g., "musical") only requires adding a new
//   subclass - no need to modify existing switch statements
// - Each type's logic is encapsulated in its own class
// - Easier to test each type in isolation
// - Open/Closed Principle: open for extension, closed for modification
// ============================================================================

// ============================================================================
// FACTORY FUNCTION
// ============================================================================
// REFACTORING: Replace Constructor with Factory Function
//
// The factory function returns the appropriate subclass based on play type.
// This is the ONLY place where we switch on type - all other code uses
// polymorphism.
// ============================================================================
export function createPerformanceCalculator(aPerformance, aPlay) {
  switch (aPlay.type) {
    case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
    case "comedy": return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`unknown type: ${aPlay.type}`);
  }
}

// ============================================================================
// BASE CLASS
// ============================================================================
// REFACTORING: Replace Type Code with Subclasses
//
// The base class defines the common interface and shared behavior.
// Subclasses override methods to provide type-specific calculations.
// ============================================================================
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  // -------------------------------------------------------------------------
  // REFACTORING: Move Function
  // Base implementation of volume credits calculation.
  // This is the default behavior - subclasses can override if needed.
  //
  // REFACTORING: Change Function Declaration
  // Changed from volumeCreditsFor(aPerformance) function to get volumeCredits()
  // getter. This allows cleaner access: calculator.volumeCredits
  // -------------------------------------------------------------------------
  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

// ============================================================================
// TRAGEDY CALCULATOR
// ============================================================================
// REFACTORING: Replace Conditional with Polymorphism
//
// TragedyCalculator implements the tragedy-specific pricing logic.
// The switch case for "tragedy" is now this entire class.
//
// Pricing Rules:
// - Base: $400 (40000 cents)
// - Over 30 audience: +$10 per person (1000 cents)
// ============================================================================
class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
  // Note: volumeCredits uses base class implementation (no comedy bonus)
}

// ============================================================================
// COMEDY CALCULATOR
// ============================================================================
// REFACTORING: Replace Conditional with Polymorphism
//
// ComedyCalculator implements the comedy-specific pricing logic.
// The switch case for "comedy" is now this entire class.
//
// Pricing Rules:
// - Base: $300 (30000 cents)
// - Over 20 audience: +$100 + $5 per person over 20
// - Always: +$3 per person (300 cents)
//
// Volume Credits:
// - Base credits (inherited from parent)
// - Comedy bonus: +1 credit per 5 audience members
// ============================================================================
class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  // Override base class - comedy has bonus credits
  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}
