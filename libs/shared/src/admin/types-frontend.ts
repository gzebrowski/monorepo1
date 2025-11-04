// Frontend-specific admin types (without NestJS dependencies)
import {
    FindByIdType,
    GetPrismaModelFieldsAndTypes,
    GetOneToOneRelationsFromDMMF,
    InlineDefinition,
    GetInlineItemsType,
    FieldDependencies,
    ExtraFieldDefinition,
    ExistingFormData,
    NewFormData,
    CommonPostResult,
    ActionIdsType
} from './baseAdmin';

export type CommonReturnModelItemType = {
    title?: string;
    item: FindByIdType | null;
    fieldsAndTypes: GetPrismaModelFieldsAndTypes;
    filterTypes: Record<string, {label: string, value: any}[]>;
    relations: GetOneToOneRelationsFromDMMF;
    relationToLabelMap?: Record<string, string>;
    readonlyFields: string[];
    fieldToLabelMap: Record<string, any>;
    fieldsConfig: Record<string, any>;
    fieldDependencies?: FieldDependencies;
    inlines?: InlineDefinition[];
    inlineItems?: GetInlineItemsType;
    canDeleteItem?: boolean;
    extraFields?: ExtraFieldDefinition[];
};

export {
    ExistingFormData,
    NewFormData,
    CommonPostResult,
    ActionIdsType
};