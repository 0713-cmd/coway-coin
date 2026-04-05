export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST 요청만 가능합니다.' });

  try {
    // 1. 부산대 맞춤법 검사기에 텍스트 전송
    const response = await fetch('https://speller.cs.pusan.ac.kr/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ text1: req.body.text })
    });

    const html = await response.text();

    // 2. 부산대 서버가 뱉어내는 HTML에서 실제 교정 데이터(JSON)만 정규식으로 추출
    const match = html.match(/data = (\[.*?\]);/s);
    
    if (match && match[1]) {
      const parsedData = JSON.parse(match[1]);
      return res.status(200).json({ success: true, data: parsedData });
    } else {
      // 오류가 없거나 파싱 실패 시 빈 배열 반환
      return res.status(200).json({ success: true, data: [] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: '부산대 서버 통신 에러' });
  }
}
