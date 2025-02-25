import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import { IoCloseCircle, IoHomeOutline } from 'react-icons/io5';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';
import { AppContext } from '../../contexts/AppContext';
import { RahatService } from '../../services/chain';
import DataService from '../../services/db';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import AppHeader from '../layouts/AppHeader';
import { Link } from 'react-router-dom';
import { getAuthSignature } from '../../utils';
import * as Service from '../../services';
import Avatar from '../../assets/images/Man.png';

const RegisterBeneficiary = () => {
	const history = useHistory();
	const {
		phone,
		setBeneficiaryToken,
		name,
		token,
		resetBeneficiary,
		addBeneficiary,
		address,
		govt_id,
		photo,
		govt_id_image
	} = useContext(RegisterBeneficiaryContext);
	const { wallet, toggleFooter } = useContext(AppContext);
	const [loading, showLoading] = useState(null);
	const [remainingToken, setRemainingToken] = useState('loading...');

	const updateBeneficiaryData = e => {
		let formData = new FormData(e.target.form);

		let tokenAmount = formData.get('token');
		setBeneficiaryToken(tokenAmount);
	};

	const save = async e => {
		e.preventDefault();
		showLoading('Issuing Tokens..');
		try {
			const signature = await getAuthSignature(wallet);
			const benExists = await Service.getBeneficiaryById(signature, phone);
			const agency = await DataService.getDefaultAgency();
			const project = await DataService.getDefaultProject();
			const rahat = RahatService(agency.address, wallet);

			if (!benExists) {
				const ben = await addBeneficiary(signature);
				if (!ben) {
					Swal.fire('Error', 'Invalid Beneficiary, Please enter valid details.', 'error');
					return;
				}
				let beneficiary = {
					name: name,
					address: address || null,
					phone: phone || null,
					govt_id: govt_id || null,
					photo: photo,
					govt_id_image: govt_id_image,
					createdAt: Date.now()
					//	id,name,location,phone,age,gender,familySize,address,createdAt
				};
				await DataService.addBeneficiary(beneficiary);
			}

			let receipt = await rahat.issueToken(project.id, phone, token);
			const tx = {
				hash: receipt.transactionHash,
				type: 'issued',
				timestamp: Date.now(),
				amount: token,
				to: phone,
				from: wallet.address,
				status: 'success'
			};

			await DataService.addTx(tx);
			if (receipt) showLoading(null);
			Swal.fire('Success', 'Tokens Issued to Beneficiary', 'success');
			resetBeneficiary();
			history.push('/');
		} catch (e) {
			showLoading(null);
			Swal.fire('Error', 'Unable To Issue Token', 'error');
			throw Error(e);
		}
		//return addBeneficiary(signature);
	};

	const updateTokenDetails = useCallback(async () => {
		const agency = await DataService.getDefaultAgency();
		const rahat = RahatService(agency.address, wallet);
		const remainingToken = await rahat.getBeneficiaryToken(phone);
		setRemainingToken(remainingToken);
	}, [phone, wallet]);

	useEffect(() => {
		// (async () => {
		// 	const agency = await DataService.getDefaultAgency();
		// 	const rahat = RahatService(agency.address, wallet);
		// 	const remainingToken = await rahat.getBeneficiaryToken(phone);
		// 	setRemainingToken(remainingToken);
		// })();
		updateTokenDetails();
		return () => {
			toggleFooter(false);
		};
	}, [updateTokenDetails, toggleFooter]);

	return (
		<>
			<AppHeader
				currentMenu="Beneficiaries"
				actionButton={
					<Link to="/" className="headerButton">
						<IoHomeOutline className="ion-icon" />
					</Link>
				}
			/>

			{loading !== null && (
				<div
					style={{
						height: '850px',
						position: 'absolute',
						color: '#ffffff',
						fontSize: 16,
						backgroundColor: '#000',
						opacity: 0.7,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 1000,
						left: 0,
						top: 0,
						right: 0,
						bottom: 0
					}}
				>
					<div className="text-center">
						<img
							src="/assets/img/brand/icon-white-128.png"
							alt="icon"
							className="loading-icon"
							style={{ width: 30 }}
						/>
						<br />
						<div className="mt-1">{loading}</div>
					</div>
				</div>
			)}

			<div id="appCapsule">
				<div className="section mt-2 text-center">
					<h2 className="mt-3">Issue Token</h2>
					<span>Enter Amount to Issue Token</span>
					<br />
					<div className="mt-3">
						{photo ? (
							<img className="video-flipped selfie" alt="preview" src={photo} />
						) : (
							<img
								className="video-flipped selfie "
								alt="preview"
								src={Avatar}
								width="100px"
								height="100px"
							/>
						)}
					</div>
				</div>

				<div className="section pt-0 p-3">
					<div>
						<ul className="listview flush transparent simple-listview no-space mt-3">
							<li>
								<strong>Name</strong>
								<span>{name}</span>
							</li>
							<li>
								<strong>Phone</strong>
								<span style={{ overflow: 'hidden' }}>{phone}</span>
							</li>
							<li>
								<strong>Token Balance</strong>
								<h3 className="m-0">{remainingToken}</h3>
							</li>
						</ul>

						<Form onSubmit={save}>
							<div className="card mt-3">
								<div className="card-body">
									<div className="form-group basic">
										<div className="input-wrapper">
											<Form.Control
												type="number"
												name="token"
												className="form-control"
												placeholder="Issue Tokens"
												value={token}
												onChange={updateBeneficiaryData}
												required
											/>
											<i className="clear-input">
												<IoCloseCircle className="ion-icon" />
											</i>
										</div>
									</div>
								</div>
							</div>
							<div className="">
								<Button type="submit" className="btn btn-lg btn-block btn-success mt-3">
									Issue Token
								</Button>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</>
	);
};

export default RegisterBeneficiary;
