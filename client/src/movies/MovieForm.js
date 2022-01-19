
import React, { useState, useEffect  } from 'react';
import FlashMessage from '../common/FlashMessage';
import { ApiGet, ApiPost, ApiPut } from '../common/Api';
import Genre from './Genre';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';
import InputCheck from '../common/InputCheck';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
const MovieForm =  (props, hooks) => {
	// state = {
	// 	movieId: null,
	// 	directorList: [],
	// 	actorList: [],
	// 	genreList: [],

	// 	movieName: '',
	// 	year: '',
	// 	director: '',
	// 	actors: [],
	// 	genres: [],
	// 	available: false,

	// 	sent: false,
	// 	success: false,
	// };
	const [movieIdState, setMovieId] = useState(null);
	const [directorListState, setDirectorList] = useState([]);
	const [actorListState, setActorList] = useState([]);
	const [genreListState, setGenreList] = useState([]);
	const [movieNameState, setMovieName] = useState('');
	const [yearState, setYear] = useState(0);
	const [directorState, setDirector] = useState('');
	const [actorsState, setActors] = useState([]);
	const [genresState, setGenres] = useState([]);
	const [availableState, setAvailable] = useState(false);
	const [addedState, setAdded] = useState('');
	const [sentState, setSent] = useState(false);
	const [successState, setSuccess] = useState(false);
	const [errorState, setError] = useState()
	const history = useHistory();

useEffect(() => {
		const id = props.match.params.id || null;

		if (id) {
			setMovieId(id[0])
		

		 ApiGet('/api/movies/' + id).then((data) => {
				setMovieName(data.name);
				setYear(data.year);
				setDirector(data.directorID);
				setActors(data.actorIDs);
				setGenres(data.genres);
				setAvailable(data.isAvailable);
			});
		}

		ApiGet('/api/directors').then((data) => setDirectorList(data));
		ApiGet('/api/actors').then((data) => setActorList(data));
		ApiGet('/api/genres').then((data) => setGenreList(data));
	
	},[]);

	const handleChange = (e) => {
		const target = e.target;

        let temp;
        if (['actors', 'genres'].includes(target.name)) {
            temp = Array.from(target.selectedOptions, (item) => item.value);
        }
        else if (target.name === 'available') {
            temp = target.checked;
        }
        else {
            temp = target.value;
        }

        const name = target.name;
        const value = temp;
		
		if (name === 'movieName') { setMovieName(value);}
		else if (name === 'year') {setYear(value);}
		else if (name === 'director'){setDirector(value);}
		else if (name === 'actors') {setActors(value);}
		else if (name === 'genres') {setGenres(value);}
		else if (name === 'available'){setAvailable(value)};
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const body = {
			name: movieNameState,
			year: yearState,
			directorID: directorState,
			actorIDs: actorsState,
			genres: genresState,
			isAvailable: availableState,
		};

	
		(movieIdState
			? ApiPut('/api/movies/' + props.match.params.id, body)
			:  ApiPost('/api/movies/', body)
		)
			.then((data) => {
				console.log('succcess', data)
				setSent(true);
				setSuccess(true);
				history.push('/movies')
				
			})
			.catch(async (error) => {
				const er = await error
				console.log(er.message);
				setError(er.message);
				setSent(true);
				setSuccess(false);
			});
	};

	const sent = sentState;
	const success = successState;
	return (
		<div>
			<h1>{props.match.params.id ? 'Upravit' : 'Vytvořit'} film</h1>
			<hr />
			{errorState? <div className='alert alert-danger'>{errorState}</div> : ""}
			{sent && (
				<FlashMessage
					theme={success ? 'success' : ''}
					text={
						success
							? 'Uložení filmu proběhlo úspěšně.'
							: ''
					}
				/>
			)}

			<form onSubmit={handleSubmit}>
				<InputField
					required={true}
					type="text"
					name="movieName"
					min="3"
					label="Název"
					prompt="Zadejte název díla"
					value={movieNameState}
					handleChange={handleChange}
				/>

				<InputField
					required={true}
					type="number"
					name="year"
					label="Rok vydání"
					prompt="Zadejte rok vydání"
					min="0"
					value={yearState}
					handleChange={handleChange}
				/>

				<InputSelect
					required={true}
					name="director"
					items={directorListState}
					label="Režie"
					prompt="Vyberte režiséra"
					value={directorListState}
					handleChange={handleChange}
				/>

				<InputSelect
					required={true}
					name="actors"
					items={actorListState}
					multiple={true}
					label="Hrají"
					prompt="Označte herce"
					value={actorsState}
					handleChange={handleChange}
				/>

				<InputSelect
					required={true}
					name="genres"
					items={genreListState}
					multiple={true}
					enum={Genre}
					label="Žánr"
					prompt="Označte žánry"
					value={genresState}
					handleChange={handleChange}
				/>

				<InputCheck
					type="checkbox"
					name="available"
					label="Dostupný"
					value={availableState}
					handleChange={handleChange}
				/>

				<input type="submit" className="btn btn-primary" value="Uložit" />
			</form>
		</div>
	);
};

export default MovieForm;
