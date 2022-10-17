(() => {

    /**
     *	private variable
     */

    let _specialStatus = 0;
    let _disabilityCategory = '視覺障礙';
    let _currentDadStatus = 'alive';
    let _currentMomStatus = 'alive';
    let _countryList = [];;

    let _hasSchoolName = true; // 有無學校所在地列表，true 則採用 $schoolNameSelect，否則採用 $schoolNameText
    let _currentSchoolLocate = "";
    let _currentSchoolName = "";
    let _schoolList = [];
    const _disabilityCategoryList = ["視覺障礙", "聽覺障礙", "肢體障礙", "語言障礙", "腦性麻痺", "自閉症", "學習障礙"];
    let _errormsg = [];

    /**
     *	cache DOM
     */

    const $personalInfoForm = $('#form-personalInfo'); // 個人資料表單

    // 申請人資料表
    const $email = $('#email');
    const $name = $('#name'); // 姓名（中）
    const $engName = $('#engName'); // 姓名（英）
    const $gender = $personalInfoForm.find('.gender'); // 性別
    const $birthday = $('#birthday'); // 生日
    const $birthContinent = $('#birthContinent'); // 出生地（州）
    const $birthLocation = $('#birthLocation'); // 出生地（國）
    const $special = $personalInfoForm.find('.special'); // 是否為「身心障礙」或「特殊照護」或「特殊教育」者
    const $specialForm = $('#specialForm'); // 身心障礙表單
    const $disabilityCategory = $('#disabilityCategory'); // 障礙類別
    const $disabilityLevel = $('#disabilityLevel'); // 障礙等級
    const $otherDisabilityCategoryForm = $('#otherDisabilityCategoryForm'); // 其他障礙說明表單
    const $otherDisabilityCategory = $('#otherDisabilityCategory'); // 其他障礙說明
    const $proposeGroup = $('#proposeGroup');

    // 僑居地資料
    const $residenceContinent = $('#residenceContinent'); // 州
    const $residentLocation = $('#residentLocation'); // 國
    const $residentId = $('#residentId'); // 身分證號碼（ID no.）
    const $residentPassportNo = $('#residentPassportNo'); // 護照號碼
    const $residentPhoneCode = $('#residentPhoneCode'); // 電話國碼
    const $residentPhone = $('#residentPhone'); // 電話號碼
    const $residentCellphoneCode = $('#residentCellphoneCode'); // 手機國碼
    const $residentCellphone = $('#residentCellphone'); // 手機號碼
    const $residentAddress = $('#residentAddress'); // 地址（中 / 英）
    const $residentOtherLangAddress = $('#residentOtherLangAddress'); // 地址（其他語言）

    // 在台資料 (選填)
    const $taiwanIdType = $('#taiwanIdType'); // 證件類型
    const $taiwanIdNo = $('#taiwanIdNo'); // 該證件號碼
    const $taiwanPassport = $('#taiwanPassport'); // 臺灣護照號碼
    const $taiwanPhone = $('#taiwanPhone'); // 臺灣電話
    const $taiwanAddress = $('#taiwanAddress'); // 臺灣地址

    // 學歷
    const $educationSystemDescription = $('#educationSystemDescription'); // 學制描述

    const $schoolLocationForm = $('#schoolLocationForm'); // 學校所在地、學校名稱 (select) 表單
    const $schoolLocation = $('#schoolLocation'); // 學校所在地
    const $schoolNameSelect = $('#schoolNameSelect'); // 學校名稱 (select)

    const $schoolNameTextForm = $('#schoolNameTextForm'); // 學校名稱表單
    const $schoolNameText = $('#schoolNameText'); // 學校名稱 (text)

    const $schoolAdmissionAt = $('#schoolAdmissionAt'); // 入學時間
    const $schoolGraduateAt = $('#schoolGraduateAt'); // 畢業時間

    // 家長資料
    // 父親
    const $dadStatus = $('.dadStatus'); // 存歿
    const $dadDataForm = $('#form-dadData'); // 資料表單
    const $dadName = $('#dadName'); // 姓名（中）
    const $dadEngName = $('#dadEngName'); // 姓名（英）
    const $dadBirthday = $('#dadBirthday'); // 生日
    const $dadJob = $('#dadJob'); // 職業
    const $dadPhoneCode = $('#dadPhoneCode'); // 聯絡電話國碼
    const $dadPhone = $('#dadPhone'); // 聯絡電話
    const $dadPhoneForm = $('#dad-phone');// 父親電話欄位
    // 母親
    const $momStatus = $('.momStatus'); // 存歿
    const $momDataForm = $('#form-momData'); // 資料表單
    const $momName = $('#momName'); // 姓名（中）
    const $momEngName = $('#momEngName'); // 姓名（英）
    const $momBirthday = $('#momBirthday'); // 生日
    const $momJob = $('#momJob'); // 職業
    const $momPhoneCode = $('#momPhoneCode'); // 聯絡電話國碼
    const $momPhone = $('#momPhone'); // 聯絡電話
    const $momPhoneForm = $('#mom-phone');// 母親電話欄位

    // 在台聯絡人
    const $twContactName = $('#twContactName'); // 姓名
    const $twContactRelation = $('#twContactRelation'); // 關係
    const $twContactPhone = $('#twContactPhone'); // 聯絡電話
    const $twContactAddress = $('#twContactAddress'); // 地址
    const $twContactWorkplaceName = $('#twContactWorkplaceName'); // 服務機關名稱
    const $twContactWorkplacePhone = $('#twContactWorkplacePhone'); // 服務機關電話
    const $saveBtn = $('#btn-save');

    /**
     *	init
     */

    _init(); 

    /**
     *	bind event
     */

    $birthContinent.on('change', _reRenderCountry);
    $special.on('change', _changeSpecial);
    $disabilityCategory.on('change', _switchDisabilityCategory);
    $residenceContinent.on('change', _reRenderResidenceCountry);
    $schoolLocation.on('change', _chSchoolLocation);
    $schoolNameSelect.on('change',_chSchoolName);
    $dadStatus.on('change', _chDadStatus);
    $momStatus.on('change', _chMomStatus);
    $saveBtn.on('click', _handleSave);
    $taiwanIdType.on('change', _showTaiwanIdExample);
    $("#form-personalInfo :input").on('change', function() {
        $(this).removeClass('invalidInput');
    });

    function _init() {
        student.getCountryList()
            .then((json) => {
                _countryList = json;
                let stateHTML = '<option value="-1" data-continentIndex="-1">Continent</option>';
                json.forEach((obj, index) => {
                    stateHTML += `<option value="${index}" data-continentIndex="${index}">${obj.continent}</option>`
                });
                $birthContinent.html(stateHTML);
                $residenceContinent.html(stateHTML);
                // 總是有人亂填生日 甚至變成未來人 只好設個上限 最年輕就是報名當下剛滿十歲
                $birthday.datepicker({
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() - 10))
                });
                // 總是有人亂填生日 甚至變成未來人 只好設個上限 父母最年輕就是報名當下剛滿二十二歲
                $dadBirthday.datepicker({
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() - 22))
                });
                $momBirthday.datepicker({
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() - 22))
                });
            })
            .then(()=>{
                _initPersonalInfo();
            })
    }

    function _initPersonalInfo() {
        student.getStudentPersonalData()
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then((json) => {
                let formData = json;

                if (formData['name'] === null) {
                    formData = {
                        "gender": "",
                        "birthday": "",
                        "birth_location": "",
                        "special": 0,
                        "disability_category": "",
                        "disability_level": "",
                        "propose_group": "",
                        "resident_location": "",
                        "resident_id": "",
                        "resident_passport_no": "",
                        "phone": "",
                        "cellphone": "",
                        "resident_address": "",
                        "taiwan_id_type": "",
                        "taiwan_id": "",
                        "taiwan_passport": "",
                        "taiwan_phone": "",
                        "taiwan_address": "",
                        "education_system_description": "",
                        "school_name": "",
                        "school_locate": "",
                        "school_admission_at": "",
                        "school_graduate_at": "",
                        "dad_status": "alive",
                        "dad_name": "",
                        "dad_eng_name": "",
                        "dad_birthday": "",
                        "dad_job": "",
                        "dad_phone": "",
                        "mom_status": "alive",
                        "mom_name": "",
                        "mom_eng_name": "",
                        "mom_birthday": "",
                        "mom_job": "",
                        "mom_phone": "",
                        "tw_contact_name": "",
                        "tw_contact_relation": "",
                        "tw_contact_phone": "",
                        "tw_contact_address": "",
                        "tw_contact_workplace_name": "",
                        "tw_contact_workplace_phone": "",
                    }
                }

                // init 申請人資料表
                $email.val(json.email);
                $name.val(json.name);
                $engName.val(json.eng_name);
                $("input[name=gender][value='" + formData.gender + "']").prop("checked", true);
                $birthday.val(formData.birthday);
                $birthContinent.val(_findContinent(formData.birth_location)).change();
                $birthLocation.val(formData.birth_location);

                // 是否為「身心障礙」或「特殊照護」或「特殊教育」者
                _specialStatus = formData.special;
                if (_specialStatus) {
                    $("input[name=special][value='1']").prop("checked", true).change();
                    if (_disabilityCategoryList.indexOf(formData.disability_category) > -1) {
                        $disabilityCategory.val(formData.disability_category).change();
                    } else {
                        $disabilityCategory.val("-1").change();
                        $otherDisabilityCategory.val(formData.disability_category);
                    }
                    $disabilityLevel.val(formData.disability_level);
                } else {
                    $("input[name=special][value='0']").prop("checked", true).change();
                }

                $proposeGroup.val(formData.propose_group)

                // init 僑居地資料
                $residenceContinent.val(_findContinent(formData.resident_location)).change();
                $residentLocation.val(formData.resident_location);
                $residentId.val(formData.resident_id);
                $residentPassportNo.val(formData.resident_passport_no);
                $residentPhoneCode.val(_splitWithSemicolon(formData.phone)[0]);
                $residentPhone.val(_splitWithSemicolon(formData.phone)[1]);
                $residentCellphoneCode.val(_splitWithSemicolon(formData.cellphone)[0]);
                $residentCellphone.val(_splitWithSemicolon(formData.cellphone)[1]);
                // $residentAddress.val(_splitWithSemicolon(formData.resident_address)[0]);
                $residentAddress.val(formData.resident_address); // 原本僑居地地址有兩欄，如果恢復其他語言地址欄位請記得取消這邊的註解
                $residentOtherLangAddress.val(_splitWithSemicolon(formData.resident_address)[1]);

                // init 在台資料
                $taiwanIdType.val(formData.taiwan_id_type);
                $taiwanIdNo.val(formData.taiwan_id);
                $taiwanPassport.val(formData.taiwan_passport);
                $taiwanPhone.val(formData.taiwan_phone);
                $taiwanAddress.val(formData.taiwan_address);

                // init 學歷
                $educationSystemDescription.val(formData.education_system_description);
                _currentSchoolLocate = (formData.school_locate !== null) ? formData.school_locate : "";
                _currentSchoolName = formData.school_name;

                // 入學時間、畢業時間初始化
                $schoolAdmissionAt.val(formData.school_admission_at);
                $schoolGraduateAt.val(formData.school_graduate_at);

                // init 家長資料
                // 父
                _currentDadStatus = formData.dad_status;
                $("input[name=dadStatus][value='" + formData.dad_status + "']").prop("checked", true);
                $dadName.val(formData.dad_name);
                $dadEngName.val(formData.dad_eng_name);
                $dadBirthday.val(formData.dad_birthday);
                $dadJob.val(formData.dad_job);
                // FIXME: 當雙親都是不詳的時候不這樣寫（判斷有無電話）渲染會出錯，懇請大神協助修改讓程式碼好看一點
                [document.getElementById("dadPhoneCode").value, document.getElementById("dadPhone").value] = _splitWithSemicolon(formData.dad_phone);

                // 母
                _currentMomStatus = formData.mom_status;
                $("input[name=momStatus][value='" + formData.mom_status + "']").prop("checked", true);
                $momName.val(formData.mom_name);
                $momEngName.val(formData.mom_eng_name);
                $momBirthday.val(formData.mom_birthday);
                $momJob.val(formData.mom_job);
                [document.getElementById("momPhoneCode").value, document.getElementById("momPhone").value] = _splitWithSemicolon(formData.mom_phone);

                // init 在台聯絡人
                $twContactName.val(formData.tw_contact_name);
                $twContactRelation.val(formData.tw_contact_relation);
                $twContactPhone.val(formData.tw_contact_phone);
                $twContactAddress.val(formData.tw_contact_address);
                $twContactWorkplaceName.val(formData.tw_contact_workplace_name);
                $twContactWorkplacePhone.val(formData.tw_contact_workplace_phone);
            })
            .then(() => {
                // init selectpicker
                $birthLocation.selectpicker('refresh');
                $residentLocation.selectpicker('refresh');
                _showSpecialForm();
                _handleOtherDisabilityCategoryForm();
                _switchDadDataForm();
                _switchMomDataForm();
                _reRenderSchoolLocation();
            })
            .then(() => {
                $birthLocation.parent().find('button').removeClass('bs-placeholder');
                $residentLocation.parent().find('button').removeClass('bs-placeholder');
                loading.complete();
            })
            .catch((err) => {
                if (err.status && err.status === 401) {
                    swal({title: `請登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
                    .then(()=>{
                        location.href = "./index.html";
                    });
                } else {
                    err.json && err.json().then((data) => {
                        console.error(data);
                        swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false})
                        .then(() => {
                            if(data.messages[0] === '請先完成資格檢視'){
                                location.href = "./qualify.html";
                            }else{
                                location.href = "./result.html";
                            }
                        });
                    })
                }
                loading.complete();
            })
    }

    function _findContinent(locationId) { // 找到州別
        let continent = '';
        for (let i = 0; i < _countryList.length; i++) {
            let countryObj = _countryList[i].country.filter((obj) => {
                return obj.id === locationId;
            });
            if (countryObj.length > 0) {
                return '' + i;
            }
        }
        return -1;
    }

    function _splitWithSemicolon(phoneNum) {
        if(phoneNum == null) return ['',''];
        let i = phoneNum.indexOf("-");
        return [phoneNum.slice(0, i), phoneNum.slice(i + 1)];
    }

    function _reRenderCountry() {
        const continent = $(this).find(':selected').data('continentindex');

        let countryHTML = '';
        if (continent !== -1) {
            $birthLocation.selectpicker({title: '請選擇國家'}); // 修改 未選擇選項時的顯示文字
            _countryList[continent]['country'].forEach((obj, index) => {
                countryHTML += `<option value="${obj.id}">${obj.country}</option>`;
            })
            $birthLocation.attr('disabled',false); // enable selector
        } else {
            $birthLocation.selectpicker({title: '請先選擇洲別(Continent)'}); // 修改 未選擇選項時的顯示文字
            $birthLocation.attr('disabled',true); // disable selector
        }
        $birthLocation.html(countryHTML); // reder option
        $birthLocation.selectpicker('refresh'); // refresh selector
        $birthLocation.parent().find('button').removeClass('bs-placeholder'); // 為了風格統一 去除預設格式
    }

    function _reRenderResidenceCountry() {
        const continent = $(this).find(':selected').data('continentindex');

        let countryHTML = '<option value="">Country</option>';

        if (continent !== -1) {
            $residentLocation.selectpicker({title: '請選擇國家'}); // 修改 未選擇選項時的顯示文字
            _countryList[continent]['country'].forEach((obj, index) => {
                countryHTML += `<option value="${obj.id}">${obj.country}</option>`;
            })
            $residentLocation.attr('disabled',false); // enable selector
        } else {
            $residentLocation.selectpicker({title: '請先選擇洲別(Continent)'}); // 修改 未選擇選項時的顯示文字
            $residentLocation.attr('disabled',true); // disable selector
        }

        $residentLocation.html(countryHTML); // reder option
        $residentLocation.selectpicker('refresh'); // refresh selector
        $residentLocation.parent().find('button').removeClass('bs-placeholder'); // 為了風格統一 去除預設格式
    }
    
    function _switchDisabilityCategory() {
        _disabilityCategory = $(this).val();
        _handleOtherDisabilityCategoryForm();
    }

    function _handleOtherDisabilityCategoryForm() {
        if (_disabilityCategory === "-1") {
            $otherDisabilityCategoryForm.fadeIn();
        } else {
            $otherDisabilityCategoryForm.hide();
        }
    }

    function _changeSpecial() {
        _specialStatus = Number($(this).val());
        _showSpecialForm();
    }

    function _showSpecialForm() {
        if (_specialStatus === 1) {
            $specialForm.fadeIn();
        } else {
            $specialForm.hide();
        }
    }

    function _showTaiwanIdExample() {
        document.getElementById("taiwanIdExample1").style.display = "none"
        document.getElementById("taiwanIdExample2").style.display = "none"
        if ($taiwanIdType.val() == '居留證') {
            document.getElementById("taiwanIdExample1").style.display = "block";
            document.getElementById("taiwanIdExample2").style.display = "none";
        }
        if ($taiwanIdType.val() == '身分證') {
            document.getElementById("taiwanIdExample2").style.display = "block";
            document.getElementById("taiwanIdExample1").style.display = "none";
        }
    }

    function _reRenderSchoolLocation() {
            student.getSchoolList(128)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw res;
                    }
                })
                .then((json) => {
                    schoolList = json;
                    schoolList.push({
                        id: 999,
                        country_id: 128,
                        locate: '其它',
                        type: '',
                        name: '其它'
                    });

                    // 當前類別有學校列表的話，渲染所在地、學校名稱列表
                    let group_to_values = schoolList.reduce(function(obj, item) {
                        obj[item.locate] = obj[item.locate] || [];
                        obj[item.locate].push({ name: item.name });
                        return obj;
                    }, {});

                    // group by 學校所在地
                    let groups = Object.keys(group_to_values).map(function(key) {
                        return { locate: key, school: group_to_values[key] };
                    });

                    //各所在地區的學校名稱加上其它選項
                    for(let i=0;i<groups.length;i++){
                        if(groups[i].locate !== '其它'){
                            groups[i].school.push({
                                name:'其它'
                            });
                        }
                    }

                    let schoolLocationHTML = '';
                    _schoolList = groups;
                    // 渲染學校所在地、隱藏學校名稱輸入
                    _schoolList.forEach((value, index) => {
                        schoolLocationHTML += `<option value="${value.locate}">${value.locate}</option>`;
                    });
                    $schoolLocation.html(schoolLocationHTML);
                    if (_currentSchoolLocate !== "") {
                        $schoolLocation.val(_currentSchoolLocate);
                    } else {
                        _currentSchoolLocate = _schoolList[0].locate;
                    }
                    $schoolLocationForm.fadeIn();   
                })
                .then(() => {
                    setTimeout(_reRenderSchoolList(), 500);
                    setTimeout(_chSchoolName(), 600);
                })
                .catch((err) => {
                    err.json && err.json().then((data) => {
                        console.error(data);
                    })
                })               
    }

    function _chSchoolLocation() {
        _currentSchoolLocate = $(this).val();
        _currentSchoolName = "";
        _reRenderSchoolList();
        _chSchoolName();
    }

    //學校名稱是其它時 出現 學校名稱 input Text 讓它輸入
    function _chSchoolName(){
        $schoolNameSelect.removeClass('invalidInput');
        if($schoolNameSelect.val() === '其它'){
            $schoolNameTextForm.show();
            $schoolNameText.val(_currentSchoolName);
            _hasSchoolName = false;
        } else {
            $schoolNameTextForm.hide();
            _hasSchoolName = true;
        }
    }

    function _reRenderSchoolList() {

        // 重新渲染學士班的學校列表
        let locateIndex = _schoolList.findIndex(order => order.locate === _currentSchoolLocate);

        let schoolListHTML = '';
        let selectSchoolName = '其它';
        _schoolList[locateIndex].school.forEach((value, index) => {
            schoolListHTML += `<option value="${value.name}">${value.name}</option>`;
            if(value.name == _currentSchoolName){selectSchoolName=value.name;}
        });
        $schoolNameSelect.html(schoolListHTML);
        if (_currentSchoolName !== "") {
            if(_currentSchoolLocate !=="其它" && selectSchoolName !== "其它"){
                $schoolNameSelect.val(_currentSchoolName);
            } else {
                $schoolNameSelect.val('其它');
            }
        }
    }

    function _chDadStatus() {
        _currentDadStatus = $(this).val();
        _switchDadDataForm();
    }

    async function _switchDadDataForm() {
        if(_currentMomStatus === "undefined" && _currentDadStatus ==="undefined"){
            await swal({title: `請至少填寫一位監護人資料`, type:"error", confirmButtonText: '確定', allowOutsideClick: false});
            _currentDadStatus = 'alive';
            $dadStatus[0].checked = true;
            $dadStatus[2].checked = false;
        }
        if (_currentDadStatus === "undefined") {
            $dadDataForm.hide();
        } else {
            $dadDataForm.fadeIn();
        }
        if(_currentDadStatus === 'alive'){
            $dadPhoneForm.fadeIn();
        } else {
            $dadPhoneForm.hide();
            document.getElementById('dadPhoneCode').value="";
            document.getElementById('dadPhone').value="";
        }
    }

    async function _chMomStatus() {
        _currentMomStatus = $(this).val();
        if(_currentMomStatus === "undefined" && _currentDadStatus ==="undefined"){
            await swal({title: `請至少填寫一位監護人資料`, type:"error", confirmButtonText: '確定', allowOutsideClick: false});
            _currentMomStatus = 'alive';
            $momStatus[0].checked = true;
            $momStatus[2].checked = false;
        } else {
            _switchMomDataForm();
        }
    }

    function _switchMomDataForm() {
        if (_currentMomStatus === "undefined") {
            $momDataForm.hide();
        } else {
            $momDataForm.fadeIn();
        }
        if(_currentMomStatus === 'alive'){
            $momPhoneForm.fadeIn();
        } else {
            $momPhoneForm.hide();
            document.getElementById('momPhoneCode').value="";
            document.getElementById('momPhone').value="";
        }
    }

    async function _handleSave() {
        let sendData = {};
        if (sendData = await _validataForm()) {
            loading.start();
            student.setStudentPersonalData(sendData)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw res;
                    }
                })
                .then(async (json) => {
                    await swal({title:"儲存成功", type:"success", confirmButtonText: '確定'});
                    window.location.reload();
                    loading.complete();
                    scroll(0,0);
                })
                .catch((err) => {
                    err.json && err.json().then((data) => {
                        // console.error(data);
                        let errMsg = data.messages[0].split(" ");
                        _handleErrMsg(errMsg[1]);
                        swal({title: `ERROR`, html: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
                    });
                    loading.complete();
                    scroll(0,0);
                })
        } else {
            await swal({title: `填寫資料錯誤`, html: `請檢查以下欄位：<br/>`+_errormsg.join('、'), type:"error", confirmButtonText: '確定', allowOutsideClick: false});
            scroll(0,0);
        }
    }

    function _checkValue(col, type){
        /*
        *   3400～4DFF：中日韓認同表意文字擴充A區，總計收容6,582個中日韓漢字。
        *   4E00～9FFF：中日韓認同表意文字區，總計收容20,902個中日韓漢字。 
        *   0023： #
        *   002d： -
        *   00b7：半形音界號
        *   2027：全形音界號
        *   0020：半形空格
        *   \s  ：空白
        *   \d  ：數字
        *   00c0~33FF：包含大部分國家的文字
        */
        let str = col.val();
        if(!str) return true;  // replace(null)會報錯
        switch (type) {
            case 'Chinese':
                str = (str.match(/\p{sc=Han}|[\u2027\u00b7]/gu) == null)? '' : str.match(/\p{sc=Han}|[\u2027\u00b7]/gu).join("");
                break;
            case 'English':
                str = str.replace(/[\s]/g, "\u0020").replace(/[^\u0020a-zA-Z.,-]/g, "");
                break;
            case 'General':
                str = str.replace(/[\s]/g, "\u0020").replace(/[\<\>\"]/g, "");
                break;
            case 'IdNumber':
                str = str.replace(/[^0-9A-Za-z\u002d]/g, "");
                break;
            case 'Number':
                str = str.replace(/[^\d\u0020\u0023]/g, "");
                break;
            case 'Date':
                return !(/^[1-2]\d{3}\/((01|03|05|07|08|10|12)\/(0[1-9]|[1-2]\d{1}|3[0-1])|(02|04|06|09|11)\/(0[1-9]|[1-2]\d{1}|30)|(0[1-9]|1[0-2]))$/).test(str);
            case 'EMail':
                return !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
        }
        col.val(str);
        if(!str) return true;
        return false;
    }

    function _handleError(col, msg) {
        _errormsg.push(msg);
        col.addClass('invalidInput');
        if (msg === '出生地') $('.birthContinent').addClass('invalidInput');
        if (msg === '僑居地國別') $('.residentLocation').addClass('invalidInput');
    }

    // 送出前檢查
    async function _validataForm() {
        _errormsg = [];
        const disabilityLevel = ['極重度','重度','中度','輕度'] // 身心障礙程度
        let disabilityCategory = "" // 給後端的身心障礙類別
        // 申請人
        if(_checkValue($name,'Chinese')) _handleError($name,'姓名（中）');
        if(_checkValue($engName,'English')) _handleError($engName,'姓名（英）');
        if(!$(".gender:checked").val()) _handleError($gender,'性別');
        if(_checkValue($birthday,'Date')) _handleError($birthday,'生日');
        if(!$birthLocation.val()) _handleError($birthLocation,'出生地');
        if(!$(".special:checked").val()) {
            _errormsg.push('身心障礙選項');
        } else if ($(".special:checked").val() === "1") {
            if($disabilityCategory.val() !== "-1" && !_disabilityCategoryList.includes($disabilityCategory.val())) {
                _errormsg.push('身心障礙類別錯誤');
            } else if($disabilityCategory.val() === "-1" && _checkValue($otherDisabilityCategory,'General')) {
                _handleError($otherDisabilityCategory,'其他身心障礙類別說明');
            } else if($disabilityCategory.val() === "-1" && $otherDisabilityCategory.val()){
                disabilityCategory = $otherDisabilityCategory.val();
            } else {
                disabilityCategory = $disabilityCategory.val();
            }
            if(!disabilityLevel.includes($disabilityLevel.val())) _errormsg.push('身心障礙程度錯誤');
        }
        _checkValue($proposeGroup,'General');
        // 僑居地
        if(!$residentLocation.val()) _handleError($residentLocation,'僑居地國別');
        if(_checkValue($residentId,'IdNumber')) _handleError($residentId,'僑居地身分證號碼');
        if(_checkValue($residentPhoneCode,'Number')) _handleError($residentPhoneCode,'僑居地電話國碼');
        if(_checkValue($residentPhone,'Number')) _handleError($residentPhone,'僑居地電話號碼');
        if(_checkValue($residentCellphoneCode,'Number')) _handleError($residentCellphoneCode,'僑居地手機國碼');
        if(_checkValue($residentCellphone,'Number')) _handleError($residentCellphone,'僑居地手機號碼');
        if(_checkValue($residentAddress,'General')) _handleError($residentAddress,'僑居地地址');
        // 學歷
        if(_checkValue($educationSystemDescription,'General')) _handleError($educationSystemDescription,'學制描述');
        if(_checkValue($schoolLocation,'Chinese')) _handleError($schoolLocation,'學校所在地');
        if(_checkValue($schoolNameSelect,'General')) _handleError($schoolNameSelect,'學校名稱');
        if(_checkValue($schoolNameText,'General') && !_hasSchoolName) _handleError($schoolNameText,'其他學校名稱');
        if(_checkValue($schoolAdmissionAt,'Date')) _handleError($schoolAdmissionAt,'入學時間');
        if(_checkValue($schoolGraduateAt,'Date')) _handleError($schoolGraduateAt,'畢業時間');
        // 父
        if(!$dadStatus.val()) _errormsg.push('父親存歿');
        if(_currentDadStatus !== "undefined"){
            if(_checkValue($dadName,'Chinese')) _handleError($dadName,'父親姓名（中）');
            if(_checkValue($dadEngName,'English')) _handleError($dadEngName,'父親姓名（英）');
            if(_checkValue($dadBirthday,'Date')) _handleError($dadBirthday,'父親生日');
            if(_currentDadStatus === "alive") {
                if(_checkValue($dadJob,'General')) _handleError($dadJob,'父親職業');
                if(_checkValue($dadPhoneCode,'Number')) _handleError($dadPhoneCode,'父親聯絡電話國碼');
                if(_checkValue($dadPhone,'Number')) _handleError($dadPhone,'父親聯絡電話號碼');
            }
        }
        // 母
        if(!$momStatus.val()) _errormsg.push('母親存歿');
        if(_currentMomStatus !== "undefined"){
            if(_checkValue($momName,'Chinese')) _handleError($momName,'母親姓名（中）');
            if(_checkValue($momEngName,'English')) _handleError($momEngName,'母親姓名（英）');
            if(_checkValue($momBirthday,'Date')) _handleError($momBirthday,'母親生日');
            if(_currentMomStatus === "alive") {
                if(_checkValue($momJob,'General')) _handleError($momJob,'母親職業');
                if(_checkValue($momPhoneCode,'Number')) _handleError($momPhoneCode,'母親聯絡電話國碼');
                if(_checkValue($momPhone,'Number')) _handleError($momPhone,'母親聯絡電話號碼');
            }        
        }
        // 在臺資料（選填）轉換字串
        if ($taiwanIdType.val() !== "") {
            let rg = /^[A-z][1-2]\d{8}$/;                            // 身份證檢查式
            let rg2 = /^[A-z]([A-D]|[a-d])\d{8}|[A-z][8-9]\d{8}$/    // 居留證檢查式
            if(($taiwanIdType.val() === "身分證" && !rg.test($taiwanIdNo.val())) 
            || ($taiwanIdType.val() === "居留證" && !rg2.test($taiwanIdNo.val()))) _handleError($taiwanIdNo,'在臺證件號碼');
        }
        _checkValue($taiwanPassport,'General');
        _checkValue($taiwanPhone,'Number');
        _checkValue($taiwanAddress,'General');
        // 在臺聯絡人（選填）轉換字串
        _checkValue($twContactName,'Chinese');
        _checkValue($twContactRelation,'General');
        _checkValue($twContactPhone,'Number');
        _checkValue($twContactAddress,'General');
        _checkValue($twContactWorkplaceName,'General');
        _checkValue($twContactWorkplacePhone,'Number');

        if(_errormsg.length > 0) {
            return false;
        } else {
            return {
                name: $name.val(),
                eng_name: $engName.val(),
                gender: $(".gender:checked").val(),
                birthday: $birthday.val(),
                birth_location: $birthLocation.val(),
                special: $(".special:checked").val(),
                disability_category: disabilityCategory,
                disability_level: ($(".special:checked").val() === "1")? $disabilityLevel.val() : "",
                propose_group: $proposeGroup.val(),
                resident_location: $residentLocation.val(),
                resident_id: $residentId.val(),
                resident_passport_no: ($residentPassportNo.val() === null)? "" : $residentPassportNo.val(),
                phone: $residentPhoneCode.val() + '-' + $residentPhone.val(),
                cellphone: $residentCellphoneCode.val() + '-' + $residentCellphone.val(),
                resident_address: $residentAddress.val(),
                taiwan_id_type: ($taiwanIdType === null)? "" : $taiwanIdType.val(),
                taiwan_id: ($taiwanIdNo === null)? "" : $taiwanIdNo.val(),
                taiwan_passport: ($taiwanPassport === null)? "" : $taiwanPassport.val(),
                taiwan_phone: ($taiwanPhone === null)? "" : $taiwanPhone.val(),
                taiwan_address: ($taiwanAddress === null)? "" : $taiwanAddress.val(),
                education_system_description: $educationSystemDescription.val(),
                school_locate: $schoolLocation.val(),
                school_name: (_hasSchoolName)? $schoolNameSelect.val() : $schoolNameText.val(),
                school_admission_at: $schoolAdmissionAt.val(),
                school_graduate_at: $schoolGraduateAt.val(),
                dad_status: _currentDadStatus,
                dad_name: (_currentDadStatus === "undefined") ?"" :$dadName.val(),
                dad_eng_name: (_currentDadStatus === "undefined")? "" : $dadEngName.val(),
                dad_birthday: (_currentDadStatus === "undefined")? "" : $dadBirthday.val(),
                dad_job: (_currentDadStatus === "alive")? $dadJob.val() : "",
                dad_phone: (_currentDadStatus === "alive")? $dadPhoneCode.val() + "-" + $dadPhone.val() : "",
                mom_status: _currentMomStatus,
                mom_name: (_currentMomStatus !== "undefinded")? $momName.val() : "",
                mom_eng_name: (_currentMomStatus !== "undefined")? $momEngName.val() : "",
                mom_birthday: (_currentMomStatus !== "undefined")? $momBirthday.val() : "",
                mom_job: (_currentMomStatus === "alive")? $momJob.val() : "",
                mom_phone: (_currentMomStatus === "alive")? $momPhoneCode.val() + "-" + $momPhone.val() : "",
                tw_contact_name: ($twContactName === null)? "" : $twContactName.val(),
                tw_contact_relation: ($twContactRelation === null)? "" : $twContactRelation.val(),
                tw_contact_phone: ($twContactPhone === null)? "" : $twContactPhone.val(),
                tw_contact_address: ($twContactAddress === null)? "" : $twContactAddress.val(),
                tw_contact_workplace_name: ($twContactWorkplaceName === null)? "" : $twContactWorkplaceName.val(),
                tw_contact_workplace_phone: ($twContactWorkplacePhone === null)? "" : $twContactWorkplacePhone.val(),
            };
        }
    }

    // 後端回傳錯誤時，對應欄位顯示紅框
    function _handleErrMsg(msg) {
        switch (msg) {
            case '姓名(中)':
                $name.addClass('invalidInput');
                break;
            case '姓名(英)':
                $engName.addClass('invalidInput');
                break;
            case '性別':
                $gender.addClass('invalidRadio');
                break;
            case '生日':
                $birthday.addClass('invalidInput');
                break;
            case '出生地':
                $('.birthLocation').addClass('invalidInput');
                break;
            case '身心障礙選項':
                $special.addClass('invalidRadio');
                break;
            case '身心障礙類別':
                $disabilityCategory.addClass('invalidInput');
                $otherDisabilityCategory.addClass('invalidInput');
                break;
            case '身心障礙程度':
                $disabilityLevel.addClass('invalidInput');
                break;
            case '僑區地國別':
                $('.residentLocation').addClass('invalidInput');
                break;
            case '僑居地身份證號碼':
                $residentId.addClass('invalidInput');
                break;
            case '僑居地護照號碼':
                $residentPassportNo.addClass('invalidInput');
                break;
            case '電話':
                $residentPhone.addClass('invalidInput');
                $residentPhoneCode.addClass('invalidInput');
                break;
            case '僑居地手機號碼':
                $residentCellphoneCode.addClass('invalidInput');
                $residentCellphone.addClass('invalidInput');
                break;
            case '僑居地地址':
                $residentAddress.addClass('invalidInput');
                break;
            case '在臺證件類型':
                $taiwanIdType.addClass('invalidInput');
                break;
            case '在臺證件號碼':
                $taiwanIdNo.addClass('invalidInput');
                break;
            case '在臺護照':
                $taiwanPassport.addClass('invalidInput');
                break;
            case '在臺聯絡電話':
                $taiwanPhone.addClass('invalidInput');
                break;
            case '在臺地址':
                $taiwanAddress.addClass('invalidInput');
                break;
            case '學制描述':
                $educationSystemDescription.addClass('invalidInput');
                break;
            case '學校所在地':
                $schoolLocation.addClass('invalidInput');
                break;
            case '學校名稱':
                $schoolNameText.addClass('invalidInput');
                break;
            case '入學時間':
                $schoolAdmissionAt.addClass('invalidInput');
                break;
            case '畢業時間':
                $schoolGraduateAt.addClass('invalidInput');
                break;
            case '父親存歿':
                $dadStatus.addClass('invalidRadio');
                break;
            case '父親姓名(中)':
                $dadName.addClass('invalidInput');
                break;
            case '父親姓名(英)':
                $dadEngName.addClass('invalidInput');
                break;
            case '父親生日':
                $dadBirthday.addClass('invalidInput');
                break;
            case '父親職業':
                $dadJob.addClass('invalidInput');
                break;
            case '父親聯絡電話':
                $dadPhoneCode.addClass('invalidInput');
                $dadPhone.addClass('invalidInput');
                break;
            case '母親存歿':
                $momStatus.addClass('invalidRadio');
                break;
            case '母親姓名(中)':
                $momName.addClass('invalidInput');
                break;
            case '母親姓名(英)':
                $momEngName.addClass('invalidInput');
                break;
            case '母親生日':
                $momBirthday.addClass('invalidInput');
                break;
            case '母親職業':
                $momJob.addClass('invalidInput');
                break;
            case '母親聯絡方式':
                $momPhoneCode.addClass('invalidInput');
                $momPhone.addClass('invalidInput');
                break;
            case '在臺聯絡人姓名':
                $twContactName.addClass('invalidInput');
                break;
            case '在臺聯絡人關係':
                $twContactRelation.addClass('invalidInput');
                break;
            case '在臺聯絡人聯絡電話':
                $twContactPhone.addClass('invalidInput');
                break;
            case '在臺聯絡人地址':
                $twContactAddress.addClass('invalidInput');
                break;
            case '在臺聯絡人服務機關名稱':
                $twContactWorkplaceName.addClass('invalidInput');
                break;
            case '在臺聯絡人服務機關電話':
                $twContactWorkplacePhone.addClass('invalidInput');
                break;
        }
    }

})();
