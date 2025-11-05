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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Calendar,
 } from '@/components/ui';
import { GetModelItemsType, splitCamelCaseWords } from '@simpleblog/shared/admin';
import { parseFieldName } from '@simpleblog/shared/admin';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="ml-2">
                    <FilterIcon />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-96">
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
                                            size="sm"
                                            onClick={() => changeFilterByField(field, '')}
                                        >
                                            All
                                        </Button>
                                    </div>
                                    { modelItems.filterTypes[field].length > 20 ? (
                                    <Select
                                        value={filterByField?.[field] || ''}
                                        onValueChange={(value) => changeFilterByField(field, value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={`Filter by ${field}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {modelItems.filterTypes[field].map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {splitCamelCaseWords(option.label, true)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    ) : (
                                        <div>
                                            {modelItems.filterTypes[field].map((option) => (
                                                <div className={cn('', (filterByField?.[field] === option.value) ? 'border' : '')} key={option.value} >
                                                    <Button
                                                        variant="link"
                                                        size="sm"
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
                                                size="sm"
                                                onClick={() => changeFilterByField(field, '')}
                                            >
                                                All
                                            </Button>
                                        </div>
                                        <div className={cn('', (filterByField?.[field] === true) ? 'border' : '')}>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => changeFilterByField(field, true)}
                                            >
                                                Yes
                                            </Button>
                                        </div>
                                        <div className={cn('', (filterByField?.[field] === false) ? 'border' : '')}>
                                            <Button
                                                variant="link"
                                                size="sm"
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
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="flex-4 relative">
                                                    <Input
                                                        type="text"
                                                        placeholder="from"
                                                        className="flex-1"
                                                        readOnly={true}
                                                        value={
                                                            filterByField?.[`${field}__$gte`] || ''
                                                        }
                                                    />
                                                    <Button
                                                        type="button"
                                                        className="mr-auto m-0 p-0 absolute top-0 right-2 rounded-l-none rounded-r-md"
                                                        variant="ghost">
                                                        <CalendarDays className="h-4 w-4 opacity-50" />
                                                    </Button>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    onSelect={(selectedDate) => {
                                                        if (selectedDate) {
                                                            changeFilterByField(`${field}__$gte`,
                                                                DateTime.fromJSDate(selectedDate).toISODate(),
                                                            );
                                                        }
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Popover>
                                            <PopoverTrigger asChild className='mt-2'>
                                                <div className="flex-4 relative">
                                                    <Input
                                                        type="text"
                                                        placeholder="to"
                                                        className="flex-1"
                                                        readOnly={true}
                                                        value={
                                                            filterByField?.[`${field}__$lte`] || ''
                                                        }
                                                    />
                                                    <Button
                                                        type="button"
                                                        className="mr-auto m-0 p-0 absolute top-0 right-2 rounded-l-none rounded-r-md"
                                                        variant="ghost">
                                                        <CalendarDays className="h-4 w-4 opacity-50" />
                                                    </Button>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    onSelect={(selectedDate) => {
                                                        if (selectedDate) {
                                                            changeFilterByField(`${field}__$lte`, 
                                                                DateTime.fromJSDate(selectedDate).toISODate(),
                                                            );
                                                        }
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
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
