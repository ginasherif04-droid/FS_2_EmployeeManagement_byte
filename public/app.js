let token = localStorage.getItem("token");

let editingEmployeeId = null;


/* ================= LOGIN ================= */

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const message = document.getElementById("login-message");

    message.textContent = "";

    try {

        const response = await fetch("/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (!response.ok) {

            message.textContent = data.message;

            return;
        }

        token = data.token;

        localStorage.setItem("token", token);

        document.getElementById("login-section").style.display = "none";

        document.getElementById("employee-section").style.display = "flex";

        loadEmployees();

    } catch (error) {

        message.textContent = "Unable to connect to the server.";

    }
}


/* ================= LOAD EMPLOYEES ================= */

async function loadEmployees() {

    try {

        const response = await fetch("/api/employees");

        const employees = await response.json();

        const employeeList =
            document.getElementById("employee-list");

        employeeList.innerHTML = "";

        document.getElementById("total-employees").textContent =
            employees.length;

        document.getElementById("employee-count").textContent =
            `${employees.length} employee${employees.length === 1 ? "" : "s"}`;


        /* Count unique departments */

        const departments = new Set(
            employees.map(employee => employee.department)
        );

        document.getElementById("total-departments").textContent =
            departments.size;


        /* Empty state */

        if (employees.length === 0) {

            employeeList.innerHTML = `
                <div style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px;
                    color: #888;
                ">
                    <div style="font-size: 45px; margin-bottom: 15px;">
                        👥
                    </div>

                    <h3>No employees yet</h3>

                    <p style="margin-top: 8px;">
                        Add your first employee to get started.
                    </p>
                </div>
            `;

            return;
        }


        employees.forEach(employee => {

            const initial =
                employee.name.charAt(0).toUpperCase();


            employeeList.innerHTML += `

                <div class="employee-card">

                    <div class="employee-top">

                        <div class="employee-info">

                            <div class="avatar">
                                ${initial}
                            </div>

                            <div>

                                <h3>
                                    ${employee.name}
                                </h3>

                                <p>
                                    ${employee.email}
                                </p>

                            </div>

                        </div>

                        <span class="department-badge">
                            ${employee.department}
                        </span>

                    </div>


                    <div class="employee-details">

                        <div class="detail">

                            <span>Position</span>

                            <span>
                                ${employee.position}
                            </span>

                        </div>


                        <div class="detail">

                            <span>Phone</span>

                            <span>
                                ${employee.phone || "N/A"}
                            </span>

                        </div>

                    </div>


                    <div class="employee-actions">

                        <button
                            class="edit-button"
                            onclick="editEmployee('${employee._id}')"
                        >
                            ✏ Edit
                        </button>

                        <button
                            class="delete-button"
                            onclick="deleteEmployee('${employee._id}')"
                        >
                            🗑 Delete
                        </button>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.error(
            "Failed to load employees:",
            error
        );

    }
}


/* ================= OPEN ADD MODAL ================= */

function openModal() {

    editingEmployeeId = null;

    document.getElementById("modal-title").textContent =
        "Add Employee";

    clearForm();

    document.getElementById("employee-modal").style.display =
        "flex";
}


/* ================= CLOSE MODAL ================= */

function closeModal() {

    document.getElementById("employee-modal").style.display =
        "none";

    editingEmployeeId = null;

    clearForm();
}


/* ================= SAVE EMPLOYEE ================= */

async function saveEmployee() {

    const employee = {

        name: document.getElementById("name").value.trim(),

        email:
            document.getElementById("employeeEmail").value.trim(),

        department:
            document.getElementById("department").value.trim(),

        position:
            document.getElementById("position").value.trim(),

        phone:
            document.getElementById("phone").value.trim()

    };


    /* Basic validation */

    if (
        !employee.name ||
        !employee.email ||
        !employee.department ||
        !employee.position
    ) {

        alert(
            "Please fill in all required fields."
        );

        return;
    }


    try {

        let response;


        /* EDIT */

        if (editingEmployeeId) {

            response = await fetch(
                `/api/employees/${editingEmployeeId}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(employee)

                }
            );

        }


        /* CREATE */

        else {

            response = await fetch(
                "/api/employees",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(employee)

                }
            );

        }


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;
        }


        if (editingEmployeeId) {

            alert(
                "Employee updated successfully!"
            );

        } else {

            alert(
                "Employee added successfully!"
            );

        }


        closeModal();

        loadEmployees();

    } catch (error) {

        alert(
            "Something went wrong. Please try again."
        );

    }
}


/* ================= EDIT EMPLOYEE ================= */

async function editEmployee(id) {

    try {

        const response =
            await fetch("/api/employees");

        const employees =
            await response.json();

        const employee =
            employees.find(emp => emp._id === id);


        if (!employee) {

            alert("Employee not found.");

            return;
        }


        editingEmployeeId = id;


        document.getElementById("modal-title").textContent =
            "Edit Employee";


        document.getElementById("name").value =
            employee.name;

        document.getElementById("employeeEmail").value =
            employee.email;

        document.getElementById("department").value =
            employee.department;

        document.getElementById("position").value =
            employee.position;

        document.getElementById("phone").value =
            employee.phone || "";


        document.getElementById("employee-modal").style.display =
            "flex";

    } catch (error) {

        alert(
            "Failed to load employee information."
        );

    }
}


/* ================= DELETE ================= */

async function deleteEmployee(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this employee?"
    );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(`/api/employees/${id}`, {

                method: "DELETE",

                headers: {

                    "Authorization":
                        `Bearer ${token}`

                }

            });


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.message);

            return;
        }


        alert(
            "Employee deleted successfully!"
        );


        loadEmployees();

    } catch (error) {

        alert(
            "Failed to delete employee."
        );

    }
}


/* ================= CLEAR FORM ================= */

function clearForm() {

    document.getElementById("name").value = "";

    document.getElementById("employeeEmail").value = "";

    document.getElementById("department").value = "";

    document.getElementById("position").value = "";

    document.getElementById("phone").value = "";
}


/* ================= LOGOUT ================= */

function logout() {

    localStorage.removeItem("token");

    token = null;

    document.getElementById("employee-section").style.display =
        "none";

    document.getElementById("login-section").style.display =
        "flex";

}


/* ================= AUTO LOGIN ================= */

if (token) {

    document.getElementById("login-section").style.display =
        "none";

    document.getElementById("employee-section").style.display =
        "flex";

    loadEmployees();

}