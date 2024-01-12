import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Card,
  CardHeader,
  CardBody,
  Input,
  Label,
  FormGroup,
  Button,
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import axios from 'axios';
import ListDisplay from './ListDisplay'; // Asegúrate de tener la ruta correcta

const LeadsSearch = () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalResults, setTotalResults] = useState('')

  const handleSearch = (offsetData) => {
    // Implement your search functionality here
    let offsetQuery = typeof offsetData === 'number' ? offsetData : "0";
    const fetchQuery = async (query) => {
    //  console.log(offsetQuery)
    //  console.log(query)
      const res = await axios.post('http://localhost:3001/', {
        query: query,
      });
     // console.log(res)
      if(res.data[0]){
      setData(res.data);
      setTotalResults(res.data[0].suma_contactos)
     // console.log(data)
     // console.log(totalResults)
      }
    };

    fetchQuery('SELECT *, (SELECT COUNT(id) FROM Contacts) AS suma_contactos FROM Contacts ORDER BY id LIMIT 10 OFFSET ' + offsetQuery);
    //console.log('Search term:', searchTerm);
    //console.log('Start Date:', startDate);
    //console.log('End Date:', endDate);
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader></CardHeader>
            <CardBody className="all-icons">
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label for="startDate">From:</Label>
                    <br></br>
                    <DatePicker
                      id="startDate"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="MM/dd/yyyy"
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label for="endDate">To:</Label>
                    <br></br>
                    <DatePicker
                      id="endDate"
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="MM/dd/yyyy"
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label for="search">Search:</Label>
                    <Input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col md="12">
                  <Button color="#2872F6" onClick={handleSearch}>
                    Search
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* Cambiado de LeadsTable a ListDisplay */}
      <ListDisplay dataList={data} totalResults={totalResults} />
    </div>
  );
};

export default LeadsSearch;
