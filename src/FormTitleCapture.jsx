import React from 'react';
import SuccessfulSave from './SuccessfulSave';
import {useForm} from './FormContext';
import {useIsInFocus} from './common/Hooks';

const FormTitleCapture = () => {
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
            <SuccessfulSave />
        </div>
    );
};

export default FormTitleCapture;