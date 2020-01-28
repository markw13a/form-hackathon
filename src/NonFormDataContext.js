import React, {useReducer} from 'react';

const NonFormDataStateContext = React.createContext();
const NonFormDataDispatchContext = React.createContext();

const initialState = {
    sectionIndex: 0
};

const reducer = (state, action) => {
    switch(action.type) {
        case 'setSectionIndex': {
            const {value} = action;

            if(value === undefined || value === null) {
                throw new Error(`Invalid value provided to setSectionIndex: ${value}`);
            }

            return {...state, sectionIndex: value};
        }
        default: {
            throw new Error(`Unhandled action type ${action.type}`)
        }
    }
};

// Used to manage data that is needed throughout, but should not be submitted along with the actual form data
const NonFormDataProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <NonFormDataStateContext.Provider value={state}>
            <NonFormDataDispatchContext.Provider value={dispatch}>
                {children}
            </NonFormDataDispatchContext.Provider>
        </NonFormDataStateContext.Provider>
    );
};

const useNonFormDataState = () => {
    const context = React.useContext(NonFormDataStateContext);
    
    if(context === undefined) {
        throw new Error('useFormState must be used within FormProvider')
    }

    return context;
};

const useNonFormDataDispatch = () => {
    const context = React.useContext(NonFormDataDispatchContext);
    
    if(context === undefined) {
        throw new Error('useFormState must be used within FormProvider')
    }

    return context;
};

const useNonFormData = () => [useNonFormDataState(), useNonFormDataDispatch()];

export {
    useNonFormData,
    useNonFormDataState,
    useNonFormDataDispatch,
    NonFormDataProvider
};