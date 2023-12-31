// script.js
let isAdminLoggedIn = false;

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
    updateCalendar();
    console.log("Admin logged in");
    loginContainer.style.display = isAdminLoggedIn ? 'none' : 'flex';
  } else {
    alert('Invalid credentials. Try again.');
  }
  console.log("logged in");
}

// Add event listeners
document.getElementById('loginButton').addEventListener('click', toggleLoginContainer);
document.getElementById('submitLogin').addEventListener('click', loginUser);

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

                // Add click event to book/unbook the slot
                slot.addEventListener('click', () => {
                    if (isAdminLoggedIn) {
                        if (slot.classList.contains('booked')) {
                            // Unbook the slot
                            slot.classList.remove('booked');
                        } else {
                            // Book the slot
                            slot.classList.add('booked');
                        }
                    }
                });

                row.appendChild(slot);
            }
        });
    });
}

updateCalendar(); // Add this line to display the calendar
