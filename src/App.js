import React from 'react';
import {FormProvider} from './FormContext';
import FormTitleCapture from './FormTitleCapture';
import {AddNewField, AddNewStaticText, FormFields} from './fields/Field';
import './style/main.scss';

const App = () => (
	<div className="App">
		<header><h1>Chameleon Form Builder</h1></header>
		<div className="content">
			<FormProvider>
				<FormTitleCapture />
				<FormFields />
				<AddNewField />
				<AddNewStaticText />
			</FormProvider>
		</div>
	</div>
);

export default App;
