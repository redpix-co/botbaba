import React, { useState, useEffect } from 'react';
import { userService } from './service/user.service';
import { UserValidation } from './validation';


import { forwardRef } from 'react';
import Avatar from 'react-avatar';
import Grid from '@material-ui/core/Grid'

// Material
import MaterialTable from "material-table";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// import MaterialTable, { Column } from '@material-table/core';
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn
} from '@mui/icons-material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


function App() {

  // Store user data
  const [user, setUser] = useState([]);


  //Notification
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertStyle, setAlertStyle] = useState();

  // Fetch User Data
  useEffect(() => {
    userService.getUser()
      .then(responce => setUser(responce.data))
      setAlertMsg("User Fetech Success..");
      setAlertStyle("success");
      setAlertStatus(true);
  }, []);


  const handleRowUpdate = (updateuser, oldData, resolve) => {
    var error = UserValidation(updateuser);                  // Check Validation
    if (error === 0) {
      userService.UserUpdate(updateuser.id, updateuser)
        .then(responce => {
          const dataUpdate = [...user];
          const index = oldData.tableData.id;
          dataUpdate[index] = updateuser;
          setUser([...dataUpdate]);
          setAlertMsg("Update Success..");
          setAlertStyle("info");
          setAlertStatus(true);
          resolve()
        })
        .catch(error => {
          setAlertMsg("Update Error..");
          setAlertStyle("error");
          setAlertStatus(true);
          resolve()

        })
    } else {
      setAlertMsg("All Fields are Manadatory");
      setAlertStyle("error");
      setAlertStatus(true);
      resolve()

    }

  }

  const handleRowAdd = (newuser, resolve) => {
    var error = UserValidation(newuser);    //check validation
    if (error === 0) {
      userService.NewUser(newuser)
        .then(res => {
          let dataToAdd = [...user];
          dataToAdd.push(newuser);
          setUser(dataToAdd);
          setAlertMsg("User Added Successful.");
          setAlertStyle("info");
          setAlertStatus(!alertStatus);
          resolve()
        })
        .catch(error => {
          setAlertMsg("Something Went Wrong..");
          setAlertStyle("error");
          setAlertStatus(true);
          resolve()
        })
    } else {
      setAlertMsg("All Fields are Manadatory");
      setAlertStyle("warning");
      setAlertStatus(true);
      resolve()
    }


  }

  const handleRowDelete = (deleteUser, resolve) => {
    userService.UserDelete(deleteUser.id)
      .then(res => {
        const dataDelete = [...user];
        const index = deleteUser.tableData.id;
        dataDelete.splice(index, 1);
        setUser([...dataDelete]);
        setAlertMsg("Delete Success");
        setAlertStyle("info");
        setAlertStatus(true);
        resolve()
      })
      .catch(error => {
        setAlertMsg("Delete Failed");
        setAlertStyle("error");
        setAlertStatus(true);
        resolve()
      })
  }

  const handleClose = () => {
    setAlertStatus(false);
  };

  const tableRef = React.createRef();

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
       }}
        open={alertStatus}
        onClose={handleClose}
        autoHideDuration={3000}
      >
        <Alert onClose={handleClose} severity={alertStyle} md={{ width: '90%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
      <Grid container spacing={2}>
        <Grid item md={2}></Grid>
        <Grid item md={8}>
          <MaterialTable
            title="User List"
            tableRef={tableRef}
            columns={
              [
                { title: "id", field: "id", hidden: true },
                { title: "Avatar", field: "avatar", render: rowData => <Avatar src={rowData.avatar} size={40} round={true} /> },
                { title: "First name", field: "first_name" },
                { title: "Last name", field: "last_name" },
                { title: "email", field: "email" }
              ]
            }
            data={user}
            icons={tableIcons}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                  handleRowUpdate(newData, oldData, resolve);
                }),
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  handleRowAdd(newData, resolve)
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  handleRowDelete(oldData, resolve)
                }),
            }}
            options={{
              actionsColumnIndex: -1,
              pageSize: 6,
              pageSizeOptions: [6, 12, 24],
              paginationType: 'stepped'
            }}
          />
        </Grid>
        <Grid item md={1}></Grid>
      </Grid>
    </React.Fragment>
  )



}

export default App;