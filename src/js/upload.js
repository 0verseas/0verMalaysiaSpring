(() => {

	/**
	*	cache DOM
	*/
    const $saveButton = $('.btn-save'); // 儲存按鈕 安慰用 檔案成功上傳其實就儲存了
	const $imgModal = $('#img-modal'); // 檔案編輯模板
	const $imgModalBody= $('#img-modal-body');// 檔案編輯模板顯示檔案區域
	const $deleteFileBtn = $('.btn-delFile');// 檔案編輯模板刪除按鈕
	let $uploadedFiles = [];// 已上傳檔案名稱陣列

	
	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

    $saveButton.on('click', _handleSave); // 儲存按鈕事件
	$deleteFileBtn.on('click',_handleDeleteFile);// 刪除按鈕事件
    $('body').on('change.upload', '.file-upload', _handleUpload);// 上傳按鈕事件
	$('body').on('click', '.img-thumbnail', _showUploadedFile);// 點擊檔案呼叫編輯模板事件

	async function _init() {
		const response = await student.getStudentAdmissionPaperFiles();
		if(response.ok){
			const data = await response.json();
			for (const [type] of Object.entries(data)) {
				// 先取得各類型的以上傳檔案名稱陣列
				$uploadedFiles = data[type];
				// 有檔案才渲染
				if($uploadedFiles.length > 0){
					await _renderUploadedArea(type);
				}
			}
		} else {
			const code = response.status;
			const data = await response.json();
			const message = data.messages[0];
			await swal({
				title: `ERROR！`,
				html:`${message}`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
		}
		await loading.complete();
	}

	// 儲存事件
    async function _handleSave(){
        await loading.start();
        await swal({title: `儲存成功`, type:"success", confirmButtonText: '確定', allowOutsideClick: false});
        await loading.complete();
        await location.reload();
    }

	// 上傳事件
    async function _handleUpload(){
		// 先取得要上傳的檔案類型
        const type = $(this).data('type');
		// 取得學生欲上傳的檔案
		const fileList = this.files;

		// 檢查檔案大小 不超過4MB 在放進senData中
		let sendData = new FormData();
		for (let i = 0; i < fileList.length; i++) {
			//有不可接受的副檔名存在
			if(! await checkFile(fileList[i])){
                return ;
            }
			if(await student.sizeConversion(fileList[i].size,4)){
				await swal({
					title: `上傳失敗！`,
					html:`${fileList[i].name}檔案過大，檔案大小不能超過4MB。`,
					type:"error",
					confirmButtonText: '確定',
					allowOutsideClick: false
				});
				return;
			}
			await sendData.append('files[]', fileList[i]);
		}

		await loading.start();
		// 將檔案傳送到後端
		const response = await student.uploadStudentAdmissionPaperFiles(sendData, type);
		if(response.ok){
			await swal({
				title: `上傳成功！`,
				type:"success",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
			// 後端會回傳上傳後該類型的已上傳檔案名稱陣列
			const data = await response.json();
			$uploadedFiles = data;
			// 重新渲染已上傳檔案區域
			await _renderUploadedArea(type);
		} else {
			const code = response.status;
			const data = await response.json();
			const message = data.messages[0];
			await swal({
				title: `上傳失敗！`,
				html:`${message}`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
		}

		await loading.complete();
		return;
    }

	// 渲染已上傳檔案區域事件
	function _renderUploadedArea(type){
		let uploadedAreaHtml = '';
		const $uploadedFileArea = document.getElementById(`${type}-uploaded-files`)
        $uploadedFiles.forEach((file) => {
            const fileType = _getFileType(file.split('.')[1]);
            if(fileType === 'img'){
                uploadedAreaHtml += `
                    <img
                        class="img-thumbnail"
                        src="${env.baseUrl}/malaysia-spring/admission-paper/${type}/${file}"
                        data-toggle="modal"
                        data-filename="${file}"
						data-target=".img-modal"
						data-type="${type}"
                        data-filetype="img"
                        data-filelink="${env.baseUrl}/malaysia-spring/admission-paper/${type}/${file}"
                    />
                `
            } else {
                uploadedAreaHtml += `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-filelink="${env.baseUrl}/malaysia-spring/admission-paper/${type}/${file}"
						data-filename="${file}"
						data-type="${type}"
                        data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
					>
						<i class="fa fa-file-${fileType}-o" data-filename="${file}" data-icon="fa-file-${fileType}-o" aria-hidden="true"></i>
					</div>
				`;
            }
        })
        $uploadedFileArea.innerHTML = uploadedAreaHtml;
	}

	// 顯示檔案 modal
	function _showUploadedFile() {
        // 取得點選的檔案名稱及類別
		const type = $(this).data('type');
		const fileName = $(this).data('filename');
		const fileType = $(this).data('filetype');

		// 清空 modal 內容
		$imgModalBody.html('');

		// 是圖放圖，非圖放 icon
		if (fileType === 'img') {
			const src = this.src;

			$imgModalBody.html(`
				<img
					src="${src}"
					class="img-fluid rounded img-ori"
				>
			`);
		} else {
			const icon = this.dataset.icon;
			const fileLink = this.dataset.filelink;

			$imgModalBody.html(`
				<div>
					<i class="fa ${icon} non-img-file-ori" aria-hidden="true"></i>
				</div>

				<a class="btn btn-primary non-img-file-download" href="${fileLink}" target="_blank" >
					<i class="fa fa-download" aria-hidden="true"></i> 下載
				</a>
			`);
		}
        // 刪除檔案按鈕紀錄點選的檔案名稱及類別
		$deleteFileBtn.attr({
			'type': type,
			'filetype': fileType,
			'filename': fileName,
		});
	}

	// 確認是否刪除上傳檔案
    function _handleDeleteFile(){
        const fileName = $deleteFileBtn.attr('filename');
		const type = $deleteFileBtn.attr('type');
        swal({
            title: '確要定刪除已上傳的檔案？',
            type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#5cb85c',
			cancelButtonColor: '#d33',
			confirmButtonText: '確定',
			cancelButtonText: '取消',
			buttonsStyling: true
        }).then(()=>{
            _deleteFile(type, fileName);
        }).catch(()=>{
            return;
        });
    }

	async function _deleteFile(type, fileName){
		await loading.start();

		const response = await student.deleteStudentAdmissionPaperFiles(type, fileName);

		if(response.ok){
			await swal({
				title: `刪除成功！`,
				type:"success",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
			const data = await response.json();
			$uploadedFiles = data;
			await $imgModal.modal('hide');
			await _renderUploadedArea(type);
		} else {
			const code = response.status;
			const data = await response.json();
			const message = data.messages[0];
			await swal({
				title: `刪除失敗！`,
				html:`${message}`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
		}

		await loading.complete();
	}

	// 副檔名與檔案型態對應（回傳值須符合 font-awesome 規範）
	function _getFileType(fileNameExtension = '') {
		switch (fileNameExtension) {
			case 'doc':
			case 'docx':
				return 'word';

			case 'mp3':
				return 'audio';

			case 'mp4':
			case 'avi':
				return 'video';

			case 'pdf':
				return 'pdf';

			default:
				return 'img';
		}
	}

	//檢查檔案類型
    function checkFile(selectfile){
        var extension = new Array(".jpg", ".png", ".pdf",".jpeg"); //可接受的附檔名
        var fileExtension = selectfile.name; //fakepath
        //看副檔名是否在可接受名單
        fileExtension = fileExtension.substring(fileExtension.lastIndexOf('.')).toLowerCase();  // 副檔名通通轉小寫
        if (extension.indexOf(fileExtension) < 0) {
			swal({
				title: `上傳失敗`,
				html:`${fileExtension} 非可接受的檔案類型副檔名。`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
            selectfile.value = null;
            return false;
        } else {
            return true;
        }
    }

})();
