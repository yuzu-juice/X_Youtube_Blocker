chrome.runtime.onInstalled.addListener(async () => {
    console.log('X Youtube Blocker installed');

    // 初期設定
    await chrome.storage.sync.set({
        blockX: true,
        blockYoutube: true,
    });

    await updateBlockingRules();
});

chrome.storage.onChanged.addListener(async (changes) => {
    if (changes.blockX || changes.blockYoutube) {
        await updateBlockingRules();
    }
});

async function updateBlockingRules() {
    try {
        const settings = await chrome.storage.sync.get(['blockX', 'blockYoutube']);

        // 既存ルールを削除
        const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
        if (existingRules.length > 0) {
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: existingRules.map(rule => rule.id)
            });
        }

        const newRules = [];
        const blockedUrl = chrome.runtime.getURL('blocked.html');

        // X/Twitter ブロック
        if (settings.blockX !== false) {
            newRules.push(
                {
                    id: 1,
                    priority: 1,
                    action: { type: 'redirect', redirect: { url: blockedUrl } },
                    condition: { urlFilter: '*://x.com/*', resourceTypes: ['main_frame'] }
                },
                {
                    id: 2,
                    priority: 1,
                    action: { type: 'redirect', redirect: { url: blockedUrl } },
                    condition: { urlFilter: '*://twitter.com/*', resourceTypes: ['main_frame'] }
                }
            );
        }

        // YouTube ブロック
        if (settings.blockYoutube !== false) {
            newRules.push(
                {
                    id: 3,
                    priority: 1,
                    action: { type: 'redirect', redirect: { url: blockedUrl } },
                    condition: { urlFilter: '*://www.youtube.com/*', resourceTypes: ['main_frame'] }
                },
                {
                    id: 4,
                    priority: 1,
                    action: { type: 'redirect', redirect: { url: blockedUrl } },
                    condition: { urlFilter: '*://youtube.com/*', resourceTypes: ['main_frame'] }
                }
            );
        }

        if (newRules.length > 0) {
            await chrome.declarativeNetRequest.updateDynamicRules({ addRules: newRules });
        }

        console.log(`Blocking rules updated: ${newRules.length} rules`);
    } catch (error) {
        console.error('Failed to update blocking rules:', error);
    }
}
