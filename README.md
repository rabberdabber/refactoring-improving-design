# Refactoring: Improving the Design of Existing Code

This project contains examples and exercises for learning refactoring techniques from Martin Fowler's book "Refactoring: Improving the Design of Existing Code".

## Project Structure

```
.
├── examples/          # Code examples demonstrating various refactoring techniques
├── exercises/         # Practice exercises with "before" and "after" code
├── tests/            # Test files for examples and exercises
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

## Refactoring Techniques

This project will cover various refactoring techniques including:

- **Extract Function** - Breaking down large functions into smaller, named pieces
- **Inline Function** - Removing unnecessary indirection
- **Extract Variable** - Making complex expressions more readable
- **Rename Variable** - Improving code clarity through better naming
- **Introduce Parameter Object** - Grouping related parameters
- **Replace Temp with Query** - Removing temporary variables
- **Split Phase** - Separating different concerns
- And many more...

## Best Practices

1. Always have tests before refactoring
2. Take small steps
3. Run tests after each change
4. Commit frequently

## Resources

- [Refactoring.com](https://refactoring.com/)
- Martin Fowler's Refactoring Catalog
