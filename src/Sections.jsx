import React from 'react';
import {useFormState, useForm} from './FormContext';
import {useIsInFocus} from './common/Hooks';

const SectionName = () => {
    const [{sections, sectionIndex}, dispatch] = useForm();
    const {isInFocus, onFocus, onBlur} = useIsInFocus();

    const {sectionName} = sections[sectionIndex];

    return (
        <div 
            className="name-section"
            onFocus={onFocus} 
            onBlur={onBlur}
        >
            <input 
                className={ isInFocus ? null : "default" }
                type="text"
                onChange={e => dispatch({type: "changeSectionName", value: e.target.value})}
                value={sectionName}
            />
        </div>
    );
};

const SectionControls = () => {
    const [form, dispatch] = useForm();

    const {sectionIndex} = form;
    const numberOfSectons = form.sections.length;

    return (
        <div className="section-buttons">
            <div className="row">
                <button 
                    onClick={() => dispatch({type: "switchToPreviousSection"})}
                    disabled={ numberOfSectons < 1 || sectionIndex === 0 }
                >
                    <i className="fa fa-arrow-left" />
                </button>
                <button 
                    onClick={() => dispatch({type: "switchToNextSection"})}
                    disabled={ numberOfSectons < 1 || sectionIndex === numberOfSectons -1 }
                >
                    <i className="fa fa-arrow-right" />
                </button>
            </div>
            <div className="row">
                <button onClick={() => dispatch({type: "addNewSection"})}>
                    <i className="fa fa-plus icon" />
                </button>
                <button 
                    onClick={() => dispatch({type: "deleteSection"})}
                    disabled={numberOfSectons <= 1}
                >
                    <i className="fa fa-trash icon" />
                </button>
            </div>
        </div>
    );
};

const SectionLabel = () => {
    const {sections, sectionIndex} = useFormState();

    return (
        <div className="current-section">
            Section {sectionIndex + 1} / {sections.length} 
        </div>
    );
}

const Section = () => (
    <div className="section-title">
        <SectionLabel />
        <SectionName />
        <SectionControls />
    </div>
);

export default Section;
