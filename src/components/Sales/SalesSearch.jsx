import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LeadsTable from "./SalesTable";
import fetchQuery from 'dbFunctions/dbFunctions';
import classNames from "classnames";
import { Line, Bar } from "react-chartjs-2";

const SalesSearch = () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  //PARTE NUEVA ARRANCA
  const [data, setData] = useState([]);

  const originalDate = new Date(startDate);
  const formattedDateStart = `${originalDate.getFullYear()}-${(
    originalDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${originalDate
    .getDate()
    .toString()
    .padStart(2, "0")} ${originalDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${originalDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${originalDate
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
  const originalDateLess12 = new Date();
  originalDateLess12.setHours(originalDate.getHours() - 12);
  const formattedDate = originalDateLess12
    .toISOString()
    .slice(0, 16)
    .replace("T", " ");

  const originalDateEnd = new Date(endDate);
  const formattedDateEnd = `${originalDateEnd.getFullYear()}-${(
    originalDateEnd.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${originalDateEnd
    .getDate()
    .toString()
    .padStart(2, "0")} ${originalDateEnd
    .getHours()
    .toString()
    .padStart(2, "0")}:${originalDateEnd
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${originalDateEnd
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

    const querySearch = `SELECT p.*, c.*, p.id AS id, p.sales_rep AS sales_rep, CONCAT('$', FORMAT(p.payment_amount, 2)) AS payment_amount, CASE WHEN c.utm_source <> 'null' THEN c.utm_source END AS utm_source, DATE_FORMAT(p.payment_date, '%Y-%m-%d %H:%i') AS payment_date, CASE WHEN c.full_name IS NULL THEN CONCAT(c.first_name, ' ', c.last_name) ELSE c.full_name END AS full_name FROM Payments p JOIN Contacts c ON p.fk_contact = COALESCE(c.id, (SELECT id FROM Contacts WHERE email = c.email AND full_name IS NOT NULL ORDER BY id LIMIT 1)) WHERE (p.payment_date >= '${formattedDateStart}' AND p.payment_date <= '${formattedDateEnd}') AND ((COALESCE(c.full_name, (SELECT full_name FROM Contacts WHERE email = c.email AND full_name IS NOT NULL ORDER BY id LIMIT 1)) LIKE '%${searchTerm}%' OR CONCAT(c.first_name, ' ', c.last_name) LIKE '%${searchTerm}%') OR c.email LIKE '%${searchTerm}%' OR c.phone LIKE '%${searchTerm}%' OR CAST(p.payment_amount AS CHAR) LIKE '%${searchTerm}%' OR p.product_name LIKE '%${searchTerm}%' OR c.sales_rep LIKE '%${searchTerm}%') ORDER BY p.payment_date DESC`;;

  async function setter() {
    setData(await fetchQuery(querySearch));
  }

  const handleSearch = () => {
    setter();
  };

  //PARTE NUEVA TERMINA

  useEffect(() => {
    setter();
  }, []);

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
      
      {
        <LeadsTable
          dataList={data}
          fetchQuery={fetchQuery}
          formattedDate={formattedDate}
        />
      }
    </div>
  );
};

export default SalesSearch;
