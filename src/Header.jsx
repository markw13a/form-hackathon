import React, {useEffect} from 'react';
import {useIsInFocus} from './common/Hooks';
import {useForm} from './FormContext';

const SaveStateMessage = () => {
    const [form, dispatch] = useForm();
    const {successfulSave} = form;

    useEffect(() => {
        if(successfulSave) {
            setTimeout(() => {
                dispatch({type: 'setSuccessfulSave', value: false});
            }, 3000);
        }
    }, [successfulSave, dispatch]);

    if(!successfulSave) {
        return null;
    }

    return (
        <div className="save-message">
            All changes saved
        </div>
    );
};

const FormTitle = () => {
    const [form, dispatch] = useForm();
    const {isInFocus, onFocus, onBlur} = useIsInFocus();

    return (
        <div 
            id="form-name-section" 
            onFocus={onFocus} 
            onBlur={onBlur}
        >
            <input 
                className={ isInFocus ? null : "default" }
                type="text"
                onChange={e => dispatch({type: "setValue", key: "title", value: e.target.value})}
                value={form.title}
                id="form-name"
            />
        </div>
    );
};

const Header = () => (
    <>
		<header><h1>Chameleon Form Builder</h1></header>
        <FormTitle />
        <SaveStateMessage />
    </>
);

export default Header;