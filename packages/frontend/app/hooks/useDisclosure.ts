import { useCallback, useEffect, useState } from "react";

interface DefaultProps {
	defaultOpen?: boolean;
	localStorageKey?: string;
}

const parseLocalStorageState = (key: string | undefined) => {
	if (!key) return undefined;
	const value = localStorage.getItem(key);
	if (value === "true") return true;
	if (value === "false") return false;
	return undefined;
};

/**
 * Copied from https://chakra-ui.com/docs/hooks/use-disclosure
 * handles state for modals, drawers, popovers, etc.
 */
export const useDisclosure = (props?: DefaultProps): DisclosureReturnType => {
	const [isOpen, setOpen] = useState(
		parseLocalStorageState(props?.localStorageKey) ??
			props?.defaultOpen ??
			false,
	);

	const onClose = useCallback(() => setOpen(false), []);

	const onOpen = useCallback(() => setOpen(true), []);

	const onToggle = useCallback(() => setOpen((prev) => !prev), []);

	const getButtonProps = () => ({
		onClick: onToggle,
	});

	const getDisclosureProps = () => ({
		open: isOpen,
		onClose,
		onOpen,
	});

	useEffect(() => {
		if (props?.localStorageKey) {
			localStorage.setItem(props.localStorageKey, isOpen.toString());
		}
	}, [isOpen, props?.localStorageKey]);

	return {
		/** Open/Close status */
		isOpen,
		/** Close callback */
		onClose,
		/** Open callback */
		onOpen,
		/** Toggle callback */
		onToggle,
		/** Get the disclosure props */
		getDisclosureProps,
		/** Get the button props */
		getButtonProps,
	};
};

interface DisclosureReturnType {
	isOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	onToggle: () => void;
	getDisclosureProps: () => {
		open: boolean;
		onClose: () => void;
		onOpen: () => void;
	};
	getButtonProps: () => {
		onClick: () => void;
	};
}
