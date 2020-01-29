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
            <label htmlFor="form-name"><i className="fa fa-edit icon"></i><span className="hide">Edit Form Name</span></label>
        </div>
    );
};

export default FormTitleCapture;