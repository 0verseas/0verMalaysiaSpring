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

	// function getAdmissionCountDetail() {
	// 	return fetch(baseUrl + `/students/admission-count/detail`, {
	// 		method: 'GET'
	// 	});
	// }

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

	// function getDeptApplicationDoc(schoolId, system, deptId) { // 接系所資料（暫時用在「上傳備審資料」上）
	// 	return fetch(baseUrl + `/schools/` + schoolId + `/systems/` + system + `/departments/` + deptId, {
	// 		method: 'GET'
	// 	});
	// }

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

	// function getStudentEducationInfoData() {
	// 	return fetch(baseUrl + `/students/education-background`, {
	// 		method: 'GET',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		credentials: 'include'
	// 	})
	// }

	// function setStudentEducationInfoData(data) {
	// 	return fetch(baseUrl + `/students/education-background`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(data),
	// 		credentials: 'include'
	// 	})
	// }

	// function getOrderList(type) {
	// 	return fetch(baseUrl + `/students/admission-order-list?type=` + type, {
	// 		method: 'GET',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		credentials: 'include'
	// 	})
	// }

	// function getEducationFile() {
	// 	var urls = [
	// 	baseUrl + '/students/diploma',
	// 	baseUrl + '/students/transcripts',
	// 	baseUrl + '/students/registration-progress'
	// 	]
	// 	const grabContent = url => fetch(url, {
	// 		method: 'GET',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		credentials: 'include'
	// 	})
	// 	return Promise.all(urls.map(grabContent))
	// }

	// function uploadEducationFile(type, data) {
	// 	return fetch(baseUrl + `/students/` + type, {
	// 		method: 'POST',
	// 		body: data,
	// 		credentials: 'include'
	// 	});
	// }

	// function deleteEducationFile(type, fileName) {
	// 	return fetch(baseUrl + `/students/` + type + `/` + fileName, {
	// 		method: 'DELETE',
	// 		credentials: 'include'
	// 	});
	// }

	// function getAdmissionSelectionOrder() {
	// 	var urls = [
	// 	baseUrl + '/students/admission-selection-order',
	// 	baseUrl + '/students/admission-order-list?type=selection'
	// 	]
	// 	const grabContent = url => fetch(url, {
	// 		method: 'GET',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		credentials: 'include'
	// 	})
	// 	return Promise.all(urls.map(grabContent))
	// }

	// function getAdmissionSelectionWishOrder() {
	// 	return fetch(baseUrl + `/students/admission-selection-order`, {
	// 		method: 'GET',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		credentials: 'include'
	// 	})
	// }

	// function setAdmissionSelectionOrder(data) {
	// 	return fetch(baseUrl + `/students/admission-selection-order`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(data),
	// 		credentials: 'include'
	// 	})
	// }

	// // POST /malaysia-spring/verify-qualification
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

	// function getStudentAvailableApplyWayList() {
	// 	return fetch(baseUrl + `/students/available-apply-way`, {
	// 		method: 'GET',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		credentials: 'include'
	// 	})
	// }

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
		var urls = [
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

	// function setReviewItem({ student_id, dept_id, type_id, data }) {
	// 	return fetch(`${baseUrl}/students/${student_id}/admission-selection-application-document/departments/${dept_id}/types/${type_id}/files`, {
	// 		method: 'POST',
	// 		body: data,
	// 		credentials: 'include'
	// 	})
	// }

	// function getReviewItem({ student_id, dept_id, type_id }) {
	// 	return new Promise((resolve, reject) => {
	// 		fetch(`${baseUrl}/students/${student_id}/admission-selection-application-document/departments/${dept_id}/types/${type_id}/files`, {
	// 			method: 'GET',
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			credentials: 'include'
	// 		})
	// 		.then((res) => {
	// 			if (res.ok) {
	// 				resolve(res.json());
	// 			} else {
	// 				reject(res);
	// 			}
	// 		})
	// 	})
	// }

	// function delReviewItem({ student_id, dept_id, type_id, filename }) {
	// 	return fetch(`${baseUrl}/students/${student_id}/admission-selection-application-document/departments/${dept_id}/types/${type_id}/files/${filename}`, {
	// 		method: 'Delete',
	// 		credentials: 'include'
	// 	})
	// }

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

	// function uploadAndSubmit() {
	// 	return fetch(baseUrl + `/students/admission-selection-application-document-lock`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			confirmed: true
	// 		}),
	// 		credentials: 'include'
	// 	})
	// }

	// 學生想要查榜，去後端看榜單
	function getAdmissionRoster(stage, name, birthday, gender) {
		return fetch(`${baseUrl}/students/search-admission-roster/${name}/${stage}/${birthday}/${gender}/result`, {
			method: 'GET',
			credentials: 'include'
		})
	}

	//檔案大小計算是否超過 limit MB
	function sizeConversion(size,limit) {
		let maxSize = limit*1024*1024;

		return size >=maxSize;
	}

	return {
		setHeader,
		getAdmissionCount,
		// getAdmissionCountDetail,
		getCountryList,
		getSchoolList,
		register,
		isLogin,
		login,
		logout,
		verifyEmail,
		resendEmail,
		// getDeptApplicationDoc,
		sendResetPassword,
		resetPassword,
		checkResetPasswordToken,
		getStudentPersonalData,
		setStudentPersonalData,
		// getStudentEducationInfoData,
		// setStudentEducationInfoData,
		// getOrderList,
		// getEducationFile,
		// uploadEducationFile,
		// deleteEducationFile,
		// getAdmissionSelectionOrder,
		// getAdmissionSelectionWishOrder,
		// setAdmissionSelectionOrder,
		verifyQualification,
		getVerifyQualification,
		// getStudentAvailableApplyWayList,
		getStudentAdmissionPlacementApplyWay,
		setStudentAdmissionPlacementApplyWay,
		getStudentRegistrationProgress,
		getPlacementSelectionOrder,
		setPlacementSelectionOrder,
		getOrderResultList,
		dataConfirmation,
		// setReviewItem,
		// getReviewItem,
		// delReviewItem,
		// uploadAndSubmit,
		// SecondPlacementSelectionOrder,
		getAdmissionRoster,
		sizeConversion,
	};

})();
