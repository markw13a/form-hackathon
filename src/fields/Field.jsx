import React from 'react';
import {useFormDispatch, useFormState} from '../FormContext';
import {useNonFormDataState} from '../NonFormDataContext';
import InputField from './InputField';
import StaticField from './StaticField';

const AddNewField = () => {
    const dispatch = useFormDispatch();
    const {sectionIndex} = useNonFormDataState();

    return (
        <button onClick={() => dispatch({type: "addNewInputField", sectionIndex})}>
            Add field
        </button>
    );
};

const AddNewStaticText = () => {
    const dispatch = useFormDispatch();
    const {sectionIndex} = useNonFormDataState();
    
    return (
        <button onClick={() => dispatch({type: "addNewStaticField", sectionIndex})}>
            Add header
        </button>
    );
};

const FormFields = ({controls}) => {

    if(controls.length === 0) {
        return null;
    }

    return (
        <div>
            {
                controls.map((control, index) => (
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

const Section = () => {
    const form = useFormState();
    const {sectionIndex} = useNonFormDataState();

    const section = form.sections[sectionIndex];

    if(!section) {
        throw new Error(`No data found for requested section at index ${sectionIndex}`);
    }

    return (
        <FormFields controls={section.controls} />
    );
};

export {
    AddNewField,
    AddNewStaticText,
    Section
};