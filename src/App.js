import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Authentication/Login";
import AddEmployeeForm from "./components/Forms/AddEmployeeForm";
import CustomerForm from "./components/Forms/CustomerForm";
import VehicleForm from "./components/Forms/VehicleForm";
import JobForm from "./components/Forms/JobForm";
import { Button } from "react-bootstrap";
import SignUp from "./components/Authentication/SignUp";

import TopNavbar from "./components/Sidebar/TopNavbar";
import Sidebar from "./components/Sidebar/Sidebar";

import JobList from "./components/JobList";
import JobModal from "./components/JobModal";

import "./App.css";
import { auth, firestore } from "./firebaseConfig";

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
  const [jobs, setJobs] = useState([]);

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
  }, [loggedInUserId]);

  useEffect(() => {
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
      console.log(jobList);
      setJobs(jobList);
    });
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
    setLoggedInUserId(auth.currentUser.uid);
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
    }
  };

  const Company = () => {
    return (
      <div>
        <h1>Company</h1>
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

  const Admin = () => {
    const [showModal, setShowModal] = React.useState(false);
    const [selectedJob, setSelectedJob] = React.useState(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [drivers, setDrivers] = React.useState(false);

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

      return () => {
        unsubscribeEmployees();
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
          <div className="left-column">
            <JobList
              jobs={jobs}
              title={"Active Jobs"}
              status="created"
              onJobClick={handleJobClick}
              reassignJob={handleReassignJob}
              employees={drivers}
            />
            <JobList
              jobs={jobs}
              title={"Pending Jobs"}
              status="billed"
              onJobClick={handleJobClick}
              reassignJob={handleReassignJob}
              employees={drivers}
            />
          </div>
          <div className="right-column">
            <JobList
              jobs={jobs}
              title={"Closed Jobs"}
              status="closed"
              onJobClick={handleJobClick}
              reassignJob={handleReassignJob}
              employees={drivers}
            />
          </div>
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
      </div>
    );
  };

  const Scheduler = () => {
    return <div>Welcome, {user.email} - Scheduler</div>;
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
      case "scheduler":
        return <Scheduler />;
      case "driver":
        return <Driver />;
      default:
        return <div>Please select a role from the sidebar</div>;
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
                    <h1>Login</h1>
                    <Login onLogin={handleLogin} />
                  </div>
                ) : (
                  <>
                    <div className="App-content">
                      <div className="App-navbar">
                        <TopNavbar
                          roles={roles}
                          onRoleSelect={handleRoleSelect}
                          onLogout={handleLogout}
                        />
                      </div>
                      <div className="App-sidebar">
                        <Sidebar
                          role={selectedRole}
                          onButtonClick={handleButtonClick}
                        />
                      </div>
                      <div className="App-main">{renderRoleContent()}</div>
                    </div>
                  </>
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
