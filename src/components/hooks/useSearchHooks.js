import { useState } from "react";
import { matches } from "validator";

function useSearchHooks() {
	const [input, setInput] = useState("");
	const [inputError, setInputError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [isInputOnBlur, setIsInputOnBlur] = useState(false);

	function handleInputOnChange(e) {
		let inputValue = e.target.value;
		let inputName = e.target.name;
		setInput(inputValue);

		let checkRegex;
		let errorMessage;

		if (inputName === "address search") {
			checkRegex = /[!@#$%^&*()\[\]?":;.,{}|<>]/g;
			errorMessage = `${inputName} cannot have special characters`;

			// checkRegex = /[!@#$%^&*()\[\]?":;.{}|<>]/g;
			// errorMessage = `${inputName} cannot have special characters other than a coma ","`;
		}
		// if (inputName === "address search") {
		// 	checkRegex = /[!@#$%^&*()\[\]?":;{}|<>]/g;
		// 	errorMessage = `${inputName} cannot have special characters other than a period "." or a coma ","`;
		// }
		if (matches(inputValue, checkRegex)) {
			setInputError(true);
			setErrorMessage(errorMessage);
		} else {
			setInputError(false);
			setErrorMessage("");
		}
	}

	function handleInputOnBlur() {
		setIsInputOnBlur(true);
	}

	return [
		input,
		handleInputOnChange,
		inputError,
		errorMessage,
		isInputOnBlur,
		handleInputOnBlur,
	];
}

export default useSearchHooks;
