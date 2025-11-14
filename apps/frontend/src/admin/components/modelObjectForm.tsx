import React, { useState, useEffect, useCallback } from 'react';
import { EditIcon as PencilIcon, PlusIcon, X, ExternalLink } from './ui/icons';
import { v4 as uuidv4 } from 'uuid';
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
	TableHeader,
	TableHead,
	Textarea,
	Checkbox,
	Input,
	Button,
	Badge,
	Card,
	CardContent,
	CardTitle,
} from './ui/simpleComponents';

import { Calendar } from './calendar';
import { DatetimePicker } from './datetimePicker';

import { AutoComplete, AutoCompleteOption } from './autocomplete';

import { DateTime } from 'luxon';

import { AdminService } from '../services/admin.services';
import {
	splitCamelCaseWords,
	CommonReturnModelItemType,
	CommonPostResult,
	FieldConfig,
	FieldDefinition,
	FieldDependencies,
	InlineDefinition,
} from '@simpleblog/shared/admin';

import { useAdminAlert } from '../context/adminAlerts';

import { LoadingSpinner } from './loadingSpinner';

export type SaveVariant = 'save' | 'saveAndAddNew' | 'saveAndStay';

type CommonObjectProps = {
	model: string;
	idx?: number;
	onSave?: (
		data: Record<string, any>,
		saveVariant: SaveVariant,
		id?: string,
	) => void;
	onDelete?: (model: string, itemId: string, idx?: number) => void;
	onInlineUpdate?: (
		itemId: string | undefined | null,
		idx: number | undefined | null,
		isValid: boolean,
		data: Record<string, any>,
	) => void;
	onCancel?: () => void;
	onError?: (error: Error) => void;
	onSaveError?: (error: CommonPostResult) => void;
	onModelRetrieve?: (data: CommonReturnModelItemType) => void;
	onRedirect?: (newModel: string, itemId: string) => void;
	inlineMode?: boolean; // Optional prop to indicate if the form is in inline mode
	childrenValid?: boolean; // Optional prop to indicate if the children are valid
	extraApiParams?: Record<string, any>;
	extraConfig?: InlineDefinition; // Optional extra configuration for the form
	layoutType?: 'stacked' | 'inline' | 'auto';
	customUpdate?: (
		model: string,
		itemId: string | undefined | null,
		data: Record<string, any>,
	) => Promise<CommonPostResult>; // Custom update function for the form
	customCreate?: (
		model: string,
		data: Record<string, any>,
	) => Promise<CommonPostResult>; // Custom create function for the form
	canAddItem?: boolean; // Optional prop to indicate if the form can add items
	errorMap?: Record<string, string> | null; // Optional prop to map field names to error messages
	showTopButtons?: boolean;
    canDelete?: boolean;
	children?: React.ReactNode; // Optional children prop for additional content
};
type AddObjectProps = CommonObjectProps & {
	mode: 'create';
	itemId?: undefined;
};

type EditObjectProps = CommonObjectProps & {
	mode: 'edit';
	itemId: string;
};

type AddObjectOrEditProps = AddObjectProps | EditObjectProps;

type LabelForFieldProps = {
	field: string;
	fieldDef: FieldDefinition | undefined;
	isFieldRequired: (fieldDef: FieldDefinition | undefined) => boolean;
	labelMaps?: Record<string, string>;
};

const LabelForField: React.FC<LabelForFieldProps> = ({
	field,
	fieldDef,
	isFieldRequired,
	labelMaps,
}) => {
	return (
		<>
			<label>
				{labelMaps?.[field] || splitCamelCaseWords(field, true)}
				{isFieldRequired(fieldDef) && (
					<span className="admin-text-red-600 admin-pl-2">*</span>
				)}
			</label>
			{fieldDef?.help_text && (
				<div>
					<em className="admin-text-sm admin-text-muted-foreground admin-ml-2">
						{fieldDef.help_text}
					</em>
				</div>
			)}
		</>
	);
};

type ControlForFieldProps = {
	field: string;
	fieldDef: FieldDefinition | undefined;
	getFieldType: (field: string) => string;
	setFormValue: (field: string, value: any) => void;
	formatCellValue: (
		columnDefinition: FieldDefinition | undefined,
		value: any,
	) => any;
	getFieldDefaultValue: (field: string) => string | boolean;
	isFieldRequired: (fieldDef: FieldDefinition | undefined) => boolean;
	getSelectFieldOptions: (field: string) => AutoCompleteOption[];
	formData: Record<string, any>;
	fieldsConfig: Record<string, FieldConfig>;
	updateAutocompleteInput: (field: string, value: string) => void;
	relationToLabelMap: Record<string, string | null>;
	fieldDependencies: FieldDependencies;
	setAutocompleteOption: (field: string, option: AutoCompleteOption) => void;
	currentOptions: Record<string, AutoCompleteOption[]>;
	clearAutocompleteField: (field: string) => void;
	redirectToRelative?: (newModel: string, itemId: string, relationField: string) => Promise<void>;
	relationsDefinition?: CommonReturnModelItemType['relations']['relations'];
};

type SaveButtonsProps = {
	mode: 'create' | 'edit';
	model: string;
	itemId?: string;
	data: Record<string, any>;
	onSave?: (
		data: Record<string, any>,
		saveVariant: SaveVariant,
		id?: string,
	) => void;
	onCancel?: () => void;
    onDelete?: () => void;
	onError?: (error: CommonPostResult) => void;
	canSubmit: () => boolean;
	updateModelItem: (
		model: string,
		itemId: string,
		data: Record<string, any>,
	) => Promise<CommonPostResult>;
	createModelItem: (
		model: string,
		data: Record<string, any>,
	) => Promise<CommonPostResult>;
	canAddItem?: boolean; // Optional prop to indicate if the form can add items
    canDelete?: boolean; // Optional prop to indicate if the form can delete items
};

const SaveButtons: React.FC<SaveButtonsProps> = ({
	onSave,
	onCancel,
    onDelete,
	onError,
	canSubmit,
	updateModelItem,
	createModelItem,
	mode,
	itemId,
	model,
	canAddItem,
    canDelete,
	data,
}) => {
	async function performSave(saveVariant: SaveVariant) {
		let result: CommonPostResult | null = null;
		if (mode === 'create') {
			result = await createModelItem(model, data);
		} else if (mode === 'edit') {
			result = await updateModelItem(model, itemId || '', data);
		}
		if (result?.status === 'success' && onSave) {
			onSave(data, saveVariant, result.data?.$pk); // pkFieldName
		} else if (result?.status === 'error' && onError) {
			onError(result);
		}
		return result;
	}
	return (
		<div>
			<Button
				disabled={!canSubmit()}
				onClick={() => performSave('save')}
				className="mr-2">
				Save
			</Button>
			{canAddItem && (
				<Button
					disabled={!canSubmit()}
					onClick={() => performSave('saveAndAddNew')}
					className="mr-2">
					Save and Add New
				</Button>
			)}
			<Button
				disabled={!canSubmit()}
				onClick={() => performSave('saveAndStay')}
				className="mr-2">
				Save and Stay Here
			</Button>
			<Button
				variant="secondary"
				className='mr-2'
				onClick={() => {
					if (onCancel) {
						onCancel();
					}
				}}>
				Cancel
			</Button>
			{ mode === 'edit' && canDelete && (
            <Button
                variant="danger"
				className='ml-4'
				onClick={() => {
					if (onDelete) {
						onDelete();
					}
				}}>
				Delete
			</Button>
            )}
		</div>
	);
};

const ControlForField: React.FC<ControlForFieldProps> = ({
	field,
	fieldDef,
	getFieldType,
	setFormValue,
	formatCellValue,
	getFieldDefaultValue,
	isFieldRequired,
	getSelectFieldOptions,
	formData,
	fieldsConfig,
	updateAutocompleteInput,
	relationToLabelMap,
	fieldDependencies,
	setAutocompleteOption,
	currentOptions,
	clearAutocompleteField,
	redirectToRelative,
	relationsDefinition,
}) => {
	const checkDependency = (field: string): boolean => {
		if (!fieldDependencies || !fieldDependencies[field]) return false;
		return fieldDependencies[field].some((dep) => !formData[dep]);
	};
	const getWidget = (
		field: string,
		defaultWidget: any,
		params: Record<string, any>,
	) => {
		const fieldConf = fieldsConfig[field];
		let Result = defaultWidget;
		if (fieldConf?.widget) {
			if (fieldConf.widget === 'textarea') {
				Result = Textarea;
			} else if (fieldConf.widget === 'input') {
				Result = Input;
			}
		}
		return <Result {...params} />;
	};
	async function redirectToRelObject(field: string) {
		if (redirectToRelative && formData[field]) {
			// fieldDef?.column_name
			const toRelModel = relationsDefinition?.find(
				(rel) => rel.from.dbField === field,
			)?.to;
			// /const { , id } = relationToLabelMap[field];
			if (toRelModel) {
				await redirectToRelative(toRelModel.model, formData[field], toRelModel.dbField);
			}
		}
	}

	return (
		<>
			{getFieldType(field) === 'static' &&
				getWidget(field, Input, {
					type: 'text',
					value: formData[field] || '',
					readOnly: true,
				})}
			{getFieldType(field) === 'text' &&
				getWidget(field, Input, {
					type: 'text',
					value: formData[field] || '',
					onChange: (e: any) => {
						setFormValue(field, e.target.value);
					},
				})}
			{getFieldType(field) === 'textarea' &&
				getWidget(field, Textarea, {
					value:
						formatCellValue(fieldDef, formData[field]) ||
						getFieldDefaultValue(field),
					onChange: (e: any) => {
						setFormValue(field, e.target.value);
					},
					placeholder: `Enter ${field}`,
				})}
			{getFieldType(field) === 'datetime' && (
				<DatetimePicker
					value={
						formData[field]
							? DateTime.fromISO(formData[field]).toJSDate()
							: undefined
					}
					onChange={(date) => {
						if (date) {
							setFormValue(field, DateTime.fromJSDate(date).toISO());
						}
					}}
				/>
			)}
			{getFieldType(field) === 'date' && (
				<Calendar
					placeholder='Select date'
					date={formData[field] ? new Date(formData[field]) : undefined}
					onDateChange={(selectedDate) => {
						if (selectedDate) {
							setFormValue(
								field,
								DateTime.fromJSDate(selectedDate).toISODate(),
							);
						}
					}}
				/>
			)}
			{getFieldType(field) === 'checkbox' && (
				<>
					{isFieldRequired(fieldDef) ? (
						<Checkbox
							checked={formData[field] ?? getFieldDefaultValue(field)}
							onCheckedChange={(checked) => {
								setFormValue(field, checked);
							}}
						/>
					) : (
						<>
							<select
								value={formData[field] ?? getFieldDefaultValue(field)}
								required={false}
								onChange={(e) => {
									setFormValue(field, e.target.value);

								}}>
								<option value="">----</option>
								<option value="true">Yes</option>
								<option value="false">No</option>
							</select>
						</>
					)}
				</>
			)}
			{getFieldType(field) === 'select' && (
				<select
					value={formData[field] || getFieldDefaultValue(field)}
					required={isFieldRequired(fieldDef)}
					onChange={(e) => {
						setFormValue(field, e.target.value);
					}}>
					<option value="">----</option>
					{getSelectFieldOptions(field).map((option) => (
						<option key={option.value} value={option.value}>
							{splitCamelCaseWords(option.label, true)}
						</option>
					))}
				</select>
			)}
			{getFieldType(field) === 'array' && (
				<Textarea
					value={
						formatCellValue(fieldDef, formData[field]) ||
						getFieldDefaultValue(field)
					}
					onChange={(e) => {
						setFormValue(
							field,
							e.target.value.split('\n').map((item) => item.trim()),
						);
					}}
					placeholder={`Enter ${field} (one value per line)`}
				/>
			)}
			{getFieldType(field) === 'number' && (
				<Input
					type="number"
					value={formData[field] || getFieldDefaultValue(field)}
					onChange={(e) => {
						setFormValue(field, parseFloat(e.target.value));
					}}
					placeholder={`Enter ${field}`}
				/>
			)}
			{getFieldType(field) === 'relation' && (
				<>
					<div>
						<AutoComplete
							onInputChange={(value) => updateAutocompleteInput(field, value)}
							disabled={checkDependency(field)}
							options={currentOptions[field] || []}
							emptyMessage="No options available"
							value={{
								value: (formData[field] === undefined
									? getFieldDefaultValue(field)
									: formData[field]) as string | null,
								label: relationToLabelMap[field],
							}}
							onValueChange={(value, label) => {
								if (value !== null && value !== undefined) {
									setAutocompleteOption(field, {value, label: label || ''});
								} else {
									clearAutocompleteField(field);
								}
							}}
						/>
					</div>
					{relationToLabelMap[field] && (
						<div>
							<em className="admin-text-sm admin-text-muted-foreground admin-inline-block">
								{relationToLabelMap[field]}
								<Button
									variant="ghost"
									className="admin-ml-2 admin-p-0"
									onClick={() => {
										clearAutocompleteField(field);
									}}>
									<X className="admin-h-4 admin-w-4" />
								</Button>
							</em>
							<span className="admin-text-sm admin-text-muted-foreground admin-inline-block admin-ml-1">
								<Button
									variant="ghost"
									className="admin-ml-2 admin-p-0"
									onClick={async () => {
										await redirectToRelObject(field);
									}}>
									<ExternalLink />
								</Button>
							</span>
						</div>
					)}
				</>
			)}
		</>
	);
};

type ErrorBoxProps = {
	errorMap?: Record<string, string> | null;
	field: string;
};

const ErrorBox: React.FC<ErrorBoxProps> = ({ errorMap, field }) => {
	const errorMessage = errorMap?.[field];
	if (!errorMessage) return null;

	return (
		<div className="error-box">
			<p className="error-message admin-p-1 admin-text-white admin-bg-red-600 admin-inline-block admin-my-1">
				{errorMessage}
			</p>
		</div>
	);
};

const ModelObjectForm: React.FC<AddObjectOrEditProps> = ({
	mode,
	idx,
	model,
	itemId,
	onSave,
	onCancel,
	onError,
	onSaveError,
	onModelRetrieve,
	onInlineUpdate,
	onDelete,
	onRedirect,
	inlineMode,
	extraApiParams,
	extraConfig,
	customUpdate,
	customCreate,
	layoutType,
	childrenValid = true,
	errorMap,
	canAddItem = true,
    canDelete = false,
	showTopButtons = false,
	children,
}) => {
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [currentOptions, setCurrentOptions] = useState<
		Record<string, AutoCompleteOption[]>
	>({});
	const [relationToLabelMap, setRelationToLabelMap] = useState<
		Record<string, string | null>
	>({});
	const [readonlyFields, setReadonlyFields] = useState<string[]>([]);
	const [layoutTp, setLayoutTp] = useState<'stacked' | 'inline' | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);
	const [objectData, setObjectData] =
		useState<CommonReturnModelItemType | null>(null);

	const apiService = new AdminService();
	
	const { confirmBox } = useAdminAlert();
	useEffect(() => {
		const result = objectData;
		if (!result) return;
		if (result.relationToLabelMap) {
			setRelationToLabelMap(result.relationToLabelMap);
		}
		const roFields = result.readonlyFields || [];
		// extend readonlyFieds with extraConfig?.readonlyFields if it exists
		roFields.push(...(extraConfig?.readonlyFields || []));

		setReadonlyFields(roFields);
		if (layoutType === 'auto' && layoutTp === null && inlineMode) {
			setLayoutTp(
				(objectData?.fieldsAndTypes.length || 0) > 5 ? 'stacked' : 'inline',
			);
		} else if (layoutType) {
			setLayoutTp(layoutType === 'inline' ? 'inline' : 'stacked');
		}
		if (onModelRetrieve) {
			onModelRetrieve(result);
		}
	}, [objectData]);

	const formatCellValue = (
		columnDefinition: FieldDefinition | undefined,
		value: any,
	) => {
		if (!columnDefinition) {
			return value; // Return raw value if no column definition is provided
		}
		if (value === null || value === undefined) {
			return '-';
		}
		if (columnDefinition) {
			const columnType = columnDefinition.data_type;
			if (columnType === 'date') {
				return DateTime.fromJSDate(new Date(value)).toISODate();
			}
			if (columnType === 'datetime') {
				return DateTime.fromJSDate(new Date(value)).toISO();
			}
			if (columnType === 'ARRAY' && typeof value === 'string') {
				// If the value is a string, split it by newlines
				return value
					.split(',')
					.map((item) => item.trim())
					.join('\n');
			}
		}
		if (Array.isArray(value)) {
			return value.join('\n');
		}
		if (typeof value === 'object') {
			return JSON.stringify(value, null, 2);
		}
		return value;
	};

	const setFormValue = (
		field: string,
		value: any,
		useData?: Record<string, any>,
	) => {
		const prevData = useData || formData;
		const newFormData = {
			...prevData,
			[field]: value,
		};
		setFormData(newFormData);
		if (onInlineUpdate && inlineMode) {
			onInlineUpdate(itemId, idx, checkCansubmit(newFormData), newFormData);
		}
		Object.keys(objectData?.fieldDependencies || {}).forEach((f) => {
			objectData?.fieldDependencies?.[f].forEach((dependentField) => {
				if (dependentField === field) {
					// If the dependent field is the one being updated, update its value
					clearAutocompleteField(f, newFormData);
				}
			});
		});
	};
	const relationData = (field: string) => {
		const relation = objectData?.relations?.relations?.find(
			(rel) => rel.from.dbField === field,
		);
		const relTo = relation ? relation : null;
        if (relTo) {
            if (objectData && objectData.filterTypes[relTo.from.dbField]) {
                return '_PREFETCH';
            }
            return relTo.to;
        }
        return relTo;
	};
	const getFieldType = (field: string): string => {
		// Determine the field type based on naming conventions or predefined rules

		if ((readonlyFields?.length || 0) > 0) {
			if (readonlyFields.includes(field)) {
				return 'static';
			}
		} else if (
			field === 'id' ||
			field === 'createdAt' ||
			field === 'updatedAt' ||
			extraConfig?.canUpdate === false
		) {
			return 'static';
		}
		const relType = relationData(field);
        if (!!relType) { 
			if (relType === '_PREFETCH') {
                return 'select'
            }
            if (!currentOptions[field]) {
				setCurrentOptions((prev) => ({
					...prev,
					[field]: [],
				}));
			}
			return 'relation';
		}
		const fieldDefinition = objectData?.fieldsAndTypes.find(
			(f) => f.column_name === field,
		);
		if (fieldDefinition) {
			if (fieldDefinition.data_type === 'enum') {
				return 'select';
			}
			if (
				fieldDefinition.data_type === 'text' ||
				fieldDefinition.data_type === 'varchar'
			) {
				return 'text';
			}
			if (fieldDefinition.data_type === 'date') {
				return 'date';
			}
			if (fieldDefinition.data_type === 'datetime' || fieldDefinition.data_type.startsWith('timestamp')) {
				return 'datetime';
			}
			if (fieldDefinition.data_type === 'boolean') {
				return 'checkbox';
			}
			if (fieldDefinition.data_type === 'json' || fieldDefinition.data_type === 'jsonb') {
				return 'textarea';
			}
			if (fieldDefinition.data_type === 'ARRAY') {
				console.warn('array detected', field);
				return 'array'; // Assuming array fields are array fields
			}
			if (fieldDefinition.data_type === 'integer') {
				return 'number'; // Assuming integer fields are number fields for input
			}
		}
		return 'text'; // Default to text if type is unknown
	};
	useEffect(() => {
		const doRetrieveData = async () => {
			let result: CommonReturnModelItemType;
			if (mode === 'edit') {
				result = await apiService.getModelItem(model, itemId, extraApiParams);
			} else {
				result = await apiService.getModelMetadata(model, extraApiParams);
			}
			setObjectData(result);
			setIsLoading(false);
		};
		doRetrieveData().catch((err) => {
			console.error('Error retrieving data:', err);
			setError(err);
			setIsLoading(false);
			if (onError) {
				onError(err);
			}
		});
		const defaultVal = inlineMode ? 'inline' : 'stacked';
		setLayoutTp(
			layoutType === 'auto' || layoutType === undefined
				? defaultVal
				: layoutType,
		);
	}, []);
	useEffect(() => {
		// Initialize formData with default values from objectData
		if (objectData) {
			const initialData: Record<string, any> = {};
			if (mode === 'create') {
				for (const field of objectData.fieldsAndTypes.map(
					(f) => f.column_name,
				)) {
					if (field === 'id') {
						continue; // Skip id field
					}
					initialData[field] = getFieldDefaultValue(field);
				}
			} else if (mode === 'edit' && objectData.item) {
				for (const field of Object.keys(objectData.item)) {
					initialData[field] = objectData.item[field];
				}
			}
			setFormData(initialData);
		}
	}, [objectData]);
	const getFieldDefaultValue = (field: string): string | boolean => {
		// Get the default value for the field based on its type
		const fieldDefinition = objectData?.fieldsAndTypes.find(
			(f) => f.column_name === field,
		);
		if (fieldDefinition) {
			if (fieldDefinition.data_type === 'enum') {
				// extract value from column_default: ie "'daily'::\"TimesheetFrequency\"" => "daily"
				return fieldDefinition.column_default || '';
			}
			if (
				fieldDefinition.data_type === 'date' &&
				fieldDefinition.column_default === 'CURRENT_TIMESTAMP'
			) {
				return DateTime.now().toISO().split('T')[0];
			}
			if (
				fieldDefinition.data_type === 'datetime' &&
				fieldDefinition.column_default === 'CURRENT_TIMESTAMP'
			) {
				return DateTime.now().toISO();
			}
			if (fieldDefinition.data_type === 'ARRAY') {
				// extract values from "ARRAY[]::text[]" and join with \n
				const match = fieldDefinition.column_default?.match(
					/ARRAY\[(.*)\]::text\[\]/,
				);
				return match
					? match[1]
							.split(',')
							.map((item) => item.trim())
							.join('\n')
					: '';
			}
			if (fieldDefinition.data_type === 'boolean') {
				return fieldDefinition.column_default === 'true';
			}
			if (
				fieldDefinition.data_type === 'uuid' &&
				!fieldDefinition.column_default &&
				fieldDefinition.is_nullable !== 'NO' &&
				!relationData(field)
			) {
				return uuidv4(); // Generate a new UUID for new items
			}
			return fieldDefinition.column_default || '';
		}
		return '';
	};
	const getSelectFieldOptions = (field: string) => {
		// Get the options for select fields from filterTypes
		return objectData?.filterTypes[field] || [];
	};
	async function updateAutocompleteInput(
		columnName: any,
		value: string,
	): Promise<void> {
		const relDefinition = objectData?.relations?.relations?.find(
			(rel) => rel.from.dbField === columnName,
		);
		const dependingFields = objectData?.fieldDependencies?.[columnName] || [];
		const depData = dependingFields.reduce(
			(acc, depField) => {
				if (
					formData[depField] !== undefined &&
					formData[depField] !== null &&
					formData[depField] !== ''
				) {
					acc[depField] = formData[depField];
				}
				return acc;
			},
			{} as Record<string, any>,
		);
		if (!relDefinition) {
			console.error(`Field ${columnName} not found in model metadata`);
			return;
		}
		if (Object.keys(depData).length === 0 && value.length === 0) {
			setCurrentOptions((prev) => ({
				...prev,
				[columnName]: [],
			}));
			return;
		}
		try {
			const options = await apiService.getAutocompleteOptions(
				model,
				relDefinition.to.model,
				columnName,
				value,
				depData,
			);
			setCurrentOptions((prev) => ({
				...prev,
				[columnName]: options,
			}));
		} catch (error) {
			console.error('Error fetching autocomplete options:', error);
		}
	}
	const getAllFieldNames = () => {
		if (mode === 'edit' && objectData?.item) {
			return Object.keys(objectData.item);
		}
		return objectData?.fieldsAndTypes.map((f) => f.column_name) || [];
	};
	const clearAutocompleteField = (
		field: string,
		useData?: Record<string, any>,
	) => {
		const prevData = useData || formData;
		const newData = {
			...prevData,
			[field]: null,
		};
		setFormData(newData);
		setRelationToLabelMap((prev) => ({
			...prev,
			[field]: null,
		}));
		setCurrentOptions((prev) => ({
			...prev,
			[field]: [],
		}));
	};

	function setAutocompleteOption(field: string, value: AutoCompleteOption) {
		setFormValue(field, value.value);
		setRelationToLabelMap((prev) => ({
			...prev,
			[field]: value.label,
		}));
	}
	function isFieldRequired(
		fieldDef: { is_nullable: string } | undefined,
	): boolean {
		// Check if the field is required based on its definition
		return !!(fieldDef && fieldDef.is_nullable === 'NO');
	}

	const checkCansubmit = (dt?: Record<string, any>) => {
		// Check if all required fields are filled
		if (childrenValid === false) {
			return false; // If children are not valid, do not allow submission
		}
		const dataToCheck = dt || formData;
		return getAllFieldNames().every((field) => {
			const fieldDef = objectData?.fieldsAndTypes.find(
				(f) => f.column_name === field,
			);
			if (fieldDef?.isPk) {
				return true;
			}
			if (isFieldRequired(fieldDef)) {
				const value = dataToCheck[field];
				if (getFieldType(field) === 'checkbox') {
					return value !== undefined; // Checkbox can be true or false
				}
				const valTp = typeof value;
				if (valTp === 'number') {
					return !Number.isNaN(value); // Number fields must not be NaN !Number.isNaN(value)
				}
				return value !== undefined && value !== '' && value !== null; // Required fields must not be empty
			}
			return true; // Non-required fields can be empty
		});
	};
	const canSubmit = useCallback(
		(dt?: Record<string, any>) => {
			return checkCansubmit(dt);
		},
		[formData, objectData, childrenValid],
	);

	function performDelete() {
		if (onDelete && !itemId) {
			onDelete(model, '', idx);
		} else {
			confirmBox({
				title: `Delete ${splitCamelCaseWords(model, true)}?`,
				onConfirm: () => {
					if (onDelete) {
						onDelete(model, itemId || '', idx);
					}
				},
			});
		}
	}
	async function updateModelItem(
		model: string,
		idItem: string,
		data: Record<string, any>,
	) {
		return await apiService.updateModelItem(model, idItem, data);
	}
	if (!objectData) {
		return <LoadingSpinner />;
	}
	function processError(error: CommonPostResult) {
		if (onSaveError) {
			onSaveError(error);
		}
	}
	async function redirectToRelative(newModel: string, itemId: string, relationField: string) {
		if (onRedirect) {
			if (relationField === 'id') {
				onRedirect(newModel.toLowerCase(), itemId);
			} else {
				const id = await apiService.getModelItemIdByUniqueField(newModel, relationField, itemId);
				onRedirect(newModel.toLowerCase(), id);
			}
		}
	}
	return (
		<div>
			{isLoading && <LoadingSpinner />}
			{error && <p>Error fetching object data</p>}
			{objectData && objectData.fieldsAndTypes && (
				<div>
					<Card>
						<CardTitle className="p-4">
							<div className="w-full flex flex-row justify-between items-center">
								{mode === 'edit' && (
									<div className="flex items-center justify-start">
										<Badge className="mr-2">
											Edit
											<PencilIcon className="ml-2 h-3 w-3" />
										</Badge>
										<div className="font-bold text-xl my-3 text-nowrap">
											{splitCamelCaseWords(model, true)}: 
											{objectData.title ? (
												<>
												<span className="ml-2">{objectData.title}</span>
												<div className="text-xs text-muted-foreground">{itemId}</div>
												</>
											) : (
												<>
												{itemId}
												</>
											)}
											{ inlineMode && onRedirect && (
												<Button onClick={() => {
													onRedirect(model, itemId);
												}} variant="ghost">
													<ExternalLink />
												</Button>
											)}
										</div>
									</div>
								)}
								{mode === 'create' && (
									<div className="font-bold text-xl my-3">
										<Badge>
											Create
											<PlusIcon className="ml-2 h-3 w-3" />
										</Badge>{' '}
										{splitCamelCaseWords(model, true)}
									</div>
								)}
								{!inlineMode && showTopButtons && (
									<div className="w-full text-right text-small my-3">
										<SaveButtons
											mode={mode}
											model={model}
											itemId={itemId}
											data={formData}
											onSave={onSave}
											onCancel={onCancel}
                                            onDelete={performDelete}
											onError={processError}
											canSubmit={canSubmit}
											canAddItem={canAddItem}
                                            canDelete={canDelete}
											updateModelItem={
												customUpdate ? customUpdate : updateModelItem
											}
											createModelItem={
												customCreate
													? customCreate
													: apiService.createModelItem.bind(apiService)
											}
										/>
									</div>
								)}
							</div>
						</CardTitle>
						<CardContent>
							<div className="w-full">
								<Table>
									{layoutTp === 'inline' && (
										<TableHeader>
											<TableRow>
												{getAllFieldNames()
													.filter((f) => (f !== objectData.pkFieldName) && (f !== '$pk'))
													.filter(
														(f) =>
															!extraConfig?.fields ||
															extraConfig.fields.includes(f),
													)
													.map((field) => {
														const fieldDef = objectData.fieldsAndTypes.find(
															(f) => f.column_name === field,
														);
														return (
															<TableHead key={'inl_head' + field}>
																<LabelForField
																	field={field}
																	fieldDef={fieldDef}
																	isFieldRequired={isFieldRequired}
																	labelMaps={objectData.fieldToLabelMap}
																/>
															</TableHead>
														);
													})}
											</TableRow>
										</TableHeader>
									)}
									<TableBody>
										{layoutTp === 'inline' && (
											<TableRow>
												{getAllFieldNames()
													.filter((f) => (f !== objectData.pkFieldName) && (f !== '$pk'))
													.filter(
														(f) =>
															!extraConfig?.fields ||
															extraConfig.fields.includes(f),
													)
													.map((field) => {
														const fieldDef = objectData.fieldsAndTypes.find(
															(f) => f.column_name === field,
														);
														return (
															<TableCell key={'inl_ctr' + field}>
																<ControlForField
																	field={field}
																	fieldDef={fieldDef}
																	getFieldType={getFieldType}
																	setFormValue={setFormValue}
																	formatCellValue={formatCellValue}
																	getFieldDefaultValue={getFieldDefaultValue}
																	isFieldRequired={isFieldRequired}
																	getSelectFieldOptions={getSelectFieldOptions}
																	formData={formData}
																	relationsDefinition={objectData.relations.relations}
																	fieldsConfig={objectData.fieldsConfig || {}}
																	redirectToRelative={redirectToRelative}
																	updateAutocompleteInput={
																		updateAutocompleteInput
																	}
																	relationToLabelMap={relationToLabelMap}
																	fieldDependencies={
																		objectData.fieldDependencies || {}
																	}
																	setAutocompleteOption={setAutocompleteOption}
																	currentOptions={currentOptions}
																	clearAutocompleteField={
																		clearAutocompleteField
																	}
																/>
																<ErrorBox errorMap={errorMap} field={field} />
															</TableCell>
														);
													})}
											</TableRow>
										)}
										{layoutTp === 'stacked' &&
											getAllFieldNames()
												.filter((f) => f !== objectData.pkFieldName && f !== '$pk')
												.filter(
													(f) =>
														!extraConfig?.fields ||
														extraConfig.fields.includes(f),
												)
												.map((field) => {
													const fieldDef = objectData.fieldsAndTypes.find(
														(f) => f.column_name === field,
													);
													return (
														<TableRow key={'stk' + field}>
															<TableCell>
																<LabelForField
																	field={field}
																	fieldDef={fieldDef}
																	isFieldRequired={isFieldRequired}
																	labelMaps={objectData.fieldToLabelMap}
																/>
															</TableCell>
															<TableCell>
																<ErrorBox errorMap={errorMap} field={field} />
																<ControlForField
																	field={field}
																	fieldDef={fieldDef}
																	getFieldType={getFieldType}
																	setFormValue={setFormValue}
																	formatCellValue={formatCellValue}
																	getFieldDefaultValue={getFieldDefaultValue}
																	isFieldRequired={isFieldRequired}
																	getSelectFieldOptions={getSelectFieldOptions}
																	relationsDefinition={objectData.relations.relations}
																	redirectToRelative={redirectToRelative}
																	formData={formData}
																	fieldsConfig={objectData.fieldsConfig || {}}
																	updateAutocompleteInput={
																		updateAutocompleteInput
																	}
																	relationToLabelMap={relationToLabelMap}
																	fieldDependencies={
																		objectData.fieldDependencies || {}
																	}
																	setAutocompleteOption={setAutocompleteOption}
																	currentOptions={currentOptions}
																	clearAutocompleteField={
																		clearAutocompleteField
																	}
																/>
															</TableCell>
														</TableRow>
													);
												})}
									</TableBody>
								</Table>
							</div>
							{inlineMode && extraConfig?.canDelete !== false && (
								<div className="mt-4 flex justify-end">
									<div className="mt-4">
										<Button
											variant="danger"
											onClick={() => {
												performDelete();
											}}>
											Delete
										</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
					{children}
					{!inlineMode && (
						<>
							<div className="mt-4 text-sm text-muted-foreground">
								<span className="text-red-500">*</span> indicates required field
							</div>
							<SaveButtons
								mode={mode}
								model={model}
								itemId={itemId}
								data={formData}
								onSave={onSave}
                                onDelete={performDelete}
								onCancel={onCancel}
								onError={processError}
								canSubmit={canSubmit}
								canAddItem={canAddItem}
                                canDelete={canDelete}
								updateModelItem={customUpdate ? customUpdate : updateModelItem}
								createModelItem={
									customCreate
										? customCreate
										: apiService.createModelItem.bind(apiService)
								}
							/>
						</>
					)}
				</div>
			)}
		</div>
	);
};
export default ModelObjectForm;
export { ModelObjectForm };
