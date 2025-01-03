import * as vscode from 'vscode';
import axios from 'axios';
//import dotenv from 'dotenv'

// .env 파일의 환경 변수를 로드합니다.
//dotenv.config();

export function activate(context: vscode.ExtensionContext) {
    console.log('CodeShare extension activated'); // 활성화 로그
    let disposable = vscode.commands.registerCommand('codeshareExtension.sendCode', async () => {
        console.log('Send Code command executed'); // 명령어 실행 로그
        vscode.window.showInformationMessage(`Loading... (SendCode)`); // 실행중임 알림
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage("No active editor found.");
            return;
        }

        let code: string;

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection).trim();
        
        //사용자가 선택한 코드 있는지 확인. 없으면 전체 코드를 보낼 대상으로 선택
        if (selectedText.length > 0) {
        code = selectedText;
        } else {
        code = editor.document.getText();
        }


        try {
            const response = await axios.post(`https://send-code-back.vercel.app/submit`, { content: code });

            if (response.data && response.data.url) {
                const generatedUrl = response.data.url;

                // 클립보드에 URL 복사
                await vscode.env.clipboard.writeText(generatedUrl);

                // URL 복사 후 성공 팝업 메시지
                vscode.window.showInformationMessage(`URL copied to clipboard: ${generatedUrl}`);
            } else {
                vscode.window.showErrorMessage("Unexpected response from the server.");
            }
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to send code: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
