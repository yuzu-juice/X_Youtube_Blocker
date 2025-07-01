document.addEventListener('DOMContentLoaded', async () => {
    const blockX = document.getElementById('blockX');
    const blockYoutube = document.getElementById('blockYoutube');

    // 設定読み込み
    const settings = await chrome.storage.sync.get(['blockX', 'blockYoutube']);
    blockX.checked = settings.blockX !== false;
    blockYoutube.checked = settings.blockYoutube !== false;

    // 設定保存
    const saveSettings = () => {
        chrome.storage.sync.set({
            blockX: blockX.checked,
            blockYoutube: blockYoutube.checked,
        });
    };

    blockX.addEventListener('change', saveSettings);
    blockYoutube.addEventListener('change', saveSettings);
});
