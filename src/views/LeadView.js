/*!

=========================================================
* Black Dashboard React v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import LeadsSearch from "components/Leads/LeadsSearch.js";
import LeadsTable from "components/Leads/LeadsTable";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";

function LeadView() {
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <h3 className="title">Leads</h3>
                <p className="category"></p>
                <LeadsSearch/>
                <LeadsTable/>
              </CardHeader>            
            </Card>       
          </Col>      
        </Row>
       
      </div>
    </>
  );
}

export default LeadView;
