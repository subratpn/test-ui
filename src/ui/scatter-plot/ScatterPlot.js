import { Button , Snackbar} from "@mui/material";
import axios from "axios";
import React from "react";
import { ScatterChart, CartesianGrid, XAxis, YAxis, Scatter} from 'recharts';
import ScatterPlotCSS from "./ScatterPlot.css";



export default () => {

    const [plotData, setPlotData] = React.useState([]);
    const [uploadStatus, setUploadStatus] = React.useState('');
    const [snackOpen, setSnackOpen] = React.useState(false);


    const fetchData = () => {
        axios({
            'method':'GET',
            'url':'http://localhost:8080/data/fetch',
            'headers': {
            },
            'params': {
            },
        }).then((response) => {
            console.log('Response Logs : ' + JSON.stringify(response.data))
            populateData(response.data);
            
        }).catch((error) => {
            console.log('Response Error : ' + JSON.stringify(error))
        })
    }

    const openForUploadData = (e) => {
        document.getElementById('upload').click();
    }


    const populateData = (input) => {
        console.log('Populating Data ' + JSON.stringify(input))
        setPlotData([]);
        input.data.map(obj => {
           console.log('Plot Data' + JSON.stringify(obj));
           setPlotData(plotData => [...plotData, {x : obj.x, y : obj.y}]);
        })
        console.log('Plot Data' + JSON.stringify(plotData));
    }

    const changeHandler  = (event) => {
       console.log('File Changed');
       submit(event.target.files[0]);
    }

    const submit = (file) => {
        const data = new FormData() 
        data.append('file', file)
        let url = "http://localhost:8080/data/upload";
        axios.post(url, data, { // receive two parameter endpoint url ,form data 
        })
        .then(res => { // then print response status
            console.warn(res);
            setUploadStatus('Upload Success');
            setSnackOpen(true);
            fetchData();
        }).catch(error => {
            setUploadStatus('Upload Failure');
            setSnackOpen(true);
        });
    }

    return (
        <div>
            <h1>Scatter Plot</h1>
            <div className={"ui-button"}>
                <Button variant="outlined" onClick={(e) => fetchData()}>Load Data</Button>
            </div>
            <div className={"ui-button"}>
                <Button variant="outlined" onClick={(e) => openForUploadData(e)}>UpLoad Data</Button>
            </div>
            <input type="file" id="upload" style={{display: 'none'}} accept=".csv" onChange={changeHandler}/>
            <div className="scatter-plot">
             <ScatterChart width={1500} height={500}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" />
                <YAxis type="number" dataKey="y" />
                <Scatter data={plotData} fill="red" />
            </ScatterChart>
            </div>
            <div>
            <Snackbar
                open={snackOpen}
                autoHideDuration={1000}
                message={uploadStatus}
                />
            </div>
        </div>
    )

}