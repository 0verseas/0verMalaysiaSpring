(() => {

	/**
	*	private variable
	*/

	let _filterOptionalWish = []; // 篩選的資料（也是需顯示的資料）
	let _optionalWish = []; // 剩餘可選志願
	let _wishList = []; // 已選擇志願

	// 僑先部 cardCode
	const _nupsList = ["1FFFF", "2FFFF", "3FFFF"];

	// 序號調整志願序之參數
	let _prevWishIndex = -1;
	let _currentWishIndex = -1;

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
	const $secondConfirm = $('#secondConfirm');

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
		$groupSubjects.attr('href', `https://cmn-hant.overseas.ncnu.edu.tw/#block-subjects`);
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
					specialDeptType: value.special_dept_type, // 特殊系所
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

			await order.forEach((value, index) => {
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
			// console.log(e);
			if (e.status && e.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else if (e.status && e.status === 403) {
				e.json && e.json().then((data) => {
					alert(`ERROR: \n${data.messages[0]}\n`);
					if(data.messages[0] === '請先完成資格檢視'){
						location.href = "./qualify.html";
					}else if(data.messages[0]==='請先完成個人基本資料填寫'){
						location.href = "./personalInfo.html";
					}else if(data.messages[0]==='請先選擇成績採計方式'){
						location.href = "./grade.html";
					}else{
						location.href = "./result.html";
					}
				})
			} else {
				e.json && e.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		}
	}

	function _addWish() { // 增加志願
		if (_wishList.length < 70) {
			const sortNum = $(this).data("sortnum");
			const optionalIndex = _optionalWish.findIndex(order => order.sortNum === sortNum)
			const pageNum = $paginationContainer.pagination('getSelectedPageNum');
			_wishList.push(_optionalWish[optionalIndex]);
			_optionalWish.splice(optionalIndex, 1);
			_generateOptionalWish(pageNum);
			_generateWishList();
		} else {
			alert('志願數量已達上限。');
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

	function _savePrevWishIndex() { // 暫存志願序號
		_prevWishIndex = $(this).val() - 1;
	}

	function _chWishIndex() { // 修改志願序號
		let currentNum = $(this).val();

		if (currentNum > _wishList.length) {
			currentNum = _wishList.length;
		} else if (currentNum < 1 ) {
			currentNum = 1;
		}
		_currentWishIndex = currentNum - 1;

		const element = _wishList[_prevWishIndex];
		_wishList.splice(_prevWishIndex, 1);
		_wishList.splice(_currentWishIndex, 0, element);
		_generateWishList();
	}

	function _prevWish() { // 志願上調
		const sortNum = $(this).data("sortnum");
		const wishIndex = _wishList.findIndex(order => order.sortNum === sortNum);
		if (wishIndex > 0) {
			const swap = _wishList[wishIndex];
			_wishList[wishIndex] = _wishList[wishIndex - 1];
			_wishList[wishIndex - 1] = swap;
			_generateWishList();
		}
	}

	function _nextWish() { // 志願下調
		const sortNum = $(this).data("sortnum");
		const wishIndex = _wishList.findIndex(order => order.sortNum === sortNum);
		if (wishIndex < _wishList.length - 1) {
			const swap = _wishList[wishIndex];
			_wishList[wishIndex] = _wishList[wishIndex + 1];
			_wishList[wishIndex + 1] = swap;
			_generateWishList();
		}
	}

	function _optionalWishTemplating(data) { // 分頁資料渲染（data.length === 0 時不會被呼叫）
		let html = '';
		const medicalList = ["醫學系", "牙醫學系", "中醫學系"];
		$.each(data, function(index, item){
			let medicalHTML = '';
			let badgeNUPS = '';
			if (item.specialDeptType !== null && medicalList.indexOf(item.specialDeptType) > -1) {
				medicalHTML = ' class="bg-medical"';
			}
			if (_nupsList.indexOf(item.id) > -1) {badgeNUPS = '<span class="badge badge-info">僑先部</span>';}
			html += `
			<tr${medicalHTML}>
			<td>
			${item.cardCode} ｜ ${item.group} ｜ ${item.mainGroup} ｜ ${item.school}<br>
			${item.dept} ${item.engDept}
			<br />
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
			const _currentWishGroup = _wishList[0].group;
			// 先篩類組
			if (_currentWishGroup === "第一類組") {
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
			callback: function(data, pagination) {
				var html = _optionalWishTemplating(data);
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
		const medicalList = ["醫學系", "牙醫學系", "中醫學系"];
		let hasNUPS = false;
		let invalidBadge = '';
		
		for(let i in _wishList) {
			let medicalHTML = '';
			let badgeNUPS = '';
			if (_wishList[i].specialDeptType !== null && medicalList.indexOf(_wishList[i].specialDeptType) > -1) {
				medicalHTML = ' class="bg-medical"';
			}
			if (_nupsList.indexOf(_wishList[i].id) > -1) {badgeNUPS = '<span class="badge badge-info" title="請將此志願置於最後">僑先部</span>';}
			rowHtml = rowHtml + `
			<tr${medicalHTML} data-wishIndex="${i}">
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
			<div class="input-group">
			<input type="text" class="form-control wish-num" value="${(Number(i) + 1)}">
			<div class="input-group-btn">
			<button type="button" data-sortNum="${_wishList[i].sortNum}" class="btn btn-secondary btn-sm up-arrow">
			<i class="fa fa-chevron-up" aria-hidden="true"></i>
			</button>
			<button type="button" data-sortNum="${_wishList[i].sortNum}" class="btn btn-secondary btn-sm down-arrow">
			<i class="fa fa-chevron-down" aria-hidden="true"></i>
			</button>
			</div>
			</div>
			</td>
			</tr>
			`;
			if (hasNUPS === false && _nupsList.indexOf(_wishList[i].id) > -1) {
				invalidBadge =
					'<span class="badge badge-warning" title="志願序在僑生先修部之後的志願將不會被分發">無效志願</span>' +
					'&nbsp;<span class="badge badge-pill badge-danger" title="志願序在僑生先修部之後的志願將不會被分發！\n請將志願序調整至僑生先修部之前。" data-toggle="tooltip">?</span>';
			}
		}
		wishList.innerHTML = rowHtml;

		const $removeWish = $wishList.find('.remove-wish');
		const $wishNum = $wishList.find('.wish-num');
		const $upArrow = $wishList.find('.up-arrow');
		const $downArrow = $wishList.find('.down-arrow');
		$removeWish.on("click", _removeWish);
		$wishNum.on("focusin", _savePrevWishIndex);
		$wishNum.on("change", _chWishIndex);
		$upArrow.on("click", _prevWish);
		$downArrow.on("click", _nextWish);
	}

	function _handleSave() {
		let order = [];
		if (_wishList.length > 0) {
			_wishList.forEach((value, index) => {
				order.push(value.id);
			});
			const data = {
				order
			}
			console.log(data);
			loading.start();
			student.setPlacementSelectionOrder(data)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				alert("儲存成功");
				location.href = "./result.html";
				loading.complete();
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
				loading.complete();
			})
		} else {
			alert('沒有選擇志願。');
		}
	}
})();
