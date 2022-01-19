
import React from 'react';
import { Link } from 'react-router-dom';
import { ApiDelete } from '../common/Api';

const PersonTable = (props) => {

	const deletee = (id, role) => {
		ApiDelete('/api/people/' + id)
		.then((data) => props.delete(role))
		.catch( async(error)=>{
			error = await error;
			if(error.success===false){
				alert(error.message)
			}
		});

		
	};

	const role = props.role;
	return (
		<div>
			<p>
				{props.label} {props.items.length}
			</p>

			<table className="table table-bordered">
				<thead>
					<tr>
						<th>#</th>
						<th>Jméno</th>
						<th colSpan={3}>Akce</th>
					</tr>
				</thead>
				<tbody>
					{props.items.map((item, index) => (
						<tr key={index + 1}>
							<td>{index + 1}</td>
							<td>{item.name}</td>
							<td>
								<div className="btn-group">
									<Link
										to={'/people/show/' + item._id}
										className="btn btn-sm btn-info"
									>
										Zobrazit
									</Link>
									<Link
										to={'/people/edit/' + item._id}
										className="btn btn-sm btn-warning"
									>
										Upravit
									</Link>
									<button
										onClick={deletee.bind(this, item._id, role)}
										className="btn btn-sm btn-danger"
									>
										Odstranit
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{props.link ? (
				<Link to={'/people/create'} className="btn btn-success">
					Nová osobnost
				</Link>
			) : null}
		</div>
	);
};

export default PersonTable;
