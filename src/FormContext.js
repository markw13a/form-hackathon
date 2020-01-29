import React, {useReducer} from 'react';
import debounce from 'lodash.debounce';

const FormStateContext = React.createContext();
const FormDispatchContext = React.createContext();

const controlSchema = {
    label: "Type your question",
    required: false,
    type: "text",
};

const staticSchema = {
    label: "Type your heading",
    type: "title",
};

// Will need to deep copy when using to avoid the same "controls" array being referenced by multiple sections
const sectionSchema = {
    sectionName: 'Unnamed section',
    controls: [
        {
            ...staticSchema
        }
    ]
};
const newSectionSchema = () => JSON.parse(JSON.stringify(sectionSchema));

const initialState = {
    title: "Untitled form",
    sectionIndex: 0,
    hasChanges: false,
    successfulSave: false,
    sections: [
        {
            ...newSectionSchema()
        }
    ]
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
        dispatch({type: 'setSuccessfulSave', value: true})
        console.error(err);
    })
);
const debouncedOnSave = debounce(onSave, 5000);

const reducer = (form, action) => {
    switch (action.type) {
        case 'setValue': {
            const {value, key} = action;

            if(value === undefined || !key) {
                throw new Error(`setValue must be called with a value and key. You provided value: ${value}, key: ${key}`);
            }
            return {...form, [key]: value};
        }
        case 'changeSectionName': {
            const {value} = action;
            const {sectionIndex, sections} = form;
            sections[sectionIndex].sectionName = value;

            return {...form};
        }
        case 'addNewSection': {
            let {sections} = form;
            // Add new section then switch to it
            return {
                ...form,
                sectionIndex: sections.length,
                sections: [
                    ...sections, 
                    {...newSectionSchema()}
                ] ,
                hasChanges: true
            };   
        }
        case 'deleteSection': {
            // Delete given section and move to the next one down
            const {sections, sectionIndex} = form;

            if(sections.length === 0) {
                console.warn("Cannot remove your last section. Aborting...");
                return form;
            }

            sections.splice(sectionIndex, 1);
            return {
                ...form,
                sectionIndex: 
                    sectionIndex === 0 
                        ? 0
                        : form.sectionIndex - 1
                        ,
                sections,
                hasChanges: true
            };
        }
        case 'switchToNextSection': {
            return {
                ...form, 
                sectionIndex: form.sectionIndex + 1
            };
        }
        case 'switchToPreviousSection': {
            return {
                ...form, 
                sectionIndex: form.sectionIndex - 1
            };
        }

        case 'addNewInputField': {
            const {sectionIndex} = form;
            const sections = [...form.sections];
            const section = sections[sectionIndex];            
            section.controls = [...section.controls, {...controlSchema}];

            return {
                ...form, 
                sections: [...sections],
                hasChanges: true
            };
        }

        case 'addNewStaticField': {
            const {sectionIndex} = form;
            const sections = [...form.sections];
            const section = sections[sectionIndex];
            section.controls = [...section.controls, {...staticSchema}];

            return {
                ...form, 
                sections: [...sections],
                hasChanges: true
            };
        }

        case 'editFieldValue': {
            // HACK: using index to identify a control could back-fire
            const {sectionIndex} = form;
            const {value, index, key} = action;
            const section = form.sections[sectionIndex];
            const controls = [...section.controls];

            if(!section || !controls || !controls[index]) {
                throw new Error(`Section or control specified does not appear to exist. Section: ${section}, controls: ${controls}`);
            }

            if(value === undefined || index === undefined || !key) {
                throw new Error(`editFieldValue must be called with a value, key and index. You provided value: ${value}, key: ${key}, index: ${index}`);
            }

            controls[index][key] = value; 

            return {
                ...form, 
                sections: [...form.sections],
                hasChanges: true
            };
        }

        case 'deleteControl': {
            const {sectionIndex} = form;
            const {index} = action;

            const section = form.sections[sectionIndex];
            section.controls.splice(index, 1);

            return {
                ...form, 
                sections: [...form.sections],
                hasChanges: true
            };
        }

        case 'setSuccessfulSave': {
            const {value} = action;

            return {
                ...form, 
                successfulSave: value
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