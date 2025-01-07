export default function randomStr(length = 8): string {
	const alphanumericCharacters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(
			Math.random() * alphanumericCharacters.length,
		);
		result += alphanumericCharacters[randomIndex];
	}

	return result;
}
