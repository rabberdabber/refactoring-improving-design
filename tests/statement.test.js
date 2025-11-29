const { statement } = require('../examples/01-extract-function-before');
const { plays, invoice } = require('../examples/test-data');

describe('statement', () => {
  test('should generate correct statement', () => {
    const result = statement(invoice, plays);
    
    expect(result).toContain('Statement for BigCo');
    expect(result).toContain('Hamlet: $650.00 (55 seats)');
    expect(result).toContain('As You Like It: $580.00 (35 seats)');
    expect(result).toContain('Othello: $500.00 (40 seats)');
    expect(result).toContain('Amount owed is $1,730.00');
    expect(result).toContain('You earned 47 credits');
  });

  test('should calculate correct amount for tragedy', () => {
    const smallInvoice = {
      customer: "SmallCo",
      performances: [
        { playID: "hamlet", audience: 30 }
      ]
    };
    
    const result = statement(smallInvoice, plays);
    expect(result).toContain('$400.00');
  });

  test('should calculate correct amount for comedy', () => {
    const comedyInvoice = {
      customer: "FunnyCo",
      performances: [
        { playID: "as-like", audience: 20 }
      ]
    };
    
    const result = statement(comedyInvoice, plays);
    expect(result).toContain('$360.00');
  });

  test('should throw error for unknown play type', () => {
    const badPlays = {
      "bad": { "name": "Bad Play", "type": "unknown" }
    };
    const badInvoice = {
      customer: "BadCo",
      performances: [{ playID: "bad", audience: 30 }]
    };
    
    expect(() => statement(badInvoice, badPlays)).toThrow('unknown type: unknown');
  });
});
