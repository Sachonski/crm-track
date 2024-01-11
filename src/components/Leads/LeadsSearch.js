import React, { useState } from 'react';
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

const LeadsSearch = () => {
  
  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');const handleSearch = () => {
    // Implement your search functionality here
    console.log('Search term:', searchTerm);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
  };

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
                  <Button color="primary" onClick={handleSearch}>
                    Search
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LeadsSearch;
