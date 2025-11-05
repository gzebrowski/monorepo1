import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Switch } from '@/components/ui';
import { useToast } from '@/components/ui';
import { DateTime } from 'luxon';
import {
	splitCamelCaseWords,
	splitSnakeCaseWords,
} from '@simpleblog/shared/admin';
import {
	ArrowUpZA,
	ArrowDownAZ,
} from 'lucide-react';

import { DataFilters } from './components/dataFilters';
import Paginator from '../components/paginator';
import { AdminService } from './services/admin.services';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { GetModelItemsType, GetModelsType } from '@simpleblog/shared/admin';

import { useAlert } from '@/common/contexts/alerts';
import { AddObject } from './components/addObject';
import { EditObject } from './components/editObject';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui';
import { Checkbox } from '@/components/ui';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui';
import { CheckedState } from '@radix-ui/react-checkbox';
import { ActionType } from '@simpleblog/shared/admin';
import { parseFieldName } from '@simpleblog/shared/admin';
import { Alert } from '@/components/ui';

const AdminPanel: React.FC = () => {
	const navigate = useNavigate();
	// Get route params
	const { adminModel, modelId } = useParams();
	const { toast } = useToast();
	const [currentModel, setCurrentModel] = useState('');
	const [currentAction, setCurrentAction] = useState('');
	const [selectedAll, setSelectedAll] = useState<CheckedState>(false);
	const [selectedAny, setSelectedAny] = useState<CheckedState>(false);
	const [orderingIdx, setOrderingIdx] = useState<number | null>(null);
	const [selectedItemsMap, setSelectedItemsMap] = useState<
		Record<string, boolean>
	>({});
	const [searchQuery, setSearchQuery] = useState('');
	const [filterByField, setFilterByField] = useState<Record<
		string,
		any
	> | null>(null);
	const [reqSearchQuery, setReqSearchQuery] = useState('');
	const [selectEverything, setSelectEverything] = useState(false);
	const [actionError, setActionError] = useState<string | null>(null);
	const [mode, setMode] = useState<
		'view' | 'edit' | 'add' | 'reloadAdd' | 'reloadEdit'
	>('view');
	const [editItemId, setEditItemId] = useState<string | null>(null);

	// Sync route params to state
	useEffect(() => {
		if (adminModel && adminModel !== currentModel) {
			setCurrentModel(adminModel);
			setPage(0);
			setSearchQuery('');
			setCurrentAction('');
			setSelectedAll(false);
			setSelectedAny(false);
			setSelectedItemsMap({});
			setOrderingIdx(null);
			setSelectEverything(false);
		}
		if (modelId) {
			if (modelId === 'addnew') {
                navigate(`/admin/${adminModel}/add`);
            }
            if (modelId === 'add') {
			    setEditItemId(null);
                setMode('add');
            } else {
                setEditItemId(modelId);
                setMode('edit');
            }
		} else {
			setEditItemId(null);
			setMode('view');
		}
	}, [adminModel, modelId]);

	const [page, setPage] = useState(0);
	const { confirmBox } = useAlert();
	const apiService = new AdminService();
	const {
		data: adminModels,
	} = useQuery<GetModelsType>({
		queryKey: ['adminModels'],
		queryFn: async () => await apiService.getAllModels(),
	});
	const {
		data: modelItems,
	} = useQuery<GetModelItemsType>({
		queryKey: ['modelItems'],
		queryFn: async () => {
			const filters: Record<string, any> = {};
			if (reqSearchQuery) {
				filters._q = reqSearchQuery;
			}
			if (orderingIdx !== null) {
				filters._o = orderingIdx;
			}
			if (filterByField) {
				Object.entries(filterByField).forEach(([key, value]) => {
					if (value || value === false) {
						filters[key] = value;
					}
				});
			}
			const result = await apiService.getModelItems(
				currentModel,
				page,
				filters,
			);
			return result;
		},
		enabled: !!currentModel,
	});
	const queryClient = useQueryClient();
	useEffect(() => {
		if (currentModel && modelItems && modelItems.items) {
			queryClient.invalidateQueries({
				queryKey: ['modelItems'],
			});
		}
	}, [orderingIdx, reqSearchQuery, page, currentModel, filterByField]);

	useEffect(() => {
		if (mode === 'reloadAdd' || mode === 'reloadEdit') {
			setMode(mode === 'reloadAdd' ? 'add' : 'edit');
		}
	}, [mode]);

	const deleteObject = async (itemId?: string) => {
		if (itemId) {
			await apiService.deleteObject(currentModel, itemId);
			queryClient.invalidateQueries({
				queryKey: ['modelItems'],
			});
			navigate(`/admin/${currentModel}`);
		}
	};
	const selectModel = (model: string) => {
		setFilterByField(null);
        navigate(`/admin/${model}`);
	};
	const changePage = (page: number) => {
		setPage(page);
	};
	const checkboxChecked = (id: string) => {
		return selectedItemsMap[id] || false;
	};
	const setEditMode = (itemId: string | null, md?: 'edit' | 'reloadEdit') => {
		md = md || 'edit';
		if (itemId) {
			navigate(`/admin/${currentModel}/${itemId}`);
		} else {
			navigate(`/admin/${currentModel}`);
		}
	};
	const changeSelectedState = (id: string | null, checked: boolean) => {
		if (!id) {
			setSelectedAll(checked);
			setSelectedAny(checked);
			setSelectedItemsMap((prev) => {
				const newMap = { ...prev };
				modelItems?.items.forEach((item) => {
					newMap[item.id] = checked === true ? true : false;
				});
				return newMap;
			});
			return;
		}
		const currSelectedState = { ...selectedItemsMap };
		setSelectedItemsMap((prev) => ({
			...prev,
			[id]: checked,
		}));
		currSelectedState[id] = checked;
		setSelectedAll(
			modelItems?.items?.length &&
				Object.keys(currSelectedState).length === modelItems.items.length
				? Object.values(currSelectedState).every((value) => value)
				: false,
		);
		setSelectedAny(
			Object.keys(currSelectedState).length > 0 &&
				Object.values(currSelectedState).some((value) => value),
		);
		setSelectEverything(false);
	};
	const performActionMutation = useMutation({
		mutationFn: async () => {
			setActionError(null);
			if (!currentModel || !currentAction || !selectedAny) {
				throw new Error('Invalid action or model selected');
			}
			const ids =
				selectedAll && selectEverything
					? 'all'
					: Object.keys(selectedItemsMap).filter(
							(key) => selectedItemsMap[key],
						);
			if (ids.length === 0) {
				throw new Error('No items selected for action');
			}
			const response = await apiService.performAction(
				currentModel,
				currentAction,
				ids,
			);
			if (response.status === 'error') {
				setActionError(response.message);
			}
			return response;
		},
		onSuccess: () => {
			const ids = Object.keys(selectedItemsMap).filter(
				(key) => selectedItemsMap[key],
			);
			toast({
				title: 'Action Successful',
				description: `Action ${currentAction} performed successfully on ${ids.length} items.`,
			});
			changeSelectedState(null, false);
			queryClient.invalidateQueries({
				queryKey: ['modelItems'],
			});
		},
	});
	const performAction = async () => {
		const action: ActionType | undefined = modelItems?.actions.find(
			(action) => action.key === currentAction,
		);
		const doPerformAction = async () => {
			await performActionMutation.mutateAsync();
		};
		if (action) {
			if (action.requiresConfirmation) {
				const confirmationMessage =
					action.confirmationMessage ||
					`Are you sure you want to perform the action "${action.label}" on the selected items?`;
				confirmBox({
					title: `Confirm ${action.label}`,
					question: confirmationMessage,
					confirmText: 'Yes, perform action',
					cancelText: 'No, cancel',
					onConfirm: async () => {
						await doPerformAction();
						changeSelectedState(null, false);
					},
				});
			} else {
				await doPerformAction();
				changeSelectedState(null, false);
			}
		}
	};
	const changeOrdering = (field: string, idx: number) => {
		if (orderingIdx === null) {
			setOrderingIdx(idx);
		} else if (orderingIdx === idx || orderingIdx === -idx) {
			setOrderingIdx(orderingIdx * -1);
		} else {
			setOrderingIdx(idx);
		}
	};
	const formatCellValue = (field: string, value: any) => {
		if (value === null || value === undefined) {
			return '-';
		}

		const columnDefinition = modelItems?.fieldsAndTypes.filter(
			(f) => f.column_name === field,
		);
		if (columnDefinition && columnDefinition.length > 0) {
			const columnType = columnDefinition[0].data_type;
			if (columnType === 'date' || columnType === 'datetime' || columnType.startsWith('timestamp')) {
				const retFormat = (columnType === 'date') ? DateTime.DATE_MED : DateTime.DATETIME_MED;
				if (typeof value === 'string') {
					return DateTime.fromISO(value).toLocaleString(
						retFormat,
					);
				}
				return DateTime.fromJSDate(new Date(value)).toLocaleString(
					retFormat,
				);
			}
			if (columnType === 'uuid') {
				return value.toString().split('-')[0] + '...';
			}
			if (columnType === 'boolean') {
				return value ? (
					<Checkbox disabled={true} checked={true} className="inline-block" />
				) : (
					<Checkbox disabled={true} checked={false} className="inline-block" />
				);
			}
		}
		if (typeof value === 'string') {
			return value;
		}
		if (Array.isArray(value)) {
			return value.join(', ');
		}
		if (typeof value === 'object') {
			return JSON.stringify(value);
		}
		return String(value);
	};
	const hasFieldDefinition = (field: string) => {
		return modelItems?.fieldsAndTypes.some((f) => f.column_name === field);
	};

	if (mode === 'view') {
		function getValueAndStyle(field: string, value: any): { fieldVal: any; valueStyle: any; } {
			let fieldVal = formatCellValue(field, value);
			let valueStyle = {};
			if (typeof value === 'string' && value.match(/^\s+/)) {
				const startPadding = value.match(/^\s+/)?.[0].length;
				valueStyle = { paddingLeft: `${startPadding || 0}em` };
			}

			if (field === 'status') {
				valueStyle = { color: value === 'active' ? 'green' : 'red' };
			}

			return { fieldVal, valueStyle };
		}

		return (
			<div className="py-2 px-3">
				{actionError && (
					<div className="my-3">
						<Alert variant="destructive">{actionError}</Alert>
					</div>
				)}
				<div>
					{adminModels && (
						<div className="mb-4">
							<h2 className="text-lg font-semibold mb-2">Admin Models</h2>
							<div className="space-y-1">
								{Object.entries(adminModels).map(([key, model]) => (
									<div key={key} className="mr-1 inline-block">
										<Button onClick={() => selectModel(key)}>{model}</Button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
				<div>
					{currentModel &&
						modelItems &&
						modelItems.items &&
						modelItems.listDisplayFields.length > 0 && (
							<>
								<div className="mb-4">
									<p>
										<strong>{currentModel.toUpperCase()}</strong>: Showing{' '}
										{modelItems.itemsCount} of {modelItems.total} items
									</p>
									<div className="mb-4 flex">
										{modelItems.searchFields?.length > 0 && (
											<div className="flex search-box mr-4">
												<div className="flex items-center">
													<div className="flex box-label items-center mr-2">
														Search:
													</div>
													<div className="flex box-ctrl items-center">
														<Input
															type="text"
															placeholder="Search..."
															value={searchQuery}
															onChange={(e) => {
																setSearchQuery(e.target.value);
															}}
															className="input input-bordered w-full max-w-xs"
														/>
													</div>
													<div className="flex box-btn items-center ml-2">
														<Button
															onClick={() => {
																setReqSearchQuery(searchQuery);
															}}>
															Search
														</Button>
													</div>
												</div>
											</div>
										)}
										{modelItems.actions && modelItems.actions.length > 0 && (
											<div className="flex action-box">
												<div className="flex action-ctrl-label items-center">
													<div className="flex box-label items-center mr-2">
														<span>Actions:</span>
													</div>
												</div>
												<div className="flex action-ctrl items-center mr-2">
													<Select
														value={currentAction}
														name="actions"
														required={false}
														onValueChange={(value) => {
															setCurrentAction(value);
														}}>
														<SelectTrigger className="w-[180px]">
															<SelectValue placeholder="Select Action" />
														</SelectTrigger>
														<SelectContent>
															{modelItems.actions.map((action) => (
																<SelectItem
																	key={action.key || ''}
																	value={action.key || ''}>
																	{splitCamelCaseWords(
																		action.label || '',
																		true,
																	) || ''}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div className="flex action-btn items-center">
													<Button
														disabled={!currentAction || !selectedAny}
														onClick={() => {
															performAction();
														}}>
														GO
													</Button>
												</div>
											</div>
										)}
										{selectedAll &&
											modelItems.actions &&
											modelItems.actions.length > 0 &&
											modelItems.total > modelItems.itemsCount &&
											modelItems.itemsCount >= 100 && (
												<div className="flex action-box">
													<div className="flex action-ctrl-label items-center">
														<div className="flex box-label items-center mr-2">
															<Switch
																checked={selectEverything}
																onCheckedChange={setSelectEverything}
															/>{' '}
															Apply to all items
														</div>
													</div>
												</div>
											)}
										{/*
                            icon on the right side of the header with filter icon and opening a dialog with filter options using Sheet component
                            */}
										{modelItems.canAddItem && (
											<div className="flex action-box">
												<div className="flex action-ctrl-label items-center">
													<div className="flex box-label items-center mx-2">
														<Button
															variant="default"
															onClick={() => {
																setMode('add');
                                                                navigate(`/admin/${currentModel}/add`);
															}}>
															Add Item
														</Button>
													</div>
												</div>
											</div>
										)}
										{modelItems.listFilterFields &&
											modelItems.listFilterFields.length > 0 && (
												<div className="flex justify-end">
													<DataFilters
                                                        model={currentModel}
														modelItems={modelItems}
														onChangeFilterByField={(v: Record<string, any>) => {
															setFilterByField(v);
														}}
													/>
												</div>
											)}
									</div>
								</div>
								<Paginator
									currentPage={page}
									itemsPerPage={100}
									totalItems={modelItems.total}
									onPageChange={changePage}
									className="my-3"
								/>
								<Table className="">
									<TableHeader className="sticky top-0 z-10 bg-card">
										<TableRow>
											<TableHead>
												<Checkbox
													title="Select All"
													checked={selectedAll || false}
													onCheckedChange={(checked) => {
														changeSelectedState(null, checked === true);
													}}
												/>
											</TableHead>
											<>
												{modelItems.listDisplayFields.map((fieldDef, idx) => {
													const { field, FieldLabel } =
														parseFieldName(fieldDef);
													return (
														<TableHead key={field}>
															{field !== 'id' ? (
																<Button
																	variant="link"
																	onClick={() => {
																		changeOrdering(field, idx + 1);
																	}}>
																	{FieldLabel}
																	{orderingIdx && orderingIdx - 1 === idx && (
																		<ArrowUpZA className="inline-block ml-1" />
																	)}
																	{orderingIdx && orderingIdx - 1 === -idx && (
																		<ArrowDownAZ className="inline-block ml-1" />
																	)}
																</Button>
															) : (
																splitSnakeCaseWords(field, true) || ''
															)}
														</TableHead>
													);
												})}
											</>
										</TableRow>
									</TableHeader>
									{modelItems.items.length > 0 ? (
										<TableBody>
											{modelItems.items.map((item: any, index: number) => (
												<TableRow key={item.id}>
													<TableCell>
														<Checkbox
															checked={checkboxChecked(item.id)}
															onCheckedChange={(checked) => {
																changeSelectedState(item.id, checked === true);
															}}
														/>
													</TableCell>
													<>
														{modelItems.listDisplayFields.map(
															(fieldDef, index2) => {
																const { field } = parseFieldName(fieldDef);
																const { fieldVal, valueStyle } = getValueAndStyle(field, item[field]);
																return (
																	<>
																		{index2 ? (
																			<TableCell key={item.id + '__' + field} style={valueStyle}>
																				{fieldVal}
																			</TableCell>
																		) : (
																			<TableCell key={item.id + '__' + field}>
																				<Button
																					style={valueStyle}
																					onClick={() => setEditMode(item.id)}
																					variant="link"
																					title={item[field].toString()}>
																					{fieldVal}
																				</Button>
																			</TableCell>
																		)}
																	</>
																);
															},
														)}
													</>
												</TableRow>
											))}
										</TableBody>
									) : (
										<TableBody>
											<TableRow>
												<TableCell
													colSpan={modelItems.listDisplayFields.length + 1}
													className="text-center">
													No items found.
												</TableCell>
											</TableRow>
										</TableBody>
									)}
								</Table>
								<Paginator
									currentPage={page}
									itemsPerPage={100}
									totalItems={modelItems.total}
									onPageChange={changePage}
								/>
							</>
						)}
				</div>
			</div>
		);
	} else if (mode === 'edit') {
		return (
			<div className="py-2 px-3">
				{currentModel && editItemId && (
					<EditObject
						model={currentModel}
						itemId={editItemId}
						canAddItem={modelItems?.canAddItem}
                        canDeleteItem={modelItems?.canDeleteItem}
						onSave={(data, saveVariant) => {
                            let navigateUrl: string | null = null;
                            if (saveVariant === 'saveAndAddNew') {
								navigateUrl = `/admin/${adminModel}/add`;
                                setMode('reloadAdd');
							} else if (saveVariant === 'saveAndStay') {
								setEditMode(editItemId, 'reloadEdit');
							} else {
								navigateUrl = `/admin/${adminModel}`;
                                setEditMode(null);
							}
							queryClient.invalidateQueries({
								queryKey: ['modelItems'],
							});
                            if (navigateUrl) {
                                navigate(navigateUrl);
                            }
						}}
                        
                        onDelete={async (itemId?: string) => {
                            await deleteObject(itemId);
                        }}
						onCancel={() => setEditMode(null)}
						onRedirect={(newModel: string, itemId: string) => {
							setMode('reloadEdit');
							navigate(`/admin/${newModel}/${itemId}`);
						}}
					/>
				)}
			</div>
		);
	} else if (mode === 'add') {
		return (
			<div className="py-2 px-3">
				{currentModel && (
					<AddObject
						model={currentModel}
						onSave={(data, saveVariant, newId) => {
                            let navigateUrl: string | null = null;
							if (saveVariant === 'saveAndAddNew') {
								navigateUrl = `/admin/${adminModel}/addnew`;
                                setMode('reloadAdd');
							} else if (saveVariant === 'saveAndStay') {
								setEditMode(newId || null, 'reloadEdit');
                                navigateUrl = `/admin/${adminModel}/${newId}`;
							} else {
								setEditMode(null);
                                navigateUrl = `/admin/${adminModel}`;
							}
							queryClient.invalidateQueries({
								queryKey: ['modelItems'],
							});
                            if (navigateUrl) {
                                navigate(navigateUrl);
                            }
						}}
						onCancel={() => setMode('view')}
					/>
				)}
			</div>
		);
	}
	return null;
};
export default AdminPanel;
