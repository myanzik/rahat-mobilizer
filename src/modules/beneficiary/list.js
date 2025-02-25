import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoSearchOutline, IoCloseCircleOutline } from 'react-icons/io5';
import DataService from '../../services/db';
import Avatar from '../../assets/images/Man.png';
import * as io5 from 'react-icons/io5';

const BenList = ({ limit, beneficiaries = [] }) => {
	const [ben, setBen] = useState([]);
	const [searchOpen, setSearchOpen] = useState(false);

	function toggleSearch() {
		setSearchOpen(!searchOpen);
	}

	function searchProduct(name) {
		// let params = {
		// 	name
		// };
		// initListProduct(params);
	}

	useEffect(() => {
		(async () => {
			let bens = beneficiaries.length ? beneficiaries : await DataService.listBeneficiaries();
			if (limit) bens = bens.slice(0, limit);
			// for (let b of bens) {

			// 		b.name = `Charge to ${t.from}`;
			// 		t.icon = (
			// 			<div className="icon-box bg-success">
			// 				<GiReceiveMoney className="ion-icon" />
			// 			</div>
			// 		);

			// }
			setBen(bens);
		})();
	}, [beneficiaries, limit]);

	return (
		<>
			{!searchOpen ? (
				<div className="appHeader" style={{ backgroundColor: '#2b7ec1' }}>
					<div className="left">
						<button className=" btn btn-text headerButton ">
							<Link to="/" className="headerButton goBack">
								<io5.IoChevronBackOutline className="ion-icon" style={{ color: 'white' }} />
							</Link>
						</button>
					</div>
					<div className="pageTitle" style={{ color: 'white' }}>
						Beneficiaries
					</div>
					<div className="right">
						<button
							className="btn btn-text headerButton toggle-searchbox"
							onClick={() => toggleSearch()}
							style={{ marginRight: '0px', color: 'white' }}
						>
							<IoSearchOutline className="ion-icon" />
						</button>
					</div>
				</div>
			) : (
				<div className="appHeader" style={{ backgroundColor: '#2b7ec1' }}>
					<form className="search-form pl-2">
						<div className="form-group searchbox">
							<input type="text" className="form-control" onChange={e => searchProduct(e.target.value)} />
							<i className="input-icon">
								<IoSearchOutline className="ion-icon" />
							</i>
							<button
								className="ml-1 close toggle-searchbox btn btn-text headerButton"
								onClick={() => toggleSearch()}
							>
								<IoCloseCircleOutline className="ion-icon" />
							</button>
						</div>
					</form>
				</div>
			)}
			<ul className="listview image-listview flush">
				{ben.length > 0 &&
					ben.map(ben => {
						return (
							<li key={ben.phone}>
								<Link to={`/beneficiary/${ben.phone}`} className="item">
									<div className="beneficiaryList">
										{ben.photo ? (
											<img className="beneficiaryPic" src={ben.photo} alt="profile pic" />
										) : (
											<img className="beneficiaryPic" src={Avatar} alt="profile pic" />
										)}
										<div>
											<div className="mb-1">
												<strong>{ben.name}</strong>
											</div>
											<div className="text-small">
												{/* <Moment date={ben.createdAt} format="YYYY/MM/DD hh:mm a" /> */}
												{ben.phone}
											</div>
										</div>
										{/* {tx.type === 'send' ? (
											<span className="text-danger">{tx.amount}</span>
										) : (
											<span className="text-success">{tx.amount}</span>
										)} */}
									</div>
								</Link>
							</li>
						);
					})}
			</ul>
		</>
	);
};

export default BenList;
