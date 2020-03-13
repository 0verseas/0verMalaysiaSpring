(() => {
	/**
	*	private variable
	*/


	const smoothScroll = (number = 0, time) => {
		if (!time) {
			document.body.scrollTop = document.documentElement.scrollTop = number;
			return number;
		}
		const spacingTime = 20; // 動畫循環間隔
		let spacingInex = time / spacingTime; // 計算動畫次數
		let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 擷取當前scrollbar位置
		let everTop = (number - nowTop) / spacingInex; // 計算每次動畫的滑動距離
		let scrollTimer = setInterval(() => {
			if (spacingInex > 0) {
				spacingInex--;	
				smoothScroll(nowTop += everTop); //在動畫次數結束前要繼續滑動
			} else {
				clearInterval(scrollTimer); // 結束計時器
			}
		}, spacingTime);
	};

	/**
	* init
	*/
	function _init() {
		loading.complete();
		_setData();

		// get data
		// student.getVerifyQualification().then((res) => {
		// 	if (res.ok) {
		// 		return res.json();
		// 	} else {
		// 		throw res;
		// 	}
		// })
		// .then((json) => {
		// 	console.log(json);
		// 	if (json && json.student_qualification_verify && json.student_qualification_verify.identity) {
		// 		_savedIdentity = json.student_qualification_verify.identity;
		// 		if (json.student_qualification_verify.system_data && json.student_qualification_verify.system_data.id) {
		// 			_savedSystem = json.student_qualification_verify.system_data.id;
		// 		}

		// 		+json.student_qualification_verify.system_id === 1 && _setData(json.student_qualification_verify);
		// 	}
		// })
		// .then(() => {
		// 	loading.complete();
		// })
		// .catch((err) => {
		// 	if (err.status && err.status === 401) {
		// 		alert('請登入。');
		// 		location.href = "./index.html";
		// 	} else {
		// 		err.json && err.json().then((data) => {
		// 			console.error(data);
		// 			alert(`ERROR: \n${data.messages[0]}`);
		// 		})
		// 	}
		// 	loading.complete();
		// });
		if(document.body.scrollWidth<768)  // 判別網頁寬度 少於768會今入單欄模式
		smoothScroll(document.body.scrollHeight/2.2,800);  // 用整體長度去做計算  滑動到需要填寫欄位位置
	}

	/**
	*	cache DOM
	*/
	const $signUpForm = $('#form-signUp');
	const $saveBtn = $signUpForm.find('.btn-save');

	// 海外僑生
	const $isDistribution = $signUpForm.find('.isDistribution');
	const $distributionMoreQuestion = $signUpForm.find('.distributionMoreQuestion');
	const $stayLimitRadio = $signUpForm.find('.radio-stayLimit');
	const $hasBeenTaiwanRadio = $signUpForm.find('.radio-hasBeenTaiwan');
	const $whyHasBeenTaiwanRadio = $signUpForm.find('.radio-whyHasBeenTaiwan');
	const $ethnicChineseRadio = $signUpForm.find('.radio-ethnicChinese');
	const $distributionTime = $('#distributionTime');

	/**
	*	init
	*/
	$signUpForm.find('.question.kangAo').removeClass('hide');

	/**
	*	bind event
	*/
	// $identityRadio.on('change', _handleChangeIdentity);
	$saveBtn.on('click', _handleSave);

	// 海外僑生
	$isDistribution.on('change', _switchShowDistribution);
	$distributionMoreQuestion.on('change', _checkDistributionValidation);
	$stayLimitRadio.on('change', _checkStayLimitValidation);
	$hasBeenTaiwanRadio.on('change', _checkHasBeenTaiwanValidation);
	$whyHasBeenTaiwanRadio.on('change', _checkWhyHasBeenTaiwanValidation);
	$ethnicChineseRadio.on('change',_checkEthnicChineseValidation);
	$distributionTime.on('blur',_handleDistributionTime)

	/**
	*	event handler
	*/

	// 儲存
	function _handleSave() {
		// 海外僑生
		const isDistribution = +$signUpForm.find('.isDistribution:checked').val();
		const distributionTime = $signUpForm.find('.input-distributionTime').val();
		const distributionOption = +$signUpForm.find('.distributionMoreQuestion:checked').val();
		const stayLimitOption = +$signUpForm.find('.radio-stayLimit:checked').val();
		const hasBeenTaiwan = +$signUpForm.find('.radio-hasBeenTaiwan:checked').val();
		const hasBeenTaiwanOption = +$signUpForm.find('.radio-whyHasBeenTaiwan:checked').val();
		const ethnicChinese = +$signUpForm.find('.radio-ethnicChinese:checked').val();
		const invalidDistributionOption = [3, 4, 5, 6];
		if (!!isDistribution && invalidDistributionOption.includes(distributionOption)) return alert('分發來台選項不具報名資格');
		if (!!isDistribution && distributionTime === '') return alert('未填寫分發來台年份或填寫格式不正確');
		if (stayLimitOption === 1) return alert('海外居留年限選項不具報名資格');
		if (!!hasBeenTaiwan && hasBeenTaiwanOption === 9) return alert('在台停留選項不具報名資格');
		if (ethnicChinese === 0) return alert('非華裔者不具報名資格');
		console.log(`是否曾經分發來臺就學過？ ${!!isDistribution}`);
		console.log(`曾分發來臺於西元幾年分發來台？ ${distributionTime}`);
		console.log(`曾分發來臺請就下列選項擇一勾選 ${distributionOption}`);
		console.log(`海外居留年限 ${stayLimitOption}`);
		console.log(`報名截止日往前推算僑居地居留期間內，是否曾在某一年來臺停留超過 120 天？ ${!!hasBeenTaiwan}`);
		console.log(`在台停留日期請就下列選項，擇一勾選，並檢附證明文件： ${hasBeenTaiwanOption}`);
		console.log(`是否為華裔者： ${ethnicChinese}`);

		// loading.start();
		// student.verifyQualification({
		// 	system_id: 1,
		// 	identity: 3,
		// 	has_come_to_taiwan: !!isDistribution,
		// 	come_to_taiwan_at: distributionTime,
		// 	reason_selection_of_come_to_taiwan: distributionOption,
		// 	overseas_residence_time: stayLimitOption,
		// 	stay_over_120_days_in_taiwan: !!hasBeenTaiwan,
		// 	reason_selection_of_stay_over_120_days_in_taiwan: hasBeenTaiwanOption,
		// 	is_ethnic_Chinese: ethnicChinese,
		// 	force_update: true // TODO:
		// })
		// .then((res) => {
		// 	if (res.ok) {
		// 		return res.json();
		// 	} else {
		// 		throw res;
		// 	}
		// })
		// .then((json) => {
		// 	console.log(json);
		// 	window.location.href = './personalInfo.html';
		// 	loading.complete();
		// })
		// .catch((err) => {
		// 	err.json && err.json().then((data) => {
		// 		console.error(data);
		// 		alert(`ERROR: \n${data.messages[0]}`);
		// 	})
		// 	loading.complete();
		// });
	}
	

	// 判斷是否分發來台就學的一推選項是否符合資格
	function _checkDistributionValidation() {
		const $this = $(this);
		const option = +$this.val();
		const validOption = [1, 2];
		$signUpForm.find('.distributionMoreAlert').hide();
		if (validOption.includes(option)) {
			$signUpForm.find('.distributionMoreAlert.valid').fadeIn();
		} else {
			$signUpForm.find('.distributionMoreAlert.invalid').fadeIn();
		}
	}

	// 海外居留年限判斷
	function _checkStayLimitValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.stayLimitAlert').hide();
		if (option===1) {
				$signUpForm.find('.stayLimitAlert.invalid').fadeIn();
		}
	}

	// 為何在台超過一百二十天
	function _checkWhyHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		$('.whyHasBeenTaiwanAlert').hide();
		if (option === 9) {
			$('.whyHasBeenTaiwanAlert.invalid').fadeIn();
		} else {
			$('.whyHasBeenTaiwanAlert.valid').fadeIn();
		}
	}

	// 是否為華裔學生
	function _checkEthnicChineseValidation() {
		const $this = $(this);
		const ethnicChinese = +$this.val();
		!!ethnicChinese && $signUpForm.find('.ethnicChineseAlert.invalid').fadeOut();
		!!ethnicChinese || $signUpForm.find('.ethnicChineseAlert.invalid').fadeIn();
	}

	function _switchShowDistribution() {
		const $this = $(this);
		const isDistribution =  +$this.val();
		!!isDistribution && $signUpForm.find('#distributionMore').fadeIn();
		!!isDistribution || $signUpForm.find('#distributionMore').fadeOut();
	}

	function _checkHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		!!option && $signUpForm.find('.question.overseas .hasBeenTaiwanQuestion').fadeIn();
		!!option || $signUpForm.find('.question.overseas .hasBeenTaiwanQuestion').fadeOut();
	}

	//處理分發來台年限
	function _handleDistributionTime(){
		let inputTime = $distributionTime[0].valueAsNumber; 

		if(inputTime){
			inputTime = Math.floor(inputTime); //先無條件捨去
			if(inputTime > $distributionTime[0].max){
				inputTime = $distributionTime[0].max;
			} else if(inputTime < $distributionTime[0].min){
				inputTime = $distributionTime[0].min;
			}
			$distributionTime[0].valueAsNumber = inputTime;
		} else {
			$distributionTime[0].value = '';
		}
	}

	/**
	*	private method
	*/

	function _setData(data) {
		
			// 海外僑生
			// 曾分發來臺
			!!data.has_come_to_taiwan &&
			$signUpForm.find('.isDistribution[value=1]').trigger('click') &&
			$signUpForm.find('.input-distributionTime').val(data.come_to_taiwan_at).trigger('change') &&
			$signUpForm.find(`.distributionMoreQuestion[value=${data.reason_selection_of_come_to_taiwan}]`).trigger('click');

			// 是否華裔學生
			!!data.is_ethnic_Chinese && $signUpForm.find('.radio-ethnicChinese[value=1]').trigger('click');

			// 海外居留年限
			$signUpForm.find(`.radio-stayLimit[value=${data.overseas_residence_time}]`).trigger('click');

			// 在台停留日期
			!!data.stay_over_120_days_in_taiwan &&
			$signUpForm.find('.radio-hasBeenTaiwan[value=1]').trigger('click') &&
			$signUpForm.find(`.radio-whyHasBeenTaiwan[value=${data.reason_selection_of_stay_over_120_days_in_taiwan}]`).trigger('click');
	}
	_init();
})();
