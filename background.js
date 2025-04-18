// 확장프로그램 설치 시 컨텍스트 메뉴 생성
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyAllTabs",
    title: "Copy All Tabs",
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: "copySelectedTabs",
    title: "Copy Selected Tabs",
    contexts: ["all"]
  });
});

// 컨텍스트 메뉴 클릭 이벤트 처리
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if(info.menuItemId === "copySelectedTabs"){
    try {
      const tabs = await chrome.tabs.query({ windowId: tab.windowId });
      const selectedTabs = tabs.filter(t => t.highlighted);
      
      // Set을 사용하여 중복된 URL을 제거합니다
      const uniqueUrls = [...new Set(selectedTabs.map(t => t.url))];
      
      // URL들을 줄바꿈으로 구분하여 문자열로 만듭니다
      const urls = uniqueUrls.join('\n');
      
      // 클립보드에 복사
      await navigator.clipboard.writeText(urls);

      // 알림으로 성공 메시지 표시
      chrome.notifications.create({
        type: 'basic',
        title: 'Copy Tabs',
        message: `Successfully copied ${uniqueUrls.length} unique tab URLs to clipboard!`
      });
    } catch (error) {
      // 에러 알림 표시
      chrome.notifications.create({
        type: 'basic',
        title: 'Error',
        message: 'Failed to copy tabs: ' + error.message
      });
    }
  }

  if (info.menuItemId === "copyAllTabs") {
    try {
      // 현재 창의 모든 탭을 가져옵니다
      const tabs = await chrome.tabs.query({ currentWindow: true });
      
      // Set을 사용하여 중복된 URL을 제거합니다
      const uniqueUrls = [...new Set(tabs.map(tab => tab.url))];
      
      // URL들을 줄바꿈으로 구분하여 문자열로 만듭니다
      const urls = uniqueUrls.join('\n');
      
      // 클립보드에 복사
      await navigator.clipboard.writeText(urls);
      
      // 알림으로 성공 메시지 표시
      chrome.notifications.create({
        type: 'basic',
        title: 'Copy Tabs',
        message: `Successfully copied ${uniqueUrls.length} unique tab URLs to clipboard!`
      });
    } catch (error) {
      // 에러 알림 표시
      chrome.notifications.create({
        type: 'basic',
        title: 'Error',
        message: 'Failed to copy tabs: ' + error.message
      });
    }
  }
}); 