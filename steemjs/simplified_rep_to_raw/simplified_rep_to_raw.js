/**
 * Converts a simlified reputation score (60) to it's raw form (7762471166286)
 * Note that this is an approximation, but it's precise enough for most of the applications.
 * @param {int} rep - Simplified reputation
 * @return {int} raw reputation
 */
function rep_to_raw(rep)
// Convert a UI-ready rep score back into its approx raw value."""
{
    rep = parseFloat(rep+0.01) - 25;
    rep = rep / 9;
    rep = rep + 9;
    const sign = (rep >= 0 ? 1  : -1);
    return parseInt(sign * Math.pow(10, rep))
}

// example
console.log(rep_to_raw(60));

