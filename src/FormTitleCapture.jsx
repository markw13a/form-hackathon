import React from 'react';
import {useForm} from './FormContext';

const FormTitleCapture = () => {
    const [form, dispatch] = useForm();

    return (
        <input 
            type="text"
            onChange={e => dispatch({type: "setValue", key: "title", value: e.target.value})}
            value={form.title}
        />
    );
};

export default FormTitleCapture;