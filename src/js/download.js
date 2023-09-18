(() => {

	/**
	*	cache DOM
	*/

	/**
	*	init
	*/
	loading.complete();
	_init();

	/**
	*	bind event
	*/

	async function _init() {
		$('.correction-form-link').attr("href",env.baseUrl+"/admission-data-correction-form/malaysia-spring");
		student.getStudentRegistrationProgress()
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			if(!json.has_qualify) {
				// alert('請先完成資格檢視');
				swal({title:`請先完成資格檢視`, type: `error`, confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=> {
					location.href = './qualify.html';
				});
			} else if(!json.has_personal_info) {
				// alert('請先填寫個人基本資料');
				swal({title:`請先填寫個人基本資料`, type: `error`, confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=> {
					location.href = './personalInfo.html';
				});
			} else if(!json.has_apply_way) {
				// alert('請先選擇成績採計方式');
				swal({title:`請先選擇成績採計方式`, type: `error`, confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=> {
					location.href = './grade.html';
				});
			} else if(!json.has_admission) {
				// alert('請先選擇分發志願類組');
				swal({title:`請先選擇分發志願類組`, type: `error`, confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=> {
					location.href = './admission.html';
				});
			} else if(json.confirmed_at == null){
				// alert('尚未確認並鎖定報名基本資料，資料確認不須更改後，請按下「確認並鎖定報名基本資料」按鈕。');
				swal({title:`尚未確認並鎖定報名基本資料，資料確認不須更改後，請按下「確認並鎖定報名基本資料」按鈕。`, type: `error`, confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=> {
					location.href = './result.html';
				});
			}
			loading.complete();
		})
		.then(() => {
			$('#btn-smart').attr('href', env.baseUrl + '/malaysia-spring/print-admission-paper');
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href = "./index.html";
				});
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
