//userData라는 이름의 null 배열을 만드는 함수
function initialize_user_data() {
    const initialUserData = [];
    localStorage.setItem('userData', JSON.stringify(initialUserData));
}

//로그인 함수
function login() {
    let user_id = document.getElementById('user_id').value;
    let password = document.getElementById('password').value;

    if (!(localStorage.userData)) {
        alert('아이디 또는 비밀번호를 잘못 입력했습니다. 아이디 또는 비밀번호를 다시 확인하세요.');
        document.getElementById('user_id').value = '';
        document.getElementById('password').value = '';
    } else {
        let userDataSet = JSON.parse(localStorage.getItem('userData'));

        const loggedInUser = userDataSet.find(user => user.user_id === user_id && user.password === password);

        if (userDataSet && userDataSet.some(user => user.user_id === user_id && user.password === password)) {
            alert('로그인 성공. 정상적으로 로그인 되었습니다.');

            localStorage.setItem('logined_user', JSON.stringify({
                user_id: loggedInUser.user_id,
                username: loggedInUser.username
            }));

            window.location.href = 'interface.html'; // 로그인 완료된 후 user interface html 파일 실행

        } else {
            alert('아이디 또는 비밀번호를 잘못 입력했습니다. 아이디 또는 비밀번호를 다시 확인하세요.');
            document.getElementById('user_id').value = '';
            document.getElementById('password').value = '';
        }
    }
}

//회원가입 함수 : 사용자 정보를 로컬스토리지 'userData'에 저장
function person() {
    let user_id = document.getElementById('user_id').value;
    let password = document.getElementById('password').value;
    let username = document.getElementById('username').value;


    if (!(localStorage.getItem('userData'))) {
        initialize_user_data();
        let userDataStored = JSON.parse(localStorage.getItem('userData'));
        if (userDataStored) {
            if (userDataStored.length <= 99) {
                // 새로운 사용자 정보를 추가
                let userData = {
                    user_id: user_id,
                    password: password,
                    username: username,
                };
                
                // 기존 사용자 정보 배열에 새로운 사용자 정보 추가
                userDataStored.push(userData);
                localStorage.setItem('userData', JSON.stringify(userDataStored));
                
                alert('회원가입이 정상적으로 완료되었습니다. 다시 로그인 화면으로 돌아갑니다.');
                go_to_login();
            } else {
                alert('사용자 정보 메모리가 가득 차서 새로운 사용자의 서비스 제공이 제한됩니다. 불편을 드려서 죄송합니다.');
                go_to_login();
            }
        }
    } else {
        let userDataStored = JSON.parse(localStorage.getItem('userData'));
        if (userDataStored && userDataStored.some(user => user.user_id === user_id)) {
            alert('중복된 아이디입니다. 다른 아이디를 사용해주세요.');
            document.getElementById('user_id').value = '';
            document.getElementById('password').value = '';
            document.getElementById('username').value = '';
        } else {
            if (userDataStored) {
                if (userDataStored.length <= 99) {
                    // 새로운 사용자 정보를 추가
                    let userData = {
                        user_id: user_id,
                        password: password,
                        username: username,
                    };

                    // 기존 사용자 정보 배열에 새로운 사용자 정보 추가
                    userDataStored.push(userData);
                    localStorage.setItem('userData', JSON.stringify(userDataStored));

                    alert('회원가입이 정상적으로 완료되었습니다. 다시 로그인 화면으로 돌아갑니다.');
                    go_to_login();
                } else {
                    alert('사용자 정보 메모리가 가득 차서 새로운 사용자의 서비스 제공이 제한됩니다. 불편을 드려서 죄송합니다.');
                    go_to_login();
                }
            } else {
                initialize_user_data();
            }
        }
    }
}

//사용자 인터페이스에서 username을 포함하여 display해주는 함수
function displayUsername() {
    let loggedInUserData = JSON.parse(localStorage.getItem('logined_user'));
    let usernameTitle = document.getElementById('usernameTitle');

    if (loggedInUserData) {
        let username = loggedInUserData.username;
        usernameTitle.textContent = `${username}님의 Smart Calendar`;
    }
}

//signup페이지를 실행시키는 함수
function go_to_signup() {
    window.location.href = 'signup.html';
}

//scheduler페이지를 실행시키는 함수
function go_to_scheduler() {
    window.location.href = 'scheduler.html';
}

//login페이지를 실행시키는 함수
function go_to_login() {
    window.location.href = 'login.html';
}

//login페이지를 실행시키는 함수
function go_to_interface() {
    window.location.href = 'interface.html';
}

function go_to_todays_task() {
    window.location.href = 'today.html'
}

function go_to_evaluation() {
    window.location.href = 'achievement.html'
}

//로그아웃 함수
function logout() {
    localStorage.setItem('logined_user', JSON.stringify({
        user_id: '',
        username: ''
    }));
    window.location.href = 'login.html';
    alert('성공적으로 로그아웃 되었습니다.');
}

// scheduler 관련 변수값
// Local Storage 키
var localStorageKey = "calendarEvents";
var event_max_id = 0;
var calendar;
// 231126 필드 충돌 대비 userData -> LoginUserData로 수정 시작
var LoginUserData = localStorage.getItem("logined_user");
var userId = (LoginUserData && JSON.parse(LoginUserData).user_id) || 'defaultId';


// Local Storage에서 데이터 불러오기
function loadPlansFromLocalStorage() {
    var events = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    displayPlansOnCalendar(events);

    return events;
}

// 달력에 이벤트 표시
function displayPlansOnCalendar(events) {
    var userEvents = events.filter(event => event.userid === userId);
    calendar.getEvents().forEach(function (existingEvent) {
        existingEvent.remove(); // 각 이벤트를 제거
    });

    userEvents.forEach(function (event) {
        calendar.addEvent(event);
    });
}

// 현재 events에 데이터를 추가하고, Local Storage에 데이터 저장하기
function createPlan(eventData) {
    var events = loadPlansFromLocalStorage();
    events.push(eventData);
    localStorage.setItem(localStorageKey, JSON.stringify(events));

    updateMaxId(events);
    displayPlansOnCalendar(events);
}

// 이벤트 배열에서 최대 ID 찾기
function updateMaxId(events) {
    events.forEach(function (eventData) {
        if (eventData.eventid > event_max_id) {
            event_max_id = eventData.eventid;
        }
    });
}

// FullCalendar에서 이벤트 ID로 이벤트 찾기
function getPlanById(eventId) {

    var events = calendar.getEvents();
    for (var i = 0; i < events.length; i++) {
        if (events[i].extendedProps.eventid == eventId) {
            return events[i];
        }
    }
    return null;
}

// 편집용 모달 열기
function openEditEventModal(info) {
    document.getElementById('editTitle').value = info.event.title;
    document.getElementById('editCategory').value = info.event.extendedProps.category;
    document.getElementById('editDescription').value = info.event.extendedProps.description;
    document.getElementById('editStartDate').value = info.event.start.toISOString().slice(0, -8);
    document.getElementById('editEndDate').value = info.event.end.toISOString().slice(0, -8);
    document.getElementById('editPriority').value = info.event.extendedProps.priority;

    // 기존 이벤트 정보를 editPlan 함수에 전달하기 위해 저장
    document.getElementById('editEventModal').dataset.eventId = info.event.extendedProps.eventid;

    // 모달 열기
    document.getElementById("editEventModal").style.display = "block";
}

// 편집용 모달 닫기
function closeEditEventModal() {
    document.getElementById("editEventModal").style.display = "none";
}

// 이벤트 수정
function editPlan() {
    if (confirm("이 일정을 수정하시겠습니까?")) {
        var eventId = document.getElementById('editEventModal').dataset.eventId;
        var editedEvent = {
            title: document.getElementById('editTitle').value.trim(),
            category: document.getElementById('editCategory').value,
            description: document.getElementById('editDescription').value.trim(),
            start: document.getElementById('editStartDate').value,
            end: document.getElementById('editEndDate').value,
            priority: document.getElementById('editPriority').value,
        };

        // 유효성 검사
        if (editedEvent.title === "" || editedEvent.description === "") {
            alert("제목과 내용은 반드시 입력해야 합니다.");
            return;
        }

        if (new Date(editedEvent.start) >= new Date(editedEvent.end)) {
            alert("종료 시간은 시작 시간보다 늦어야 합니다.");
            return;
        }

        // 수정된 이벤트를 FullCalendar에 반영
        var calendarEvent = getPlanById(eventId);
        if (calendarEvent) {
            calendarEvent.setProp('title', editedEvent.title);
            calendarEvent.setExtendedProp('category', editedEvent.category);
            calendarEvent.setExtendedProp('description', editedEvent.description);
            calendarEvent.setStart(editedEvent.start);
            calendarEvent.setEnd(editedEvent.end);
            calendarEvent.setExtendedProp('priority', editedEvent.priority);

            // 로컬 스토리지에서도 데이터 업데이트
            editPlanInLocalStorage(eventId, editedEvent);
        } else {
            console.error("이벤트를 찾을 수 없습니다.");
        }

        // 모달 닫기
        closeEditEventModal();
    }
}

// 수정된 이벤트를 LocalStorage에 업데이트
function editPlanInLocalStorage(eventId, eventData) {
    var events = loadPlansFromLocalStorage();

    // 이벤트 ID를 사용하여 해당 이벤트 찾기
    var updatedEvents = events.map(function (event) {
        if (event.eventid == eventId) {
            return {
                title: eventData.title,
                category: eventData.category,
                description: eventData.description,
                start: eventData.start,
                end: eventData.end,
                priority: eventData.priority,
                eventid: eventId,
                userid: userId,
                achievement: event.achievement
            };
        } else {
            return event;
        }
    });

    localStorage.setItem(localStorageKey, JSON.stringify(updatedEvents));
    events = loadPlansFromLocalStorage();
}

// Local Storage에서 이벤트 삭제
function deletePlanInLocalStorage(eventId) {
    var events = loadPlansFromLocalStorage();
    var updatedEvents = events.filter(function (event) {
        return event.eventid != eventId;
    });

    localStorage.setItem(localStorageKey, JSON.stringify(updatedEvents));

    events = loadPlansFromLocalStorage();
    updateMaxId(events);
    displayPlansOnCalendar(events);
}

function deletePlan() {
    if (confirm("이 일정을 삭제하시겠습니까?")) {

        // 클릭한 이벤트의 ID 가져오기
        var eventId = document.getElementById('editEventModal').dataset.eventId;
        deletePlanInLocalStorage(eventId);
        closeEditEventModal();
    }
}

// 일정 생성 및 수정 모달 제어 코드
var modal = document.getElementById("eventModal");
var editEventModal = document.getElementById("editEventModal");
var btn = document.getElementById("addEventButton");
var span = document.getElementsByClassName("close")[0];
var spanEdit = document.getElementsByClassName("close")[1];

btn.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

spanEdit.onclick = function () {
    editEventModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal || event.target == editEventModal) {
        modal.style.display = "none";
        editEventModal.style.display = "none";
    }
}


// Scheduler 로컬 스토리지 관련 코드
var localStorageKey = "calendarEvents";
document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'Asia/Seoul',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        events: [
        ],

        eventClick: function (info) {
            openEditEventModal(info);
        }
    });
    calendar.render();
});

// 달력 생성 및 일정 수정 버튼
document.addEventListener('DOMContentLoaded', function () {

    userId = (LoginUserData && JSON.parse(LoginUserData).user_id) || 'defaultId';
    // 231126 필드 충돌 대비 userData -> LoginUserData로 수정 끝

    var calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'Asia/Seoul',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',

        eventClick: function (info) {
            if (confirm("'" + info.event.title + "' 일정을 수정하시겠습니까 ?")) {
                openEditEventModal(info);
            }
        }
    });
    var events = loadPlansFromLocalStorage();
    updateMaxId(events);
    calendar.render();
});

// 일정 추가 폼 제출 핸들러 및 유효성 검사
document.getElementById('addEventForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var title = document.getElementById('title').value.trim();
    var description = document.getElementById('description').value.trim();
    var start = document.getElementById('startDate').value;
    var end = document.getElementById('endDate').value;

    if (title === "" || description === "") {
        alert("제목과 내용은 반드시 입력해야 합니다.");
        return;
    }

    if (start === "" || end === "") {
        alert("시작 시간과 종료 시간은 반드시 입력해야 합니다.");
        return;
    }

    if (new Date(start) >= new Date(end)) {
        alert("종료 시간은 시작 시간보다 늦어야 합니다.");
        return;
    }

    var eventData = {
        title: title,
        category: document.getElementById('category').value,
        description: description,
        start: start,
        end: end,
        priority: document.getElementById('priority').value,
        achievement: 0,
        eventid: ++event_max_id,
        userid: userId
    };
    createPlan(eventData);

    document.getElementById("eventModal").style.display = "none";
    document.getElementById('addEventForm').reset();

});

window.onload = function () {
    displayUsername();
};


/////////////////////////////////* today *///////////////////////////////
// Local Storage 키
var localStorageKey = "calendarEvents";
var event_max_id = 0;
var calendar;
var userId = 'defaultId';


var achidata = JSON.parse(localStorage.getItem(`acdata_${userId}`)) || {};


function updateStatusDisplay(status) {
    var statusDisplay = document.getElementById("statusDisplay");
    statusDisplay.innerHTML = "Current Status: " + status;
}

// Function to remove acdata from LocalStorage
document.addEventListener('DOMContentLoaded', function () {
    for (var d = new Date('2023-01-01'); d <= new Date('2023-12-31'); d.setDate(d.getDate() + 1)) {
        var dateString = d.toISOString().slice(0, 10);
        if (!achidata.hasOwnProperty(dateString)) {
            achidata[dateString] = -1;
        }
    }

    // Save initialized achidata to local storage
   
    console.log("DOM Content Loaded");
    var calendarEl = document.getElementById('calendar');
    var achievementBtn = document.getElementById("acheivement");
    function saveDataToLocalStorage() {
        localStorage.setItem(`acdata_${userId}`, JSON.stringify(achidata));
    }
    function someFunction() {
        // Access data here
        console.log(achidata);
    }
    function updateData() {
        // Modify data object
        achidata.someKey = 'someValue';
        // Save the updated data to localStorage
        saveDataToLocalStorage();
    }

    achievementBtn.onclick = function () {
        var achievementStartDate = document.getElementById('achievementStartDate').value;
        var achievementEndDate = document.getElementById('achievementEndDate').value;

        // Create modal container
        var dateModal = document.createElement("div");
        dateModal.id = "dateModal";

        // Create modal content
        var modalContent = document.createElement("div");
        modalContent.className = "date-modal-content";

        // Create 시작 시간 label and input
        var startLabel = document.createElement("label");
        startLabel.className = "date-modal-label";
        startLabel.innerText = "시작 시간:";

        var startDateInput = document.createElement("input");
        startDateInput.className = "date-modal-input";
        startDateInput.setAttribute("type", "datetime-local");
        startDateInput.setAttribute("id", "startDate_achi");
        startDateInput.setAttribute("name", "startDate_achi");
        startDateInput.setAttribute("step", "1");

        // Create 종료 시간 label and input
        var endLabel = document.createElement("label");
        endLabel.className = "date-modal-label";
        endLabel.innerText = "종료 시간:";

        var endDateInput = document.createElement("input");
        endDateInput.className = "date-modal-input";
        endDateInput.setAttribute("type", "datetime-local");
        endDateInput.setAttribute("id", "endDate_achi");
        endDateInput.setAttribute("name", "");
        endDateInput.setAttribute("step", "1");

        // Create submit button
        var submitButton = document.createElement("button");
        submitButton.className = "date-modal-button";
        submitButton.innerText = "Submit";

        // Append elements to modal content
        modalContent.appendChild(startLabel);
        modalContent.appendChild(startDateInput);
        modalContent.appendChild(document.createElement("br")); // Line break for spacing
        modalContent.appendChild(endLabel);
        modalContent.appendChild(endDateInput);
        modalContent.appendChild(document.createElement("br")); // Line break for spacing
        modalContent.appendChild(submitButton);

        // Append modal content to modal container
        dateModal.appendChild(modalContent);

        // Append modal container to the body
        document.body.appendChild(dateModal);

        // Display the modal
        dateModal.style.display = "block";

        var additionalButtonsContainer = document.createElement("div");


        // Create additional buttons
        var additionalButton1 = document.createElement("button");
        additionalButton1.innerText = "Additional Button 1";
        additionalButton1.className = "additional-button";
        additionalButton1.onclick = function () {
            // Handle the click event for Additional Button 1
            console.log("Additional Button 1 clicked");
            var startDate = new Date(startDateInput.value);
            startDate.setHours(0, 0, 0, 0);
            var endDate = new Date(endDateInput.value);
            endDate.setHours(0, 0, 0, 0);

            // Iterate through each date and update data object
            var currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                var year = currentDate.getFullYear();
                var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                var day = currentDate.getDate().toString().padStart(2, '0');
                var currentDateString = `${year}-${month}-${day}`;

                achidata[currentDateString] = 1;

                // Move to the next date
                currentDate.setDate(currentDate.getDate() + 1);
            }
            saveDataToLocalStorage();

            console.log("Additional Button 1 clicked");
            // Log or display all data

            console.log("All data:", achidata);
            if (!startDateInput.value || !endDateInput.value) {
                alert("날짜를 선택하세요"); // Display an alert if dates are not selected
                return;
            } else {
                alert("추가 완료!");
            }
        };

        var additionalButton2 = document.createElement("button");
        additionalButton2.innerText = "Additional Button 2";
        additionalButton2.className = "additional-button";
        additionalButton2.onclick = function () {
            // Handle the click event for Additional Button 2
            console.log("Additional Button 2 clicked");
            var startDate = new Date(startDateInput.value);
            startDate.setHours(0, 0, 0, 0);
            var endDate = new Date(endDateInput.value);
            endDate.setHours(0, 0, 0, 0);

            // Iterate through each date and update data object
            var currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                var year = currentDate.getFullYear();
                var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                var day = currentDate.getDate().toString().padStart(2, '0');
                var currentDateString = `${year}-${month}-${day}`;

                achidata[currentDateString] = 0;

                // Move to the next date
                currentDate.setDate(currentDate.getDate() + 1);
            }
            saveDataToLocalStorage();

            console.log("Additional Button 1 clicked");
            // Log or display all data

            console.log("All data:", achidata);

            if (!startDateInput.value || !endDateInput.value) {
                alert("날짜를 선택하세요"); // Display an alert if dates are not selected
                return;
            } else {
                alert("추가 완료!");
            }
        };

        // Append additional buttons to the container
        additionalButtonsContainer.appendChild(additionalButton1);
        additionalButtonsContainer.appendChild(additionalButton2);

        // Append the container to the modal content
        modalContent.appendChild(additionalButtonsContainer);

        // Set up event listener for the submit button
        submitButton.onclick = function () {
            dateModal.style.display = "none";
        };
    }

    calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'Asia/Seoul',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',

        eventClick: function (info) {
            if (confirm("'" + info.event.title + "' 일정을 수정하시겠습니까 ?")) {
                openEditEventModal(info);
            }
        }
    });

    var events = loadPlansFromLocalStorage();
    updateMaxId(events);
    calendar.render();
});

// Local Storage에서 데이터 불러오기
function loadPlansFromLocalStorage() {
    var events = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    displayPlansOnCalendar(events);

    return events;
}

// 달력에 이벤트 표시
function displayPlansOnCalendar(events) {
    var userEvents = events.filter(event => event.userid === userId);
    calendar.getEvents().forEach(function (existingEvent) {
        existingEvent.remove(); // 각 이벤트를 제거
    });

    userEvents.forEach(function (event) {
        calendar.addEvent(event);
    });
}

// 현재 events에 데이터를 추가하고, Local Storage에 데이터 저장하기
function createPlan(eventData) {
    var events = loadPlansFromLocalStorage();
    events.push(eventData);
    localStorage.setItem(localStorageKey, JSON.stringify(events));

    updateMaxId(events);
    displayPlansOnCalendar(events);
}

// 이벤트 배열에서 최대 ID 찾기
function updateMaxId(events) {
    events.forEach(function (eventData) {
        if (eventData.eventid > event_max_id) {
            event_max_id = eventData.eventid;
        }
    });
}

// FullCalendar에서 이벤트 ID로 이벤트 찾기
function getPlanById(eventId) {

    var events = calendar.getEvents();
    for (var i = 0; i < events.length; i++) {
        if (events[i].extendedProps.eventid == eventId) {
            return events[i];
        }
    }
    return null;
}

// 편집용 모달 열기
function openEditEventModal(info) {
    document.getElementById('editTitle').value = info.event.title;
    document.getElementById('editCategory').value = info.event.extendedProps.category;
    document.getElementById('editDescription').value = info.event.extendedProps.description;
    document.getElementById('editStartDate').value = info.event.start.toISOString().slice(0, -8);
    document.getElementById('editEndDate').value = info.event.end.toISOString().slice(0, -8);
    document.getElementById('editPriority').value = info.event.extendedProps.priority;

    // 기존 이벤트 정보를 editPlan 함수에 전달하기 위해 저장
    document.getElementById('editEventModal').dataset.eventId = info.event.extendedProps.eventid;

    // 모달 열기
    document.getElementById("editEventModal").style.display = "block";
}

// 편집용 모달 닫기
function closeEditEventModal() {
    document.getElementById("editEventModal").style.display = "none";
}

// 이벤트 수정
function editPlan() {
    if (confirm("이 일정을 수정하시겠습니까?")) {
        var eventId = document.getElementById('editEventModal').dataset.eventId;
        var editedEvent = {
            title: document.getElementById('editTitle').value.trim(),
            category: document.getElementById('editCategory').value,
            description: document.getElementById('editDescription').value.trim(),
            start: document.getElementById('editStartDate').value,
            end: document.getElementById('editEndDate').value,
            priority: document.getElementById('editPriority').value,
        };

        // 유효성 검사
        if (editedEvent.title === "" || editedEvent.description === "") {
            alert("제목과 내용은 반드시 입력해야 합니다.");
            return;
        }

        if (new Date(editedEvent.start) >= new Date(editedEvent.end)) {
            alert("종료 시간은 시작 시간보다 늦어야 합니다.");
            return;
        }

        // 수정된 이벤트를 FullCalendar에 반영
        var calendarEvent = getPlanById(eventId);
        if (calendarEvent) {
            calendarEvent.setProp('title', editedEvent.title);
            calendarEvent.setExtendedProp('category', editedEvent.category);
            calendarEvent.setExtendedProp('description', editedEvent.description);
            calendarEvent.setStart(editedEvent.start);
            calendarEvent.setEnd(editedEvent.end);
            calendarEvent.setExtendedProp('priority', editedEvent.priority);

            // 로컬 스토리지에서도 데이터 업데이트
            editPlanInLocalStorage(eventId, editedEvent);
        } else {
            console.error("이벤트를 찾을 수 없습니다.");
        }

        // 모달 닫기
        closeEditEventModal();
    }
}

// 수정된 이벤트를 LocalStorage에 업데이트
function editPlanInLocalStorage(eventId, eventData) {
    var events = loadPlansFromLocalStorage();

    // 이벤트 ID를 사용하여 해당 이벤트 찾기
    var updatedEvents = events.map(function (event) {
        if (event.eventid == eventId) {
            return {
                title: eventData.title,
                category: eventData.category,
                description: eventData.description,
                start: eventData.start,
                end: eventData.end,
                priority: eventData.priority,
                eventid: eventId,
                userid: userId
            };
        } else {
            return event;
        }
    });

    localStorage.setItem(localStorageKey, JSON.stringify(updatedEvents));
    events = loadPlansFromLocalStorage();
}

// Local Storage에서 이벤트 삭제
function deletePlanInLocalStorage(eventId) {
    var events = loadPlansFromLocalStorage();
    var updatedEvents = events.filter(function (event) {
        return event.eventid != eventId;
    });

    localStorage.setItem(localStorageKey, JSON.stringify(updatedEvents));

    events = loadPlansFromLocalStorage();
    updateMaxId(events);
    displayPlansOnCalendar(events);
}

function deletePlan() {
    if (confirm("이 일정을 삭제하시겠습니까?")) {

        // 클릭한 이벤트의 ID 가져오기
        var eventId = document.getElementById('editEventModal').dataset.eventId;
        deletePlanInLocalStorage(eventId);
        closeEditEventModal();
    }
}

// 모달 제어 코드
var modal = document.getElementById("eventModal");
var editEventModal = document.getElementById("editEventModal");
var btn = document.getElementById("addEventButton");
var span = document.getElementsByClassName("close")[0];
var spanEdit = document.getElementsByClassName("close")[1];

btn.onclick = function () {
    // Set the default values for start and end date and time
    var today = new Date();
    var currentDateString = today.toISOString().slice(0, 16);

    document.getElementById('startDate').value = currentDateString;
    document.getElementById('endDate').value = currentDateString;

    modal.style.display = "block";
}
span.onclick = function () {
    modal.style.display = "none";
}

spanEdit.onclick = function () {
    editEventModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal || event.target == editEventModal) {
        modal.style.display = "none";
        editEventModal.style.display = "none";
    }
}


// URL에서 쿼리 파라미터를 파싱하는 함수
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return false;
}

// 사용자 아이디를 URL에서 추출하고 변수에 저장
var userId = getQueryVariable("user_id");

// userId 사용 예시
document.addEventListener('DOMContentLoaded', function () {
    if (userId) {
        // 여기에 userId를 사용하는 코드를 추가
        console.log("Logged in User ID (Schedler):", userId);
    } else {
        console.log("No User ID found in URL");
    }
});
