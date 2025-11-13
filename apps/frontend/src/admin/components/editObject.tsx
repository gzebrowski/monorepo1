import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ModelObjectForm, SaveVariant } from './modelObjectForm';
import {
	CommonReturnModelItemType,
	NewFormData,
	ExistingFormData,
	CommonPostResult,
} from '@simpleblog/shared/admin';
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
	Separator,
	Card,
	CardTitle,
	Badge,
	Button,
} from './ui/simpleComponents';
import { AdminService } from '../services/admin.services';
import { ChevronDown, PlusIcon, AlertTriangle } from './ui/icons';
import { ErrorData } from '../models';
import { cn } from '../utils/utils';

type EditObjectProps = {
	model: string;
	itemId: string;
	onSave?: (data: Record<string, any>, saveVariant: SaveVariant) => void;
	onCancel?: () => void;
    onDelete?: (id?: string) => void;
	onError?: (error: Error) => void;
	onRedirect?: (newModel: string, itemId: string) => void;
	canAddItem?: boolean;
	canDeleteItem?: boolean;
};

// type ErrorData = {
//     message: string | null | undefined;
//     main: Record<string, string> | null | undefined;
//     inlines: Record<string, Record<string, string>> | null | undefined;
// }

const EditObject: React.FC<EditObjectProps> = ({
	model,
	itemId,
	onSave,
	onCancel,
	onError,
    onDelete,
	canAddItem,
	onRedirect,
    canDeleteItem,
}) => {
	const [modelData, setModelData] = useState<CommonReturnModelItemType | null>(
		null,
	);
	const [newInlinesData, setNewInlinesData] = useState<
		Record<string, NewFormData[]>
	>({});
	const [inlinesOpenMap, setInlinesOpenMap] = useState<Record<string, boolean>>(
		{},
	);
	const [existingInlinesData, setExistingInlinesData] = useState<
		Record<string, ExistingFormData[]>
	>({});
	const [errorData, setErrorData] = useState<ErrorData>({
		message: null,
		main: {},
		inlines: {},
	});
	const [preparingStep, setPreparingStep] = useState<number>(1);
	const currentIdx = useRef(0);
	const apiService = new AdminService();

	const retrievedData = async (data: CommonReturnModelItemType) => {
		setModelData(data);
		const newInlines: Record<string, NewFormData[]> = {};
		data.inlines?.forEach((inline) => {
			newInlines[inline.model] = [];
			changeOpenState(inline.model, inline.expanded || false);
		});
		setNewInlinesData(newInlines);
		setPreparingStep(2);
	};
	const changeNewInlinesData = (
		newInlines: Record<string, NewFormData[]>,
		reload = false,
	) => {
		setNewInlinesData(newInlines);
		if (reload) {
			setPreparingStep(-1);
		}
	};
	useEffect(() => {
		if (preparingStep < 0) {
			setPreparingStep(preparingStep * -1);
		}
	}, [preparingStep]);
	const getInlineIdsByModel = useCallback(
		(model: string, data?: CommonReturnModelItemType): string[] => {
			const mData = data || modelData;
			if (!mData || !mData?.inlineItems?.[model].items.length) {
				return [];
			}
			return mData.inlineItems[model].items;
		},
		[modelData],
	);
	const getInlineConfByModel = useCallback(
		(model: string) => {
			if (!modelData || !modelData?.inlineItems?.[model].exclude) {
				return {};
			}
			return { exclude: modelData.inlineItems[model].exclude };
		},
		[modelData],
	);
	const updateAllData = async (
		model: string,
		itemId: string | undefined | null,
		formData: Record<string, any>,
	) => {
		setErrorData({ message: null, main: {}, inlines: {} });
		const mainObjResult = await apiService.updateModelItem(
			model,
			itemId || '',
			formData,
		);
		if (mainObjResult.status === 'error') {
			return mainObjResult;
		}

		const inlineResults = await apiService.saveInlines(
			model,
			itemId || '',
			existingInlinesData,
			newInlinesData,
		);
		if (inlineResults.status === 'error') {
			return inlineResults;
		}
		return mainObjResult;
	};

	const changeOpenState = (model: string, open: boolean) => {
		setInlinesOpenMap((prev) => ({
			...prev,
			[model]: open,
		}));
	};
	const cancelEdit = async () => {
		if (onCancel) {
			onCancel();
		}
	};

	function onSaveError(error: CommonPostResult): void {
		if (error.errors) {
			setErrorData((prev) => ({
				...prev,
				main: error.errors?.reduce(
					(acc, err) => {
						acc[err.field] = err.message;
						return acc;
					},
					{} as Record<string, string>,
				),
			}));
		}
		if (error.errorMap) {
			const inlines: Record<string, Record<string, string>> = {};
			Object.keys(error.errorMap).forEach((k) => {
				inlines[k] = (error.errorMap?.[k] || []).reduce(
					(acc, err) => {
						acc[err.field] = err.message;
						return acc;
					},
					{} as Record<string, string>,
				);
			});
			setErrorData((prev) => ({
				...prev,
				inlines,
			}));
		}
		if (error.message) {
			setErrorData((prev) => ({
				...prev,
				message: error.message,
			}));
		}
	}

	return (
		<>
			{preparingStep < 1 ? null : (
				<>
					{errorData.message && (
						<div className="text-center border border-red-500 p-2 mb-2">
							<div className="text-red-500 inline-flex items-center mt-2 font-bold">
								<AlertTriangle className="mr-2" />
								<span className="">{errorData.message}</span>
							</div>
						</div>
					)}
					<ModelObjectForm
						mode="edit"
						model={model}
						itemId={itemId}
						onSave={(data, saveVariant) => onSave?.(data, saveVariant)}
                        onDelete={() => onDelete?.(itemId)}
                        canDelete={canDeleteItem}
						customUpdate={updateAllData}
						errorMap={errorData.main}
						onRedirect={onRedirect}
						onSaveError={onSaveError}
						showTopButtons={!!modelData?.inlines?.length}
						onCancel={async () => await cancelEdit()}
						childrenValid={
							Object.values(existingInlinesData).every((items) =>
								items.every((item) => item.isValid),
							) &&
							Object.values(newInlinesData).every((items) =>
								items.every((item) => item.isValid),
							)
						}
						onError={onError}
						onModelRetrieve={retrievedData}>
						{preparingStep < 2 || !modelData || !modelData.inlines?.length ? (
							<></>
						) : (
							<div>
								<div className="flex flex-row items-center justify-center">
									<Separator className="my-3" />
									<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 text-nowrap my-4">
										Related objects
									</h3>
									<Separator className="my-3" />
								</div>
								{modelData.inlines.map((inline) => (
									<div key={inline.model} className="mb-4">
										<Card>
											<Collapsible
												defaultOpen={inline.expanded}
												onOpenChange={(open) =>
													changeOpenState(inline.model, open)
												}>
												<CollapsibleTrigger>
													<CardTitle className="flex flex-row items-center justify-between cursor-pointer select-none p-4">
														<div className="flex flex-row items-center">
															<div>{inline.label}</div>
															<Badge variant={'secondary'} className="mx-2">
																{getInlineIdsByModel(inline.model).length} items
															</Badge>
														</div>
														<div>
															<ChevronDown
																className={` -4 w-4 transition-transform ${inlinesOpenMap[inline.model] ? 'rotate-180' : ''}`}
															/>
														</div>
													</CardTitle>
												</CollapsibleTrigger>
												<CollapsibleContent className="p-4">
													{getInlineIdsByModel(inline.model).map((id, nr) => {
														const isError =
															existingInlinesData[inline.model]?.find(
																(item) => item.id === id,
															)?.isValid === false;
														return (
															<div
																className={cn('', {
																	'border-red-500': isError,
																})}
																key={inline.model + '_cnt_' + id}>
																{isError && (
																	<div className="text-red-500 mb-2 flex items-center">
																		<AlertTriangle className="mr-2" />
																		<span>Invalid inline data</span>
																	</div>
																)}
																<ModelObjectForm
																	key={inline.model + '__' + id}
																	mode="edit"
																	model={inline.model.toLowerCase()}
																	idx={nr}
																	extraApiParams={getInlineConfByModel(
																		inline.model,
																	)}
																	extraConfig={{ ...inline }}
																	onRedirect={onRedirect}
																	errorMap={
																		errorData.inlines?.[inline.model] || {}
																	}
																	layoutType={inline.mode || 'auto'}
																	itemId={id}
																	inlineMode={true}
																	onDelete={async (model, itemId, idx) => {
																		await apiService.deleteObject(
																			model,
																			itemId,
																		);
																		changeNewInlinesData(newInlinesData, true);
																	}}
																	onInlineUpdate={(
																		inlitemId,
																		inlIdx,
																		isValid,
																		inlData,
																	) => {
																		const newExistingData = (
																			existingInlinesData[inline.model] || []
																		).filter((item) => item.id !== inlitemId);
																		newExistingData.push({
																			id: inlitemId || '',
																			formData: inlData,
																			isValid,
																		});
																		setExistingInlinesData((prev) => ({
																			...prev,
																			[inline.model]: newExistingData,
																		}));
																	}}
																/>
															</div>
														);
													})}
													{newInlinesData[inline.model] &&
														newInlinesData[inline.model].map((newData) => (
															<div
																className=""
																key={inline.model + '_new_' + newData.idx}>
																<ModelObjectForm
																	mode="create"
																	model={inline.model.toLowerCase()}
																	idx={newData.idx}
																	extraApiParams={getInlineConfByModel(
																		inline.model,
																	)}
																	extraConfig={{ ...inline }}
																	layoutType={inline.mode || 'auto'}
																	inlineMode={true}
																	onDelete={(model, itemId, idx) => {
																		const replaceNewInlinesData = {
																			...newInlinesData,
																			[inline.model]: newInlinesData[
																				inline.model
																			].filter((d) => d.idx !== idx),
																		};
																		changeNewInlinesData(
																			replaceNewInlinesData,
																			true,
																		);
																	}}
																	onInlineUpdate={(
																		inlitemId,
																		inlIdx,
																		isValid,
																		inlData,
																	) => {
																		const replaceNewInlinesData = {
																			...newInlinesData,
																			[inline.model]: newInlinesData[
																				inline.model
																			].map((item) =>
																				item.idx === inlIdx
																					? {
																							...item,
																							formData: inlData,
																							isValid,
																						}
																					: item,
																			),
																		};
																		changeNewInlinesData(
																			replaceNewInlinesData,
																			false,
																		);
																	}}
																/>
															</div>
														))}
													{inline.canAdd !== false &&
														(inline.maxItems === undefined ||
															newInlinesData[inline.model].length <
																inline.maxItems) && (
															<Button
																variant={'secondary'}
																onClick={() => {
																	const newData: NewFormData = {
																		idx: currentIdx.current++,
																		isValid: false,
																		formData: {},
																	};
																	const replaceNewInlinesData = {
																		...newInlinesData,
																		[inline.model]: [
																			...(newInlinesData[inline.model] || []),
																			newData,
																		],
																	};
																	changeNewInlinesData(
																		replaceNewInlinesData,
																		false,
																	);
																}}>
																Add Item <PlusIcon />
															</Button>
														)}
												</CollapsibleContent>
											</Collapsible>
										</Card>
									</div>
								))}
							</div>
						)}
					</ModelObjectForm>
				</>
			)}
		</>
	);
};

export { EditObject };
