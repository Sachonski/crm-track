import React, { useState, useEffect } from 'react';
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
import BookingsTable from './BookingsTable'
import fetchQuery from 'dbFunctions/dbFunctions';


const BookingsSearch = () => {

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('')
  //PARTE NUEVA ARRANCA
  const [data, setData] = useState([]);

  const originalDate = new Date(startDate);
  const originalDateLess12 = new Date();
  originalDateLess12.setHours(originalDate.getHours() - 12)
  const formattedDate = originalDateLess12.toISOString().slice(0, 16).replace("T", " ");
  const formattedDateStart = `${originalDate.getFullYear()}-${(originalDate.getMonth() + 1).toString().padStart(2, '0')}-${originalDate.getDate().toString().padStart(2, '0')} ${originalDate.getHours().toString().padStart(2, '0')}:${originalDate.getMinutes().toString().padStart(2, '0')}:${originalDate.getSeconds().toString().padStart(2, '0')}`;


  const originalDateEnd = new Date(endDate);
  const formattedDateEnd = `${originalDateEnd.getFullYear()}-${(originalDateEnd.getMonth() + 1).toString().padStart(2, '0')}-${originalDateEnd.getDate().toString().padStart(2, '0')} ${originalDateEnd.getHours().toString().padStart(2, '0')}:${originalDateEnd.getMinutes().toString().padStart(2, '0')}:${originalDateEnd.getSeconds().toString().padStart(2, '0')}`;

  const querySearch = `SELECT DISTINCT *, CASE WHEN setter = 'I acknowledge this and promise' THEN NULL ELSE setter END AS setter, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS created_date, DATE_FORMAT(booked_at, '%Y-%m-%d %H:%i') AS booked_at, CASE WHEN utm_source = 'null' THEN NULL ELSE utm_source END AS utm_source, CASE WHEN booked_at < '${formattedDate}' THEN 'completed' ELSE status END AS status FROM Bookings WHERE created_at BETWEEN '${formattedDateStart}' AND '${formattedDateEnd}' AND (full_name LIKE '%${searchTerm}%' OR email LIKE '%${searchTerm}%') AND status != 'canceled' ORDER BY created_at DESC`;

  

  async function setter() {
    setData(await fetchQuery(querySearch))
  }

  const handleSearch = () => {
    setter()
  };

  //PARTE NUEVA TERMINA

  useEffect(() => {

    setter()

  }, [])


  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>


            </CardHeader>
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
      {<BookingsTable dataList={data} fetchQuery={fetchQuery} formattedDate={formattedDate}/>}
    </div>
  );
};

export default BookingsSearch;