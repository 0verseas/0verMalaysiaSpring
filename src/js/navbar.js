(() => {

	/**
	*	cache DOM
	*/
	const $logoutBtn = $('#btn-logout');
	const $mailResendBtn = $('#btn-mailResend');
	const $checkBtn = $('#btn-all-set');
	const $afterConfirmZone = $('#afterConfirmZone');

	/**
	* init
	*/
	// get progress
	// student.getStudentRegistrationProgress()
	// .then((res) => {
	// 	if (res.ok) {
	// 		return res.json();
	// 	} else {
	// 		throw res;
	// 	}
	// })
	// .then((json) => {
	// 	!!json || location.replace('./');
	// 	_setEmailVerifyAlert(json);
	// 	// _setProgress(json);
	// 	_setHeader(json);
	// 	// _checkConfirm(json);
	// })
	// .catch((err) => {
	// 	console.error(err);
    //     if (err.status && err.status === 401) {
    //         alert('請登入。');
    //         location.href = "./index.html";
    //     } else {
    //         err.json && err.json().then((data) => {
    //             console.error(data);
    //             alert(`ERROR: \n${data.messages[0]}`);
    //         })
    //     }
	// });

	/**
	*	bind event
	*/
	$logoutBtn.on('click', _handleLogout);
	$mailResendBtn.on('click', _handleResendMail);
	$checkBtn.on('click', _checkAllSet);

	function _handleLogout() {
		loading.start();
		student.logout()
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			alert('登出成功。');
			location.href="./index.html";
			loading.complete();
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			})
			loading.complete();
		})
	}

	function _handleResendMail() {
		loading.start();
		student.resendEmail()
		.then((res) => {
			if(res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((data) => {
			alert('已寄出驗證信，請至填寫信箱查看。');
			loading.complete();
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
			});
			loading.complete();
		})
	}

	function _setEmailVerifyAlert(data) {
		if (!data.email_verified) {
			$('.alert-emailVerify').show();
		}
	}

	function _setProgress(data) {
		// 資格驗證
		// if (!!data.student_qualification_verify) {
		// 	$('.nav-systemChoose').addClass('list-group-item-success');
		// 	const systemID = data.student_qualification_verify.system_id;
		// 	if (+systemID === 1) {
		// 		$('.nav-educationInfo, .nav-olympia, .nav-grade, .nav-placementSelection').show();
		// 	}
		// }

		// 個人基本資料
		// !!data.student_personal_data && $('.nav-personalInfo').addClass('list-group-item-success');

		// 分發成績採計方式
		// !!data.student_department_admission_placement_apply_way && $('.nav-grade').addClass('list-group-item-success');

		// 分發志願
		// !!data.student_department_admission_placement_order && $('.nav-placementSelection').addClass('list-group-item-success');

		// if (!data.student_department_admission_placement_apply_way) {
		// 	// 學生沒有填聯合分發採計方式時，「聯合分發志願」出現提示訊息（請先選擇聯合分發採計方式）
		// 	$('.nav-placementSelection').addClass('disabled');
		// 	$('.nav-placementSelection').addClass('show-grade-first');
		// 	$('.nav-placementSelection').click(function(e){e.preventDefault();});
		// } else {
		// 	// 學生有填聯合分發採計方式，但沒有在聯合分發期間期間時，「聯合分發志願」出現提示訊息（聯合分發已截止）
		// 	$('.nav-placementSelection').addClass('disabled');
		// 	$('.nav-placementSelection').addClass('show-placement-deadline');
		// 	$('.nav-placementSelection').click(function(e){e.preventDefault();});
		// }

		// }
	}

	function _setHeader(data) {
		student.setHeader({
			id: (data.user_id).toString().padStart(6, "0")
		});
	}

	function _checkAllSet() {
		var isAllSet = confirm("確認後就「無法再次更改資料」，您真的確認送出嗎？");
		if (isAllSet === true) {
			const data = {
				"confirmed": true
			};
			student.dataConfirmation(data)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				// console.log(json);
				alert("成功確認資料。\n如果需要再修改資料請利用「資料修正表」，或是重新申請一組新的帳號。");
				location.href = "./downloadDocs.html";
				loading.complete();
			})
			.catch((err) => {
				if (err.status && err.status === 401) {
					alert('請登入。');
					location.href = "./index.html";
				} else {
					err.json && err.json().then((data) => {
						console.error(data);
						alert(`ERROR: \n${data.messages[0]}`);
					})
				}
				loading.complete();
			});
		}
	}

	function  _checkConfirm(json) {
		if (!!json.student_misc_data.confirmed_at) {
			$('#btn-all-set').removeClass('btn-danger').addClass('btn-success').prop('disabled', true).text('已填報') && $afterConfirmZone.show();
		} else if (!json.student_qualification_verify) {
			// 沒有輸入資格驗證的狀況下，隱藏提交按鈕
			$('#btn-all-set').addClass('hide');
		} else if (json.student_qualification_verify.system_id === 1 && !json.student_department_admission_placement_apply_way) {
			// 學士班，聯合分發成績採計方式未填寫者，確認提交按鈕消失
			$('#btn-all-set').addClass('hide');
		} else if (json.student_qualification_verify.system_id !== 1 && !json.student_personal_data) {
			// 學士班以外其它學制，個人基本資料未填寫者，確認提交按鈕消失
			$('#btn-all-set').addClass('hide');
		} else if (!json.can_admission_selection && !json.can_admission_placement) {
			// 還沒有填報，且不在報名個人申請、聯合分發的期間，不能點送出填報按鈕
			$('#btn-all-set').prop('disabled', true).text('目前不是可報名時間');
		}
	}

})();
