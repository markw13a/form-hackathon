import React from 'react';
import {useFormDispatch, useFormState} from '../FormContext';
import InputField from './InputField';
import StaticField from './StaticField';

const AddNewField = () => {
    const dispatch = useFormDispatch();

    return (
        <button onClick={() => dispatch({type: "addNewInputField"})}>
            Add field
        </button>
    );
};

const AddNewStaticText = () => {
    const dispatch = useFormDispatch();
    
    return (
        <button onClick={() => dispatch({type: "addNewStaticField"})}>
            Add header
        </button>
    );
};

const FormFields = () => {
    const form = useFormState();

    if(form.controls.length === 0) {
        return null;
    }

    return (
        <div>
            {
                form.controls.map((control, index) => (
                    control.static
                    ? <StaticField {...control} index={index} />
                    : (
                        <InputField  
                            {...control} 
                            index={index} 
                        />
                    )
                ))
            }
        </div>

    );
};

export {
    AddNewField,
    AddNewStaticText,
    FormFields
};