import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui';

import { Input, Textarea } from '@/components/ui';


type AlertDialogOpts = {
	title?: string;
	description?: string;
	okText?: string;
	onConfirm?: () => void;
};

type ConfirmDialogProps = {
	title?: string;
	question?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: (prompt?: string) => void;
	onCancel?: () => void;
	onClose?: () => void;
};

type ConfirmDialogWithInputTextProps = ConfirmDialogProps & {
	inputText?: string;
	inputType?: 'text' | 'email' | 'number' | 'password' | 'multiline';
	inputPlaceholder?: string;
	inputRequired?: boolean;
	inputMinLength?: number;
	inputMaxLength?: number;
	inputPattern?: string;
	inputErrorMessage?: string;
	inputValue?: string;
}

type AlertContextProps = {
	alertBox: (alertParams: AlertDialogOpts) => void;
	confirmBox: (
		confirmParams: ConfirmDialogProps,
	) => void;
	confirmWithInputBox: (
		confirmParams: ConfirmDialogWithInputTextProps,
	) => void;
};


const AlertContext = createContext<
	AlertContextProps | undefined
>(undefined);

type AlertProviderProps = {
	children: ReactNode;
};

export function AlertProvider({
	children,
}: AlertProviderProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [alertTitle, setAlertTitle] = useState('');
	const [alertDescription, setAlertDescription] = useState('');
	const [confirmText, setConfirmText] = useState('Confirm');
	const [cancelText, setCancelText] = useState('Cancel');
	const [inputText, setInputText] = useState('');
	const [confirmDialogWithInputTextProps, setConfirmDialogWithInputTextProps] = useState<ConfirmDialogWithInputTextProps | null>(null);

	const [modalType, setModalType] = useState<
		'alert' | 'confirm' | 'confirmWithInput'
	>('alert');
	const [confirmCallback, setConfirmCallback] = useState<
		((prompt?: string) => void) | null
	>(null);
	const [cancelCallback, setCancelCallback] = useState<
		(() => void) | null
	>(null);
	const [closeCallback, setCloseCallback] = useState<
		(() => void) | null
	>(null);
	const setCloseStates = useCallback(() => {
		setAlertTitle('');
		setAlertDescription('');
		setConfirmText('Confirm');
		setCancelText('Cancel');
		setModalType('alert');
		setConfirmCallback(null);
		setCancelCallback(null);
		setCloseCallback(null);
		setInputText('');
		setConfirmDialogWithInputTextProps(null);
	}, []);
	useEffect(() => {
		if (!dialogOpen) {
			setCloseStates();
		}
	}, [dialogOpen]);

	const canConfirmDialogWithInput = (props: ConfirmDialogWithInputTextProps | null, inputText: string) => {
		if (!props) {
			return false;
		}
		if (props.inputRequired && !inputText) {
			return false;
		}
		if (props.inputMinLength && inputText.length < props.inputMinLength) {
			return false;
		}
		if (props.inputMaxLength && inputText.length > props.inputMaxLength) {
			return false;
		}
		if (props.inputPattern && !new RegExp(props.inputPattern).test(inputText)) {
			return false;
		}
		return true;
	};

	return (
		<AlertContext.Provider
			value={{
				alertBox: useCallback(
					({ title, description, okText, onConfirm }) => {
						setAlertTitle(title || 'Alert');
						setAlertDescription(description || '');
						setConfirmText(okText || 'OK');
						setModalType('alert');
						setConfirmCallback(() => onConfirm || null);
						setDialogOpen(true);
					},
					[],
				),
				confirmBox: useCallback(
					({
						title,
						question,
						confirmText,
						cancelText,
						onConfirm,
						onCancel,
						onClose,
					}) => {
						setAlertTitle(title || 'Confirm');
						setAlertDescription(question || '');
						setModalType('confirm');
						setConfirmText(confirmText || 'Confirm');
						setCancelText(cancelText || 'Cancel');
						setConfirmCallback(() => onConfirm || null);
						setCancelCallback(() => onCancel || null);
						setCloseCallback(() => onClose || null);
						setDialogOpen(true);
					},
					[],
				),
				confirmWithInputBox: useCallback(
					(props: ConfirmDialogWithInputTextProps) => {
						setConfirmDialogWithInputTextProps(props);
						setAlertTitle(props.title || 'Confirm');
						setAlertDescription(props.question || '');
						setModalType('confirmWithInput');
						setConfirmText(confirmText || 'Confirm');
						setCancelText(cancelText || 'Cancel');
						setConfirmCallback(() => props.onConfirm || null);
						setCancelCallback(() => props.onCancel || null);
						setCloseCallback(() => props.onClose || null);
						setDialogOpen(true);
						
					},
					[],
				),
			}}>
			{children}
			<AlertDialog
				open={dialogOpen}
				onOpenChange={(openState) => {
					setDialogOpen(openState);
					if (!openState) {
						setCloseStates();
						if (closeCallback) {
							closeCallback();
						}
					}
				}}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{alertTitle}</AlertDialogTitle>
						<AlertDialogDescription>
							{alertDescription}
							{modalType === 'confirmWithInput' && confirmDialogWithInputTextProps && (
								<>
								{confirmDialogWithInputTextProps.inputType === 'multiline' ? (
									<Textarea
										value={inputText}
										onChange={(e) =>
											setInputText(e.target.value)
										}
										placeholder={confirmDialogWithInputTextProps.inputPlaceholder || 'Enter your input'}
										className="mt-2"
									/>
								) : (
									<Input
										type={confirmDialogWithInputTextProps.inputType || 'text'}
										value={inputText}
										onChange={(e) =>
											setInputText(e.target.value)
										}
										placeholder={confirmDialogWithInputTextProps.inputPlaceholder || 'Enter your input'}
										className="mt-2"
									/>
								)	
								}
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						{(modalType === 'confirm' || modalType === 'confirmWithInput') && (
							<>
								<AlertDialogCancel onClick={cancelCallback || undefined}>
									{cancelText}
								</AlertDialogCancel>
								<AlertDialogAction
									disabled={(modalType === 'confirmWithInput') ? !canConfirmDialogWithInput(confirmDialogWithInputTextProps, inputText) : false}
									onClick={() => {
										if (confirmCallback) {
											(modalType === 'confirmWithInput'
												? confirmCallback(inputText)
												: confirmCallback());
										}
										setDialogOpen(false);
									}}>
									{confirmText}
								</AlertDialogAction>
							</>
						)}
						{modalType === 'alert' && (
							<AlertDialogAction
								onClick={() => {
									if (confirmCallback) {
										confirmCallback();
									}
									setDialogOpen(false);
								}}>
								{confirmText}
							</AlertDialogAction>
						)}
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

		</AlertContext.Provider>
	);
}

export function useAlert() { // confirmBox
	const context = useContext(AlertContext);
	if (!context) {
		throw new Error(
			'useAlert must be used within AlertProvider',
		);
	}
	return context;
}
