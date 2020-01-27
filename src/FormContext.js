import React, {useReducer} from 'react';

const FormStateContext = React.createContext();
const FormDispatchContext = React.createContext();

const initialState = {
    title: "Untitled form",
    controls: []
}

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
            const {controls} = form;
            controls.push({
                label: null,
                required: false,
                type: "text"
            });
            return {...form, controls};
        }

        case 'addNewStaticField': {
            const {controls} = form;
            controls.push({
                label: null,
                static: true
            });
            return {...form, controls};
        }

        case 'editFieldValue': {
            // HACK: using index to identify a control could back-fire
            const {value, index, key} = action;
            const {controls} = form;

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