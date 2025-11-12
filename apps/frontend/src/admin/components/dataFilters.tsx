import React, { useState, useEffect } from 'react';
import { FilterIcon } from 'lucide-react';
import { DateTime } from 'luxon';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Button,
    Input,
 } from './ui/simpleComponents';
import { Calendar } from './calendar';
import { GetModelItemsType, splitCamelCaseWords } from '@simpleblog/shared/admin';
import { parseFieldName } from '@simpleblog/shared/admin';
import { cn } from '../utils/utils';

type DataFiltersProps = {
    model: string;
    modelItems: GetModelItemsType;
    onChangeFilterByField: (v: Record<string, any>) => void;
};

const DataFilters: React.FC<DataFiltersProps> = ({ model, modelItems, onChangeFilterByField }) => {
    const [filterByField, setFilterByField] = useState<Record<string, any> | null>(null);
    const [typeByField, setTypeByField] = useState<Record<string, string | null>>({});
    const changeFilterByField = (field: string, value: any) => {
        setFilterByField((prev) => ({
            ...prev,
            [field]: value,
        }));
        onChangeFilterByField({
            ...filterByField,
            [field]: value,
        });
    };
    useEffect(() => {
        setFilterByField(null);
        modelItems.fieldsAndTypes.forEach((f) => {
            let tp = 'text';
            const field = f.column_name;
            const dataTp = modelItems.fieldsAndTypes.find((f) => f.column_name === field)?.data_type;
            if (field in (modelItems.filterTypes || {})) {
                tp = 'choice';
            } else if (dataTp === 'boolean') {
                tp = 'boolean';
            } else if (dataTp === 'date' || dataTp === 'datetime' || dataTp?.startsWith('timestamp')) {
                tp = 'date';
            }
            setTypeByField((prev) => ({
                ...prev,
                [field]: tp,
            }));
        });
    }, [model, modelItems.fieldsAndTypes]);

    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="primary-outline" className="ml-2">
                    <FilterIcon />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-96">
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                        Apply filters to narrow down the results.
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-4">
                    {modelItems.listFilterFields.map((fieldName) => {
                        const { field, FieldLabel} = parseFieldName(fieldName);

                        return (
                        <div key={field} className="space-x-2 mb-3">
                            <h3 className='display-block'>{FieldLabel}</h3>
                            { typeByField[field] === 'choice' ? (
                                <div className="w-full">
                                    <div className=''>
                                        <Button
                                            variant="link"
                                            onClick={() => changeFilterByField(field, '')}
                                        >
                                            All
                                        </Button>
                                    </div>
                                    { modelItems.filterTypes[field].length > 20 ? (
                                    <select
                                        value={filterByField?.[field] || ''}
                                        onChange={(e) => changeFilterByField(field, e.target.value)}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    >
                                        <option value=''>All</option>
                                        {modelItems.filterTypes[field].map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {splitCamelCaseWords(option.label, true)}
                                            </option>
                                        ))}
                                    </select>
                                    ) : (
                                        <div>
                                            {modelItems.filterTypes[field].map((option) => (
                                                <div className={cn('', (filterByField?.[field] === option.value) ? 'border' : '')} key={option.value} >
                                                    <Button
                                                        variant="link"
                                                        onClick={() => changeFilterByField(field, option.value)}
                                                    >
                                                        {splitCamelCaseWords(option.label, true)}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                { typeByField[field] === 'boolean' && (
                                    <div className="w-full">
                                        <div className=''>
                                            <Button
                                                variant="link"
                                                onClick={() => changeFilterByField(field, '')}
                                            >
                                                All
                                            </Button>
                                        </div>
                                        <div className={cn('', (filterByField?.[field] === true) ? 'border' : '')}>
                                            <Button
                                                variant="link"
                                                onClick={() => changeFilterByField(field, true)}
                                            >
                                                Yes
                                            </Button>
                                        </div>
                                        <div className={cn('', (filterByField?.[field] === false) ? 'border' : '')}>
                                            <Button
                                                variant="link"
                                                onClick={() => changeFilterByField(field, false)}
                                            >
                                                No
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                { typeByField[field] === 'date' && (
                                    <div>
                                        <div>
                                            <Calendar
                                                date={filterByField?.[`${field}__$gte`] ? DateTime.fromISO(filterByField?.[`${field}__$gte`]).toJSDate() : undefined}
                                                onDateChange={(selectedDate) => {
                                                    if (selectedDate) {
                                                        changeFilterByField(`${field}__$gte`,
                                                            DateTime.fromJSDate(selectedDate).toISODate(),
                                                        );
                                                    }
                                                }}
                                            />
                                            <Calendar
                                                date={filterByField?.[`${field}__$lte`] ? DateTime.fromISO(filterByField?.[`${field}__$lte`]).toJSDate() : undefined}
                                                onDateChange={(selectedDate) => {
                                                    if (selectedDate) {
                                                        changeFilterByField(`${field}__$lte`, 
                                                            DateTime.fromJSDate(selectedDate).toISODate(),
                                                        );
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className=""
                                            onClick={() => {
                                                changeFilterByField(`${field}__$gte`, '');
                                                changeFilterByField(`${field}__$lte`, '');
                                            }}>
                                                Clear
                                        </Button>
                                        </div>

                                    </div>
                                )}
                                { typeByField[field] === 'text' && (
                                    <Input
                                        id={field}
                                        type="text"
                                        value={filterByField?.[field] || ''}
                                        placeholder={`Filter by ${field}`}
                                        onChange={(e) => {
                                            changeFilterByField(field, e.target.value);
                                        }}
                                    />
                                    )}
                                </>
                            )}
                        </div>
                    )})}
                </div>
                <SheetFooter>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
export default DataFilters;
export { DataFilters };
