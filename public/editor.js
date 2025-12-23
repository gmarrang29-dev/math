// 1. DOM 콘텐츠가 모두 로드되면 에디터를 실행합니다.
document.addEventListener('DOMContentLoaded', function() {

  // 코드 하이라이트 플러그인 설정
  const { codeSyntaxHighlight } = toastui.Editor.plugin;

  // 2. '#editor' 요소를 찾아 에디터 인스턴스를 생성합니다.
  const editor = new toastui.Editor({
    el: document.querySelector('#editor'),
    height: '500px',
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical',
    initialValue: '',
    plugins: [codeSyntaxHighlight],
    hooks: {
      addImageBlobHook: async (blob, callback) => {
        console.log("서버로 전송해야 할 이미지 파일:", blob);
        // 임시 코드: 실제 서버 연결 시 이 부분을 수정해야 합니다.
        const fakeUrl = 'https://picsum.photos/500/300?random=' + Math.random();
        callback(fakeUrl, '이미지 설명');
      }
    }
  });

  // --- [추가된 핵심 로직] ---
  // 3. '글 작성' 버튼이 속한 폼(form)을 찾습니다.
  const writeForm = document.querySelector('#write-form');
  
  if (writeForm) {
    writeForm.addEventListener('submit', function(e) {
      // 폼이 실제로 서버로 전송되기 직전에 실행됩니다.
      
      // 에디터에 작성된 내용을 HTML 형식으로 가져옵니다.
      const editorHtmlContent = editor.getHTML();
      
      // html의 <input type="hidden" id="contents-hidden"> 요소를 찾아 값을 채워넣습니다.
      const hiddenInput = document.querySelector('#contents-hidden');
      if (hiddenInput) {
        hiddenInput.value = editorHtmlContent;
        console.log("에디터 내용이 hidden input에 복사되었습니다.");
      }
    });
  }
  // -----------------------

  // 기존 '돌아가기' 버튼 로직
  const mainButton = document.querySelector('.main-button');
  if (mainButton) {
    mainButton.addEventListener('click', function() {
        window.location.href = '/';                                     
    });
  }
});