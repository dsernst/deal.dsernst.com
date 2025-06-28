## How to Fairly Price 2-Person Bets?

**Given:** 2 people disagree about the probability of a future event. They state their personal best guess probabilities:

Person 1 says: 99% odds.  
Person 2 says: 50% odds.

### The Question:

How to find a fair price for a bet between them, for max Expected Gain for each, given their stated believed odds?

# Strategy 1: Linear Midpoint (Arithmetic Mean)

Simple linear mid: 74.5%

> `(99 + 50) / 2 => 74.5`

## Person 1: Expected Gain

YES @ $.745 per $1  
(believe 99%— willing to pay .99)

.745 cost  
.99 value

.99 - .745 = .245 absolute discount  
.245 / .99 = `24.7%` relative discount

## Person 2: Expected Gain

NO @ $.255 per $1  
(believe 50%— willing to pay .50)

.255 cost  
.50 value

.5 - .255 = .245 absolute discount  
.245 / .5 = `49%` relative discount

### Strategy 1 Conclusion

absolute discounts are equal: `.245 = .245`  
relative discounts are **_not_** equal: `.247 != .49`

# Strategy 2: Can we find a "Relative" Midpoint? To equalize relative discounts

We'll derive this algebraically.

### Still given same individual probabilities:

Person 1 says: 99% odds. `alias: a`  
Person 2 says: 50% odds. `alias: b`

relative mid: `x` <--- Unknown value we want to solve for.

### From P1's Perspective

YES @ x per $1  
(believe 99%— willing to pay .99)

x cost  
.99 value

.99 - x = y absolute discount  
y / .99 = z relative discount

### From P2's Perspective

NO @ (1-x) per $1  
(believe 50%— willing to pay .50)

(1-x) cost  
.50 value

.5 - (1-x) = u absolute discount  
u / .5 = v relative discount

## Goal:

Find x, such that `z == v`  
z = v  
y / .99 = u / .5

(.99 - x) / .99 = (.5 - (1-x)) / .5

(a - x) / a = (b - (1-x)) / b  
(a - x) = a \* (b - (1-x)) / b  
b \* (a - x) = a \* (b - (1-x))

ba - bx = ab - a + ax  
ba = ab - a + ax + bx  
ab - ab + a = ax + bx  
a = ax + bx  
a = (a + b)x  
a / (a+b) = x

### Success: x = a / (a+b)

Let's plug in our numbers and see if it works:

a=.99  
b=.5  
x = .99/(.99+.5)  
x = .99/(1.49)  
x = 0.6644  
"relative mid"

## relative mid: 66.44%

### For p1:

YES @ $.6644 per $1  
(believe 99%— willing to pay .99)

.6644 cost  
.99 value

.99 - .664 = .326 absolute discount  
.326 / .99 = `32.9%` relative discount

### For p2:

NO @ $.336 per $1  
(believe 50%— willing to pay .50)

.336 cost  
.50 value

.5 - .336 = .164 absolute discount  
.164 / .5 = `32.8%` relative discount

### Strategy 2 Conclusion

absolute discounts are not equal  
relative discounts are equal 🎉
