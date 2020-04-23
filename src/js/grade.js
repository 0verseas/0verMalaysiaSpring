(() => {

	/**
	*	cache DOM
	*/

	const $applyWaysFieldSet = $('#apply-ways');
	
	/**
	*	init
	*/
	_init();

	/**
	*	bind event
	*/

	$applyWaysFieldSet.on('change.chooseOption', '.applyOptions', _handleChoose);
	$('.btn-save').on('click', _handleSave);

	/**
	* event handler
	*/

	function _handleChoose() {
		if (+$(this).val() === 1) {
			// code = 01 (華文獨中統考文憑) 要驗證 馬來西亞華文獨中統考准考證號碼
			$('.forCode01').fadeIn();
		} else {
			$('.forCode01').hide();
		}
	}

	async function _handleSave() {
		const id = $('.applyOptions:checked').val();
		const ticket_no = $('.my_admission_ticket_no').val();
		if (!id ) {
			alert('請選擇您欲申請的成績採計方式');
			return;
		}

		let data = {
			apply_way: id,
			my_admission_ticket_no: null
		};

		if (+id === 1) {
			if(!ticket_no){
				alert('請填寫你的准考證號碼');
				return;
			}
			data.my_admission_ticket_no = ticket_no;
		}

		loading.start();

		student.setStudentAdmissionPlacementApplyWay(data).then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then(() => {
			alert("儲存成功");

			location.href = "./admission.html"
			
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			}
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
				alert(data.messages[0]);
			});
			loading.complete();
		});
	}

	function _init() {
		// 取得選擇的選項
		student.getStudentAdmissionPlacementApplyWay()
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			const option = json.apply_way;
			const my_admission_ticket_no = json.my_admission_ticket_no;
			!!option && $(`.applyOptions[value=${option}]`).trigger('click');
			$('.my_admission_ticket_no').val(my_admission_ticket_no || '');
		})
		.then(() => {
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else if (err.status && err.status === 403) {
				err.json && err.json().then((data) => {
					alert(`ERROR: \n${data.messages[0]}\n` + '即將返回上一頁');
					window.history.back();
				})
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		});
	}
})();
