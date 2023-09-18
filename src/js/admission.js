(() => {

	/**
	*	private variable
	*/

	let _filterOptionalWish = []; // 篩選的資料（也是需顯示的資料）
	let _optionalWish = []; // 剩餘可選志願
	let _wishList = []; // 已選擇志願

	// 僑先部 cardCode
	const _nupsList = ["1FFFF", "2FFFF", "3FFFF"];

	/**
	*	cache DOM
	*/
	const $group1QuotaBtn = $('#btn-group1Quota');
	const $group2QuotaBtn = $('#btn-group2Quota');
	const $group3QuotaBtn = $('#btn-group3Quota');
	const $groupSubjects = $('#btn-groupSubjects');
	const $optionFilterSelect = $('#select-optionFilter'); // 「招生校系清單」篩選類別 selector
	const $optionFilterInput = $('#input-optionFilter'); // 關鍵字欄位
	const $manualSearchBtn = $('#btn-manualSearch'); // 手動搜尋按鈕
	const $optionalWishList = $('#optionalWish-list'); // 招生校系清單
	const $paginationContainer = $('#pagination-container'); // 分頁區域
	const $wishList = $('#wish-list'); // 已填選志願
	const wishList = document.getElementById('wish-list'); // 已填選志願，渲染用
	const $saveBtn = $('#btn-save');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$optionFilterSelect.on('change', _generateOptionalWish); // 監聽「招生校系清單」類別選項
	$optionFilterInput.on('keyup', _generateOptionalWish); // // 監聽「招生校系清單」關鍵字
	$manualSearchBtn.on('click', _generateOptionalWish);
	$saveBtn.on('click', _handleSave);

	async function _init() {
		loading.complete();
		$group1QuotaBtn.attr('href', `https://student.overseas.ncnu.edu.tw/quota/?school=all&group=all&keyword=&first-group=true&second-group=false&third-group=false`);
		$group2QuotaBtn.attr('href', `https://student.overseas.ncnu.edu.tw/quota/?school=all&group=all&keyword=&first-group=false&second-group=true&third-group=false`);
		$group3QuotaBtn.attr('href', `https://student.overseas.ncnu.edu.tw/quota/?school=all&group=all&keyword=&first-group=false&second-group=false&third-group=true`);
		$groupSubjects.attr('href', `https://cmn-hant.overseas.ncnu.edu.tw/further-study-area/18-academic-and-subjects-in-taiwan/`);
		try {

			// 使用 jQuery 的 Tooltip
			$(document).tooltip({
				track: true,  // 提示框會隨著滑鼠游標移動
			});

			const response = await student.getPlacementSelectionOrder();
			if (!response[0].ok) { throw response[0]; }

			const resPlacement = await response[0].json();
			const resOrder = await response[1].json();

			const groupName = ["第一類組", "第二類組", "第三類組"]; // 用於類組 code 轉中文
			await resOrder.forEach((value, index) => { // 志願列表格式整理
				let add = {
					id: value.id, // 系所 id
					cardCode: value.card_code, // 畫卡號碼
					mainGroup: value.main_group_data.title, // 學群
					group: groupName[Number(value.group_code) - 1], // 類組
					school: value.school.title, // 校名
					dept: value.title, // 中文系名
					engDept: value.eng_title, // 英文系名
					sortNum: index // 根據初始資料流水號，用於排序清單、抓取資料
				};
				_optionalWish.push(add);
			})

			// 整理已選志願
			let order = [];
			if(resPlacement.admission_group !== null){
				let dept_id = resPlacement.admission_group+'FFFF'
				order.push(dept_id);
			}

			order.forEach((value) => {
				let orderIndex = _optionalWish.findIndex(order => order.id === value);
				if (orderIndex > -1) {
					_wishList.push(_optionalWish[orderIndex]);
					_optionalWish.splice(orderIndex, 1);
				}
			});

			_generateOptionalWish();
			_generateWishList();
			loading.complete();
		} catch (e) {
			if (e.status && e.status === 401) {
				swal({title: `請登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href = "./index.html";
				});
			} else if (e.status && e.status === 403) {
				e.json && e.json().then((data) => {
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false})
					.then(()=> {
						if(data.messages[0] === '請先完成資格檢視'){
							location.href = "./qualify.html";
						}else if(data.messages[0]==='請先完成個人基本資料填寫'){
							location.href = "./personalInfo.html";
						}else if(data.messages[0]==='請先選擇成績採計方式'){
							location.href = "./grade.html";
						}else{
							location.href = "./result.html";
						}
					});
				})
			} else {
				e.json && e.json().then((data) => {
					console.error(data);
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
				})
			}
			loading.complete();
		}
	}

	function _addWish() { // 增加志願
		if (_wishList.length < 1) {
			const sortNum = $(this).data("sortnum");
			const optionalIndex = _optionalWish.findIndex(order => order.sortNum === sortNum)
			const pageNum = $paginationContainer.pagination('getSelectedPageNum');
			_wishList.push(_optionalWish[optionalIndex]);
			_optionalWish.splice(optionalIndex, 1);
			_generateOptionalWish(pageNum);
			_generateWishList();
		} else {
			swal({title: `志願類組僅可選擇一項。`, type: `warning`, confirmButtonText: '確定', allowOutsideClick: false});
		}
	}

	function _removeWish() { // 刪除志願
		const sortNum = $(this).data("sortnum");
		const wishIndex = _wishList.findIndex(order => order.sortNum === sortNum);
		const pageNum = (_filterOptionalWish.length === 0) ? 1 : $paginationContainer.pagination('getSelectedPageNum');
		_optionalWish.push(_wishList[wishIndex]);
		_wishList.splice(wishIndex, 1);
		_optionalWish.sort(function(a, b) {
			return parseInt(a.sortNum) - parseInt(b.sortNum);
		});
		_generateOptionalWish(pageNum);
		_generateWishList();
	}

	function _optionalWishTemplating(data) { // 分頁資料渲染（data.length === 0 時不會被呼叫）
		let html = '';
		$.each(data, function(index, item){
			let badgeNUPS = '';
			if (_nupsList.indexOf(item.id) > -1) {badgeNUPS = '<span class="badge badge-info">僑先部</span>';}
			html += `
				<tr>
					<td>
						${item.cardCode} ｜ ${item.group} ｜ ${item.mainGroup} ｜ ${item.school}<br>
						${item.dept} ${item.engDept}<br>
						${badgeNUPS}
					</td>
					<td class="text-right">
						<button type="button" data-sortNum="${item.sortNum}" class="btn btn-info btn-sm add-wish">
						<i class="fa fa-plus" aria-hidden="true"></i>
						</button>
					</td>
				</tr>
			`;
		});
		return html;
	}

	function _generateOptionalWish(pageNum) { // 渲染「招生校系清單」、含篩選
		pageNum = (!isNaN(parseFloat(pageNum)) && isFinite(pageNum)) ? pageNum : 1;
		const filterSelect = '' + $optionFilterSelect.val();
		const filter = $optionFilterInput.val().toUpperCase();

		if (_wishList.length > 0) { // 有選志願
			// 先篩類組
			if (_wishList[0].group === "第一類組") {
				_filterOptionalWish = _optionalWish.filter(function (obj) {
					return obj["group"] === "第一類組";
				});
			} else {
				_filterOptionalWish = _optionalWish.filter(function (obj) {
					return obj["group"] === "第二類組" || obj["group"] === "第三類組";
				});
			}

			// 再篩資料
			_filterOptionalWish = _filterOptionalWish.filter(function (obj) {
				if (filterSelect === "dept") {
					return obj['dept'].toUpperCase().indexOf(filter) > -1 ||
					obj['engDept'].toUpperCase().indexOf(filter) > -1
				}
				return obj[filterSelect].toUpperCase().indexOf(filter) > -1;
			});
		} else { // 沒選志願
			// 全部篩選
			_filterOptionalWish = _optionalWish.filter(function (obj) {
				if (filterSelect === "dept") {
					return obj['dept'].toUpperCase().indexOf(filter) > -1 ||
					obj['engDept'].toUpperCase().indexOf(filter) > -1
				}
				return obj[filterSelect].toUpperCase().indexOf(filter) > -1;
			});
		}

		$paginationContainer.pagination({
			dataSource: _filterOptionalWish,
			pageNumber: pageNum,
			callback: function(data) {
				let html = _optionalWishTemplating(data);
				$optionalWishList.html(html);
				const $addWish = $optionalWishList.find('.add-wish');
				$addWish.on("click", _addWish);
			}
		});

		if (_filterOptionalWish.length === 0) {
			$optionalWishList.html(`
				<tr>
				<td class="text-center" colspan="2">查無資料。</td>
				</tr>
				`);
		}
	}

	function _generateWishList() { // 「渲染已填選志願」
		let rowHtml = '';
		let invalidBadge = '';

		for(let i in _wishList) {
			let badgeNUPS = '';
			if (_nupsList.indexOf(_wishList[i].id) > -1) {badgeNUPS = '<span class="badge badge-info">僑先部</span>';}
			rowHtml = rowHtml + `
				<tr data-wishIndex="${i}">
					<td>
						<button type="button" data-sortNum="${_wishList[i].sortNum}" class="btn btn-danger btn-sm remove-wish"><i class="fa fa-times" aria-hidden="true"></i></button>
					</td>
					<td>
						${_wishList[i].cardCode} ｜ ${_wishList[i].group} ｜ ${_wishList[i].mainGroup} | ${_wishList[i].school}<br>
						${_wishList[i].dept} ${_wishList[i].engDept}
						<br />
						${badgeNUPS} ${invalidBadge}
					</td>
					<td class="text-right td-wish-num">
						<span class="form-control wish-num">1</span>
					</td>
				</tr>
			`;
		}
		wishList.innerHTML = rowHtml;

		const $removeWish = $wishList.find('.remove-wish');
		$removeWish.on("click", _removeWish);
	}

	function _handleSave() {
		let order = [];
		if (_wishList.length > 0) {
			_wishList.forEach((value) => {
				order.push(value.id);
			});
			const data = {
				order
			}
			loading.start();
			student.setPlacementSelectionOrder(data)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then(() => {
				swal({title:`儲存成功`, type:`success`, confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=> {
					location.href = "./result.html";
				});
				loading.complete();
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					swal({title:`ERROR`, text: data.messages[0], type: `error`, confirmButtonText: '確定', allowOutsideClick: false});
				})
				loading.complete();
			})
		} else {
			swal({title: `沒有選擇志願。`, type:`error`, confirmButtonText: '確定', allowOutsideClick: false});
		}
	}
})();
