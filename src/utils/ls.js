export function getItemLC (key) {
	return JSON.parse(localStorage.getItem(key))
}

export function setItemLC (key, item) {
	return localStorage.setItem(key, JSON.stringify(item))
}
