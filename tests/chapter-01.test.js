// ============================================================================
// CHAPTER 1: Tests for All Refactoring Steps
// ============================================================================
//
// These tests verify that each refactoring step produces the SAME output
// as the original. This is the essence of refactoring:
// "Changing the structure of code without changing its behavior."
//
// The tests ensure we haven't broken anything as we refactor.
// ============================================================================

import { plays, invoice } from '../chapter-01/testData.js';

// Import all versions of statement
import { statement as statement01 } from '../chapter-01/01-original/statement.js';
import { statement as statement02 } from '../chapter-01/02-extract-function/statement.js';
import { statement as statement03 } from '../chapter-01/03-replace-temp-with-query/statement.js';
import { statement as statement04 } from '../chapter-01/04-extract-volume-credits/statement.js';
import { statement as statement05 } from '../chapter-01/05-split-loop/statement.js';
import { statement as statement06 } from '../chapter-01/06-replace-loop-with-pipeline/statement.js';
import { statement as statement07, htmlStatement } from '../chapter-01/07-split-phase/statement.js';

// The expected output that all versions should produce
const expectedPlainText = `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`;

const expectedHtml = `<h1>Statement for BigCo</h1>
<table>
<tr><th>play</th><th>seats</th><th>cost</th></tr>
 <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>
 <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>
 <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>
</table>
<p>Amount owed is <em>$1,730.00</em></p>
<p>You earned <em>47</em> credits</p>
`;

// ============================================================================
// TEST: All refactoring steps produce identical output
// ============================================================================
// This is the core refactoring test: behavior must not change.
// ============================================================================

describe('Chapter 1: Refactoring Progression', () => {

  describe('Step 01: Original', () => {
    test('produces correct statement', () => {
      expect(statement01(invoice, plays)).toBe(expectedPlainText);
    });
  });

  describe('Step 02: Extract Function', () => {
    test('produces same output as original', () => {
      expect(statement02(invoice, plays)).toBe(expectedPlainText);
    });
  });

  describe('Step 03: Replace Temp with Query', () => {
    test('produces same output as original', () => {
      expect(statement03(invoice, plays)).toBe(expectedPlainText);
    });
  });

  describe('Step 04: Extract Volume Credits', () => {
    test('produces same output as original', () => {
      expect(statement04(invoice, plays)).toBe(expectedPlainText);
    });
  });

  describe('Step 05: Split Loop', () => {
    test('produces same output as original', () => {
      expect(statement05(invoice, plays)).toBe(expectedPlainText);
    });
  });

  describe('Step 06: Replace Loop with Pipeline', () => {
    test('produces same output as original', () => {
      expect(statement06(invoice, plays)).toBe(expectedPlainText);
    });
  });

  describe('Step 07: Split Phase', () => {
    test('statement() produces same output as original', () => {
      expect(statement07(invoice, plays)).toBe(expectedPlainText);
    });

    test('htmlStatement() produces correct HTML output', () => {
      expect(htmlStatement(invoice, plays)).toBe(expectedHtml);
    });
  });

});

// ============================================================================
// TEST: Edge cases and error handling
// ============================================================================

describe('Chapter 1: Edge Cases', () => {

  describe('Tragedy calculations', () => {
    test('audience at threshold (30) - no extra charge', () => {
      const smallInvoice = {
        customer: "SmallCo",
        performances: [{ playID: "hamlet", audience: 30 }]
      };
      const result = statement07(smallInvoice, plays);
      expect(result).toContain('$400.00');
    });

    test('audience below threshold - base charge only', () => {
      const tinyInvoice = {
        customer: "TinyCo",
        performances: [{ playID: "hamlet", audience: 20 }]
      };
      const result = statement07(tinyInvoice, plays);
      expect(result).toContain('$400.00');
    });
  });

  describe('Comedy calculations', () => {
    test('audience at threshold (20) - base charge only', () => {
      const comedyInvoice = {
        customer: "FunnyCo",
        performances: [{ playID: "as-like", audience: 20 }]
      };
      const result = statement07(comedyInvoice, plays);
      expect(result).toContain('$360.00'); // 30000 + 300*20 = 36000 cents
    });

    test('audience below threshold', () => {
      const smallComedyInvoice = {
        customer: "SmallFunnyCo",
        performances: [{ playID: "as-like", audience: 10 }]
      };
      const result = statement07(smallComedyInvoice, plays);
      expect(result).toContain('$330.00'); // 30000 + 300*10 = 33000 cents
    });
  });

  describe('Error handling', () => {
    test('throws error for unknown play type', () => {
      const badPlays = {
        "bad": { "name": "Bad Play", "type": "musical" }
      };
      const badInvoice = {
        customer: "BadCo",
        performances: [{ playID: "bad", audience: 30 }]
      };
      expect(() => statement07(badInvoice, badPlays)).toThrow('unknown type: musical');
    });
  });

  describe('Volume credits', () => {
    test('no credits for audience of 30 or less (tragedy)', () => {
      const noCreditsInvoice = {
        customer: "NoCreditsCo",
        performances: [{ playID: "hamlet", audience: 30 }]
      };
      const result = statement07(noCreditsInvoice, plays);
      expect(result).toContain('You earned 0 credits');
    });

    test('comedy bonus credits calculated correctly', () => {
      // For comedy with 25 audience:
      // Base credits: max(25-30, 0) = 0
      // Comedy bonus: floor(25/5) = 5
      // Total: 5 credits
      const comedyCreditsInvoice = {
        customer: "ComedyCreditsCo",
        performances: [{ playID: "as-like", audience: 25 }]
      };
      const result = statement07(comedyCreditsInvoice, plays);
      expect(result).toContain('You earned 5 credits');
    });
  });

});

// ============================================================================
// TEST: All versions handle edge cases the same way
// ============================================================================

describe('Chapter 1: Consistency Across Versions', () => {
  const allVersions = [
    { name: '01-original', fn: statement01 },
    { name: '02-extract-function', fn: statement02 },
    { name: '03-replace-temp-with-query', fn: statement03 },
    { name: '04-extract-volume-credits', fn: statement04 },
    { name: '05-split-loop', fn: statement05 },
    { name: '06-replace-loop-with-pipeline', fn: statement06 },
    { name: '07-split-phase', fn: statement07 },
  ];

  const testCases = [
    {
      name: 'single tragedy performance',
      invoice: { customer: "Test", performances: [{ playID: "hamlet", audience: 55 }] }
    },
    {
      name: 'single comedy performance',
      invoice: { customer: "Test", performances: [{ playID: "as-like", audience: 35 }] }
    },
    {
      name: 'empty performances',
      invoice: { customer: "Empty", performances: [] }
    },
  ];

  testCases.forEach(testCase => {
    test(`all versions produce same output for: ${testCase.name}`, () => {
      const results = allVersions.map(v => v.fn(testCase.invoice, plays));

      // All results should be identical
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toBe(results[0]);
      }
    });
  });
});
