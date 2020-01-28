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
    static: true
};

const sectionSchema = {
    controls: [
        {
            ...staticSchema
        }
    ]
};

const initialState = {
    title: "Untitled form",
    sections: [
        {
            ...sectionSchema
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

        case 'addNewInputField': {
            const {sectionIndex} = action;

            const section = form.sections[sectionIndex];
            const {controls} = section;
            controls.push({...controlSchema});

            return {...form, controls};
        }

        case 'addNewStaticField': {
            const {sectionIndex} = action;

            const section = form.sections[sectionIndex];
            const {controls} = section;
            controls.push({...staticSchema});

            return {...form, controls};
        }

        case 'editFieldValue': {
            // HACK: using index to identify a control could back-fire
            const {value, index, key, sectionIndex} = action;
            const section = form.sections[sectionIndex];
            const {controls} = section;

            if(!section || !controls || !controls[index]) {
                throw new Error(`Section or control specified does not appear to exist. Section: ${section}, controls: ${controls}`);
            }

            if(value === undefined || index === undefined || !key) {
                throw new Error(`editFieldValue must be called with a value, key and index. You provided value: ${value}, key: ${key}, index: ${index}`);
            }

            controls[index][key] = value; 

            return {...form, controls};
        }

        default: {
            throw new Error(`Unhandled action type ${action.type}`)
        }
    }
};

const FormProvider = ({children}) => {
    const [form, dispatch] = useReducer(reducer, initialState);
    console.warn(form);
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