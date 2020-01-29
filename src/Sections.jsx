import React from 'react';
import {useFormState, useForm} from './FormContext';
import {FormFields} from './Field';

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

const SectionTitle = () => {
    const {sections, sectionIndex} = useFormState();

    return (
        <div className="section-title">
            Section {sectionIndex + 1} / {sections.length} 
        </div>
    );
};

export {
    Section,
    SectionControls,
    SectionTitle
};