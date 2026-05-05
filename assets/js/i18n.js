// i18n.js - translate text only; keep original DataTable/layout structure
(function () {
    var resources = {
        en: {
            translation: {
                manageInventory: 'Manage Inventory',
                itemName: 'Item Name',
                quantity: 'Quantity',
                type: 'Type',
                unitPrice: 'Unit Price',
                totalPrice: 'Total Price',
                addNewItemButton: 'ADD NEW ITEM',
                saveDataButton: 'SAVE DATA',
                newDataButton: 'NEW DATA',
                loadDataButton: 'LOAD DATA',
                searchPlaceholder: "🔍︎    Search inventory",
                emptyTable: "Please select 'LOAD DATA' or 'NEW DATA'.",
                pleaseEnterValue: 'Please enter a value.',
                deleteConfirmation: 'Delete Confirmation',
                deleteMessage: 'Are you sure you wish to remove this record?',
                deleteButton: 'Delete',
                updateConfirmation: 'Update Confirmation',
                updateMessage: 'Inventory has been successfully updated.',
                addConfirmation: 'Add Confirmation',
                addMessage: 'A new item has been successfully added.',
                okButton: 'OK',
                editData: 'Edit Data',
                addNewItem: 'Add New Item',
                update: 'Update',
                add: 'Add',
                alertMessage: 'Hi there! I added these buttons just for design because it looked kinda empty :3'
            }
        },
        zh: {
            translation: {
                manageInventory: '库存管理',
                itemName: '商品名称',
                quantity: '数量',
                type: '类型',
                unitPrice: '单价',
                totalPrice: '总价',
                addNewItemButton: '添加新商品',
                saveDataButton: '保存数据',
                newDataButton: '新建数据',
                loadDataButton: '加载数据',
                searchPlaceholder: "🔍︎    搜索库存",
                emptyTable: '请选择“加载数据”或“新建数据”。',
                pleaseEnterValue: '请输入内容。',
                deleteConfirmation: '删除确认',
                deleteMessage: '您确定要删除这条记录吗？',
                deleteButton: '删除',
                updateConfirmation: '更新确认',
                updateMessage: '库存已成功更新。',
                addConfirmation: '添加确认',
                addMessage: '新商品已成功添加。',
                okButton: '确定',
                editData: '编辑数据',
                addNewItem: '添加新商品',
                update: '更新',
                add: '添加',
                alertMessage: '你好！这些按钮只是为了让页面看起来不那么空而添加的 :3'
            }
        }
    };

    var currentLang = localStorage.getItem('i18nextLng') || 'en';
    if (!resources[currentLang]) currentLang = 'en';

    function translate(key) {
        return (resources[currentLang] && resources[currentLang].translation[key]) ||
               (resources.en && resources.en.translation[key]) ||
               key;
    }

    window.t = translate;

    function setDataI18nText(root) {
        $(root || document).find('[data-i18n]').each(function () {
            var key = $(this).attr('data-i18n');
            $(this).text(translate(key));
        });
    }

    function updatePlaceholders() {
        $('#addModal input[placeholder], #editModal input[placeholder]').attr('placeholder', translate('pleaseEnterValue'));
        $('.dataTables_filter input').attr('placeholder', translate('searchPlaceholder'));
    }

    function updateDataTableTranslations() {
        if (!$.fn.dataTable || !$.fn.dataTable.isDataTable('#myTable')) return;

        var table = $('#myTable').DataTable();

        $('#myTable thead th').eq(0).text(window.t('itemName'));
        $('#myTable thead th').eq(1).text(window.t('quantity'));
        $('#myTable thead th').eq(2).text(window.t('type'));
        $('#myTable thead th').eq(3).text(window.t('unitPrice'));
        $('#myTable thead th').eq(4).text(window.t('totalPrice'));

        var buttons = table.buttons().nodes().toArray();
        if (buttons[0]) $(buttons[0]).find('span').text(window.t('addNewItemButton'));
        if (buttons[1]) $(buttons[1]).find('span').text(window.t('saveDataButton'));
        if (buttons[2]) $(buttons[2]).find('span').text(window.t('newDataButton'));
        if (buttons[3]) $(buttons[3]).find('span').text(window.t('loadDataButton'));

        $('.dataTables_empty').text(window.t('emptyTable'));
        updatePlaceholders();

        $('.dataTables_scrollBody thead').css({
            visibility: 'collapse',
            height: 0
        });
    }

    function refreshContent(root) {
        setDataI18nText(root || document);
        updateDataTableTranslations();
        updatePlaceholders();
    }

    window.refreshContent = refreshContent;

    window.changeLanguage = function (lng) {
        if (!resources[lng]) lng = 'en';

        currentLang = lng;
        localStorage.setItem('i18nextLng', lng);

        document.documentElement.lang = lng === 'zh' ? 'zh-CN' : 'en';

        window.t = translate;
        refreshContent(document);
        updateLanguageToggleButton();
    };
    function updateLanguageToggleButton() {
        var btn = document.getElementById('languageToggleBtn');
        if (!btn) return;

        if (currentLang === 'en') {
            btn.textContent = '中文';
            btn.setAttribute('aria-label', 'Switch language to Chinese');
        } else {
            btn.textContent = 'EN';
            btn.setAttribute('aria-label', 'Switch language to English');
        }
    }

    function initPage() {
        document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

        refreshContent(document);

        if (typeof initializeDataTable === 'function' && $.fn.dataTable && !$.fn.dataTable.isDataTable('#myTable')) {
            initializeDataTable();
        }

        refreshContent(document);
        updateLanguageToggleButton();

        $('.modal').off('show.bs.modal.i18n shown.bs.modal.i18n')
            .on('show.bs.modal.i18n shown.bs.modal.i18n', function () {
                refreshContent(this);
            });
    }

    $(document).ready(initPage);

    window.toggleLanguage = function () {
        var nextLang = currentLang === 'en' ? 'zh' : 'en';
        window.changeLanguage(nextLang);
    };
})();
