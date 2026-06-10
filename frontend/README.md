// When the user starts typing for the first time:
// - Set `userTyping = true`
// - Start a 1-second `setTimeout` that will set `userTyping = false`
//
// If another typing event occurs before the timeout finishes:
// - Clear the previous timeout
// - Create a new 1-second timeout
//
// This continues until the user stops typing for 1 second,
// after which `userTyping` becomes `false`.