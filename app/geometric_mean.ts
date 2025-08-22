/** Scratchpad for getting a specific geometric mean, given a uniform sample with a fixed min and a guess for the necessary max.

The guess is coming from a binary search, not done here. This code is just verifying the guess.

The example case was a buyer's max price of 1_000_000, and a seller's min price of 1, for a desired geometric mean of 1_000.
We tried arbitrary higher fixed_min values, to cut off the extreme ends of the distribution.
*/

function calculate_geometric_mean_of_uniform_sample(min: number, max: number) {
  const resolution = 1e8
  const step = (max - min) / resolution
  let log_sum = 0
  let val = min
  for (let i = 0; i < resolution; i++) {
    log_sum += Math.log(val)
    val += step
  }
  return Math.exp(log_sum / resolution)
}

// const fixed_min = 500
// const claudes_guess = 1603.017

// const fixed_min = 100
// const claudes_guess = 2363

const fixed_min = 4
const claudes_guess = 2692

console.log(
  'result==',
  calculate_geometric_mean_of_uniform_sample(fixed_min, claudes_guess)
)
