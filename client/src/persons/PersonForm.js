
import React, { useState, useEffect } from 'react';
import { ApiGet, ApiPost, ApiPut } from '../common/Api';
import DateStringFormatter from '../common/DateStringFormatter';
import FlashMessage from '../common/FlashMessage';
import InputField from '../common/InputField';
import InputCheck from '../common/InputCheck';
import Role from './Role';
import { useHistory } from "react-router";


const PersonForm = (props) => {
	const history = useHistory();

	const [personIdState, setPersonId] = useState(null);
	const [personNameState, setPersonName] = useState('');
	const [birthDateState, setBirthDate] = useState('');
	const [countaryState, setCountry] = useState('');
	const [biographyState, setBiography] = useState('');
	const [personRoleState, setPersonRole] = useState('');
	const [sentState, setSent] = useState(false);
	const [successState, setSuccess] = useState(false);
    const [errorState, setError] = useState(null)
	useEffect(() => {
		const id = props.match.params.id || null;

		if (id) {
			setPersonId(id);

			ApiGet('/api/people/' + id).then((data) => {
				setPersonName(data.name);
				setBirthDate(DateStringFormatter(data.birthDate));
				setCountry(data.country);
				setBiography(data.biography);
				setPersonRole(data.role);
			});
		}
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		const body = {
			name: personNameState,
			birthDate: birthDateState,
			country: countaryState,
			biography: biographyState,
			role: personRoleState,
		};

		(personIdState
			? ApiPut('/api/people/' + props.match.params.id, body)
			: ApiPost('/api/people/', body)
		)
			.then((data) => {
				setSent(true);
				setSuccess(true);		
				history.push('/people');
			})
			.catch( async (error) => {
				const er = await error
				console.log('here', er.message)
				setError(er.message)
				setSent(true);
				setSuccess(false);
			});

	};

	const sent = sentState;
	const success = successState;

	return (
		<div>
			<h1>{props.match.params.id ? 'Upravit' : 'Vytvořit'} osobnost</h1>
			<hr />
			{errorState? <div className='alert alert-danger'>{errorState}</div> : ''}
			{sent && (
				<FlashMessage
					theme={success ? 'success' : ''}
					text={
						success
							? 'Uložení osobnosti proběhlo úspěšně.'
							: ''
					}
				/>
			)}

			<form onSubmit={handleSubmit}>
				<InputField
					required={true}
					type="text"
					name="personName"
					min="3"
					label="Jméno"
					prompt="Zadejte celé jméno"
					value={personNameState}
					handleChange={(e) => {
						const { value } = e.target;
						setPersonName(value);
						console.log(personNameState);
					}}
				/>

				<InputField
					required={true}
					type="date"
					name="birthDate"
					label="Datum narození"
					prompt="Zadejte datum narození"
					min="0000-01-01"
					value={birthDateState}
					handleChange={(e) => {
						const { value } = e.target;
						setBirthDate(value);
						console.log(birthDateState);
					}}
				/>

				<InputField
					required={true}
					type="text"
					name="country"
					min="2"
					label="Země původu"
					prompt="Zadejte zemi původu"
					value={countaryState}
					handleChange={(e) => {
						const { value } = e.target;
						setCountry(value);
						console.log(countaryState);
					}}
				/>

				<InputField
					required={true}
					type="textarea"
					name="biography"
					minLength="10"
					label="Biografie"
					prompt="Napište biografii"
					rows="5"
					value={biographyState}
					handleChange={(e) => {
						const { value } = e.target;
						setBiography(value);
						console.log(biographyState);
					}}
				/>

				<h6>Role:</h6>

				<InputCheck
					type="radio"
					name="personRole"
					label="Režisér"
					value={Role.DIRECTOR}
					handleChange={(e) => {
						const { value } = e.target;
						setPersonRole(value);
						console.log(personRoleState);
					}}
					checked={Role.DIRECTOR === personRoleState}
				/>

				<InputCheck
					type="radio"
					name="personRole"
					label="Herec"
					value={Role.ACTOR}
					handleChange={(e) => {
						const { value } = e.target;
						setPersonRole(value);
						console.log(personRoleState);
					}}
					checked={Role.ACTOR === personRoleState}
				/>

				<input type="submit" className="btn btn-primary" value="Uložit" />
			</form>
		</div>
	);
};

export default PersonForm;
