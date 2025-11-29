# Refactoring: Improving the Design of Existing Code

This project contains examples and exercises for learning refactoring techniques from Martin Fowler's book "Refactoring: Improving the Design of Existing Code".

## Project Structure

```
.
├── chapter-01/                         # Chapter 1: Refactoring, A First Example
│   ├── 01-original/                    # Starting point - monolithic function
│   ├── 02-extract-function/            # Extract amountFor()
│   ├── 03-replace-temp-with-query/     # Extract playFor(), inline variables
│   ├── 04-extract-volume-credits/      # Extract volumeCreditsFor()
│   ├── 05-split-loop/                  # Split loops, slide statements
│   ├── 06-replace-loop-with-pipeline/  # Use reduce() for totals
│   ├── 07-split-phase/                 # Separate calculation & formatting
│   ├── 08-polymorphism/                # Replace conditionals with polymorphism
│   └── testData.js                     # Shared test data
├── exercises/                          # Practice exercises
├── tests/                              # Test files
│   └── chapter-01.test.js              # Tests for all Chapter 1 versions
└── README.md
```

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
npm test
```

### Watch Mode (for TDD)
```bash
npm run test:watch
```

## Chapter 1: Refactoring, A First Example

The classic theater billing example demonstrating step-by-step refactoring:

| Step | Directory | Refactoring Technique | Description |
|------|-----------|----------------------|-------------|
| 1 | `01-original/` | - | Starting point with all problems |
| 2 | `02-extract-function/` | Extract Function | Extract `amountFor()` |
| 3 | `03-replace-temp-with-query/` | Replace Temp with Query, Inline Variable | Extract `playFor()`, remove temp |
| 4 | `04-extract-volume-credits/` | Extract Function, Inline Variable | Extract `volumeCreditsFor()` |
| 5 | `05-split-loop/` | Split Loop, Slide Statements | Separate accumulation loops |
| 6 | `06-replace-loop-with-pipeline/` | Replace Loop with Pipeline | Use `reduce()` for totals |
| 7 | `07-split-phase/` | Split Phase | Separate calculation from formatting |
| 8 | `08-polymorphism/` | Replace Conditional with Polymorphism | Use subclasses for play types |

Each step includes detailed comments explaining the refactoring technique applied.

## Refactoring Techniques Covered

### Chapter 1
- **Extract Function** - Breaking down large functions into smaller, named pieces
- **Inline Variable** - Removing unnecessary temporary variables
- **Replace Temp with Query** - Replacing temp variables with function calls
- **Change Function Declaration** - Renaming for clarity
- **Split Loop** - Separating different accumulations
- **Slide Statements** - Moving related code together
- **Replace Loop with Pipeline** - Using map/reduce instead of for loops
- **Split Phase** - Separating calculation from formatting
- **Replace Type Code with Subclasses** - Using inheritance for type variations
- **Replace Constructor with Factory Function** - Encapsulating object creation
- **Replace Conditional with Polymorphism** - Using method dispatch instead of switch
- **Move Function** - Moving logic to appropriate classes

## Best Practices

1. Always have tests before refactoring
2. Take small steps
3. Run tests after each change
4. Commit frequently
5. Refactor first, then optimize based on profiling

## Resources

- [Refactoring.com](https://refactoring.com/)
- Martin Fowler's Refactoring Catalog
