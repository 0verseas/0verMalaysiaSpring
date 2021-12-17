(() => {

	/**
	*	private variable
	*/

	let _systemId = 0;
	let _hasOlympia = false;
	let _hasAdmission = false;
	let _hasPlacement = false;

	/**
	*	cache DOM
	*/
	
	const $previewPersonalDataBtn = $('#btn-previewPersonalData');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	async function _init() {
		loading.start();
		$('.correction-form-link').attr("href",env.baseUrl+"/admission-data-correction-form/malaysia-spring");
		// get progress
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
			} else{
				$previewPersonalDataBtn.attr('href', env.baseUrl + '/malaysia-spring/admission-paper/department-apply-form');
			}
			loading.complete();
		})
		.catch((err) => {
			console.error(err);
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
		});
	}
})();
