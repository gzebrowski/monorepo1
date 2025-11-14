import React, { useState } from 'react';
import { ModelObjectForm, SaveVariant } from './modelObjectForm';
import { CommonPostResult } from '@simpleblog/shared/admin';
import { ErrorData } from '../models';
import { AlertTriangle } from './ui/icons';

type AddObjectProps = {
    model: string;
    onSave?: (data: Record<string, any>, saveVariant: SaveVariant, id?: string) => void;
    onCancel?: () => void;
    onError?: (error: Error) => void;
};

const AddObject: React.FC<AddObjectProps> = ({ model, onSave, onCancel, onError }) => {
    // const [modelData, setModelData] = useState<CommonReturnModelItemType | null>(null); // unused
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
            <div className="admin-text-center admin-border admin-p-2 admin-mb-2" style={{ borderColor: '#dc2626' }}>
                <div className="admin-text-red-600 admin-inline-flex admin-items-center admin-mt-2 admin-font-bold">
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
            onModelRetrieve={() => {}}
        />
        </div>
    )
};

export { AddObject };
