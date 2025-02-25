import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { IoWalletOutline } from 'react-icons/io5';

import DataService from '../../services/db';
import PackageJson from '../../../package.json';

export default function Main() {
	const history = useHistory();
	const hasWallet = async () => {
		const wallet = await DataService.getWallet();
		if (wallet != null) {
			history.push('/');
		}
	};

	hasWallet();

	return (
		<>
			<div className="item p-2">
				<div className="text-center p-3 mb-3">
					<img src="/assets/img/brand/logo-512.png" alt="alt" width="200" />
				</div>
				<h2>राहत अधिकृत परिचालनकर्ता</h2>
				<p>
					राहत कार्यक्रममा भाग लिनु भएकोमा धन्यवाद। कोरोना भाइरसको निषेधाज्ञाबाट पिडितहरुलाई राहतको धेरै खाँचो
					छ। देश विदेशका दाताबाट राहत बाडिएको छ। उहाँहरुको सहयोग खेरा नजान यो सिस्टम बनाइएको हो। यो आधुनिक
					सिस्टमबाट राहत बाड्न सहज र पारदर्सी हुन्छ। हजुर परिचालनकर्ताको लागि भनेर यो छुटै App बनाइएको हो। यो
					App को माध्यमबाट तपाइले राहत वितरण गर्नु सक्नुहुने छ।
				</p>
				<p>आउनुहोस तपाईंलाई Register गरौ। </p>
				<div className="p-2">
					<Link
						to="/setup/profile"
						id="btnSetupWallet"
						type="button"
						className="btn btn-lg btn-block btn-primary mt-3"
					>
						<IoWalletOutline className="ion-icon" aria-label="Restore Using Google" />
						Register as Social Mobilizer
					</Link>
					{/* <Link
						to="/setup/profile"
						id="btnSetupWallet"
						type="button"
						className="btn btn-lg btn-block btn-danger mt-3"
					>
						<IoLogoGoogle className="ion-icon" aria-label="Restore Using Google" />
						Register using Google
					</Link> */}
				</div>
				<div className="text-center mt-4">
					<small>Version: {PackageJson.version}</small>
				</div>
			</div>
		</>
	);
}
