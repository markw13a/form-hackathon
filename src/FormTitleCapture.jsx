import React from 'react';
import {useForm} from './FormContext';

const FormTitleCapture = () => {
    const [form, dispatch] = useForm();

    return (
        <div id="form-name-section">
            <input 
                type="text"
                onChange={e => dispatch({type: "setValue", key: "title", value: e.target.value})}
                value={form.title}
                id="form-name"
            />
            <label for="form-name"><i class="fa fa-edit icon"></i></label>
        </div>
    );
};

export default FormTitleCapture;