const schedules = {
  "2025-12-19": [
    "3학년: 수시모집 합격자 등록 기간",
    "장영실 창의융합주간 시작",
    "1학년: 대건주니어 페스티벌",
    "3학년: 외박",
    "자습감독: 김경민 (1학년)",
    "자습감독: 문익준 (2학년)"
  ],

  "2025-12-20": [
    "장영실 창의융합주간",
    "자습감독: 이현우, 조아라, 권민영 (1학년)",
    "자습감독: 한희정, 이종영, 오세롬 (2학년)"
  ],

  "2025-12-21": [
    "장영실 창의융합주간",
    "3학년: 귀사",
    "자습감독: 김경민, 이정원, 이지연 (1학년)",
    "자습감독: 한진규, 서동주, 박동민 (2학년)"
  ],

  "2025-12-22": [
    "장영실 창의융합주간",
    "1학년: 다문화박람회",
    "자습감독: 김영미 (1학년)",
    "자습감독: 서정석 (2학년)"
  ],

  "2025-12-23": [
    "장영실 창의융합주간",
    "예비 신학생 미사 (19시)",
    "3학년: 수시충원 합격통보 마감",
    "자습감독: 강길재 (1학년)",
    "자습감독: 박동민 (2학년)"
  ],

  "2025-12-24": [
    "1, 2학년: 방학식",
    "3학년: 종업식",
    "전학년: 외박 (13:30)"
  ]
};
const scheduleBox = document.getElementById("today-schedule");

const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const date = String(today.getDate()).padStart(2, "0");

const todayKey = ${year}-${month}-${date};

if (schedules[todayKey]) {
  scheduleBox.innerHTML = `
    <ul>
      ${schedules[todayKey].map(item => <li>${item}</li>).join("")}
    </ul>
  `;
} else {
  scheduleBox.innerHTML = `
    <h3>오늘의 일정</h3>
    <p>오늘은 등록된 일정이 없습니다.</p>
  `;
}
