import React, { useState } from 'react';
import { ModelObjectForm, SaveVariant } from './modelObjectForm';
import { CommonPostResult, CommonReturnModelItemType } from '@simpleblog/shared/admin';
import { ErrorData } from '../models';
import { AlertTriangle } from 'lucide-react';

type AddObjectProps = {
    model: string;
    onSave?: (data: Record<string, any>, saveVariant: SaveVariant, id?: string) => void;
    onCancel?: () => void;
    onError?: (error: Error) => void;
};

const AddObject: React.FC<AddObjectProps> = ({ model, onSave, onCancel, onError }) => {
    const [modelData, setModelData] = useState<CommonReturnModelItemType | null>(null);
    const [errorData, setErrorData] = useState<ErrorData>({ message: null, main: {}, inlines: {} });

    function onSaveError(error: CommonPostResult): void {
        if (error.errors) {
            setErrorData((prev) => ({
                ...prev,
                main: error.errors?.reduce((acc, err) => {
                    acc[err.field] = err.message;
                    return acc;
                }, {} as Record<string, string>),
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
        <div>
        { errorData.message && (
            <div className="text-center border border-red-500 p-2 mb-2">
                <div className="text-red-500 inline-flex items-center mt-2 font-bold">
                    <AlertTriangle className="mr-2" />
                    <span className="">{errorData.message}</span>
                </div>
            </div>
        )}
        <ModelObjectForm
            mode="create"
            model={model}
            onSave={onSave}
            errorMap={errorData.main}
            onSaveError={onSaveError}
            onCancel={onCancel}
            onError={onError}
            onModelRetrieve={setModelData}
        />
        </div>
    )
};

export { AddObject };
