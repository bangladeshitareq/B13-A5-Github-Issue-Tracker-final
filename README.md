# GitHub Issues Tracker - Assignment 5

This is a simple GitHub-inspired issue management dashboard built with Vanilla JavaScript and Tailwind CSS.

## Features

- **Login:** Simple admin login.
- **Data Load:** Fetches issues from server.
- **Search:** Search specific issues using the search bar.
- **Filter:** Filter by All, Open, or Closed status.
- **Detail Modal:** See full issue details by clicking the cards.

## Questions & Answers

**1. What is the difference between var, let, and const?**
`var` is older and function-scoped, which can cause bugs. `let` and `const` are block-scoped. We use `let` when we need to change the value later, and `const` when the value remains constant.

**2. What is the spread operator (...)?**
The spread operator allows us to copy elements from an array or object into a new one. For example, `[...oldArray]` creates a new copy of the array without affecting the original.

**3. What is the difference between map(), filter(), and forEach()?**

- `forEach()` just loops through items (does not return anything).
- `map()` creates a new array by transforming every item.
- `filter()` creates a new array but only with items that pass a specific condition.

**4. What is an arrow function?**
It is a shorter way to write functions in ES6. Instead of writing `function() {}`, we use `() => {}`. It is cleaner and handles the `this` keyword differently.

**5. What are template literals?**
Instead of using single or double quotes, we use backticks (``). This allows us to easily put variables inside strings using `${variableName}`.

## Live Link 

https://bangladeshitareq.github.io/B13-A5-Github-Issue-Tracker-final/
