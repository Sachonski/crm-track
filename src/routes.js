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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoney, faUser } from '@fortawesome/free-solid-svg-icons';
import Dashboard from "views/Dashboard.js";
import LeadView from "views/LeadView.js";
import BookingView from 'views/BookingView';
import SaleView from 'views/SaleView';
import Map from "views/Map.js";
import Notifications from "views/Notifications.js";
import Rtl from "views/Rtl.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";


var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/leads",
    name: "Leads",
    rtlName: "الرموز",
    icon: "tim-icons icon-tag",
    component: <LeadView />,
    layout: "/admin",
  },
  {
    path: "/bookings",
    name: "Bookings",
    rtlName: "خرائط",
    icon:"tim-icons icon-calendar-60",
    component: <BookingView />,
    layout: "/admin",
  },
  {
    path: "/sales",
    name: "Sales",
    rtlName: "إخطارات",
    icon: "tim-icons icon-money-coins",
    component: <SaleView />,
    layout: "/admin",
  },

  {
    path: "/funnels",
    name: "Funnels",
    rtlName: "إخطارات",
    icon: "tim-icons icon-tablet-2",
    component: <Typography />,
    layout: "/admin",
  },
 
  
];
export default routes;
