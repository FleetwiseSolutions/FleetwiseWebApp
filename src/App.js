import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Authentication/Login";
import AddEmployeeForm from "./components/Forms/AddEmployeeForm";
import UpdateEmployeeForm from "./components/Forms/UpdateEmployeeForm";
import CustomerForm from "./components/Forms/CustomerForm";
import VehicleForm from "./components/Forms/VehicleForm";
import JobForm from "./components/Forms/JobForm";
import { Button, ButtonGroup, Alert } from "react-bootstrap";
import SignUp from "./components/Authentication/SignUp";

import TopNavbar from "./components/Sidebar/TopNavbar";
import Sidebar from "./components/Sidebar/Sidebar";

import JobList from "./components/JobList";
import JobModal from "./components/JobModal";

import FormEditor from "./components/FormEditor/FormEditor"

import "./App.css";
import { auth, firestore } from "./firebaseConfig";
import UpdateVehicleForm from "./components/Forms/UpdateVehicleForm";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [company, setCompany] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showUpdateEmployeeForm, setShowUpdateEmployeeForm] = useState(false);
  const [showUpdateVehicleForm, setShowUpdateVehicleForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const lCompany = localStorage.getItem("company");
        const lRoles = localStorage.getItem("roles");

        if (savedUser && savedUser.uid === user.uid && lCompany && lRoles) {
          // If the user is authenticated and the saved user matches the current user
          setUser(savedUser);
          setLoggedIn(true);
          setCompany(localStorage.getItem("company"));
          setRoles(JSON.parse(localStorage.getItem("roles")));
          console.log(localStorage.getItem("roles"));
        } else {
          try {
            const userDoc = await firestore
              .collection("users")
              .doc(user.uid)
              .get();
            console.log(userDoc.data());

            const userData = userDoc.data();
            const userRoles = userData.roles || [];
            const c = userData.company;

            setRoles(userRoles);
            setUser(user);
            setLoggedIn(true);
            setCompany(c);

            localStorage.setItem("loggedInUser", JSON.stringify(user));
            localStorage.setItem("company", c);
            localStorage.setItem("roles", JSON.stringify(userRoles));
          } catch (error) {
            console.error("Error retrieving user roles:", error);
          }
        }
      } else {
        setRoles([]);
        setUser(null);
        setLoggedIn(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [loggedIn]);

  const getJobs = ()=> {
    const savedUser = localStorage.getItem("loggedInUser");
    const savedCompany = localStorage.getItem("company");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setLoggedIn(true);
    }

    if (savedCompany) {
      setCompany(savedCompany);
    }
    if (!company) return;
    const jobsRef = firestore.collection(`companies/${company}/jobs`);
    jobsRef.onSnapshot((querySnapshot) => {
      const jobList = [];
      querySnapshot.forEach((doc) => {
        jobList.push({ id: doc.id, ...doc.data() });
      });
      setJobs(jobList);
      setLoading(false);
  })
  }

  useEffect(() => {
  getJobs();
  }, []);
  const handleLogin = async () => {
    console.log("BRUH")
    const userId = auth.currentUser.uid;
    setLoggedIn(true);
    setLoggedInUserId(userId);

    try {
      const userDoc = await firestore
          .collection("users")
          .doc(userId)
          .get();

      const userData = userDoc.data();
      const userRoles = userData.roles || [];
      const c = userData.company;

      setRoles(userRoles);
      setUser(userData);
      setCompany(c);

      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      localStorage.setItem("company", c);
      localStorage.setItem("roles", JSON.stringify(userRoles));

      // Fetch jobs after successful login
      getJobs();
    } catch (error) {
      console.error("Error retrieving user roles:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setLoggedIn(false);
      setLoggedInUserId("");
      setUser(null);
      setRoles([]);
      setSelectedRole(null);
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("company");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleRoleSelect = (role) => {
    getJobs()
    setSelectedRole(role);
  };

  const handleButtonClick = (action) => {
    switch (action) {
      case "addCustomer":
        setShowCustomerForm(true);
        break;

      case "addJob":
        setShowJobForm(true);
        break;

      case "addVehicle":
        setShowVehicleForm(true);
        break;

      case "addEmployee":
        setShowEmployeeForm(true);
        break;

      case "editEmployee":
        setShowUpdateEmployeeForm(true);
        break;

      case "editVehicle":
        setShowUpdateVehicleForm(true);
        break;
    }
  };

  const Company = () => {
    return (
      <div>
        {showEmployeeForm && (
          <AddEmployeeForm
            onAddEmployee={(email) => {
              console.log(email);
              setShowEmployeeForm(false);
            }}
            companyName={company}
            show={showEmployeeForm}
            onHide={() => setShowEmployeeForm(false)}
          />
        )}
      </div>
    );
  };

  const Notifications = ({ employees, trucks }) => {
    // Your utility functions
    const calculateRemainingDays = (expiryDate) => {
      // Check for invalid dates
      if (isNaN(Date.parse(expiryDate))) {
        return Infinity;
      }

      const today = new Date();
      const expDate = new Date(expiryDate);

      const diffTime = expDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const getExpiryColor = (expiryDate) => {
      const remainingDays = calculateRemainingDays(expiryDate);

      if (remainingDays <= 0) {
        return 'danger'; // For expired dates, return 'text-danger' for red color
      } else if (remainingDays <= 14) {
        return 'warning'; // For dates expiring in less than 14 days, return 'text-warning' for orange color
      } else {
        return 'dark'; // For dates expiring in more than 14 days, return 'text-dark' for default color
      }
    };

    console.log(employees, trucks)

    const expiryFields = [
      { field: 'driverDemeritsExp', entity: 'employee', display:"Driver Demerits" },
      { field: 'licenseExpiry', entity: 'employee', display: "License" },
      { field: 'medicalExpiryDate', entity: 'employee', display: "Medical" },
      { field: 'policeExpiryDate', entity: 'employee', display: "Police Check" },
      { field: 'waFatigueExp', entity: 'employee', display: "WA Fatigue" },
      { field: 'workRightExp', entity: 'employee', display: "Work Right" },
      { field: 'regoExp', entity: 'truck', display: "Registration" },
    ];

    const createNotifications = () => {
      const employeeNotifications = {};
      const truckNotifications = [];

      expiryFields.forEach(({ field, entity, display }) => {
        const entities = entity === 'employee' ? employees : trucks;

        entities.forEach((item, index) => {
          const remainingDays = calculateRemainingDays(item[field]);

          if (remainingDays <= 14) {
            const alert = (
                <Alert variant={getExpiryColor(item[field])} key={index}>
                  {`${entity=="employee"? item.firstName: item.registration}'s ${display} 
    ${remainingDays < 0 ? `expired ${Math.abs(remainingDays)} days ago` : `will expire in ${remainingDays} days.`}`}
                </Alert>
            );

            if (entity === 'employee') {
              const name = `${item.firstName} ${item.lastName}`;
              if (!employeeNotifications[name]) {
                employeeNotifications[name] = [];
              }
              employeeNotifications[name].push(alert);
            } else {
              truckNotifications.push(alert);
            }
          }
        });
      });

      return { employeeNotifications, truckNotifications };
    };

    const { employeeNotifications, truckNotifications } = createNotifications();

    return (
        <div className="notifications">
          <h2>Notifications</h2>
          {Object.keys(employeeNotifications).map(name => (
              <div key={name}>
                <b>{name}</b>
                {employeeNotifications[name]}
                <hr />
              </div>
          ))}
          {truckNotifications.map((alert, index) => (
              <div key={index}>
                {alert}
                <hr />
              </div>
          ))}
        </div>
    );
  };

  const Admin = () => {
    const [showModal, setShowModal] = React.useState(false);
    const [selectedJob, setSelectedJob] = React.useState(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [drivers, setDrivers] = React.useState([]);
    const [vehicles, setVehicles] = React.useState([]);
    const [selectedJobType, setSelectedJobType] = useState("active");

    const handleJobTypeChange = (jobType) => {
      setSelectedJobType(jobType);
    }

    useEffect(() => {
      const unsubscribeEmployees = firestore
        .collection("users")
        .where("company", "==", company)
        .onSnapshot((snapshot) => {
          const employeesData = [];
          snapshot.forEach((doc) =>
            employeesData.push({ id: doc.id, ...doc.data() })
          );
          setDrivers(employeesData);
          console.log(employeesData);
        });

      const unsubscribeVehicles = firestore
          .collection(`companies/${company}/vehicles`)
          .onSnapshot((snapshot) => {
            const vehicleData = [];
            snapshot.forEach((doc) =>
                vehicleData.push({ id: doc.id, ...doc.data() })
            );
            setVehicles(vehicleData);
            console.log(vehicleData);
          });

      return () => {
        unsubscribeEmployees();
        unsubscribeVehicles();
      };
    }, []);

    const handleJobClick = (job) => {
      setSelectedJob(job);
      setShowModal(true);
    };

    const handleSaveChanges = async (e) => {
      console.log(e)
      let job = e;
      if(job.invoiced && job.pod && job.safeJourneyPlan && job.preTrip && job.delivered){
        job.status="closed"
      } else if(job.delivered){
        job.status="billed"
      } else {
        job.status="created"
      }
      console.log(selectedJob.id)
      const jobRef = firestore.collection(`companies/${company}/jobs`).doc(selectedJob.id)
      await jobRef.update(job)
      setShowModal(false);
    };

    const handleReassignJob = async (job, driver) => {
      console.log(selectedJob);
      const jobRef = firestore
        .collection("companies")
        .doc(company)
        .collection("jobs")
        .doc(job);

      const jobDoc = await jobRef.get();
      const jobData = jobDoc.data();
      console.log(driver);
      if (jobData) {
        await jobRef.update({
          driver,
          assignedStatus: "reassigned",
        });
      } else {
        console.error("Job data not found.");
      }
    };

    return (
      <div>
        <div className="admin-container">
          <FormEditor company={company}/>
          <div className="buffer"></div>
          <ButtonGroup
              aria-label="Job type"
              horizontal
              style={{maxHeight: '50px', overflow: 'auto', position: 'relative', zIndex: 0}}
          >
            <Button
                variant={selectedJobType === "active" ? "warning" : "secondary"}
                onClick={() => handleJobTypeChange("active")}
            >
              Active
            </Button>
            <Button
                variant={selectedJobType === "pending" ? "warning" : "secondary"}
                onClick={() => handleJobTypeChange("pending")}
            >
              Pending
            </Button>
            <Button
                variant={selectedJobType === "closed" ? "warning" : "secondary"}
                onClick={() => handleJobTypeChange("closed")}
            >
              Closed
            </Button>
            <Button
                variant={selectedJobType === "notifications" ? "warning" : "secondary"}
                onClick={() => handleJobTypeChange("notifications")}
            >
              Notifications
            </Button>
          </ButtonGroup>
          <div className="buffer"></div>
          {selectedJobType === "active" && (
              <div className="column">
                <JobList
                    jobs={jobs}
                    title={"Active Jobs"}
                    status="created"
                    onJobClick={handleJobClick}
                    reassignJob={handleReassignJob}
                    employees={drivers}
                    className="list"
                />
              </div>
          )}

          {selectedJobType === "pending" && (
              <div className="column">
                <JobList
                    jobs={jobs}
                    title={"Pending Jobs"}
                    status="billed"
                    onJobClick={handleJobClick}
                    reassignJob={handleReassignJob}
                    employees={drivers}
                    className="list"
                />
              </div>
          )}

          {selectedJobType === "closed" && (
              <div className="column">
                <JobList
                    jobs={jobs}
                    title={"Closed Jobs"}
                    status="closed"
                    onJobClick={handleJobClick}
                    reassignJob={handleReassignJob}
                    employees={drivers}
                    className="list"
                />
              </div>
          )}

          {selectedJobType === "notifications" && (
              <div className="column notifications">
                <Notifications employees={drivers} trucks={vehicles} />
              </div>
          )}
        </div>
        <CustomerForm
          company={company}
          show={showCustomerForm}
          onHide={() => setShowCustomerForm(false)}
        />
        <VehicleForm
          company={company}
          show={showVehicleForm}
          onHide={() => setShowVehicleForm(false)}
        />

        <JobForm
          company={company}
          show={showJobForm}
          onHide={() => setShowJobForm(false)}
        />
        {showModal && (
          <JobModal
            showModal={showModal}
            handleClose={() => {setShowModal(false); setIsEditing(false)}}
            selectedJob={selectedJob}
            handleSaveChanges={handleSaveChanges}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            company={company}
          />

        )}

        {showUpdateEmployeeForm && (
            <UpdateEmployeeForm
                company={company}
                show={showUpdateEmployeeForm}
                onHide={() => setShowUpdateEmployeeForm(false)}
            />
        )}

        {showUpdateVehicleForm && (
            <UpdateVehicleForm
                company={company}
                show={showUpdateVehicleForm}
                onHide={() => setShowUpdateVehicleForm(false)}
            />
        )}

      </div>
    );
  };


  const Driver = () => {
    return <div>Welcome, {user.email} - Driver</div>;
  };


  const renderRoleContent = () => {
    switch (selectedRole) {
      case "company":
        return <Company />;
      case "admin":
        return <Admin />;
      case "driver":
        return <Driver />;
      default:
        return (<div className="default"><div>Please select a role from the sidebar</div></div>);
    }
  };

  return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route
                  path="/"
                  element={
                    !loggedIn ? (
                        <div>
                          <Login onLogin={handleLogin} />
                        </div>
                    ) : (
                        <div className="container-fluid App-content">
                          <div className="App-navbar" style={{zIndex: 1}}>
                            <TopNavbar roles={roles} onRoleSelect={handleRoleSelect} onLogout={handleLogout} noToggle={true} onSidebarShow={() => setShowSidebar(!showSidebar)}/>
                          </div>
                          <div className="row">
                            <div className="col-12 col-lg-2">
                              {showSidebar && (
                                  <div className="App-sidebar d-md-block" style={{position: 'relative', zIndex: 1}}>
                                    <Sidebar role={selectedRole} onButtonClick={handleButtonClick} close={() => setShowSidebar(false)}  noToggle={isSidebarOpen} />
                                  </div>
                              )}

                            </div>
                            <div className="App-main col-12 col-lg-10">
                              {renderRoleContent()}
                            </div>
                          </div>
                        </div>
                    )
                  }
              />
            </Routes>
          </header>
        </div>
      </Router>
  );
}

export default App;
