import React from 'react';
import {FormProvider} from './FormContext';
import FormTitleCapture from './FormTitleCapture';
import {AddNewField} from './Field';
import {Section, SectionControls} from './Sections';
import './style/main.scss';

const App = () => (
	<div className="App">
		<div className="content">
			<FormProvider>
				<FormTitleCapture />
				<SectionControls />
				<Section />
				<AddNewField />
			</FormProvider>
		</div>
	</div>
);

export default App;
