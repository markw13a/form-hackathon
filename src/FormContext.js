import React, {useReducer} from 'react';

const FormStateContext = React.createContext();
const FormDispatchContext = React.createContext();

const controlSchema = {
    label: null,
    required: false,
    type: "text"
};

const staticSchema = {
    label: null,
    subHeader: null,
    static: true
};

// Will need to deep copy when using to avoid the same "controls" array being referenced by multiple sections
const sectionSchema = {
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
    sections: [
        {
            ...newSectionSchema()
        }
    ]
};

const reducer = (form, action) => {
    switch (action.type) {
        case 'setValue': {
            const {value, key} = action;

            if(value === undefined || !key) {
                throw new Error(`setValue must be called with a value and key. You provided value: ${value}, key: ${key}`);
            }
            return {...form, [key]: value};
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
                ] 
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

            return {...form, sections: [...sections]};
        }

        case 'addNewStaticField': {
            const {sectionIndex} = form;
            const sections = [...form.sections];
            const section = sections[sectionIndex];
            section.controls = [...section.controls, {...staticSchema}];

            return {...form, sections: [...sections]};
        }

        case 'editFieldValue': {
            // HACK: using index to identify a control could back-fire
            const {value, index, key, sectionIndex} = action;
            const section = form.sections[sectionIndex];
            const controls = [...section.controls];

            if(!section || !controls || !controls[index]) {
                throw new Error(`Section or control specified does not appear to exist. Section: ${section}, controls: ${controls}`);
            }

            if(value === undefined || index === undefined || !key) {
                throw new Error(`editFieldValue must be called with a value, key and index. You provided value: ${value}, key: ${key}, index: ${index}`);
            }

            controls[index][key] = value; 

            return {...form, sections: [...form.sections]};
        }

        default: {
            throw new Error(`Unhandled action type ${action.type}`)
        }
    }
};

const FormProvider = ({children}) => {
    const [form, dispatch] = useReducer(reducer, initialState);

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