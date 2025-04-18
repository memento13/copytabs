document.addEventListener('DOMContentLoaded', function() {
  const copyButton = document.getElementById('copyButton');
  const statusDiv = document.getElementById('status');

  copyButton.addEventListener('click', async function() {
    try {
      // 현재 창의 모든 탭을 가져옵니다
      const tabs = await chrome.tabs.query({ currentWindow: true });
      
      // Set을 사용하여 중복된 URL을 제거합니다
      const uniqueUrls = [...new Set(tabs.map(tab => tab.url))];
      
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
}); 