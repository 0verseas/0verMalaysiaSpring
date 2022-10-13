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
			swal({title: `請選擇您的成績採計方式`, type:`error`, confirmButtonText: '確定', allowOutsideClick: false});
			return;
		}

		let data = {
			apply_way: id,
			my_admission_ticket_no: null
		};

		if (+id === 1) {
			if(!ticket_no){
				swal({title: `請填寫你的准考證號碼`, type:`error`, confirmButtonText: '確定', allowOutsideClick: false});
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
		.then(async() => {
			await swal({title:"儲存成功", type:"success", confirmButtonText: '確定'});

			student.getStudentRegistrationProgress()
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				if(json.is_opening){
					location.href = "./admission.html"
				} else {
					window.location.reload();
				}
			})
			.then(() => {
                loading.complete();
            })
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href = "./index.html";
				});
			}
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
				swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
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
				swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href = "./index.html";
				});
			} else if (err.status && err.status === 403) {
				err.json && err.json().then((data) => {
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false})
					.then(()=> {
						if(data.messages[0] === '請先完成資格檢視'){
							location.href = "./qualify.html";
						}else if(data.messages[0]==='請先完成個人基本資料填寫'){
							location.href = "./personalInfo.html";
						}else{
							location.href = "./result.html";
						}
					});
				})
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
				})
			}
			loading.complete();
		});
	}
})();
