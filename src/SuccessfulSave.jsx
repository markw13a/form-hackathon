import React, {useEffect} from 'react';
import {useForm} from './FormContext';

const SuccessfulSave = () => {
    const [form, dispatch] = useForm();
    const {successfulSave} = form;

    useEffect(() => {
        if(successfulSave) {
            setTimeout(() => {
                dispatch({type: 'setSuccessfulSave', value: false});
            }, 3000)
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

export default SuccessfulSave;