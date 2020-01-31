import React from 'react';
import {useFormState, useForm} from './FormContext';
import {useIsInFocus} from './common/Hooks';

const SectionName = () => {
    const [{form, sectionIndex}, dispatch] = useForm();
    console.warn(form);
    const {isInFocus, onFocus, onBlur} = useIsInFocus();
    const {name} = form.sections[sectionIndex];

    return (
        <div 
            className="name-section"
            onFocus={onFocus} 
            onBlur={onBlur}
        >
            <input 
                className={ isInFocus ? null : "default" }
                type="text"
                onChange={e => dispatch({
                    type: "changeSectionName",
                    uuid: form.sections[sectionIndex].uuid, 
                    value: e.target.value
                })}
                value={name}
            />
        </div>
    );
};

const SectionControls = () => {
    const [{form, sectionIndex}, dispatch] = useForm();
    const numberOfSectons = form.sections.length;

    const goToPreviousSection = () => {
        dispatch({type: "setSectionIndex", value: sectionIndex - 1});
    };
    const goToNextSection = () => {
        dispatch({type: "setSectionIndex", value: sectionIndex + 1});
    };
    const addNewSection = () => {
        dispatch({type: "addNewSection"});
    };
    const deleteSection = () => {
        dispatch({type: "deleteSection", uuid: form.sections[sectionIndex].uuid});
    };

    return (
        <div className="section-buttons">
            <div className="row">
                <button 
                    onClick={goToPreviousSection}
                    disabled={ numberOfSectons < 1 || sectionIndex === 0 }
                >
                    <i className="fa fa-arrow-left" />
                </button>
                <button 
                    onClick={goToNextSection}
                    disabled={ numberOfSectons < 1 || sectionIndex === numberOfSectons - 1 }
                >
                    <i className="fa fa-arrow-right" />
                </button>
            </div>
            <div className="row">
                <button onClick={() => {
                    addNewSection();
                    goToNextSection();
                }}>
                    <i className="fa fa-plus icon" />
                </button>
                <button 
                    onClick={() => {
                        deleteSection();
                        goToPreviousSection();
                    }}
                    disabled={numberOfSectons <= 1}
                >
                    <i className="fa fa-trash icon" />
                </button>
            </div>
        </div>
    );
};

const SectionLabel = () => {
    const {form: {sections}, sectionIndex} = useFormState();

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
