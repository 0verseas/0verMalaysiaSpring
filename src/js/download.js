(() => {

	/**
	*	cache DOM
	*/

	const $memo = $('#memo');

	let personalData='';

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
				alert('請先完成資格檢視');
				location.href = './qualify.html';
			} else if(!json.has_personal_info) {
				alert('請先填寫個人基本資料');
				location.href = './personalInfo.html';
			} else if(!json.has_apply_way) {
				alert('請先選擇成績採計方式');
				location.href = './grade.html';
			} else if(!json.has_admission) {
				alert('請先選擇分發志願類組');
				location.href = './admission.html';
			} else if(json.confirmed_at == null){
				alert('尚未完成填報，資料確認不須更改後，請按下「完成填報」按鈕。');
				location.href = './result.html';
			}
			loading.complete();
		})
		.then(() => {
			$('#btn-smart').attr('href', env.baseUrl + '/malaysia-spring/print-admission-paper');
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

})();
