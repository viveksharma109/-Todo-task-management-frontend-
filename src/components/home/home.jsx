import React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Button } from "@mui/material";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SendIcon from '@mui/icons-material/Send';

import DeleteIcon from '@mui/icons-material/Delete';

import axios from "axios";
import { DeleteTwoTone } from "@mui/icons-material";

// import React from 'react';

const host_url = process.env.REACT_APP_HOST_URL;
const token = process.env.REACT_APP_TOKEN;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Home() {
    const [open, setOpen] = React.useState(false); // FOR CREATE
    const [openupdate,setopenUpdate] = React.useState(false); // UPDATE
    const [openMove, setopenMove]  = React.useState(false);  // FOR MOVE
    const [openDelete, setopenDelete]  = React.useState(false);  // FOR DELETE


    //FOR CREATE VALUES
    const [taskTitle, setTaskTitle] = React.useState(""); //
    const [bucketName, setBucketName] = React.useState("");
    const [priority, setPriority] = React.useState("");
    const [bucketData, setBucketData] = React.useState([]);

    //FOR UPDATE VALUES
    const [tasktitle , setupdateTitle] = React.useState("");
    const [prioritye , setUpdatePriority] = React.useState("");
    const [taskIdUp,settaskIdUp] = React.useState("");

    //FOR MOVE VALUES
    const [buketID, setBuketID]  = React.useState("");
    const [taskID, setTaskID] = React.useState("");

    //FOR DELETE VALUES
     const [IdForDelete ,setIdForDelete] = React.useState("");


    //FOR CREATE OPEN 
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //FOR UPDATE OPEN
    const handleUpdateOpen  = () => setopenUpdate(true);
    const handleUpdateClose = () => setopenUpdate(false);

    //FOR MOVE OPEN
    const handleMoveOpen = () => setopenMove(true);
    const handleMoveClose = () => setopenMove(false);

    // FOR DELETE OPEN
    const handleDeleteOpen = () => setopenDelete(true);
    const handledeleteClose = () => setopenDelete(false);

     // FIND START
     React.useEffect(() => {
        async function getData() {
            const response = await axios.get(`${host_url}find`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log("Response: ", response);
            setBucketData(prev => [...response.data.data]);
        }
        getData();
    }, []);
    // FIND END
    

     // FOR CREATE VALUES AND RESPONSES
    const HandleInputChange = (e) => {
        const { name, value } = e.target;       

        console.log(name, value);

        switch (name) {
            case "task-title":
                setTaskTitle(value);
                break;
            case "task-priority":
                setPriority(value);
                break;
            case "task-bucket":
                setBucketName(value);
                break;
            default:
                console.log("Invalid input name");
        }
    }

    const handleCreateTask = async () => {
        const postData = {
            taskTitle: taskTitle,
            bucketId: bucketName,
            priority: priority
        }

        const response = await axios.post(`${host_url}create`, postData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        setBucketData(prev => [...prev, response.data.data]);
        setBucketName("");
        setPriority("");
        setTaskTitle("");
        handleClose();
    }


    // FOR UPDATE VALUES AND RESPONSES
    const HandleUpdateChange = (e) => {
        const {name , value} = e.target;

        switch(name) {
            case "task-title":
                setupdateTitle(value);
                break;
            case "task-priority":
                setUpdatePriority(value);
                break;
            default:
                console.log("can't updated")
        }
    }

    const handleUpdateTask = async () =>{
        const putData = {
            priority: prioritye ,
            task :tasktitle,
            taskId : taskIdUp
            
        }
        const response = await axios.put(`${host_url}update`,putData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const updatedTaskIndex = bucketData.findIndex(task => task._id === taskIdUp);
        if (updatedTaskIndex !== -1) {
         const updatedBucketData = [...bucketData];
        updatedBucketData[updatedTaskIndex] = response.data.data;
        setBucketData(updatedBucketData);
        }
        setPriority("");
        setTaskTitle("");
        handleUpdateClose();
    }
    const handleId =  (id,prior,task) =>{
        setupdateTitle(task);
        setUpdatePriority(prior);
        settaskIdUp(id);
        handleUpdateOpen();
    }




    // FOR MOVE TASK VALUES AND RESPONSES
    const HandleMoveChange = (e) =>{
        const {name , value} = e.target;
        switch(name) {
            case "task-bucket":
                setBuketID(value);
                break;
            default:
                console.log("Invalid input name");
        }
    }
    const handleMoveTask = async () =>{
        const putData = {
            bucketId:buketID,
            taskId : taskID, 
        }
        const response = await axios.post(`${host_url}move`,putData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const MoveTaskIndex = bucketData.findIndex(task => task._id ===  taskID);
        if (MoveTaskIndex !== -1) {
         const MoveBucketData = [...bucketData];
        MoveBucketData[MoveTaskIndex] = response.data.data;
        setBucketData(MoveBucketData);
        }
      
        setBuketID();
        handleMoveClose();
    }
    const moveId = (bId,tskId) =>{
        setTaskID(tskId);
        setBuketID(bId);
        handleMoveOpen();
    }
    

    // FOR DELETE VALUES AND RESPONSES
    const handleDeleteTask = async () => {
        try {
                    const response = await axios.delete(`${host_url}delete`, {
                        data: { taskId: IdForDelete }, // Send taskId in the request body
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
            
                    if (response.status === 200) {
                        // Task was deleted successfully on the server
                        // Update the client-side state
                        const taskIndexToDelete = bucketData.findIndex(task => task._id === IdForDelete);
            
                        if (taskIndexToDelete !== -1) {
                            const updatedBucketData = [...bucketData];
                            updatedBucketData.splice(taskIndexToDelete,     1);
                            setBucketData(updatedBucketData);
                        }
                        console.log("Task deleted successfully");
                    } else {
                        // Handle other response status codes if necessary
                        console.log(`Request failed with status code ${response.status}`);
                    }
                } catch (error) {
                    // Handle Axios errors, such as network issues or invalid responses
                    console.error('Error:', error);
                }
                handledeleteClose();

    }
    const DeleteTask = (taskForDelete) =>{
        setIdForDelete(taskForDelete);
        handleDeleteOpen();
    }
  
    
    React.useEffect(() =>{
        console.log("Bucket data: ", bucketData);
    }, [bucketData])

    return (
        <>
            <Box sx={{ flexGrow: 1, padding: 10, background: "Light grey" }}>
                <Grid container spacing={2} >
                    <Grid sx={{ textAlign: 'center', my: 2 }} xs={12}>
                        <h1> Todo App </h1>
                    </Grid>
                    <Grid sx={{ textAlign: 'left', my: 2 }} xs={12}>
                        <Button onClick={handleOpen} variant="contained" color="success"> Create Task </Button>
                    </Grid>
                    <Grid sx={{ background: 'lightBlue', px: 1, mb: 5 }} xs={12}>
                        <h2>Todos</h2>
                        <Box>
                            <List>
                                {bucketData.map((data, i) => {
                                    return data?.bucketId === 1 ? (
                                        <ListItem key={i} disablePadding>
                                            <ListItemButton >
                                                <ListItemText primary={data?.task} />
                                                <ListItemText primary={data?.priority} style={{ textAlign: 'right' }} />
                                            </ListItemButton>
                                            <Button onClick={() => handleId(data?._id, data?.priority, data?.task)} variant="contained" color="success"> Update</Button>
                                           <Button   variant="contained" endIcon={<SendIcon />}>MOVE</Button>
                                        </ListItem>
                                    ) : null;
                                })}
                            </List>
                        </Box>
                        
                    </Grid>

                    <Grid sx={{ background: 'lightBlue', px: 1, mb: 5 }} xs={12}>
                        <h2>Complete task</h2>
                        <Box>
                            <List>
                                {bucketData.map((data, i) => {
                                    return data?.bucketId === 2 ? (
                                        <ListItem key={i} disablePadding>
                                            <ListItemButton>
                                                <ListItemText primary={data?.task} />
                                                <ListItemText primary={data?.priority} style={{ textAlign: 'right' }} />
                                            </ListItemButton>
                                            <Button onClick={() => handleId(data?._id, data?.priority, data?.task)} variant="contained" color="success"> Update</Button>
                                            <Button onClick={() => moveId(data?.bucketId,data?._id)} variant="contained" endIcon={<SendIcon />}>MOVE</Button>
                                           <Button onClick={() => DeleteTask(data?._id,)} variant="outlined" startIcon={<DeleteIcon />} style={{color:"white",  backgroundColor:"#D32F2F"}}> Delete</Button>

                                        </ListItem>
                                    ) : null;
                                })}
                            </List>
                        </Box>
                    </Grid>

                    <Grid sx={{ background: 'lightBlue', px: 1, mb: 5 }} xs={12} >
                        <h2>Remain</h2>
                        <Box>
                            <List>
                                {bucketData.map((data, i) => {
                                    return data?.bucketId === 3 ? (
                                        <ListItem key={i} disablePadding>
                                            <ListItemButton>
                                                <ListItemText primary={data?.task} />
                                                <ListItemText primary={data?.priority} style={{ textAlign: 'right' }} />
                                            </ListItemButton>
                                            <Button onClick={() => handleId(data?._id, data?.priority, data?.task)} variant="contained" color="success"> Update</Button>
                                            <Button onClick={() => moveId(data?.bucketId,data?._id)} variant="contained" endIcon={<SendIcon />}>MOVE</Button>

                                        </ListItem>
                                    ) : null;
                                })}
                            </List>
                        </Box>
                    </Grid>

                    <Grid sx={{ background: 'lightBlue', px: 1, mb: 5 }} xs={12}>
                        <h2> Pending </h2>
                        <Box>
                            <List>
                                {bucketData.map((data, i) => {
                                    return data?.bucketId === 4 ? (
                                        <ListItem key={i} disablePadding>
                                            <ListItemButton>
                                                <ListItemText primary={data?.task} />
                                                <ListItemText primary={data?.priority} style={{ textAlign: 'right' }} />
                                            </ListItemButton>
                                            <Button onClick={() => handleId(data?._id, data?.priority, data?.task)} variant="contained" color="success"> Update</Button>
                                            <Button onClick={() => moveId(data?.bucketId,data?._id)} variant="contained" endIcon={<SendIcon />}>MOVE</Button>
                                        </ListItem>
                                    ) : null;
                                })}
                            </List>
                        </Box>
                    </Grid>
                </Grid>


                {/* MODAL AREA FOR CREATE */} 
                <Modal 
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography sx={{ p: 2, textAlign: 'center' }} id="modal-modal-title" variant="h5" component="h2">
                            create task
                        </Typography>
                        <TextField sx={{ mb: 2 }} onChange={HandleInputChange} fullWidth name="task-title" value={taskTitle} label="task name" variant="outlined" />
                        <Grid xs={12} sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel id="demo-simple-select-helper-label">Priority</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    fullWidth
                                    name="task-priority"
                                    value={priority}
                                    label="priority"
                                    onChange={HandleInputChange}
                                >
                                    <MenuItem value={"low"}>Low</MenuItem>
                                    <MenuItem value={"medium"}>Medium</MenuItem>
                                    <MenuItem value={"high"}>High</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel id="demo-simple-select-helper-label">Bucket</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    fullWidth
                                    name="task-bucket"
                                    value={bucketName}
                                    label="bucket"
                                    onChange={HandleInputChange}
                                >
                                    <MenuItem value={1}>Todo</MenuItem>
                                    <MenuItem value={2}>Complete</MenuItem>
                                    <MenuItem value={3}>Remain</MenuItem>
                                    <MenuItem value={4}>Pending</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sx={{ display: 'flex', justifyContent: "space-between" }}>
                            <Button onClick={handleClose} variant="contained" color="error">cancel</Button>
                            <Button onClick={handleCreateTask} variant="contained" color="success">Create</Button>
                        </Grid>
                    </Box>
                </Modal>


                 {/* MODAL AREA FOR UPDATE*/} 
                <Modal 
                    open={openupdate}
                    onClose={handleUpdateClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography sx={{ p: 2, textAlign: 'center' }} id="modal-modal-title" variant="h5" component="h2">
                            Update task
                        </Typography>
                        <TextField sx={{ mb: 2 }} onChange={HandleUpdateChange} fullWidth name="task-title" value={tasktitle} label="task name" variant="outlined" />
                        <Grid xs={12} sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel id="demo-simple-select-helper-label">Priority</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    fullWidth
                                    name="task-priority"
                                    value={prioritye}
                                    label="priority"
                                    onChange={HandleUpdateChange}
                                >
                                    <MenuItem value={"low"}>Low</MenuItem>
                                    <MenuItem value={"medium"}>Medium</MenuItem>
                                    <MenuItem value={"high"}>High</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sx={{ display: 'flex', justifyContent: "space-between" }}>
                            <Button onClick={handleUpdateClose} variant="contained" color="error">cancel</Button>
                            <Button onClick={handleUpdateTask} variant="contained" color="success">Updated</Button>
                        </Grid>
                    </Box>
                </Modal>


                 {/* MODAL AREA FOR MOVE */} 
                <Modal 
                    open={openMove}
                    onClose={handleMoveClose }
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography sx={{ p: 2, textAlign: 'center' }} id="modal-modal-title" variant="h5" component="h2">
                            Move task
                        </Typography>
                        <Grid xs={12} sx={{ display: 'flex', justifyContent: "space-between" }}>
                        <FormControl sx={{ width: '100%' ,}}>
                                <InputLabel id="demo-simple-select-helper-label">Bucket</InputLabel>
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    fullWidth
                                    name="task-bucket"  
                                    value={buketID}
                                    label="bucket"
                                    onChange={HandleMoveChange}
                                >
                                    <MenuItem value={1}>Todo</MenuItem>
                                    <MenuItem value={2}>Complete</MenuItem>
                                    <MenuItem value={3}>Remain</MenuItem>
                                    <MenuItem value={4}>Pending</MenuItem>
                                </Select>
                            </FormControl>
                            <Button onClick={handleMoveClose } variant="contained" color="error" style={{ margin: '10px' }}>cancel</Button>
                            <Button onClick={handleMoveTask} variant="contained" color="success" style={{ margin: '10px' }}>move</Button>
                        </Grid>
                    </Box>
                </Modal>


                 {/* MODAL AREA FOR DELETE*/} 
                <Modal 
                    open={openDelete}
                    onClose={handledeleteClose }
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography sx={{ p: 2, textAlign: 'center' }} id="modal-modal-title" variant="h5" component="h2">
                            Are you sure ?
                        </Typography>
                        <Grid xs={12} sx={{ display: 'flex', justifyContent: "space-between" }}>
                            <Button onClick={handledeleteClose } variant="contained" color="error" style={{ margin: '10px' }}>cancel</Button>
                            <Button onClick={handleDeleteTask} variant="contained" color="success" style={{ margin: '10px' }}>Delete</Button>
                        </Grid>
                    </Box>
                </Modal>
            </Box>
        </>
    );
};

export default Home;