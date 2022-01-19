
import React, { useState, useEffect } from 'react';
import { ApiGet } from '../common/Api';
import DateStringFormatter from '../common/DateStringFormatter';
import Role from './Role';

const PersonDetail = (props) => {

	const [personNameState, setPersonName] = useState('');
	const [birthDateState, setBirthDate] = useState('');
	const [countaryState, setCountry] = useState('');
	const [biographyState, setBiography] = useState('');
	const [personRoleState, setPersonRole] = useState('');

	useEffect(() => {
		ApiGet('/api/people/' + props.match.params.id)
			.then((data) => {
				setPersonName(data.name);
				setBirthDate(DateStringFormatter(data.birthDate, true));
				setCountry(data.country);
				setBiography(data.biography);
				setPersonRole(data.role);
			})
			.catch((error) => {
				console.error(error);
			});
	},[]);

	const role = Role.DIRECTOR === personRoleState ? 'Režisér' : 'Herec';

	return (
		<div>
			<h1>Detail osobnosti</h1>
			<hr />
			<h3>{personNameState}</h3>
			<p>
				{role}, nar. {birthDateState}, {countaryState}.
			</p>
			<p>
				<strong>Biografie:</strong>
				<br />
				{biographyState}
			</p>
		</div>
	);
};

export default PersonDetail;
