import React, {useReducer} from 'react';
import debounce from 'lodash.debounce';
import uuid from 'uuid/v4';

const FormStateContext = React.createContext();
const FormDispatchContext = React.createContext();

const staticSchema = {
    uuid: null,
    label: "Type your heading",
    type: "title",
};
const controlSchema = {
    uuid: null,
    label: "Type your question",
    type: "text",
    required: false
};
const newControlSchema = isStatic => ({
    ...(
        isStatic
        ? staticSchema
        : controlSchema
    ),
    uuid: uuid()
});

// Will need to deep copy when using to avoid the same "controls" array being referenced by multiple sections
const sectionSchema = {
    uuid: null,
    name: 'Unnamed section',
    controls: [
        {
            ...staticSchema
        }
    ]
};
const newSectionSchema = () => (
    JSON.parse(JSON.stringify({
        ...sectionSchema,
        uuid: uuid()
    }))
);

const initialState = {
    sectionIndex: 0,
    changes: [],
    saveStatus: null,
    form: {
        title: "Untitled form",
        sections: [
            newSectionSchema()
        ]
    }
};

const onSave = (form, dispatch) => (
    fetch('http://amazon.co.uk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
    .then(() => dispatch({type: 'setValue', key: 'hasChanges', value: false}))
    .catch(err => {
        dispatch({type: 'setValue', key: 'hasChanges', value: false});
        dispatch({type: 'setSaveStatus', value: true})
        console.error(err);
    })
);
const debouncedOnSave = debounce(onSave, 5000);

const reducer = (state, action) => {
    switch (action.type) {
        case 'setSectionIndex': {
            const {value} = action;
            const {form: sections} = state;

            if(value >= sections.length || value < 0) {
                throw new Error(`Invalid section index: ${value}`)
            }

            return {
                ...state, 
                sectionIndex: value
            };
        }
        case 'changeSectionName': {
            const {value, uuid} = action;
            const {form} = state;
            const sections = [...form.sections];
            
            if(value === undefined || !uuid) {
                throw new Error(`changeSectionName must be provided with a valid value and uuid. You provided value: ${value}, uuid: ${uuid}`);
            }

            // Update the section that has uuid = action.uuid
            const index = sections.findIndex( section => section.uuid === uuid );
            sections[index].name = value;

            return {
                ...state,
                form: {
                    ...form,
                    sections
                }
            };
        }
        case 'addNewSection': {
            const {form} = state;
            const sections = [
                ...form.sections,
                newSectionSchema()
            ];

            // TODO: update changes array as a side-effect
            // TODO: switch section index as a side-effect

            return {
                ...state,
                form: {
                    ...form,
                    sections
                }
            };   
        }
        case 'deleteSection': {
            // Delete given section and move to the next one down
            const {uuid} = action;
            const {form} = state;
            let sections = [...form.sections];
            
            if(sections.length === 1) {
                console.warn("Cannot remove your last section. Aborting...");
                return state;
            }

            sections = sections.filter(section => section.uuid !== uuid);

            // TODO: switch section index as a side-effect

            return {
                ...state,
                form: {
                    ...form,
                    sections
                }
            };
        }
        case 'addNewField': {
            const {form} = state;
            // TODO: change addNewInputField so that it passes down entire section that it belongs to.
            const {section, isStatic} = action;
            const {uuid} = section;

            const sections = [...form.sections];
            const index = sections.findIndex( section => section.uuid === uuid );
            sections[index].controls = [
                ...sections[index].controls,
                newControlSchema(isStatic)
            ];

            // TODO: update changes array as a side-effect

            return {
                ...form, 
                sections,
            };
        }
        case 'editFieldValue': {
            const {form} = state;
            const {value, control, key} = action;
            const {uuid} = control;

            const sections = [...form.sections];
            // TODO: should we change this so that the section id is passed along with the dispatch call?
            // Could also make it so that controls always carry a "section ID" property themselves. Fine as long as we're okay with controls being locked to a specific section
            // Find section that contains the control that we want to update
            const sectionIndex = sections.findIndex(section => 
                section.controls.some(control => control.uuid === uuid)
            );
            const controlIndex = sections[sectionIndex].controls.findIndex(control => 
                control.uuid === uuid    
            );

            const section = sections[sectionIndex];
            const controls = section.controls;

            if(!section || !controls || !controls[controlIndex]) {
                throw new Error(`Section or control specified does not appear to exist. Section: ${section}, controls: ${controls}`);
            }

            if(value === undefined || controlIndex === undefined || !key) {
                throw new Error(`editFieldValue must be called with a value, key and index. You provided value: ${value}, key: ${key}, index: ${controlIndex}`);
            }

            controls[controlIndex][key] = value; 

            return {
                ...state,
                form: {
                    ...form,
                    sections
                }
            };
        }
        case 'deleteControl': {
            const {form} = state;
            const {control} = action;
            const {uuid} = control;

            const sections = [...form.sections];

            const sectionIndex = sections.findIndex(section => 
                section.controls.some(control => control.uuid === uuid)
            );
            const controlIndex = sections[sectionIndex].controls.findIndex(control => 
                control.uuid === uuid    
            );

            const section = form.sections[sectionIndex];
            section.controls.splice(controlIndex, 1);

            return {
                ...form, 
                sections,
            };
        }
        case 'setSaveStatus': {
            const {value} = action;

            return {
                ...state, 
                saveStatus: value
            };
        }

        default: {
            throw new Error(`Unhandled action type ${action.type}`)
        }
    }
};

const FormProvider = ({children}) => {
    const [form, dispatch] = useReducer(reducer, initialState);

    if(form.hasChanges) {
        debouncedOnSave(form, dispatch);
    }

    console.warn("initialState", initialState);

    return (
        <FormStateContext.Provider value={form}>
            <FormDispatchContext.Provider value={dispatch}>
                {children}
            </FormDispatchContext.Provider>
        </FormStateContext.Provider>
    );
};

const useFormState = () => {
    const context = React.useContext(FormStateContext);
    
    if(context === undefined) {
        throw new Error('useFormState must be used within FormProvider')
    }

    return context;
};

const useFormDispatch = () => {
    const context = React.useContext(FormDispatchContext);
    
    if(context === undefined) {
        throw new Error('useFormState must be used within FormProvider')
    }

    return context;
};

const useForm = () => [useFormState(), useFormDispatch()];

export {
    FormProvider,
    useForm,
    useFormState,
    useFormDispatch
};