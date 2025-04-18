document.addEventListener('DOMContentLoaded', async function() {
  const copyButton = document.getElementById('copyButton');
  const statusDiv = document.getElementById('status');
  const copySelectedButton = document.getElementById('copySelectedButton');
  const sortSwitch = document.getElementById('sortSwitch');

  // 저장된 정렬 설정을 로드
  const { shouldSort = true } = await chrome.storage.local.get('shouldSort');
  sortSwitch.checked = shouldSort;

  // 정렬 스위치 상태 변경 시 설정 저장
  sortSwitch.addEventListener('change', function() {
    chrome.storage.local.set({ shouldSort: this.checked });
  });

  copyButton.addEventListener('click', async function() {
    try {
      // 현재 창의 모든 탭을 가져옵니다
      const tabs = await chrome.tabs.query({ currentWindow: true });
      // index 순서대로 정렬
      tabs.sort((a, b) => a.index - b.index);
      
      // URL 배열을 만들고, 정렬 스위치가 켜져있을 경우에만 알파벳 정렬합니다
      let uniqueUrls = [...new Set(tabs.map(tab => tab.url))];
      if (sortSwitch.checked) {
        uniqueUrls = uniqueUrls.sort();
      }
      
      // URL들을 줄바꿈으로 구분하여 문자열로 만듭니다
      const urls = uniqueUrls.join('\n');
      
      // 클립보드에 복사
      await navigator.clipboard.writeText(urls);
      
      // 성공 메시지 표시 (중복 제거된 탭 수 표시)
      statusDiv.textContent = `Successfully copied ${uniqueUrls.length} unique tab URLs to clipboard!`;
      statusDiv.className = 'success';
      statusDiv.style.display = 'block';
    } catch (error) {
      // 에러 메시지 표시
      statusDiv.textContent = 'Error: ' + error.message;
      statusDiv.className = 'error';
      statusDiv.style.display = 'block';
    }
  });

  copySelectedButton.addEventListener('click', async function() {
    try {
      // 현재 창의 모든 탭을 가져옵니다
      const tabs = await chrome.tabs.query({ currentWindow: true });
      // index 순서대로 정렬
      tabs.sort((a, b) => a.index - b.index);
      const selectedTabs = tabs.filter(t => t.highlighted);
      
      // URL 배열을 만들고, 정렬 스위치가 켜져있을 경우에만 알파벳 정렬합니다
      let uniqueUrls = [...new Set(selectedTabs.map(t => t.url))];
      if (sortSwitch.checked) {
        uniqueUrls = uniqueUrls.sort();
      }
      
      const urls = uniqueUrls.join('\n');
      await navigator.clipboard.writeText(urls);
      statusDiv.textContent = `Successfully copied ${uniqueUrls.length} unique tab URLs to clipboard!`;
      statusDiv.className = 'success';
      statusDiv.style.display = 'block';
    } catch (error) {
      statusDiv.textContent = 'Error: ' + error.message;
      statusDiv.className = 'error';
      statusDiv.style.display = 'block';
    }
  });
}); 