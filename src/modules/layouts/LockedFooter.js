import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { IoLockClosed } from 'react-icons/io5';

import Loading from '../global/Loading';
import Wallet from '../../utils/blockchain/wallet';
import DataService from '../../services/db';
import { AppContext } from '../../contexts/AppContext';
import * as Service from '../../services';
import { RahatService } from '../../services/chain';

export default function LockedFooter() {
	let history = useHistory();
	const { setWallet, setProject, setTotalBeneficiaries, agency } = useContext(AppContext);
	const [loadingModal, setLoadingModal] = useState(false);

	const checkProjectBeneficiaries = useCallback(async () => {
		const totalBen = await DataService.listBeneficiaries();
		setTotalBeneficiaries(totalBen.length);
	}, [setTotalBeneficiaries]);

	const checkMobilizerStatus = useCallback(
		async wallet => {
			//update API to only query relevant agency.
			if (!wallet) return;

			const data = await Service.getMobilizerByWallet(wallet.address);
			let defaultAgency = await DataService.getDefaultAgency();
			if (data && data.projects.length) {
				//	setProject({ name: data.projects[0].project.name, id: data.projects[0].project.id });
				await checkProjectBeneficiaries(wallet, data.projects[0].project.id);
				RahatService(defaultAgency.address, wallet)
					.getProjectBalance(data.projects[0].project.id)
					.then(bal => {
						setProject({
							name: data.projects[0].project.name,
							id: data.projects[0].project.id,
							balance: bal
						});
					});
			}
			if (!data.agencies.length) return history.push('/setup/idcard');
			let status = data.agencies[0].status;

			if (status !== 'active') {
				let dagency = Object.assign(agency, { isApproved: false });
				await DataService.updateAgency(dagency.address, dagency);
				history.push('/setup/pending');
			}
		},
		[agency, checkProjectBeneficiaries, history, setProject]
	);

	const handleUnlockClick = useCallback(async () => {
		setLoadingModal(true);
		let profile = await DataService.get('profile');
		// const wallet = await Wallet.loadFromPrivateKey(
		// 	'0x387e176cf5a5016a38f552abc0c3370a733a4f232061957d76d8f5e9a8b0b729'
		// );
		if (profile) {
			let encryptedWallet = await DataService.getWallet();
			const wallet = await Wallet.loadFromJson(profile.phone, encryptedWallet);
			setWallet(wallet);
			await checkMobilizerStatus(wallet);
		}
		history.push('/');
		setLoadingModal(false);
	}, [checkMobilizerStatus, setWallet, history]);

	useEffect(() => {
		const timer = setTimeout(() => {
			handleUnlockClick();
		}, 1000);
		return () => clearTimeout(timer);
	}, [handleUnlockClick]);

	return (
		<>
			<Loading message="Unlocking your wallet. Please wait..." showModal={loadingModal} />
			<div className="footer-locked">
				<div className="appBottomMenu">
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
					<a
						title="Tap here to unlock"
						href="#screen"
						className="item"
						id="btnUnlock"
						onClick={handleUnlockClick}
					>
						<div className="col">
							<div className="action-button large">
								<IoLockClosed className="ion-icon" />
							</div>
						</div>
					</a>
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
				</div>
			</div>
		</>
	);
}
