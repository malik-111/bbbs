// script.js
let isAdminLoggedIn = false;
let bookedSlots = []; 

function getBookedSlots() {
    return fetch('/api/bookedSlots')
        .then(response => response.json())
        .catch(error => console.error('Error fetching booked slots:', error));
}

function saveBookedSlots(bookedSlots) {
    fetch('/api/bookedSlots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookedSlots),
    })
        .catch(error => console.error('Error saving booked slots:', error));
}

// Function to apply booked slots from the backend
function applyBookedSlots() {
    getBookedSlots().then(response => {
        const bookedSlots = response || [];
        
        if (Array.isArray(bookedSlots)) {
            bookedSlots.forEach(({ slotKey }) => {
                if (slotKey) {
                    const [dayIndex, hourIndex] = slotKey.split('-');
                    const slot = document.querySelector(`#calendar tr:nth-child(${parseInt(hourIndex) + 2}) td:nth-child(${parseInt(dayIndex) + 2})`);

                    if (slot) {
                        slot.classList.add('booked');
                    }
                }
            });
        }
    });
}

// Function to update calendar with booked slots
function updateCalendar() {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hoursOfDay = Array.from({ length: 12 }, (_, i) => `${i + 9}:00`);

    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    // Create header row with days of the week
    const headerRow = calendar.createTHead().insertRow();
    daysOfWeek.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });

    // Create time slots for each day
    hoursOfDay.forEach(hour => {
        const row = calendar.insertRow();

        // Display hour in the first cell of each row
        const timeCell = row.insertCell(0);
        timeCell.textContent = hour;

        // Create slots for each day
        daysOfWeek.forEach(day => {
            if (day !== 'Monday') {
                const slot = document.createElement('td');
                slot.className = 'slot';
                slot.textContent = hour;

                // Modify the click event to update booked slots and backend
                slot.addEventListener('click', () => {
                    if (isAdminLoggedIn) {
                        const dayIndex = daysOfWeek.indexOf(day);
                        const hourIndex = hoursOfDay.indexOf(hour);
                        const slotKey = `${dayIndex}-${hourIndex}`;

                        if (slot.classList.contains('booked')) {
                            // Unbook the slot
                            slot.classList.remove('booked');
                            bookedSlots = bookedSlots.filter(slot => slot.slotKey !== slotKey);
                        } else {
                            // Book the slot
                            slot.classList.add('booked');
                            bookedSlots.push({ slotKey, isBooked: true });
                        }

                        // Save the updated booked slots to the backend
                        saveBookedSlots(bookedSlots);
                    }
                });

                row.appendChild(slot);
            }
        });
    });
}

// Function to handle login/logout
function toggleLoginContainer() {
    const loginContainer = document.getElementById('login-container');
    if (isAdminLoggedIn) {
        // If admin is logged in, log them out and don't show the login container
        isAdminLoggedIn = false;
        document.getElementById('loginButton').textContent = 'Login';
        console.log("Admin logged out");
    } else {
        // If admin is not logged in, show the login container
        loginContainer.style.display = 'flex';
        console.log("Login container shown");
    }
}

function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginContainer = document.getElementById('login-container');
    const loginButton = document.getElementById('loginButton');

    if (isAdminLoggedIn) {
        // Admin is logged in, so log them out
        isAdminLoggedIn = false;
        loginButton.textContent = 'Login';
        toggleLoginContainer();
        console.log("Admin logged out");
    } else if (username === 'admin' && password === 'pass') {
        // Admin login
        isAdminLoggedIn = true;
        loginButton.textContent = 'Logout';
        updateCalendar(); // Add this line to update the calendar after login
        console.log("Admin logged in");

        window.addEventListener('beforeunload', () => {
            saveBookedSlots(bookedSlots);
        });        

        loginContainer.style.display = isAdminLoggedIn ? 'none' : 'flex';
    } else {
        alert('Invalid credentials. Try again.');
    }
    console.log("logged in");
}

// Add event listeners
document.getElementById('loginButton').addEventListener('click', toggleLoginContainer);
document.getElementById('submitLogin').addEventListener('click', loginUser);

// Call updateCalendar on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCalendar();
    applyBookedSlots();
});
