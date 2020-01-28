import React from 'react';
import {FormProvider} from './FormContext';
import FormTitleCapture from './FormTitleCapture';
import {AddNewField, AddNewStaticText, Section, SectionControls} from './fields/Field';
import './style/main.scss';

const App = () => (
	<div className="App">
		<div className="content">
			<FormProvider>
				<FormTitleCapture />
				<SectionControls />
				<Section />
				<AddNewField />
				<AddNewStaticText />
			</FormProvider>
		</div>
	</div>
);

export default App;
