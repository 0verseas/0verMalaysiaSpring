const student = (() => {

	const baseUrl = env.baseUrl;

	function setHeader(headerData) {
		const $studentInfoHeader = $('#header-studentInfo');
		const $headerId = $studentInfoHeader.find('#headerId');

		headerData = headerData || {
			id: "重新整理"
		}

		$headerId.html(headerData.id);
	}

	function getAdmissionCount () {
		return fetch(baseUrl + `/malaysia-spring/admission-count`, {
			method: 'GET'
		});
	}

	async function getCountryList() {
		if (localStorage.countryList
			&& localStorage.countryList !== ""
			&& localStorage.countryListExpiration
			&& localStorage.countryListExpiration
			&& localStorage.countryListExpiration > new Date().getTime()) {
			return JSON.parse(localStorage.countryList);
		} else {
			try {
				const response = await fetch(baseUrl + `/country-lists`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
				});
				if (!response.ok) { throw response; }
				const json = await response.json();

				let group_to_values = await json.reduce(function (obj, item) {
					obj[item.continent] = obj[item.continent] || [];
					obj[item.continent].push({id: item.id, country: item.country});
					return obj;
				}, {});

				let groups = await Object.keys(group_to_values).map(function (key) {
					return {continent: key, country: group_to_values[key]};
				});

				localStorage.countryList = JSON.stringify(groups);
                localStorage.countryListExpiration = new Date().getTime() + (1440 * 60 * 1000);
				return groups;
			} catch (e) {
				console.log('Boooom!!');
				console.log(e);
			}
		}
	}

	function getSchoolList(countryId) {
		return fetch(baseUrl + `/overseas-school-lists?country_id=` + countryId, {
			method: 'GET'
		});
	}

	function register(data) {
		return fetch(baseUrl + `/malaysia-spring/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	function isLogin() {
		return fetch(baseUrl + `/malaysia-spring/login`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function login(data) {
		return fetch(baseUrl + `/malaysia-spring/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	function logout() {
		return fetch(baseUrl + `/malaysia-spring/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function verifyEmail(email, token) {
		return fetch(baseUrl + `/malaysia-spring/verify-email/${email}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({ token })
		})
	}

	function resendEmail() {
		return fetch(baseUrl + `/malaysia-spring/verify-email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function sendResetPassword(data) {
		return fetch(baseUrl + `/malaysia-spring/reset-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	}

	function resetPassword(data, email) {
		return fetch(baseUrl + `/malaysia-spring/reset-password/` + email, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	}

	function checkResetPasswordToken(email, token) {
		return fetch(baseUrl + `/malaysia-spring/reset-password?email=` + email + `&token=` + token, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}

	function getStudentPersonalData() {
		return fetch(baseUrl + `/malaysia-spring/personal-data`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setStudentPersonalData(data) {
		return fetch(baseUrl + `/malaysia-spring/personal-data`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	// POST /malaysia-spring/verify-qualification
	function verifyQualification(data) {
		return fetch(`${baseUrl}/malaysia-spring/verify-qualification`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	function getVerifyQualification() {
		return fetch(`${baseUrl}/malaysia-spring/verify-qualification`, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});
	}

	function getStudentAdmissionPlacementApplyWay() {
		return fetch(baseUrl + `/malaysia-spring/admission-apply-way`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setStudentAdmissionPlacementApplyWay(data) {
		return fetch(baseUrl + `/malaysia-spring/admission-apply-way`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function getPlacementSelectionOrder() {
		let urls = [
		baseUrl + '/malaysia-spring/admission-order',
		baseUrl + '/malaysia-spring/admission-order-list?type=placement'
		]
		const grabContent = url => fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		return Promise.all(urls.map(grabContent))
	}

	function setPlacementSelectionOrder(data) {
		return fetch(baseUrl + `/malaysia-spring/admission-order`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function getOrderResultList(url) {
		return fetch(baseUrl + url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function getStudentRegistrationProgress() {
		return fetch(baseUrl + `/malaysia-spring/registration-progress`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function dataConfirmation(data) {
		return fetch(baseUrl + `/malaysia-spring/data-confirmation`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}
	//檔案大小計算是否超過 limit MB
	function sizeConversion(size,limit) {
		let maxSize = limit*1024*1024;

		return size >=maxSize;
	}

	function getStudentAdmissionPaperFiles() {
		return fetch(baseUrl + `/malaysia-spring/admission-paper/files/get`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function uploadStudentAdmissionPaperFiles(data, type) {
		return fetch(baseUrl + `/malaysia-spring/admission-paper/upload/${type}`, {
			method: 'POST',
			body: data,
			credentials: 'include'
		})
	}

	function deleteStudentAdmissionPaperFiles(type, name) {
		return fetch(baseUrl + `/malaysia-spring/admission-paper/${type}/${name}`, {
			method: 'DELETE',
			credentials: 'include'
		})
	}

	return {
		setHeader,
		getAdmissionCount,
		getCountryList,
		getSchoolList,
		register,
		isLogin,
		login,
		logout,
		verifyEmail,
		resendEmail,
		sendResetPassword,
		resetPassword,
		checkResetPasswordToken,
		getStudentPersonalData,
		setStudentPersonalData,
		verifyQualification,
		getVerifyQualification,
		getStudentAdmissionPlacementApplyWay,
		setStudentAdmissionPlacementApplyWay,
		getStudentRegistrationProgress,
		getPlacementSelectionOrder,
		setPlacementSelectionOrder,
		getOrderResultList,
		dataConfirmation,
		sizeConversion,
		getStudentAdmissionPaperFiles,
		uploadStudentAdmissionPaperFiles,
		deleteStudentAdmissionPaperFiles
	};

})();
