export function setScore(sets, filterLast = true) {
	let completedSets = filterLast ? sets.slice(0, sets.length-1) : sets;
	return [
		completedSets.filter((s) => s[0] > s[1]).length,
		completedSets.filter((s) => s[0] < s[1]).length
	];
}

export function currentScore(sets) {
	return sets[sets.length-1];
}