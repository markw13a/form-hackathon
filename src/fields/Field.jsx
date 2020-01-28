import React from 'react';
import {useFormState, useForm, useFormDispatch} from '../FormContext';
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
    const {sectionIndex} = form;

    const section = form.sections[sectionIndex];
    
    if(!section) {
        throw new Error(`No data found for requested section at index ${sectionIndex}`);
    }

    return (
        <FormFields controls={section.controls} />
    );
};

const SectionControls = () => {
    const [form, dispatch] = useForm();

    const {sectionIndex} = form;
    const numberOfSectons = form.sections.length;

    return (
        <>
            <button onClick={() => dispatch({type: "addNewSection"})}>
                Add new section
            </button>
            {
                numberOfSectons > 1
                && sectionIndex !== 0
                && (
                    <button onClick={() => dispatch({type: "switchToPreviousSection"})}>
                        To Section {sectionIndex - 1}
                    </button>
                )
            }
            {
                numberOfSectons > 1
                && sectionIndex !== numberOfSectons - 1
                && (
                    <button onClick={() => dispatch({type: "switchToNextSection"})}>
                        To Section {sectionIndex + 1}
                    </button>
                )
            }
            {
                numberOfSectons > 1
                && (
                    <button onClick={() => dispatch({type: "deleteSection"})}>
                        Delete this section
                    </button>
                )
            }
        </>
    );
};

export {
    AddNewField,
    AddNewStaticText,
    Section,
    SectionControls
};